<template>
  <div class="kanban-board">
    <div class="m-2 p-2 bg-white rounded-lg shadow-sm sticky top-0 z-10">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div class="flex flex-wrap gap-3">
          <!-- Priority Filter -->
          <div class="flex flex-col space-y-1 w-48">
            <label class="text-sm font-medium text-gray-700">Priority</label>
            <MultiSelect
              v-model="searchFilters.priority"
              :options="priorityOptions"
              option-label="label"
              variant="filled"
              option-value="value"
              :max-selected-labels="2"
              placeholder="All Priorities"
              show-clear
              class="w-full"
              @change="applyFilters"
            />
          </div>

          <!-- Assignee Filter -->
          <div class="flex flex-col space-y-1 w-48">
            <label class="text-sm font-medium text-gray-700">Assignee</label>
            <Select
              v-model="searchFilters.assignee"
              :options="projectMembers"
              option-label="username"
              option-value="_id"
              placeholder="All Assignees"
              show-clear
              class="w-full fixed-select"
              @change="applyFilters"
            />
          </div>

          <!-- Status Filter -->
          <div class="flex flex-col space-y-1 w-48">
            <label class="text-sm font-medium text-gray-700">Status</label>
            <MultiSelect
              v-model="searchFilters.status"
              :options="statusOptions"
              option-label="label"
              option-value="value"
              placeholder="All Statuses"
              show-clear
              class="w-full fixed-multiselect"
              @change="handleStatusChange"
            />
          </div>
        </div>

        <!-- Utility Buttons -->
        <div class="flex items-center space-x-2">
          <Button
            v-tooltip="'My Tasks'"
            icon="pi pi-user"
            class="p-button-rounded p-button-text"
            :class="{
              'my-tasks-active': isMyTasksFilterActive,
              'p-button-outlined': !isMyTasksFilterActive,
            }"
            severity="secondary"
            @click="toggleMyTasksFilter"
          />
          <Button
            v-tooltip="'Burning Tasks'"
            class="p-button-rounded p-button-text"
            :class="{
              'my-tasks-active': isBurningTasksFilterActive,
              'p-button-outlined': !isBurningTasksFilterActive,
            }"
            severity="secondary"
            @click="toggleBurningTasksFilter"
            >🔥</Button
          >
          <!-- pi-sliders-v -->
          <Button
            v-tooltip="'Change UI'"
            icon="pi pi-sliders-h"
            class="p-button-rounded p-button-text"
            :class="{
              'my-tasks-active': isGroupedByUser,
              'p-button-outlined': !isGroupedByUser,
            }"
            severity="secondary"
            @click="toggleGroupedByUser"
          />
        </div>
      </div>
    </div>

    <div class="sticky top-[20px] z-10 bg-white border-b px-2">
      <div class="flex overflow-x-auto gap-4">
        <div
          v-for="column in visibleColumns"
          :key="column.id"
          class="flex-shrink-0"
          :class="getColumnWidthClass()"
        >
          <div class="p-3 font-semibold flex justify-between items-center">
            <span>{{ column.title }}</span>
            <span class="bg-gray-100 text-xs px-2 py-1 rounded-full">
              {{ getTaskCountByStatus(column.id) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isLoading" class="text-center py-10">
      <i class="pi pi-spin pi-spinner text-2xl" />
      <p class="mt-2">Loading board...</p>
    </div>
    <div v-else-if="error" class="text-center py-10 text-red-500">
      <i class="pi pi-exclamation-triangle text-2xl" />
      <p class="mt-2">{{ error }}</p>
    </div>
    <div v-else class="overflow-y-auto h-[calc(100vh-220px)] px-2">
      <div v-if="isGroupedByUser" class="space-y-4">
        <!-- Group by User View -->
        <div
          v-for="(group, userId) in tasksGroupedByUser"
          :key="userId"
          class="bg-white rounded-lg shadow-sm border border-gray-200 mt-2"
        >
          <!-- User Header with Dropdown -->
          <div
            class="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50"
            @click="toggleUserExpansion(userId)"
          >
            <div class="flex items-center space-x-3">
              <div
                class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium"
              >
                {{ group.user ? group.user.username?.slice(0, 2).toUpperCase() : "??" }}
              </div>
              <div>
                <div class="font-medium text-gray-900">
                  {{ group.user ? group.user.username : "Unassigned" }}
                </div>
                <div class="text-sm text-gray-500">{{ group.tasks.length }} tasks</div>
              </div>
            </div>
            <i
              :class="[
                'pi transition-transform duration-200',
                isUserExpanded(userId) ? 'pi-chevron-down' : 'pi-chevron-right',
              ]"
            />
          </div>

          <!-- User Tasks -->
          <div v-show="isUserExpanded(userId)" class="border-t border-gray-200">
            <div class="flex overflow-x-auto gap-4 p-3">
              <div
                v-for="column in visibleColumns"
                :key="`${userId}-${column.id}`"
                class="bg-gray-100 rounded-b-common flex flex-col flex-shrink-0"
                :class="[column.color || 'bg-gray-100', getColumnWidthClass()]"
              >
                <div
                  class="p-2 space-y-2 flex-1 transition-colors duration-200 min-h-[50px]"
                  :class="{
                    'bg-blue-50 bg-opacity-50':
                      isDraggingOver && dragOverColumnId == column.id,
                  }"
                  @dragover.prevent="onDragOver(column.id)"
                  @dragleave="onDragLeave"
                  @drop="onDrop(column.id)"
                >
                  <KanbanTask
                    v-for="task in group.tasks.filter((t) => t.status == column.id)"
                    :key="task._id"
                    :task="task"
                    @dragstart="onDragStart(task)"
                    @edit="onEditTask"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Normal Kanban View -->
      <div v-else class="flex overflow-x-auto gap-4 pb-4">
        <div
          v-for="column in visibleColumns"
          :key="column.id"
          class="bg-gray-100 rounded-b-common flex flex-col flex-shrink-0"
          :class="[column.color || 'bg-gray-100', getColumnWidthClass()]"
        >
          <div
            class="p-2 space-y-2 flex-1 transition-colors duration-200 min-h-[50px]"
            :class="{
              'bg-blue-50 bg-opacity-50': isDraggingOver && dragOverColumnId == column.id,
            }"
            @dragover.prevent="onDragOver(column.id)"
            @dragleave="onDragLeave"
            @drop="onDrop(column.id)"
          >
            <KanbanTask
              v-for="task in getTasksByStatus(column.id)"
              :key="task._id"
              :task="task"
              @dragstart="onDragStart(task)"
              @edit="onEditTask"
            />
          </div>
        </div>
      </div>
    </div>

    <AddTask
      v-model:visible="taskDialogVisible"
      :project-id="props.projectId"
      :initial-task="editingTask"
      @close="closeTaskDialog"
      @save="saveTaskSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import MultiSelect from "primevue/multiselect";
