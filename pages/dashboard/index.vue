<template>
  <div class="dashboard">
    <!-- Filters with PrimeVue -->
    <div class="filters-container">
      <div class="filters">
        <div class="filter-group">
          <label class="filter-label">Dự án</label>
          <Dropdown
            v-model="selectedProject"
            :options="projectOptions"
            option-label="name"
            option-value="id"
            placeholder="Chọn dự án"
            class="filter-dropdown"
            @change="fetchDashboardData()"
          />
        </div>

        <div class="filter-group">
          <label class="filter-label">Ưu tiên</label>
          <Dropdown
            v-model="priorityFilter"
            :options="priorityOptions"
            option-label="name"
            option-value="value"
            placeholder="Chọn mức ưu tiên"
            class="filter-dropdown"
            @change="fetchDashboardData"
          />
        </div>

        <div class="filter-group checkbox-group">
          <label class="modern-checkbox">
            <input v-model="showOverdueOnly" type="checkbox" class="checkbox-input" />
            <span class="checkbox-checkmark">
              <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M13.3332 4L5.99984 11.3333L2.6665 8"
                  stroke="white"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
            <span class="checkbox-label">Task quá hạn</span>
          </label>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="stats-grid">
      <div class="stat-card card">
        <h3>Tổng Task</h3>
        <p class="stat-number">{{ dashboardData.statistics?.total || 0 }}</p>
      </div>
      <div class="stat-card card">
        <h3>Task Quá hạn</h3>
        <p class="stat-number overdue">{{ dashboardData.statistics?.overdue || 0 }}</p>
      </div>
      <div class="stat-card card">
        <h3>Task Bình thường</h3>
        <p class="stat-number normal">{{ dashboardData.statistics?.normal || 0 }}</p>
      </div>
    </div>

    <!-- Chart Section -->
    <div class="charts-grid">
      <!-- Donut Chart -->
      <div class="chart-card card">
        <h2>Phân tích Task (Tỷ lệ)</h2>
        <ClientOnly>
          <apexchart
            type="donut"
            :options="donutChartOptions"
            :series="chartSeries"
            height="300"
          />
        </ClientOnly>
      </div>

      <!-- Column Chart - Tasks by Date with Pagination -->
      <div class="chart-card card">
        <div class="chart-header">
          <h2>Số lượng Task theo Ngày</h2>
          <div class="chart-controls">
            <button
              class="chart-nav-btn"
              :disabled="dateChartPage === 0"
              @click="dateChartPage--"
            >
              ←
            </button>
            <button
              class="chart-nav-btn"
              :disabled="dateChartPage >= maxDateChartPages - 1"
              @click="dateChartPage++"
            >
              →
            </button>
          </div>
        </div>
        <ClientOnly>
          <apexchart
            type="bar"
            :options="dateChartOptions"
            :series="dateChartSeries"
            height="300"
          />
        </ClientOnly>
      </div>
    </div>

    <!-- Task Table -->
    <div class="table-card card">
      <h2>Danh sách Task</h2>
      <div class="simple-table">
        <div class="table-header">
          <div class="table-cell">End Date</div>
          <div class="table-cell">Task</div>
          <div class="table-cell">Project</div>
          <div class="table-cell">Priority</div>
          <div class="table-cell">Status</div>
          <div class="table-cell">Assignee</div>
        </div>
        <div v-for="task in paginatedTasks" :key="task._id" class="table-row">
          <div class="table-cell">{{ formatDate(task.end_date!) }}</div>
          <div class="table-cell">{{ task.title }}</div>
          <div class="table-cell">{{ task.project?.name || "N/A" }}</div>
          <div class="table-cell" :class="'priority-' + getPriorityClass(task.priority)">
            {{ getTaskPriority(task.priority) }}
          </div>
          <div class="table-cell" :class="'priority-' + getPriorityClass(task.status!)">
            {{ getTaskStatus(task.status!) }}
          </div>

          <div class="table-cell">{{ task.userAssignee?.username || "Chưa giao" }}</div>
        </div>
      </div>
      <div v-if="filteredTasks.length > itemsPerPage" class="table-pagination">
        <button
          class="pagination-btn"
          :disabled="currentPage === 1"
          @click="currentPage--"
        >
          ←
        </button>
        <span class="pagination-info"> Trang {{ currentPage }}/{{ totalPages }} </span>
        <button
          class="pagination-btn"
          :disabled="currentPage === totalPages"
          @click="currentPage++"
        >
          →
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted, watch } from "vue";
import Dropdown from "primevue/dropdown";
import { getTaskPriority, getTaskStatus, TaskPriority } from "@/constants/project_type";
import type { DashboardData, ProjectDropdown } from "@/schema/kanban";

