<!-- components/AddTask.vue -->
<template>
  <Dialog
    v-model:visible="dialogVisible"
    :header="props.initialTask ? 'Edit Task' : 'Add New Task'"
    :modal="true"
    :style="{ width: '700px' }"
    :draggable="false"
    @update:visible="onDialogVisibleChange"
  >
    <div class="p-fluid">
      <!-- Title -->
      <div class="field mb-4">
        <label for="task-title" class="block text-sm font-medium mb-1">Title *</label>
        <InputText
          id="task-title"
          v-model="localTaskForm.title"
          required
          placeholder="Enter task title"
          class="w-full"
          :class="{ 'p-invalid': errors.title }"
        />
        <small v-if="errors.title" class="p-error">{{ errors.title }}</small>
      </div>

      <!-- Description -->
      <div class="field mb-4">
        <label for="task-description" class="block text-sm font-medium mb-1"
          >Description</label
        >
        <Textarea
          id="task-description"
          v-model="localTaskForm.description"
          placeholder="Enter task description"
          rows="3"
          class="w-full"
          :class="{ 'p-invalid': errors.description }"
        />
        <small v-if="errors.description" class="p-error">{{ errors.description }}</small>
      </div>

      <!-- Assignee và Status - cùng hàng -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div class="field">
          <label for="task-assignee" class="block text-sm font-medium mb-1"
            >Assignee</label
          >
          <Dropdown
            id="task-assignee"
            v-model="localTaskForm.assignee"
            :options="assigneeOptions"
            :option-label="(assignee) => `${assignee.username} (${assignee.email})`"
            :option-value="(assignee) => assignee._id"
            placeholder="Select Assignee"
            :loading="loadingUsers"
            class="w-full"
            :class="{ 'p-invalid': errors.assignee }"
            filter
          />
          <small v-if="errors.assignee" class="p-error">{{ errors.assignee }}</small>
        </div>
      </div>

      <!-- Start Date và End Date - cùng hàng -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div class="field">
          <label for="task-start-date" class="block text-sm font-medium mb-1"
            >Start Date</label
          >
          <Calendar
            id="task-start-date"
            v-model="localTaskForm.start_date"
            date-format="yy-mm-dd"
            placeholder="yyyy-mm-dd"
            class="w-full"
          />
        </div>
        <div class="field">
          <label for="task-end-date" class="block text-sm font-medium mb-1"
            >End Date</label
          >
          <Calendar
            id="task-end-date"
            v-model="localTaskForm.end_date"
            date-format="yy-mm-dd"
            placeholder="yyyy-mm-dd"
            class="w-full"
          />
        </div>
      </div>

      <!-- Priority -->
      <div class="field mb-4">
        <label for="task-priority" class="block text-sm font-medium mb-1">Priority</label>
        <Dropdown
          id="task-priority"
          v-model="localTaskForm.priority"
          :options="priorityOptions"
          option-label="label"
          option-value="value"
          placeholder="Select priority"
          class="w-full"
        />
      </div>

      <!-- Estimated Hours và Actual Hours - cùng hàng -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div class="field">
          <label for="task-estimated-hours" class="block text-sm font-medium mb-1"
            >Estimated Hours</label
          >
          <InputNumber
            id="task-estimated-hours"
            v-model="localTaskForm.estimated_hours"
            mode="decimal"
            :min="0"
            class="w-full"
          />
        </div>
        <div class="field">
          <label for="task-actual-hours" class="block text-sm font-medium mb-1"
            >Actual Hours</label
          >
          <InputNumber
            id="task-actual-hours"
            v-model="localTaskForm.actual_hours"
            mode="decimal"
            :min="0"
            class="w-full"
          />
        </div>
      </div>

      <!-- Tags -->
      <div class="field mb-4">
        <label for="task-tags" class="block text-sm font-medium mb-1"
          >Tags (comma separated)</label
        >
        <InputText
          id="task-tags"
          v-model="tagsInput"
          placeholder="tag1, tag2, tag3"
          class="w-full"
          @blur="updateTags"
        />
      </div>

      <!-- Attachments -->
      <div class="field mb-4 text-center">
        <label for="task-attachments" class="block text-sm font-medium mb-2">
          Attachments
        </label>

        <div
          class="relative border-2 border-dashed rounded-lg p-6 cursor-pointer hover:bg-gray-50 transition"
          @click="fileInput?.click()"
        >
          <!-- Icon ở giữa -->
          <i class="pi pi-upload text-3xl text-gray-500 mb-2" />
          <p class="text-gray-500">Click or drag files here</p>

          <!-- Input file ẩn -->
          <input
            id="task-attachments"
            ref="fileInput"
            type="file"
            class="hidden"
            multiple
            @change="handleFileSelect"
          />
        </div>

        <!-- Hiển thị danh sách file đã chọn -->
        <ul v-if="selectedFiles.length" class="mt-3 text-sm text-left">
          <li v-for="file in selectedFiles" :key="file.name">
            📄 {{ file.name }} ({{ (file.size / 1024).toFixed(1) }} KB)
          </li>
        </ul>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end gap-2">
        <Button label="Cancel" severity="secondary" @click="closeDialog" />
        <Button label="Save" severity="info" @click="saveTask" />
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from "vue";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import Calendar from "primevue/calendar";
import Dropdown from "primevue/dropdown";
import InputNumber from "primevue/inputnumber";
import Button from "primevue/button";
import type { TaskDetail, User } from "@/schema/kanban";
import { getTaskPriority, TaskPriority } from "@/constants/project_type";

interface PriorityOption {
  label: string;
  value: number;
}

interface ValidationError {
  [key: string]: string;
}

