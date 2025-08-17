<template>
  <div class="container mx-auto">
    <LoadingComponent :is-loading="isLoading" />
    <!-- Search Section -->
    <div class="bg-white p-x-4 rounded-lg mb-5">
      <div class="flex flex-wrap gap-2 items-end">
        <!-- Search -->
        <div class="flex flex-col flex-grow min-w-[250px] max-w-[320px]">
          <label class="text-sm font-medium mb-1">Search</label>
          <InputText
            v-model="filters.key"
            placeholder="Search in name, code, description"
            class="p-inputtext-sm w-full h-9"
          />
        </div>
        <!-- Project Type -->
        <div class="flex flex-col flex-grow min-w-[200px] max-w-[220px]">
          <label class="text-sm font-medium mb-1">Project Type</label>
          <Dropdown
            v-model="filters.project_type"
            :options="projectTypes"
            option-label="name"
            option-value="value"
            placeholder="Select type"
            class="w-full"
            :show-clear="true"
          />
        </div>
        <!-- Industry -->
        <div class="flex flex-col flex-grow min-w-[200px] max-w-[220px]">
          <label class="text-sm font-medium mb-1">Industry</label>
          <Dropdown
            v-model="filters.industry"
            :options="industries"
            option-label="name"
            option-value="value"
            placeholder="Select industry"
            class="w-full"
            :show-clear="true"
          />
        </div>
        <!-- Manager -->
        <div class="flex flex-col flex-grow min-w-[200px] max-w-[220px]">
          <label class="text-sm font-medium mb-1">Manager</label>
          <Dropdown
            v-model="filters.manager"
            :options="managers"
            option-label="name"
            option-value="value"
            placeholder="Select manager"
            class="w-full"
            :show-clear="true"
          />
        </div>
        <!-- Start Date From -->
        <div class="flex flex-col flex-grow min-w-[200px] max-w-[220px]">
          <label class="text-sm font-medium mb-1">Start Date From</label>
          <Calendar
            v-model="filters.start_date_from"
            date-format="yy-mm-dd"
            placeholder="yyyy-mm-dd"
            class="w-full"
            :show-clear="true"
          />
        </div>
        <!-- Start Date To -->
        <div class="flex flex-col flex-grow min-w-[200px] max-w-[220px]">
          <label class="text-sm font-medium mb-1">Start Date To</label>
          <Calendar
            v-model="filters.start_date_to"
            date-format="yy-mm-dd"
            placeholder="yyyy-mm-dd"
            class="w-full"
            :show-clear="true"
          />
        </div>
        <div class="flex flex-col flex-grow min-w-[200px] max-w-[220px]">
          <Button
            severity="info"
            icon="pi pi-search"
            label="Search"
            class="p-button-sm"
            @click="fetchDataSearch"
          />
        </div>
        <!-- Create Button -->
        <div class="flex flex-col flex-grow min-w-[100px] max-w-[120px]">
          <Button
            severity="success"
            icon="pi pi-plus"
            label="Create"
            class="p-button-sm"
            @click="openCreateDialog"
          />
        </div>
        <!-- Buttons -->
        <div class="flex flex-col flex-grow min-w-[100px] max-w-[120px]">
          <Button
            severity="secondary"
            icon="pi pi-times"
            label="Clear"
            class="p-button-outlined p-button-sm"
            @click="onClearFilter"
          />
        </div>
      </div>
    </div>

    <!-- Cards Section -->
    <div class="h-90 overflow-scroll">
      <div
        class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3 h-max[calc(100vh-200px)] overflow-y-auto"
      >
        <div
          v-for="(project, index) in projects"
          :key="project._id || index"
          class="border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200 flex flex-col h-full relative"
        >
          <!-- Background with overlay -->
          <div
            class="absolute inset-0 opacity-30"
            :style="{ backgroundColor: getColorCode(project.color) }"
          />

          <!-- Card Content -->
          <div class="p-4 flex-grow relative z-10">
            <div class="flex justify-between items-start mb-2 wrap">
              <h3 class="text-lg font-semibold text-black max-w-[95%]">
                {{ project.name }}
              </h3>
              <div class="flex justify-end space-x-1 p-1 pt-0 relative z-10">
                <Button
                  icon="pi pi-eye"
                  class="p-button-rounded p-button-warning p-button-text p-button-sm"
                  title="Update"
                  @click="viewProject(project)"
                />
                <Button
                  icon="pi pi-trash"
                  class="p-button-rounded p-button-danger p-button-text p-button-sm"
                  title="Delete"
                  @click="deleteProject(project)"
                />
              </div>
            </div>
            <p class="text-sm text-black mb-1">
              <span class="font-bold">Code:</span> {{ project.code }}
            </p>

            <div class="grid grid-cols-2 gap-2 text-sm mb-3">
              <p class="text-black">
                <span class="font-medium">Type:</span>
                {{ getProjectTypeDescription(project.project_type) }}
              </p>
              <p class="text-black">
                <span class="font-medium">Industry: </span>
                {{ getIndustryDescription(project.industry) }}
              </p>
              <p class="text-black">
                <span class="font-medium">Start date: </span>
                {{ formatDate(project.start_date) }}
              </p>
              <p class="text-black">
                <span class="font-medium">End date: </span>
                {{ formatDate(project.end_date) }}
              </p>
              <p class="col-span-2 text-black">
                <span class="font-bold">Manager: </span>
                {{ project.managerUser?.username }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <SaveProjectDialogVue
      v-model:visible="displayCreateDialog"
      :project-types="projectTypes"
      :industries="industries"
      :managers="managers"
      @project-created="onProjectCreated"
    />
    <!-- External Pagination -->
    <div class="container mx-auto flex flex-col">
      <div
        class="flex flex-col sm:flex-row items-center justify-between p-4 border border-gray-200 bg-white rounded-lg shadow-sm mt-auto"
      >
        <div class="flex items-center space-x-2 mb-2 sm:mb-0">
          <span class="text-sm text-gray-600">Rows per page:</span>
          <Dropdown v-model="rowsPerPage" :options="[5, 10, 20, 50]" class="w-20" />
        </div>
        <div class="flex items-center space-x-4">
          <span class="text-sm text-gray-600 whitespace-nowrap">
            {{ firstItemIndex }} - {{ lastItemIndex }} of {{ totalRecords }}
          </span>
          <div class="flex space-x-1">
            <Button
              icon="pi pi-angle-left"
              class="p-button-text p-button-rounded p-button-sm"
              :disabled="currentPage === 1"
              @click="currentPage--"
            />
            <Button
              icon="pi pi-angle-right"
              class="p-button-text p-button-rounded p-button-sm"
              :disabled="lastItemIndex >= totalRecords"
              @click="currentPage++"
            />
          </div>
        </div>
      </div>
      <!-- End External Pagination -->
    </div>

    <!-- Create Project Dialog -->
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import InputText from "primevue/inputtext";
import Dropdown from "primevue/dropdown";
import Calendar from "primevue/calendar";

import Button from "primevue/button";
import { useToast } from "primevue/usetoast";
import { getApiRoutes } from "@/utils/api";
import LoadingComponent from "@/components/LoadingComponent.vue";
import SaveProjectDialogVue from "@/components/project/SaveProjectDialog.vue";

// Enum màu từ API
const BoardColor = {
  WHITE: 0,
  BLUE: 1,
  RED: 2,
  GREEN: 3,
  YELLOW: 4,
  PURPLE: 5,
  ORANGE: 6,
  GRAY: 7,
  NAVY: 8,
};

// Hàm lấy mã màu
const getColorCode = (color) => {
  switch (color) {
    case BoardColor.WHITE:
      return "#FFFFFF";
    case BoardColor.BLUE:
      return "#2196F3";
    case BoardColor.RED:
      return "#F44336";
    case BoardColor.GREEN:
      return "#4CAF50";
    case BoardColor.YELLOW:
      return "#FFEB3B";
    case BoardColor.PURPLE:
      return "#9C27B0";
    case BoardColor.ORANGE:
      return "#FF9800";
    case BoardColor.GRAY:
      return "#9E9E9E";
    case BoardColor.NAVY:
      return "#003087";
    default:
      return "#FFFFFF"; // Mặc định là trắng nếu không có màu
  }
};

const api = getApiRoutes();
const router = useRouter();
const projects = ref([]);
const toast = useToast();
const totalRecords = ref(0);
const currentPage = ref(1);
const rowsPerPage = ref(10);
const isLoading = ref(true);

// Dialog
const displayCreateDialog = ref(false);

// New project data
const newProject = ref({
  name: "",
  basicInfo: "",
  code: "",
  description: "",
  features: "",
  project_type: null,
  categories: [],
  industry: null,
  start_date: null,
  end_date: null,
  tags: [],
  manager: null,
  color: null,
});

// Validation errors
const errors = ref({});

// Computed properties
const firstItemIndex = computed(() => {
  return (currentPage.value - 1) * rowsPerPage.value + 1;
});
const lastItemIndex = computed(() => {
  return Math.min(currentPage.value * rowsPerPage.value, totalRecords.value);
});

// Filters
const filters = ref({
  key: "",
  project_type: null,
  industry: null,
  manager: null,
  start_date_from: null,
  start_date_to: null,
});

// Mock data - bạn cần thay thế bằng dữ liệu thực từ API
const projectTypes = ref([
  { name: "Internal", value: 1 },
  { name: "External", value: 2 },
  { name: "Research", value: 3 },
]);

const industries = ref([
  { name: "Technology", value: 1 },
  { name: "Finance", value: 2 },
  { name: "Healthcare", value: 3 },
]);

// Hàm hỗ trợ - bạn cần thay thế bằng logic thực tế
const getProjectTypeDescription = (type) => {
  const types = {
    1: "Internal",
    2: "External",
    3: "Research",
  };
  return types[type] || "Unknown";
};

const getIndustryDescription = (industry) => {
  const industries = {
    1: "Technology",
    2: "Finance",
    3: "Healthcare",
  };
  return industries[industry] || "Unknown";
};

// Format date
const formatDate = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString();
};

