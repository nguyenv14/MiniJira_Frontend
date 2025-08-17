<!-- src/components/ProjectDetails.vue -->
<template>
  <div class="project-details-tab p-6 bg-white rounded-lg">
    <div v-if="isLoading" class="text-center py-10">
      <i class="pi pi-spin pi-spinner text-2xl" />
      <p class="mt-2">Loading board...</p>
    </div>
    <div v-if="!isLoading && project">
      <!-- Header với nút Edit -->
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">Project Details</h2>
        <Button
          label="Edit Project"
          icon="pi pi-pencil"
          class="p-button-outlined"
          @click="openEditDialog"
        />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DetailItem label="Name" :value="project.name" />
        <DetailItem label="Code" :value="project.code" />
        <DetailItem label="Project Type" :value="getProjectType(project.project_type)" />
        <DetailItem label="Industry" :value="getIndustryDescription(project.industry)" />
        <DetailItem label="Categories" :value="getCategoryNames(project.categories)" />
        <div class="flex flex-col">
          <label class="font-semibold text-gray-700">Color</label>
          <div class="flex items-center mt-1">
            <span
              class="inline-block w-5 h-5 rounded-full border border-gray-300 mr-2"
              :style="{ backgroundColor: getColorCode(project.color) }"
            />
            <span class="text-sm text-gray-900">{{ getColorName(project.color) }}</span>
          </div>
        </div>

        <DetailItem label="Start Date" :value="formatDate(project.start_date)" />
        <DetailItem label="End Date" :value="formatDate(project.end_date)" />
        <DetailItem
          label="Manager"
          :value="`${project.managerUser?.username} (${project.managerUser?.email})`"
        />

        <div class="md:col-span-2 lg:col-span-3">
          <label class="font-semibold text-gray-700 block">Basic Info</label>
          <p class="mt-1 text-sm text-gray-900">{{ project.basicInfo }}</p>
        </div>

        <div class="md:col-span-2 lg:col-span-3">
          <label class="font-semibold text-gray-700 block">Description</label>
          <p class="mt-1 text-sm text-gray-900">{{ project.description }}</p>
        </div>

        <div class="md:col-span-2 lg:col-span-3">
          <label class="font-semibold text-gray-700 block">Features</label>
          <p class="mt-1 text-sm text-gray-900">{{ project.features }}</p>
        </div>

        <div class="md:col-span-2 lg:col-span-3">
          <label class="font-semibold text-gray-700 block">Tags</label>
          <div class="mt-1 flex flex-wrap gap-2">
            <span
              v-for="tag in project.tags"
              :key="tag"
              class="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full"
            >
              {{ tag }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="!isLoading">
      <p class="text-gray-500">Project not found for ID: {{ projectId }}.</p>
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
import DetailItem from "./components/DetailItem.vue";

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
