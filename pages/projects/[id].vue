<!-- src/pages/projects/[id].vue -->
<template>
  <!-- Header với Navigation -->
  <div
    class="project-detail-page min-h-screen"
    :style="{ backgroundColor: getColorCode(project?.color || 0) }"
  >
    <!-- Unified Navigation Bar -->
    <div class="bg-white shadow-sm border-b-gray-400 border-b">
      <div class="px-4">
        <div class="flex items-center py-3">
          <!-- Back Button -->
          <button
            class="flex items-center text-blue-600 hover:text-blue-800 mr-4"
            @click="goBack"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L6.414 10l3.293 3.293a1 1 0 010 1.414zm4.586-9.707a1 1 0 00-1.414 0l-4 4a1 1 0 000 1.414l4 4a1 1 0 001.414-1.414L11.414 10l3.293-3.293a1 1 0 000-1.414z"
                clip-rule="evenodd"
              />
            </svg>
            Back
          </button>

          <!-- Project Title -->
          <h1 class="text-xl font-bold text-gray-800 mr-4">
            {{ "Project Details" }}
          </h1>

          <!-- Navigation Tabs -->
          <nav class="flex space-x-6 flex-1">
            <button
              v-for="tab in tabs"
              :key="tab.key"
              :class="[
                'py-2 px-1 font-medium text-sm focus:outline-none whitespace-nowrap border-b-2',
                activeTab === tab.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              ]"
              @click="changeTab(tab.key)"
            >
              {{ tab.label }}
            </button>
          </nav>

          <!-- Add New Task Button (chỉ hiển thị ở tab Kanban) -->
          <Button
            v-if="activeTab === 'kanban'"
            severity="info"
            class="ml-4 bg-sky-300 hover:bg-sky-400 c text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center"
            @click="openAddTaskDialog"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clip-rule="evenodd"
              />
            </svg>
            Add Task
          </Button>
        </div>
      </div>
    </div>

    <!-- Tab Content -->
    <div class="" style="height: calc(100vh - 65px); overflow-y: auto">
      <!-- Tab 1: Project Details -->
      <div v-if="activeTab === 'details'" class="bg-white shadow-sm h-100vh p-4">
        <ProjectDetailsTab
          :project-id="projectId"
          @project-updated="handleProjectUpdated"
        />
      </div>

      <div v-else-if="activeTab === 'tasks'" class="bg-white shadow-sm h-full">
        <TaskTab
          :project-id="projectId"
          @task-count-change="updateTaskCount"
          @add-task="openAddTaskDialog"
        />
      </div>

      <!-- Tab 2: Kanban Board -->
      <div v-else-if="activeTab === 'kanban'" class="bg-white shadow-sm h-full">
        <KanbanBoard
          ref="kanbanBoardRef"
          :project-id="projectId"
          @task-count-change="updateTaskCount"
          @add-task="openAddTaskDialog"
        />
      </div>

      <!-- Tab 3: Members -->
      <div v-else-if="activeTab === 'members'" class="bg-white shadow-sm h-full">
        <MemberTab :project-id="projectId" />
      </div>
    </div>

    <!-- Add Task Dialog -->
    <AddTask
      v-model:visible="taskDialogVisible"
      :project-id="projectId"
      :initial-task="null"
      @close="closeTaskDialog"
      @save="handleTaskSaved"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import KanbanBoard from "@/components/project/KanbanBoard.vue";
import MemberTab from "@/components/project/MemberTab.vue";
import ProjectDetailsTab from "@/components/project/ProjectDetailsTab.vue";
import { getApiRoutes } from "@/utils/api";
import { useToast } from "primevue/usetoast";
import AddTask from "@/components/project/components/AddTask.vue";
import type { KanbanBoardInstance } from "@/schema/kanban";
import TaskTab from "@/components/project/TaskTab.vue";

// Define page meta
definePageMeta({
  layout: "empty",
});

// Composables
const route = useRoute();
const router = useRouter();
const api = getApiRoutes();
const toast = useToast();

// Props/Refs
const projectId = route.params.id as string;
const tabs = ref([
  { key: "details", label: "Project Details" },
  { key: "tasks", label: "Tasks" },
  { key: "kanban", label: "Kanban Board" },
  { key: "members", label: "Members" },
]);
// Lấy tab từ query param nếu có, mặc định là 'details'
const activeTab = ref<string>(
  route.query.tab && typeof route.query.tab === "string" ? route.query.tab : "details"
);
const taskCount = ref<number>(0);
const taskDialogVisible = ref<boolean>(false);
const kanbanBoardRef = ref<KanbanBoardInstance | null>(null);
// Đổi tab và cập nhật query param
function changeTab(tabKey: string) {
  if (activeTab.value === tabKey) return;
  activeTab.value = tabKey;
  router.replace({
    query: { ...route.query, tab: tabKey },
  });
}

// Khi query param tab thay đổi (ví dụ: back/forward trình duyệt), cập nhật activeTab
watch(
  () => route.query.tab,
  (newTab) => {
    if (typeof newTab === "string" && newTab !== activeTab.value) {
      activeTab.value = newTab;
    }
  }
);

const project = ref<{
  name: string;
  code: string;
  basicInfo: string;
  description: string;
  features: string;
  project_type: number;
  industry: number;
  categories: number[];
  color: number;
  start_date: string | Date;
  end_date: string | Date;
  actual_start_date?: string | Date | null;
  actual_end_date?: string | Date | null;
  tags: string[];
  managerUser?: { username: string; email: string };
  createdByUser?: { username: string; email: string };
} | null>(null);

// Methods
const goBack = (): void => {
  router.back();
};

function getColorCode(color: number): string {
  const colorMap: Record<number, string> = {
    0: "#ffffff",
    1: "#3b82f6", // blue
    2: "#ef4444", // red
    3: "#10b981", // green
    4: "#facc15", // yellow
    5: "#8b5cf6", // purple
    6: "#f97316", // orange
    7: "#9ca3af", // gray
    8: "#1e3a8a", // navy
  };
  return colorMap[color] || "#3b82f6";
}

const fetchProjectDetails = async () => {
  try {
    const response = await useRequest(api.project.detail, {
      method: "POST",
      body: { id: projectId },
    });

    if (response && response.data) {
      project.value = response.data;
    }
  } catch (error) {
    console.error("Failed to fetch project details:", error);
  }
};

const handleProjectUpdated = () => {
  // Refresh project details when updated
  fetchProjectDetails();
};

const updateTaskCount = (count: number) => {
  taskCount.value = count;
};

// Task Dialog Methods
const openAddTaskDialog = (): void => {
  taskDialogVisible.value = true;
};

const closeTaskDialog = (): void => {
  taskDialogVisible.value = false;
};

const handleTaskSaved = (): void => {
  closeTaskDialog();
  toast.add({
    severity: "success",
    summary: "Success",
    detail: "Task created successfully!",
    life: 3000,
  });
  if (activeTab.value === "kanban") {
    kanbanBoardRef.value?.fetchTasks();
  }
};

onMounted(async () => {
  if (projectId) {
    await fetchProjectDetails();
  }
  if (!tabs.value.some((t) => t.key === activeTab.value)) {
    changeTab(tabs.value[0].key);
  }
});
</script>

<style scoped>
/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #c5c5c5;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