const fetchDataSearch = async () => {
  isLoading.value = true;
  try {
    // Chuyển đổi ngày thành chuỗi ISO nếu có giá trị
    const requestBody = {
      key: filters.value.key,
      project_type: filters.value.project_type,
      industry: filters.value.industry,
      manager: filters.value.manager,
      start_date_from: filters.value.start_date_from
        ? new Date(filters.value.start_date_from).toISOString()
        : undefined,
      start_date_to: filters.value.start_date_to
        ? new Date(filters.value.start_date_to).toISOString()
        : undefined,

      page: currentPage.value,
      limit: rowsPerPage.value,
    };
    const response = await useRequest(api.project.search, {
      method: "POST",
      body: requestBody,
    });
    if (response && response.data.data) {
      projects.value = response.data.data;
      currentPage.value = response.data.page;
      console.log("Projects fetched:", projects.value);
      totalRecords.value = response.data.total || 0;
    }
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    projects.value = [];
    totalRecords.value = 0;
  } finally {
    isLoading.value = false;
  }
};

const deleteProject = async (data) => {
  isLoading.value = true;
  try {
    const response = await useRequest(api.project.project(data._id), {
      method: "DELETE",
      body: {},
    });
    if (response && response.statusCode == 200) {
      toast.add({
        severity: "success",
        summary: "Success",
        detail: response.message,
        life: 3000,
      });
      fetchDataSearch();
    }
  } catch (error) {
    console.error("Failed to delete project:", error);
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Failed to delete project",
      life: 3000,
    });
  } finally {
    isLoading.value = false;
  }
};