const api = getApiRoutes();

// Data từ API
const dashboardData = ref<DashboardData>({
  tasks: [],
  statistics: {
    total: 0,
    overdue: 0,
    completed: 0,
    normal: 0,
  },
  tasksByDate: [],
});

// Projects data (sẽ lấy từ API)
const projects = ref<ProjectDropdown[]>([]);

// Filters
const selectedProject = ref<string | "">(""); // ✅ Sửa kiểu dữ liệu
const priorityFilter = ref<number | "">(""); // ✅ Sửa kiểu dữ liệu
const showOverdueOnly = ref(false);
const currentPage = ref(1);
const itemsPerPage = 5;
const dateChartPage = ref(0);
const datesPerPage = 5;

// Dropdown options
const projectOptions = computed(() => [
  { id: null, name: "Tất cả dự án" },
  ...(projects.value || []),
]);

const priorityOptions = [
  { name: "All", value: null },
  { name: getTaskPriority(TaskPriority.HIGHEST), value: TaskPriority.HIGHEST },
  { name: getTaskPriority(TaskPriority.HIGH), value: TaskPriority.HIGH },
  { name: getTaskPriority(TaskPriority.MEDIUM), value: TaskPriority.MEDIUM },
  { name: getTaskPriority(TaskPriority.LOW), value: TaskPriority.LOW },
];

const getProjects = async () => {
  try {
    const response = await useRequest(api.dashboard.getProject, {
      method: "POST",
      body: null,
    });
    projects.value = response.data || []; // ✅ Thêm fallback
    console.log("Projects loaded:", projects.value);
  } catch (e) {
    console.log("Error fetching projects:", e);
    projects.value = []; // ✅ Fallback
  }
};

// Fetch dashboard data
const fetchDashboardData = async () => {
  try {
    console.log("Fetching dashboard with params:", {
      projectId: selectedProject.value || null,
      priority: priorityFilter.value !== "" ? priorityFilter.value : null,
      isOver: showOverdueOnly.value,
    });

    const response = await useRequest(api.dashboard.getTask, {
      method: "POST",
      body: {
        projectId: selectedProject.value || null,
        priority: priorityFilter.value !== "" ? priorityFilter.value : null,
        isOver: showOverdueOnly.value,
      },
    });

    console.log("Dashboard response:", response);

    // ✅ Thêm fallback cho dữ liệu
    dashboardData.value = {
      tasks: response.data?.tasks || [],
      statistics: response.data?.statistics || {
        total: 0,
        overdue: 0,
        completed: 0,
        normal: 0,
      },
      tasksByDate: response.data?.tasksByDate || [],
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    // ✅ Fallback khi lỗi
    dashboardData.value = {
      tasks: [],
      statistics: {
        total: 0,
        overdue: 0,
        completed: 0,
        normal: 0,
      },
      tasksByDate: [],
    };
  }
};

// Computed values
const filteredTasks = computed(() => {
  let tasks = [...(dashboardData.value.tasks || [])];

  // Filter by project
  if (selectedProject.value) {
    tasks = tasks.filter((task) => task.project_id === selectedProject.value);
  }

  // Filter by priority
  if (priorityFilter.value !== "") {
    tasks = tasks.filter((task) => task.priority === priorityFilter.value);
  }

  // Filter by overdue
  if (showOverdueOnly.value) {
    tasks = tasks.filter((task) => isTaskOverdue(task));
  }

  return tasks;
});

const paginatedTasks = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredTasks.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(filteredTasks.value.length / itemsPerPage);
});

