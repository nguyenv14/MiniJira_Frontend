<template>
  <div class="project-details-tab p-6 bg-white rounded-lg shadow-md">
    <div v-if="isLoading" class="text-center py-10">
      <i class="pi pi-spin pi-spinner text-2xl" />
      <p class="mt-2">Loading board...</p>
    </div>
    <div v-if="!isLoading && project">
      <h2 class="text-2xl font-bold mb-6 text-gray-800">Project Details</h2>

      <!-- Grid layout: 2 hoặc 3 cột -->
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { getApiRoutes } from "@/utils/api";
import { BoardColor, getColorCode } from "@/constants/board_color";
import { getProjectType } from "@/constants/project_type";
import { getIndustryDescription, getProjectCategoryDescription } from "@/constants/enum";
import DetailItem from "./components/DetailItem.vue";

const api = getApiRoutes();

const props = defineProps({
  projectId: {
    type: String,
    required: true,
  },
});

// Hàm lấy tên màu
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

// Hàm định dạng ngày tháng
const formatDate = (dateString: string | Date | null | undefined): string => {
  if (!dateString) return "N/A";
  if (typeof dateString === "string" || dateString instanceof Date) {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "Invalid Date" : date.toLocaleDateString();
  }
  return "Invalid Date";
};

// State
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

const isLoading = ref(true);

const fetchProjectDetails = async () => {
  isLoading.value = true;
  try {
    // Giả lập độ trễ mạng
    const response = await useRequest(api.project.detail, {
      method: "POST",
      body: { id: props.projectId },
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
      project.value = null; // Reset dữ liệu cũ
      await fetchProjectDetails();
    } else {
      isLoading.value = false;
      project.value = null;
    }
  }
);
</script>

<style scoped>
/* Style tùy chỉnh nếu cần */
</style>