const onClearFilter = () => {
  filters.value = {
    key: "",
    project_type: null,
    industry: null,
    manager: null,
    start_date_from: null,
    start_date_to: null,
  };
  currentPage.value = 1;
  fetchDataSearch();
};

// Dialog methods
const openCreateDialog = () => {
  // Reset form và errors
  newProject.value = {
    name: "",
    basicInfo: "",
    code: "",
    description: "",
    features: "",
    project_type: null,
    categories: [],
    industry: null,
    start_date: null,
    end_date: null,
    tags: [],
    manager: null,
    color: null,
  };
  errors.value = {};
  displayCreateDialog.value = true;
};

// const closeCreateDialog = () => {
//   displayCreateDialog.value = false;
// };

const onProjectCreated = async (newProjectData) => {
  // Xử lý sau khi tạo thành công, ví dụ: làm mới danh sách
  console.log("Dự án mới được tạo:", newProjectData);
  await fetchDataSearch(); // Làm mới danh sách dự án
  // Có thể thêm thông báo thành công nếu chưa có trong dialog
  // toast.add({...})
};

// Watch for pagination changes
const watch = (await import("vue")).watch;
watch([currentPage, rowsPerPage], async () => {
  await fetchDataSearch();
});

onMounted(async () => {
  await fetchDataSearch();
});

const viewProject = (project) => {
  // Giả sử project có trường _id
  if (project && project._id) {
    router.push(`/projects/${project._id}`);
  } else {
    console.warn("Project ID is missing, cannot navigate.");
  }
};
</script>

<style scoped>
/* Optional: Limit description lines */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Error styling */
.p-invalid {
  border-color: #f44336;
}
.p-error {
  color: #f44336;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: block;
}
</style>