// Stats
const totalTasks = computed(() => dashboardData.value.statistics?.total || 0);
const overdueTasks = computed(() => dashboardData.value.statistics?.overdue || 0);
const normalTasks = computed(() => dashboardData.value.statistics?.normal || 0);

// Chart data
const chartSeries = computed(() => [overdueTasks.value, normalTasks.value]);

// Date chart data with pagination
const dateChartData = computed(() => dashboardData.value.tasksByDate || []);

const maxDateChartPages = computed(() => {
  return Math.ceil(dateChartData.value.length / datesPerPage);
});

const paginatedDates = computed(() => {
  const start = dateChartPage.value * datesPerPage;
  const end = start + datesPerPage;
  return dateChartData.value.slice(start, end);
});

const dateChartSeries = computed(() => {
  const data = paginatedDates.value.map((item) => item.count || 0); // ✅ Thêm fallback

  return [
    {
      name: "Số lượng Task",
      data,
    },
  ];
});

const dateChartOptions = computed(() => ({
  chart: {
    type: "bar",
    toolbar: {
      show: false,
    },
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: "60%",
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    show: true,
    width: 2,
    colors: ["transparent"],
  },
  xaxis: {
    categories: paginatedDates.value.map((item) => item.date || ""),
    labels: {
      rotate: -45,
      style: {
        fontSize: "12px",
      },
    },
  },
  yaxis: {
    title: {
      text: "Số lượng Task",
    },
    min: 0,
  },
  fill: {
    opacity: 1,
  },
  colors: ["#3b82f6"],
  tooltip: {
    y: {
      formatter: function (val) {
        return val + " task(s)";
      },
    },
  },
}));

const donutChartOptions = reactive({
  labels: ["Task Quá hạn", "Task Bình thường"],
  colors: ["#ef4444", "#10b981"],
  legend: {
    position: "bottom",
  },
  dataLabels: {
    enabled: true,
  },
  plotOptions: {
    pie: {
      donut: {
        size: "65%",
      },
    },
  },
});

const getPriorityClass = (priority: number) => {
  const priorityClassMap: Record<number, string> = {
    1: "low",
    2: "medium",
    3: "high",
  };
  return priorityClassMap[priority] || "low";
};

const formatDate = (dateString: Date) => {
  if (!dateString) return "Không có";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Ngày không hợp lệ";
  return date.toLocaleDateString("vi-VN");
};

const isTaskOverdue = (task: any) => {
  if (!task.end_date) return false;
  const endDate = new Date(task.end_date);
  const now = new Date();
  return endDate < now && task.status !== 4 && task.status !== 5;
};

// Watch filters change to re-fetch data
watch([selectedProject, priorityFilter, showOverdueOnly], () => {
  currentPage.value = 1;
  dateChartPage.value = 0;
  fetchDashboardData();
});

onMounted(async () => {
  await getProjects();
  await fetchDashboardData();
});
</script>

<style scoped>
.dashboard {
  padding: 1rem;
  background: #ffffff;
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  color: #374151;
}

.filters-container {
  margin-bottom: 1.5rem;
}

.filters {
  display: flex;
  gap: 2rem;
  align-items: end;
  flex-wrap: wrap;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0;
}

.filter-dropdown {
  min-width: 200px;
}

:deep(.p-dropdown) {
  border-radius: 6px;
  border: 1px solid #d1d5db;
  background: white;
  font-size: 0.875rem;
  box-shadow: none;
}