import type { MultiSelectChangeEvent } from "primevue/multiselect";
import type { Column, TaskDetail, TaskSave, User } from "../../schema/kanban";
import { ref, onMounted, computed, reactive, watch } from "vue";
import KanbanTask from "./components/KanbanTask.vue";
import AddTask from "./components/AddTask.vue";
import { getTaskStatus, TaskPriority, TaskStatus } from "@/constants/project_type";
import { useToast } from "primevue/usetoast";
import { getApiRoutes } from "@/utils/api";

const userStore = useAuthStore();

const props = defineProps({
  projectId: {
    type: String,
    required: true,
  },
  initialColumns: {
    type: Array as () => Column[],
    default: () => [],
  },
});

const toast = useToast();
const apiRule = getApiRoutes();

const fakeColumns: Column[] = [
  { id: TaskStatus.TODO, title: getTaskStatus(TaskStatus.TODO), color: "bg-gray-200" },
  {
    id: TaskStatus.IN_PROGRESS,
    title: getTaskStatus(TaskStatus.IN_PROGRESS),
    color: "bg-sky-200",
  },
  {
    id: TaskStatus.REVIEW,
    title: getTaskStatus(TaskStatus.REVIEW),
    color: "bg-yellow-200",
  },
  { id: TaskStatus.DONE, title: getTaskStatus(TaskStatus.DONE), color: "bg-green-200" },
  {
    id: TaskStatus.CANCELLED,
    title: getTaskStatus(TaskStatus.CANCELLED),
    color: "bg-red-200",
  },
];

