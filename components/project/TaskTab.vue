<template>
  <div class="flex h-screen font-sans bg-slate-100 text-slate-700">
    <!-- Left Panel - Navigation Bar -->
    <div
      class="w-80 bg-gradient-to-b from-white to-slate-50 border-r border-slate-200 flex flex-col shadow-lg z-10"
    >
      <div class="flex justify-between items-center px-5 py-6 border-b border-slate-200">
        <h2 class="text-xl font-bold text-slate-800">Tasks</h2>
        <button
          @click="createNewTask"
          class="bg-gradient-to-r from-indigo-500 to-violet-500 border-none rounded-xl w-9 h-9 flex items-center justify-center cursor-pointer transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
      </div>

      <div class="px-5 py-4 bg-slate-100">
        <div
          class="relative flex items-center bg-white rounded-xl px-3 py-2 shadow-sm border border-slate-200 transition-all duration-200 focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-100"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="text-slate-400 mr-2"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            v-model="searchTerm"
            placeholder="Search tasks..."
            class="w-full py-2 border-none bg-transparent text-sm text-slate-700 outline-none placeholder-slate-400"
          />
        </div>
      </div>

      <!-- Loading & Error States -->
      <div v-if="isLoading" class="flex-1 flex items-center justify-center py-8">
        <div class="text-slate-500">Loading tasks...</div>
      </div>

      <div v-else-if="error" class="flex-1 flex items-center justify-center py-8">
        <div class="text-red-500">{{ error }}</div>
      </div>

      <div v-else class="flex-1 overflow-y-auto py-2">
        <div
          v-for="task in filteredTasks"
          :key="task._id"
          @click="selectTask(task)"
          :class="[
            'px-5 py-4 cursor-pointer transition-all duration-200 border-l-3 border-transparent hover:bg-slate-100',
            { 'bg-slate-100 border-l-violet-500': selectedTask?._id === task._id },
          ]"
        >
          <div class="flex flex-col gap-2">
            <div class="font-semibold text-sm text-slate-800 truncate">
              {{ task.title }}
            </div>
            <div class="flex gap-2 items-center">
              <span
                :class="[
                  'px-2 py-1 rounded text-xs font-medium uppercase tracking-wide',
                  getStatusClass(task.status!),
                ]"
              >
                {{ getStatusText(task.status!) }}
              </span>
              <span
                :class="[
                  'px-2 py-1 rounded text-xs font-medium uppercase tracking-wide',
                  getPriorityClass(task.priority),
                ]"
              >
                {{ getPriorityText(task.priority) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Center Panel - Task Detail -->
    <TaskDetailComponent :selected-task="selectedTask" :task-id="selectedTask?._id!" />
  </div>
</template>

<script lang="ts" setup>
import {
  getTaskPriority,
  getTaskStatus,
  TaskPriority,
  TaskStatus,
} from "@/constants/project_type";
import type { TaskDetail } from "@/schema/kanban";
import { ref, computed, onMounted, watch } from "vue";
import TaskDetailComponent from "./TaskDetailComponent.vue";

// Props
const props = defineProps<{
  projectId: string;
}>();

// Reactive state
const tasks = ref<TaskDetail[]>([]);
const selectedTask = ref<TaskDetail | null>(null);
const searchTerm = ref("");
const isLoading = ref(false);
const error = ref<string | null>(null);
const api = getApiRoutes();

// Computed
const filteredTasks = computed(() => {
  if (!searchTerm.value) return tasks.value;
  const term = searchTerm.value.toLowerCase();
  return tasks.value.filter(
    (task) =>
      task.title.toLowerCase().includes(term) ||
      task.description?.toLowerCase().includes(term) ||
      task.tags?.some((tag) => tag.toLowerCase().includes(term))
  );
});

// Methods
const selectTask = (task: TaskDetail) => {
  selectedTask.value = task;
};

const getStatusText = (status: number): string => {
  const statuses = [
    getTaskStatus(TaskStatus.TODO),
    getTaskStatus(TaskStatus.IN_PROGRESS),
    getTaskStatus(TaskStatus.REVIEW),
    getTaskStatus(TaskStatus.DONE),
    getTaskStatus(TaskStatus.CANCELLED),
  ];
  return statuses[status] || "Unknown";
};

const getStatusClass = (status: number): string => {
  const statusIndex = status - 1;
  const classes = [
    "bg-slate-300 text-slate-800",
    "bg-amber-200 text-amber-800",
    "bg-blue-200 text-blue-800",
    "bg-emerald-200 text-emerald-800",
  ];
  return classes[statusIndex] || "bg-slate-300 text-slate-800";
};

const getPriorityText = (priority: number): string => {
  const priorityIndex = priority - 1;
  const priorities = [
    getTaskPriority(TaskPriority.LOW),
    getTaskPriority(TaskPriority.MEDIUM),
    getTaskPriority(TaskPriority.HIGH),
    getTaskPriority(TaskPriority.HIGHEST),
  ];
  return priorities[priorityIndex] || "Unknown";
};

const getPriorityClass = (priority: number): string => {
  const classes = [
    "bg-emerald-200 text-emerald-800",
    "bg-amber-200 text-amber-800",
    "bg-orange-200 text-orange-800",
    "bg-red-200 text-red-800",
  ];
  return classes[priority] || "bg-slate-300 text-slate-800";
};

const createNewTask = () => {
  // Implement create new task logic
  console.log("Create new task");
};

// const editTask = () => {
//   // Implement edit task logic
//   console.log("Edit task:", selectedTask.value?._id);
// };

// const deleteTask = () => {
//   // Implement delete task logic
//   console.log("Delete task:", selectedTask.value?._id);
// };

// Fetch tasks from API
const fetchTasks = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const response = await useRequest(api.task.search, {
      method: "POST",
      body: { projectId: props.projectId },
    });
    tasks.value = response.data || [];
    console.log(response.data);
    if (tasks.value.length > 0 && !selectedTask.value) {
      selectTask(tasks.value[0]);
    }
  } catch (err) {
    console.error("Error fetching tasks:", err);
    error.value = "Failed to load tasks.";
    tasks.value = [];
  } finally {
    isLoading.value = false;
  }
};

// Lifecycle
onMounted(() => {
  fetchTasks();
});

// Watch for projectId changes
watch(
  () => props.projectId,
  () => {
    fetchTasks();
  }
);
</script>
