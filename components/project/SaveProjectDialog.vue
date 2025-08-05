<template>
  <Dialog
    v-model:visible="dialogVisible"
    :style="{ width: '70vw' }"
    header="Create New Project"
    :modal="true"
    :closable="false"
  >
    <div class="p-fluid">
      <div class="flex flex-wrap gap-4">
        <div class="w-full flex flex-col sm:flex-row gap-4">
          <div class="flex-grow">
            <InputComponent
              v-model="newProject.name"
              type="text"
              label="Project Name"
              :is-required="true"
              :class="{ 'p-invalid': errors.name }"
              placeholder="Enter project name"
              :error-message="errors.name"
            />
          </div>
          <div class="sm:w-1/3 flex-shrink-0">
            <InputComponent
              v-model="newProject.code"
              type="text"
              label="Project Code"
              :is-required="true"
              :class="{ 'p-invalid': errors.code }"
              placeholder="Enter project code (e.g., PROJ-001)"
              :error-message="errors.code"
            />
          </div>
        </div>

        <div class="w-full">
          <label class="block text-sm font-bold mb-1"
            >Basic Info <span style="color: red">*</span></label
          >
          <Textarea
            v-model="newProject.basicInfo"
            :class="{ 'p-invalid': errors.basicInfo }"
            placeholder="Enter basic information"
            :rows="2"
            style="width: 100%"
          />
          <small v-if="errors.basicInfo" class="p-error">{{ errors.basicInfo }}</small>
        </div>
        <div class="w-full flex flex-col md:flex-row gap-4">
          <!-- Description -->
          <div class="md:w-1/2 flex flex-col">
            <label class="block text-sm font-bold mb-1"
              >Description <span style="color: red">*</span></label
            >
            <!-- Dùng Textarea trực tiếp -->
            <Textarea
              v-model="newProject.description"
              :class="{ 'p-invalid': errors.description }"
              placeholder="Enter project description"
              :rows="4"
              class="flex-grow"
              style="width: 100%"
            />
            <!-- Giữ lại small error -->
            <small v-if="errors.description" class="p-error">{{
              errors.description
            }}</small>
          </div>
          <!-- Features -->
          <div class="md:w-1/2 flex flex-col">
            <label class="block text-sm font-bold mb-1"
              >Features <span style="color: red">*</span></label
            >
            <!-- Dùng Textarea trực tiếp -->
            <Textarea
              v-model="newProject.features"
              :class="{ 'p-invalid': errors.features }"
              placeholder="Enter project features"
              :rows="4"
              class="flex-grow"
              style="width: 100%"
            />
            <!-- Giữ lại small error -->
            <small v-if="errors.features" class="p-error">{{ errors.features }}</small>
          </div>
        </div>

        <!-- Project Type -->
        <div class="w-full sm:w-[calc(50%-0.5rem)]">
          <label class="block text-sm font-bold mb-1"
            >Project Type <span style="color: red">*</span></label
          >
          <Select
            v-model="newProject.project_type"
            :options="projectTypeOptions"
            option-label="label"
            option-value="value"
            placeholder="Select type"
            class="w-full"
            :show-clear="true"
          />
          <small v-if="errors.project_type" class="p-error">{{
            errors.project_type
          }}</small>
        </div>

        <!-- Industry -->
        <div class="w-full sm:w-[calc(50%-0.5rem)]">
          <label class="block text-sm font-bold mb-1"
            >Industry
            <span style="color: red"><span style="color: red">*</span></span></label
          >
          <Select
            v-model="newProject.industry"
            :options="industryOptions"
            option-label="label"
            option-value="value"
            placeholder="Select industry"
            class="w-full"
            :show-clear="true"
          />
          <small v-if="errors.industry" class="p-error">{{ errors.industry }}</small>
        </div>

        <!-- Categories (Full Width) -->
        <div class="w-full">
          <label class="block text-sm font-bold mb-1"
            >Categories <span style="color: red">*</span></label
          >
          <MultiSelect
            v-model="newProject.categories"
            :options="categoryOptions"
            option-label="label"
            option-value="value"
            placeholder="Select categories"
            filter
            class="w-full"
          />
          <small v-if="errors.categories" class="p-error">{{ errors.categories }}</small>
        </div>

        <!-- Color Picker với Radio Buttons -->
        <div class="w-full">
          <label class="block text-sm font-bold mb-1"
            >Color <span style="color: red">*</span></label
          >
          <div class="flex flex-wrap gap-3">
            <div
              v-for="colorOption in colorOptions"
              :key="colorOption.value"
              :style="{ backgroundColor: getColorCode(colorOption.value) }"
              :class="[
                'w-8 h-8 rounded-full cursor-pointer border-2 transition-all flex items-center justify-center',
                newProject.color == colorOption.value
                  ? 'ring-2 ring-offset-2 ring-black'
                  : 'border-gray-300',
              ]"
              @click="newProject.color = colorOption.value"
            >
              <!-- Hiển thị check nếu chọn -->
              <svg
                v-if="newProject.color === colorOption.value"
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 text-black"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
          </div>
          <small v-if="errors.color" class="p-error">{{ errors.color }}</small>
        </div>

        <!-- Start Date -->
        <div class="w-full sm:w-[calc(50%-0.5rem)]">
          <label class="block text-sm font-bold mb-1">Start Date</label>
          <Calendar
            v-model="newProject.start_date"
            date-format="yy-mm-dd"
            placeholder="yyyy-mm-dd"
            :show-icon="true"
            :show-button-bar="true"
            :show-clear="true"
            class="w-full"
            :input-class="errors.start_date ? 'p-invalid' : ''"
          />
          <small v-if="errors.start_date" class="p-error">{{ errors.start_date }}</small>
        </div>

        <!-- End Date -->
        <div class="w-full sm:w-[calc(50%-0.5rem)]">
          <label class="block text-sm font-bold mb-1">End Date</label>
          <Calendar
            v-model="newProject.end_date"
            date-format="yy-mm-dd"
            placeholder="yyyy-mm-dd"
            :show-icon="true"
            :show-button-bar="true"
            :show-clear="true"
            class="w-full"
            :input-class="errors.end_date ? 'p-invalid' : ''"
          />
          <small v-if="errors.end_date" class="p-error">{{ errors.end_date }}</small>
        </div>

        <!-- Manager -->
        <!-- <div class="w-full sm:w-[calc(50%-0.5rem)]">
          <label class="block text-sm font-medium mb-1">Manager</label>
          <Dropdown
            v-model="categories"
            :options="projectTypes"
            option-label="name"
            option-value="value"
            placeholder="Select type"
            class="w-full"
            :show-clear="true"
          />
          <small v-if="errors.manager" class="p-error">{{ errors.manager }}</small>
        </div> -->

        <label class="block text-sm font-bold"
          >Tags</label>
        <div
          class="flex flex-wrap items-center gap-1 border border-gray-300 rounded p-2 min-h-[42px] w-full focus-within:ring-2 focus-within:ring-blue-500"
        >
          <span
            v-for="tag in newProject.tags"
            :key="tag"
            class="flex items-center bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full"
          >
            {{ tag }}
            <button class="ml-1 text-blue-500 hover:text-red-500" @click="removeTag(tag)">
              &times;
            </button>
          </span>
          <input
            v-model="inputValue"
            class="flex-1 outline-none border-none focus:ring-0 text-sm"
            placeholder="Nhập tag và nhấn Enter, Space hoặc ,"
            @keydown="handleKeydown"
          >
        </div>
      </div>
    </div>
    <template #footer>
      <Button
        label="Cancel"
        icon="pi pi-times"
        class="p-button-text"
        @click="closeDialog"
      />
      <Button
        label="Create"
        icon="pi pi-check"
        :loading="isCreating"
        @click="createProject"
      />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, computed } from "vue";
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import { useToast } from "primevue/usetoast";
import { getApiRoutes } from "@/utils/api";
import { BoardColor } from "@/constants/board_color";
import InputComponent from "@/components/InputComponent.vue"; // Import InputComponent
import { ProjectType, ProjectCategory, Industry } from "@/constants/project_type";