const searchFilters = reactive({
  priority: [
    TaskPriority.HIGHEST,
    TaskPriority.HIGH,
    TaskPriority.MEDIUM,
    TaskPriority.LOW,
  ],
  assignee: "",
  status: [
    TaskStatus.TODO,
    TaskStatus.IN_PROGRESS,
    TaskStatus.REVIEW,
    TaskStatus.DONE,
    TaskStatus.CANCELLED,
  ],
});

const projectMembers = ref<User[]>([]);

const priorityOptions = [
  { label: "Highest", value: TaskPriority.HIGHEST },
  { label: "High", value: TaskPriority.HIGH },
  { label: "Medium", value: TaskPriority.MEDIUM },
  { label: "Low", value: TaskPriority.LOW },
];

const statusOptions = [
  { label: "To Do", value: TaskStatus.TODO },
  { label: "In Progress", value: TaskStatus.IN_PROGRESS },
  { label: "Review", value: TaskStatus.REVIEW },
  { label: "Done", value: TaskStatus.DONE },
  { label: "Cancelled", value: TaskStatus.CANCELLED },
];

// State
const isLoading = ref<boolean>(false);
const error = ref<string | null>(null);
const columns = ref<Column[]>(
  props.initialColumns.length > 0 ? props.initialColumns : fakeColumns
);
const tasks = ref<TaskDetail[]>([]);
const filteredTasks = ref<TaskDetail[]>([]);
const taskDialogVisible = ref<boolean>(false);
const editingTask = ref<TaskSave | null>(null);
const isMyTasksFilterActive = ref<boolean>(true);
const isBurningTasksFilterActive = ref<boolean>(false);
const isGroupedByUser = ref<boolean>(false);
const expandedUsers = ref<Record<string, boolean>>({});

// Drag & Drop state
const draggedTask = ref<TaskDetail | null>(null);
const isDraggingOver = ref<boolean>(false);
const dragOverColumnId = ref<number | null>(null);

// Computed
const visibleColumns = computed(() => {
  return columns.value.filter((column) => searchFilters.status.includes(column.id));
});

const getTasksByStatus = (status: number): TaskDetail[] => {
  return filteredTasks.value.filter((task) => task.status == status);
};

const getTaskCountByStatus = (status: number): number => {
  return filteredTasks.value.filter((task) => task.status == status).length;
};

const tasksGroupedByUser = computed(() => {
  const grouped: Record<string, { user: User | null; tasks: TaskDetail[] }> = {};

  // Nhóm tasks theo assignee
  filteredTasks.value.forEach((task) => {
    const assigneeId = task.assignee || "unassigned";
    if (!grouped[assigneeId]) {
      const user = projectMembers.value.find((u) => u._id === assigneeId) || null;
      grouped[assigneeId] = {
        user: user,
        tasks: [],
      };
    }
    grouped[assigneeId].tasks.push(task);
  });

  return grouped;
});

const toggleUserExpansion = (userId: string) => {
  expandedUsers.value[userId] = !expandedUsers.value[userId];
};

const isUserExpanded = (userId: string) => {
  return expandedUsers.value[userId] !== false; // Mặc định là expanded
};