const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
  projectId: {
    type: String,
    required: true,
  },
  initialTask: {
    type: Object as () => TaskDetail | null,
    default: null,
  },
});

const api = getApiRoutes();

const emit = defineEmits<{
  (e: "update:visible", value: boolean): void;
  (e: "close"): void;
  (e: "save", task: TaskDetail): void;
}>();

// Reactive data
const dialogVisible = ref<boolean>(props.visible);
const errors = ref<ValidationError>({});

const localTaskForm = reactive<TaskDetail>({
  _id: "",
  title: "",
  description: "",
  assignee: "",
  priority: TaskPriority.LOW,
  project_id: props.projectId,
  start_date: undefined,
  end_date: undefined,
  tags: [],
  attachments: [],
  estimated_hours: 0,
  actual_hours: undefined,
  completed_at: undefined,
  parent_task_id: "",
  is_subtask: false,
  checklists: [],
  comments: []
});

const fileInput = ref<HTMLInputElement | null>(null);
const selectedFiles = ref<File[]>([]);
const assigneeOptions = ref<User[]>([]);
const loadingUsers = ref(false);

function handleFileSelect(e: Event) {
  const target = e.target as HTMLInputElement;
  if (target.files) {
    selectedFiles.value = Array.from(target.files);
  }
}

const tagsInput = ref<string>("");
const attachmentsInput = ref<string>("");

const priorityOptions: PriorityOption[] = Object.values(TaskPriority)
  .filter((value): value is TaskPriority => typeof value === "number")
  .map((status) => ({
    label: getTaskPriority(status),
    value: status,
  }));

// Watchers
watch(
  () => props.visible,
  (newVal) => {
    dialogVisible.value = newVal;
  }
);

watch(
  () => props.initialTask,
  (newTask) => {
    if (newTask) {
      Object.assign(localTaskForm, newTask);
      tagsInput.value = newTask.tags?.join(", ") || "";
      attachmentsInput.value =
        newTask.attachments?.map((att) => `${att.name}|${att.url}`).join("\n") || "";
    } else {
      resetForm();
    }
  },
  { immediate: true }
);

watch(
  () => props.projectId,
  (newProjectId) => {
    localTaskForm.project_id = newProjectId;
    if (dialogVisible.value && newProjectId) {
      fetchUsersForProject();
    }
  }
);

// Methods
function resetForm(): void {
  Object.assign(localTaskForm, {
    _id: "",
    title: "",
    description: "",
    assignee: "",
    priority: TaskPriority.LOW,
    project_id: props.projectId,
    start_date: undefined,
    end_date: undefined,
    tags: [],
    attachments: [],
    estimated_hours: 0,
    actual_hours: undefined,
    completed_at: undefined,
    parent_task_id: "",
    is_subtask: false,
  });
  tagsInput.value = "";
  attachmentsInput.value = "";
  errors.value = {};
}

function updateTags(): void {
  localTaskForm.tags = tagsInput.value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function updateAttachments(): void {
  const lines = attachmentsInput.value.split("\n").filter(Boolean);
  localTaskForm.attachments = lines.map((line) => {
    const [name, url] = line.split("|").map((part) => part.trim());
    return { name: name || "", url: url || "" };
  });
}

function onDialogVisibleChange(visible: boolean): void {
  dialogVisible.value = visible;
  emit("update:visible", visible);

  if (visible) {
    fetchUsersForProject();
    errors.value = {}; // Reset errors khi mở dialog
  } else {
    emit("close");
  }
}

function closeDialog(): void {
  dialogVisible.value = false;
  emit("update:visible", false);
  emit("close");
  errors.value = {}; // Reset errors khi đóng dialog
}

function setErrors(validationErrors: any) {
  errors.value = {};

  // Xử lý lỗi từ API response
  if (typeof validationErrors === "object") {
    Object.keys(validationErrors).forEach((key) => {
      const errorMessages = validationErrors[key];
      if (Array.isArray(errorMessages) && errorMessages.length > 0) {
        errors.value[key] = errorMessages[0]; // Lấy lỗi đầu tiên
      }
    });
  }
}

const saveTask = async () => {
  updateTags();
  updateAttachments();

  // Reset errors trước khi submit
  errors.value = {};

  const taskToSave: TaskDetail = {
    ...localTaskForm,
    _id: props.initialTask?._id || "",
  };

  try {
    const response = await useRequest(api.task.save, {
      method: "POST",
      body: taskToSave,
    });

    if (response && response.data && response.statusCode === 200) {
      taskToSave._id = response.data.id || response.data._id || "";
      closeDialog();
      emit("save", taskToSave);
    } else {
      // Xử lý lỗi từ server
      if (response?.message) {
        setErrors(response.message);
      }
    }
  } catch (error) {
    console.error("Validation error:", error);
    // Xử lý lỗi validation từ API
    if (error?.message) {
      setErrors(error.data.message);
    }
  }
};

const fetchUsersForProject = async () => {
  if (!props.projectId) {
    console.warn("Project ID is required to fetch users");
    return;
  }

  loadingUsers.value = true;
  try {
    const response = await useRequest(`${api.user.getUserToProjectByAddTask}`, {
      method: "POST",
      body: { project_id: props.projectId },
    });

    if (response && response.data && response.statusCode === 200) {
      assigneeOptions.value = response.data || [];
    } else {
      assigneeOptions.value = [];
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    assigneeOptions.value = [];
  } finally {
    loadingUsers.value = false;
  }
};

// Gọi API khi component mounted
onMounted(() => {
  if (props.projectId) {
    fetchUsersForProject();
  }
});
</script>

<style scoped>
.relative {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.p-error {
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}
</style>