:deep(.p-dropdown:focus) {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

:deep(.p-dropdown .p-dropdown-label) {
  padding: 0.5rem 0.75rem;
}

:deep(.p-dropdown .p-dropdown-trigger) {
  width: 2.5rem;
  color: #6b7280;
}

:deep(.p-dropdown-panel) {
  border: 1px solid #d1d5db;
  border-radius: 6px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

:deep(.p-dropdown-item) {
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
}

:deep(.p-dropdown-item:hover) {
  background: #f9fafb;
}

:deep(.p-dropdown-item.p-highlight) {
  background: #3b82f6;
  color: white;
}

.checkbox-group {
  display: flex;
  align-items: end;
  height: 100%;
}

.modern-checkbox {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  position: relative;
  font-size: 0.875rem;
  color: #374151;
  padding: 0.5rem;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.modern-checkbox:hover {
  background: #f9fafb;
}

.checkbox-input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkbox-checkmark {
  width: 20px;
  height: 20px;
  background-color: white;
  border: 2px solid #d1d5db;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.modern-checkbox:hover .checkbox-checkmark {
  border-color: #9ca3af;
}

.checkbox-input:checked + .checkbox-checkmark {
  background-color: #3b82f6;
  border-color: #3b82f6;
}

.checkbox-checkmark svg {
  width: 12px;
  height: 12px;
  opacity: 0;
  transform: scale(0.8);
  transition: all 0.2s ease;
}

.checkbox-input:checked + .checkbox-checkmark svg {
  opacity: 1;
  transform: scale(1);
}

.checkbox-label {
  user-select: none;
  font-weight: 500;
}

.modern-checkbox:hover .checkbox-label {
  color: #1f2937;
}

/* Hiệu ứng focus cho accessibility */
.checkbox-input:focus + .checkbox-checkmark {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

.card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.25rem;
  margin-bottom: 2rem;
}

.stat-card {
  text-align: center;
  padding: 1.25rem;
}

.stat-card h3 {
  margin: 0 0 0.5rem 0;
  color: #6b7280;
  font-size: 0.9rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
  color: #1f2937;
}

.overdue {
  color: #ef4444;
}

.normal {
  color: #10b981;
}

.charts-grid {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.chart-card h2 {
  margin-top: 0;
  margin-bottom: 1.25rem;
  color: #1f2937;
  font-size: 1.1rem;
  font-weight: 600;
  text-align: center;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.chart-header h2 {
  margin: 0;
  text-align: left;
}

.chart-controls {
  display: flex;
  gap: 0.5rem;
}

.chart-nav-btn {
  padding: 0.25rem 0.5rem;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.chart-nav-btn:hover:not(:disabled) {
  background: #f9fafb;
  border-color: #9ca3af;
}

.chart-nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.table-card h2 {
  margin-top: 0;
  margin-bottom: 1.25rem;
  color: #1f2937;
  font-size: 1.1rem;
  font-weight: 600;
}

/* Simple Table */
.simple-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.table-header {
  display: grid;
  grid-template-columns: 120px 1fr 1fr 100px 100px 1fr;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  font-weight: 500;
  color: #4b5563;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.5px;
}

.table-row {
  display: grid;
  grid-template-columns: 120px 1fr 1fr 100px 100px 1fr;
  border-bottom: 1px solid #f3f4f6;
  transition: background-color 0.2s ease;
}

.table-row:hover {
  background: #f9fafb;
}

.table-cell {
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
}

.priority-high {
  color: #ef4444;
}

.priority-medium {
  color: #f59e0b;
}

.priority-low {
  color: #10b981;
}

.status-overdue {
  color: #ef4444;
  font-weight: 500;
}

.status-normal {
  color: #10b981;
}

.table-pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #f3f4f6;
}

.pagination-btn {
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.pagination-btn:hover:not(:disabled) {
  background: #f9fafb;
  border-color: #9ca3af;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-info {
  font-size: 0.875rem;
  color: #6b7280;
}

@media (max-width: 1024px) {
  .charts-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .dashboard {
    padding: 1.5rem;
  }

  .filters {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }

  .filter-group {
    width: 100%;
  }

  .filter-dropdown {
    min-width: auto;
    width: 100%;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .table-header,
  .table-row {
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
  }

  .table-cell:nth-child(n + 3) {
    display: none;
  }

  .table-header .table-cell:nth-child(1),
  .table-header .table-cell:nth-child(2) {
    display: flex;
  }

  .table-pagination {
    flex-direction: column;
    gap: 0.5rem;
  }

  .chart-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .chart-controls {
    align-self: flex-end;
  }

  .checkbox-group {
    align-items: center;
    justify-content: center;
  }

  .modern-checkbox {
    justify-content: center;
    width: 100%;
  }
}
</style>