// Methods
const getColumnWidthClass = () => {
  return "flex-1 min-w-[250px]";
};

const fetchTasks = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const response = await useRequest(apiRule.task.search, {
      method: "POST",
      body: { projectId: props.projectId },
    });
    tasks.value = response.data || [];
    filteredTasks.value = [...tasks.value];
    extractTagsAndMembers();
  } catch (err) {
    console.error("Error fetching tasks:", err);
    error.value = "Failed to load tasks.";
    tasks.value = [];
    filteredTasks.value = [];
  } finally {
    isLoading.value = false;
  }
};

const extractTagsAndMembers = () => {
  const membersSet = new Map<string, User>();

  tasks.value.forEach((task) => {
    // Extract assignees
    if (task.assignee) {
      membersSet.set(task.userAssignee!._id, {
        _id: task.userAssignee!._id,
        username: task.userAssignee!.username || "Unknown",
        email: task.userAssignee!.email || "Unknown",
        role: task.userAssignee!.role || 0,
      });
    }
  });
  projectMembers.value = Array.from(membersSet.values());
};

const applyFilters = () => {
  let result = [...tasks.value];
  if (searchFilters.priority && searchFilters.priority.length > 0) {
    result = result.filter((task) => searchFilters.priority.includes(task.priority));
  } else {
    // Nếu không chọn priority nào => không hiển thị task nào
    result = [];
  }

  // Filter by assignee (multi-select)
  if (searchFilters.assignee && searchFilters.assignee.length > 0) {
    result = result.filter(
      (task) => task.assignee && searchFilters.assignee.includes(task.userAssignee!._id)
    );
  }

  if (searchFilters.status && searchFilters.status.length > 0) {
    result = result.filter((task) => searchFilters.status.includes(task.status!));
  }

  // Filter by assignee (if "My Tasks" is active)
  if (isMyTasksFilterActive.value) {
    console.log("Filtering for my tasks only");
    const currentUserId = userStore.userInfo?._id;
    console.log("Current user ID:", currentUserId);
    if (currentUserId) {
      // Chỉ hiển thị các task của người dùng hiện tại
      console.log("Filtering tasks for user:", currentUserId);
      console.log("Before filtering:", result);
      console.log("Tasks before filtering:", tasks.value);
      console.log("Filtered tasks before filtering:", filteredTasks.value);
      result = result.filter((task) => task.assignee === currentUserId);
    }
  } else if (searchFilters.assignee) {
    result = result.filter((task) => task.assignee === searchFilters.assignee);
  }

  if (isBurningTasksFilterActive.value) {
    const burningStatuses = [TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.REVIEW];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    result = result.filter((task) => {
      // Chỉ áp dụng cho các status cụ thể
      if (!task.start_date || !burningStatuses.includes(task.status!)) {
        return false;
      }

      const startDate = new Date(task.start_date);
      // Task burning khi start_date < today (quá hạn)
      return startDate < today;
    });
  }

  filteredTasks.value = result;
};

const toggleMyTasksFilter = () => {
  isMyTasksFilterActive.value = !isMyTasksFilterActive.value;
  applyFilters();
};

const toggleBurningTasksFilter = () => {
  isBurningTasksFilterActive.value = !isBurningTasksFilterActive.value;
  applyFilters();
};

const toggleGroupedByUser = () => {
  isGroupedByUser.value = !isGroupedByUser.value;

  // Khởi tạo expanded state cho tất cả users khi bật chế độ grouping
  if (isGroupedByUser.value) {
    Object.keys(tasksGroupedByUser.value).forEach((userId) => {
      expandedUsers.value[userId] = true; // Mặc định mở rộng tất cả
    });
  }
  applyFilters();
};

