<template>
  <div
    class="project-detail-page p-4"
    :style="`background-color: ${getColorCode(project!.color ? project!.color : 1)}!important`"
  >
    <!-- Header Top -->
    <div class="flex items-center mb-2 bg-white rounded-lg shadow-sm p-4">
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

      <!-- Title -->
      <h2 class="text-xl font-bold">Board Detail</h2>
    </div>

    <!-- Tab Navigation -->
    <div class="border-b border-gray-200">
      <nav class="flex space-x-2 overflow-x-auto">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          :class="[
            'flex-1 px-4 py-2 font-medium text-sm rounded-t-lg focus:outline-none text-center',
            activeTab === tab.key
              ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
              : 'text-gray-500 hover:text-gray-700 hover:border-gray-300 bg-gray-50',
          ]"
          @click="activeTab = tab.key"
        >
          {{ tab.label }}
        </button>
      </nav>
    </div>

    <!-- Tab Content -->
    <div
      class="tab-content bg-white shadow-sm rounded-b-xl"
      style="height: calc(100vh - 140px)"
    >
      <div class="h-full overflow-y-auto">
        <!-- Tab 1: Update Project & Add Members -->
        <div v-if="activeTab === 'details'" class="p-4">
          <ProjectDetailsTab :project-id="projectId" />
        </div>

        <div v-else-if="activeTab === 'kanban'" class="p-4">
          <KanbanBoard :project-id="projectId" />
        </div>

        <div v-else-if="activeTab === 'members'" class="p-4">
          <MemberTab :project-id="projectId" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Import types and composables
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import KanbanBoard from "@/components/project/KanbanBoard.vue";
import MemberTab from "@/components/project/MemberTab.vue";

// Define page meta
definePageMeta({
  layout: "empty",
});

// Interfaces
interface Tab {
  key: string;
  label: string;
}

// Composables
const route = useRoute();
const router = useRouter();
const api = getApiRoutes();

// Props/Refs
const projectId = route.params.id as string;
const activeTab = ref<string>("details");

const tabs = ref<Tab[]>([
  { key: "details", label: "Project Details" },
  { key: "members", label: "Members" },
  { key: "kanban", label: "Kanban Board" },
]);

// Methods
const goBack = (): void => {
  router.back();
};

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
} | null>({
  name: "",
  code: "",
  basicInfo: "",
  description: "",
  features: "",
  project_type: 0,
  industry: 0,
  categories: [],
  color: 0,
  start_date: new Date(),
  end_date: new Date(),
  tags: [],
});

function getColorCode(color: number, opacity = 10): string {
  const hex =
    {
      0: "#ffffff",
      1: "#3b82f6",
      2: "#ef4444",
      3: "#10b981",
      4: "#facc15",
      5: "#8b5cf6",
      6: "#f97316",
      7: "#9ca3af",
      8: "#1e3a8a",
    }[color] || "#ffffff";

  // Convert hex to rgba
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

const isLoading = ref(true);

const fetchProjectDetails = async () => {
  isLoading.value = true;
  try {
    // Giả lập độ trễ mạng
    const response = await useRequest(api.project.detail, {
      method: "POST",
      body: { id: projectId },
    });

    if (response && response.data) {
      project.value = response.data;
      console.log("Project details fetched successfully:", project.value);
    } else {
      console.error("Project not found or error fetching details");
      project.value = null;
    }
  } catch (error) {
    console.error("Failed to fetch fake project details:", error);
    project.value = null;
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  if (projectId) {
    await fetchProjectDetails();
  } else {
    isLoading.value = false;
  }
});
</script>

<style scoped>
.tab-content {
  min-height: 400px;
}
</style>
