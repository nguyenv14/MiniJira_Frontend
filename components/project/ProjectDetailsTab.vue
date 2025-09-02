<template>
  <div
    class="project-details-tab bg-white rounded-2xl shadow-lg p-6 transition-all duration-300"
  >
    <!-- Loading State -->
    <div v-if="isLoading" class="flex flex-col items-center justify-center py-16">
      <div class="relative">
        <div
          class="w-12 h-12 border-4 border-blue-200 rounded-full animate-spin border-t-blue-500"
        />
      </div>
      <p class="mt-4 text-gray-600 font-medium">Loading project details...</p>
    </div>

    <!-- Project Content -->
    <div v-else-if="project" class="space-y-8">
      <!-- Header Section -->
      <div
        class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 pb-6 border-b border-gray-100"
      >
        <div>
          <h2 class="text-3xl font-bold text-gray-900">{{ project.name }}</h2>
          <p class="text-gray-500 mt-1">Project ID: {{ project.code }}</p>
        </div>
        <Button
          label="Edit Project"
          icon="pi pi-pencil"
          class="p-button-outlined p-button-secondary rounded-lg"
          @click="openEditDialog"
        />
      </div>

      <!-- Project Info Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Basic Info Cards -->
        <div class="bg-gray-50 rounded-xl p-5 transition-all hover:shadow-sm">
          <div class="flex items-center">
            <div class="p-2 bg-blue-100 rounded-lg">
              <i class="pi pi-briefcase text-blue-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm text-gray-500">Project Type</p>
              <p class="font-medium text-gray-900">
                {{ getProjectType(project.project_type) }}
              </p>
            </div>
          </div>
        </div>

        <div class="bg-gray-50 rounded-xl p-5 transition-all hover:shadow-sm">
          <div class="flex items-center">
            <div class="p-2 bg-green-100 rounded-lg">
              <i class="pi pi-industry text-green-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm text-gray-500">Industry</p>
              <p class="font-medium text-gray-900">
                {{ getIndustryDescription(project.industry) }}
              </p>
            </div>
          </div>
        </div>

        <div class="bg-gray-50 rounded-xl p-5 transition-all hover:shadow-sm">
          <div class="flex items-center">
            <div class="p-2 bg-purple-100 rounded-lg">
              <i class="pi pi-tags text-purple-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm text-gray-500">Categories</p>
              <p class="font-medium text-gray-900">
                {{ getCategoryNames(project.categories) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Color & Dates -->
        <div class="bg-gray-50 rounded-xl p-5 transition-all hover:shadow-sm">
          <div class="flex items-center">
            <div class="p-2 bg-yellow-100 rounded-lg">
              <i class="pi pi-palette text-yellow-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm text-gray-500">Color</p>
              <div class="flex items-center mt-1">
                <span
                  class="inline-block w-4 h-4 rounded-full border border-gray-300 mr-2"
                  :style="{ backgroundColor: getColorCode(project.color) }"
                />
                <span class="font-medium text-gray-900">{{
                  getColorName(project.color)
                }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-gray-50 rounded-xl p-5 transition-all hover:shadow-sm">
          <div class="flex items-center">
            <div class="p-2 bg-red-100 rounded-lg">
              <i class="pi pi-calendar-plus text-red-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm text-gray-500">Start Date</p>
              <p class="font-medium text-gray-900">
                {{ formatDate(project.start_date) }}
              </p>
            </div>
          </div>
        </div>

        <div class="bg-gray-50 rounded-xl p-5 transition-all hover:shadow-sm">
          <div class="flex items-center">
            <div class="p-2 bg-indigo-100 rounded-lg">
              <i class="pi pi-calendar-minus text-indigo-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm text-gray-500">End Date</p>
              <p class="font-medium text-gray-900">{{ formatDate(project.end_date) }}</p>
            </div>
          </div>
        </div>

        <!-- Manager -->
        <div
          class="lg:col-span-3 bg-gray-50 rounded-xl p-5 transition-all hover:shadow-sm"
        >
          <div class="flex items-center">
            <div class="p-2 bg-cyan-100 rounded-lg">
              <i class="pi pi-user text-cyan-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm text-gray-500">Project Manager</p>
              <p v-if="project.managerUser" class="font-medium text-gray-900">
                {{ project.managerUser.username }}
                <span class="text-gray-500 font-normal"
                  >({{ project.managerUser.email }})</span
                >
              </p>
              <p v-else class="font-medium text-gray-900">N/A</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Detailed Sections -->
      <div class="space-y-6">
        <!-- Basic Info -->
        <div class="border border-gray-200 rounded-xl overflow-hidden">
          <div class="bg-gray-50 px-5 py-3 border-b border-gray-200">
            <h3 class="font-semibold text-gray-800 flex items-center">
              <i class="pi pi-info-circle mr-2 text-blue-500"></i>
              Basic Information
            </h3>
          </div>
          <div class="p-5">
            <p class="text-gray-700">
              {{ project.basicInfo || "No basic information provided" }}
            </p>
          </div>
        </div>

        <!-- Description -->
        <div class="border border-gray-200 rounded-xl overflow-hidden">
          <div class="bg-gray-50 px-5 py-3 border-b border-gray-200 flex items-center">
            <i class="pi pi-file mr-2 text-green-500"></i>
            <h3 class="font-semibold text-gray-800">Description</h3>
          </div>
          <div class="p-5 bg-white">
            <p class="text-gray-700 leading-relaxed">
              {{ project.description || "No description provided" }}
            </p>
          </div>
        </div>

        <!-- Features -->
        <div class="border border-gray-200 rounded-xl overflow-hidden">
          <div class="bg-gray-50 px-5 py-3 border-b border-gray-200 flex items-center">
            <i class="pi pi-star mr-2 text-yellow-500" />
            <h3 class="font-semibold text-gray-800">Features</h3>
          </div>
          <div class="p-5 bg-white">
            <p class="text-gray-700 leading-relaxed">
              {{ project.features || "No features listed" }}
            </p>
          </div>
        </div>

        <!-- Tags -->
        <div class="border border-gray-200 rounded-xl overflow-hidden">
          <div class="bg-gray-50 px-5 py-3 border-b border-gray-200 flex items-center">
            <i class="pi pi-tags mr-2 text-purple-500" />
            <h3 class="font-semibold text-gray-800">Tags</h3>
          </div>
          <div class="p-5 bg-white">
            <div class="flex flex-wrap gap-2">
              <span
                v-for="tag in project.tags"
                :key="tag"
                class="px-3 py-1.5 text-sm font-medium bg-blue-50 text-blue-700 rounded-full border border-blue-100 transition-all hover:bg-blue-100 cursor-pointer"
              >
                {{ tag }}
              </span>
              <span
                v-if="!project.tags || project.tags.length === 0"
                class="text-gray-500 text-sm"
              >
                No tags available
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Not Found -->
    <div v-else class="text-center py-16">
      <div
        class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4"
      >
        <i class="pi pi-search text-2xl text-gray-400" />
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-1">Project Not Found</h3>
      <p class="text-gray-500">No project found with ID: {{ projectId }}</p>
    </div>

    <!-- Edit Dialog -->
    <EditProjectDialog
      v-if="project"
      v-model:visible="editDialogVisible"
      :project="project"
      @project-updated="handleProjectUpdated"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { getApiRoutes } from "@/utils/api";
import { BoardColor, getColorCode } from "@/constants/board_color";
import { getProjectType } from "@/constants/project_type";
import { getIndustryDescription, getProjectCategoryDescription } from "@/constants/enum";
import Button from "primevue/button";
import { useToast } from "primevue/usetoast";
import EditProjectDialog from "./EditProjectDialog.vue";

const api = getApiRoutes();
const toast = useToast();

const props = defineProps({
  projectId: {
    type: String,
    required: true,
  },
});

// State cho dialog
const editDialogVisible = ref(false);

// Hàm mở dialog edit
const openEditDialog = () => {
  editDialogVisible.value = true;
};

// Hàm xử lý khi project được cập nhật
const handleProjectUpdated = async () => {
  toast.add({
    severity: "success",
    summary: "Success",
    detail: "Project updated successfully!",
    life: 3000,
  });

  // Gọi lại API để refresh dữ liệu
  await fetchProjectDetails();
};

// Các hàm helper
const getColorName = (color: number) => {
  const colorNames: Record<number, string> = {
    [BoardColor.WHITE]: "White",
    [BoardColor.BLUE]: "Blue",
    [BoardColor.RED]: "Red",
    [BoardColor.GREEN]: "Green",
    [BoardColor.YELLOW]: "Yellow",
    [BoardColor.PURPLE]: "Purple",
    [BoardColor.ORANGE]: "Orange",
    [BoardColor.GRAY]: "Gray",
    [BoardColor.NAVY]: "Navy",
  };
  return colorNames[color] || "Unknown";
};

const getCategoryNames = (categoryIds: number[]): string => {
  if (!categoryIds || categoryIds.length === 0) return "None";
  return categoryIds.map((id) => getProjectCategoryDescription(id)).join(", ");
};

const formatDate = (dateString: string | Date | null | undefined): string => {
  if (!dateString) return "N/A";
  if (typeof dateString === "string" || dateString instanceof Date) {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "Invalid Date" : date.toLocaleDateString();
  }
  return "Invalid Date";
};

// State
const project = ref<any>(null);
const isLoading = ref(true);

const fetchProjectDetails = async () => {
  isLoading.value = true;
  try {
    const response = await useRequest(api.project.detail, {
      method: "POST",
      body: { id: props.projectId },
    });

    if (response && response.data) {
      project.value = response.data;
    } else {
      project.value = null;
    }
  } catch (error) {
    console.error("Failed to fetch project details:", error);
    project.value = null;
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  if (props.projectId) {
    await fetchProjectDetails();
  } else {
    isLoading.value = false;
  }
});

watch(
  () => props.projectId,
  async (newId) => {
    if (newId) {
      project.value = null;
      await fetchProjectDetails();
    } else {
      isLoading.value = false;
      project.value = null;
    }
  }
);
</script>

<style scoped>
.project-details-tab {
  max-width: 1400px;
  margin: 0 auto;
}

/* Custom spinner animation */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