const handleStatusChange = (event: MultiSelectChangeEvent): void => {
  const newStatuses = event.value as number[];

  if (!newStatuses || newStatuses.length === 0) {
    const lastSelected =
      searchFilters.status.length > 0
        ? searchFilters.status[searchFilters.status.length - 1]
        : TaskStatus.TODO;
    searchFilters.status = [lastSelected];
    toast.add({
      severity: "warn",
      summary: "Warning",
      detail: "At least one status must be selected.",
      life: 3000,
    });
    return;
  }
  applyFilters();
};

const openAddTaskDialog = (): void => {
  editingTask.value = null;
  taskDialogVisible.value = true;
};

const onEditTask = (task: TaskSave): void => {
  editingTask.value = { ...task };
  taskDialogVisible.value = true;
};

const closeTaskDialog = (): void => {
  taskDialogVisible.value = false;
  editingTask.value = null;
};

const saveTaskSuccess = async () => {
  await fetchTasks();
  applyFilters();
};

const onDragStart = (task: TaskSave): void => {
  draggedTask.value = task;
};

const onDragOver = (columnId: number): void => {
  isDraggingOver.value = true;
  dragOverColumnId.value = columnId;
};

const onDragLeave = (): void => {
  // Có thể tinh chỉnh logic nếu cần
};

const onDrop = async (columnId: number) => {
  console.log("Task dropped in column %d", columnId);
  isDraggingOver.value = false;
  dragOverColumnId.value = null;
  if (draggedTask.value && draggedTask.value.status !== columnId) {
    const taskIndex = tasks.value.findIndex((t) => t._id === draggedTask.value!._id);
    const taskId = draggedTask.value._id;
    const oldStatus = draggedTask.value.status;
    if (taskIndex !== -1) {
      const mainTaskIndex = tasks.value.findIndex((t) => t._id === taskId);
      if (mainTaskIndex !== -1) {
        tasks.value[mainTaskIndex].status = columnId;
      }
      const filteredTaskIndex = filteredTasks.value.findIndex((t) => t._id === taskId);
      if (filteredTaskIndex !== -1) {
        filteredTasks.value[filteredTaskIndex].status = columnId;
      }

      try {
        const response = await useRequest(apiRule.task.changeStatus, {
          method: "POST",
          body: {
            taskId: taskId,
            status: columnId,
          },
        });

        if (!(response && response.statusCode === 200)) {
          if (mainTaskIndex !== -1) {
            tasks.value[mainTaskIndex].status = oldStatus;
          }
          if (filteredTaskIndex !== -1) {
            filteredTasks.value[filteredTaskIndex].status = oldStatus;
          }
          toast.add({
            severity: "error",
            summary: "Error",
            detail: response?.message || "Failed to update task status.",
            life: 3000,
          });
        } else {
          toast.add({
            severity: "success",
            summary: "Success",
            detail: "Task status updated successfully.",
            life: 3000,
          });
        }
      } catch (error) {
        if (mainTaskIndex !== -1) {
          tasks.value[mainTaskIndex].status = oldStatus;
        }
        if (filteredTaskIndex !== -1) {
          filteredTasks.value[filteredTaskIndex].status = oldStatus;
        }
        if (error instanceof Error) {
          toast.add({
            severity: "error",
            summary: "Error",
            detail: error.message,
            life: 3000,
          });
        }
      }
    }
  }
  draggedTask.value = null;
};

watch(
  () => searchFilters,
  () => {
    applyFilters();
  },
  { deep: true }
);

defineExpose({
  fetchTasks,
  openAddTaskDialog,
  closeTaskDialog,
});

onMounted(async () => {
  userStore.loadFromStorage();
  await fetchTasks();
  applyFilters();
});
</script>

<style scoped>
.kanban-board {
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* Giữ cho sticky header hoạt động tốt */
.sticky {
  position: sticky;
  background: white;
}

/* Tùy chỉnh thanh cuộn */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.p-button.my-tasks-active {
  background-color: #64748b !important; /* slate-500 */
  color: white !important;
}

.p-button.my-tasks-active:hover {
  background-color: #475569 !important; /* slate-600 */
}
</style>