const inputValue = ref("");

function addTag() {
  const trimmed = inputValue.value.trim();
  if (trimmed && !(newProject.value.tags as string[]).includes(trimmed)) {
    (newProject.value.tags as string[]).push(trimmed);
  }
  inputValue.value = "";
}

function handleKeydown(e: KeyboardEvent) {
  if (["Enter", " ", ","].includes(e.key)) {
    e.preventDefault();
    addTag();
  }
}

function removeTag(tag: string) {
  newProject.value.tags = newProject.value.tags.filter((t) => t !== tag);
}

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  projectTypes: {
    type: Array,
    default: () => [],
  },
  industries: {
    type: Array,
    default: () => [],
  },
  managers: {
    type: Array,
    default: () => [],
  },
});

const errors = ref<Record<string, string>>({
  name: "",
  basicInfo: "",
  code: "",
  description: "",
  features: "",
  project_type: "",
  categories: "",
  industry: "",
  manager: "",
  tags: "",
});

const emit = defineEmits(["update:visible", "project-created"]);

const toast = useToast();
const api = getApiRoutes();

const dialogVisible = computed({
  get: () => props.visible,
  set: (val) => emit("update:visible", val),
});

const projectTypeOptions = [
  { label: "Internal", value: ProjectType.INTERNAL },
  { label: "External", value: ProjectType.EXTERNAL },
  { label: "Labor", value: ProjectType.LABOR },
  { label: "Product", value: ProjectType.PRODUCT },
];

const categoryOptions = [
  { label: "Web Development", value: ProjectCategory.WEB_DEVELOPMENT },
  { label: "Mobile Development", value: ProjectCategory.MOBILE_DEVELOPMENT },
  { label: "Design", value: ProjectCategory.DESIGN },
  { label: "Marketing", value: ProjectCategory.MARKETING },
  { label: "Consulting", value: ProjectCategory.CONSULTING },
];

const industryOptions = [
  { label: "Technology", value: Industry.TECHNOLOGY },
  { label: "Finance", value: Industry.FINANCE },
  { label: "Healthcare", value: Industry.HEALTHCARE },
  { label: "Education", value: Industry.EDUCATION },
  { label: "E-commerce", value: Industry.ECOMMERCE },
];

// Sắp xếp lại colorOptions để màu trắng lên đầu (nếu cần)
const colorOptions = ref([
  { name: "White", value: BoardColor.WHITE },
  { name: "Blue", value: BoardColor.BLUE },
  { name: "Red", value: BoardColor.RED },
  { name: "Green", value: BoardColor.GREEN },
  { name: "Yellow", value: BoardColor.YELLOW },
  { name: "Purple", value: BoardColor.PURPLE },
  { name: "Orange", value: BoardColor.ORANGE },
  { name: "Gray", value: BoardColor.GRAY },
  { name: "Navy", value: BoardColor.NAVY },
]);

// Hàm lấy mã màu (cần được định nghĩa hoặc import)
// Giả định bạn có một hàm như thế này, nếu không hãy thay thế bằng logic của bạn
const getColorCode = (colorValue: number) => {
  const colorMap: Record<number, string> = {
    [BoardColor.WHITE]: "#FFFFFF",
    [BoardColor.BLUE]: "#2196F3",
    [BoardColor.RED]: "#F44336",
    [BoardColor.GREEN]: "#4CAF50",
    [BoardColor.YELLOW]: "#FFEB3B",
    [BoardColor.PURPLE]: "#9C27B0",
    [BoardColor.ORANGE]: "#FF9800",
    [BoardColor.GRAY]: "#9E9E9E",
    [BoardColor.NAVY]: "#003087",
  };
  return colorMap[colorValue] || "#CCCCCC"; // Mặc định nếu không tìm thấy
};

// Form data
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
  color: 0,
});

const isCreating = ref(false);

// Methods
const closeDialog = () => {
  dialogVisible.value = false;
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
    color: 0,
  };
};

const createProject = async () => {
  // if (!validateForm()) return;

  isCreating.value = true;
  try {
    const requestBody = { ...newProject.value };
    requestBody.start_date = requestBody.start_date
      ? new Date(requestBody.start_date).toISOString()
      : null;

    requestBody.end_date = requestBody.end_date
      ? new Date(requestBody.end_date).toISOString()
      : null;

    const response = await useRequest(api.project.project, {
      method: "POST",
      body: requestBody,
    });

    if (response && response.statusCode === 200) {
      toast.add({
        severity: "success",
        summary: "Success",
        detail: "Project created successfully!",
        life: 3000,
      });
      emit("project-created", response.data);
      closeDialog();
    } else if (response.statusCode == 400) {
      toast.add({
        severity: "success",
        summary: "Message",
        detail: response.message,
        life: 3000,
      });
    } else {
      const fieldErrors: Record<string, string> = {};
      const messages = response.message;
      for (const key in messages) {
        if (
          Object.prototype.hasOwnProperty.call(messages, key) &&
          Array.isArray(messages[key]) &&
          messages[key].length > 0
        ) {
          fieldErrors[key] = messages[key][0]; // ✅ chỉ lấy lỗi đầu tiên của mỗi field
        }
      }
      errors.value = fieldErrors;
    }
  } catch (error) {
    console.log("tag", "error: " + error);
  } finally {
    isCreating.value = false;
  }
};
</script>

<style scoped>
.p-error {
  color: #f44336;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: block;
}
</style>
