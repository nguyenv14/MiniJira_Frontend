<template>
  <div class="kanban-board">
    <div v-if="isLoading" class="text-center py-10">
      <i class="pi pi-spin pi-spinner text-2xl"></i>
      <p class="mt-2">Loading board...</p>
    </div>
    <div v-else-if="error" class="text-center py-10 text-red-500">
      <i class="pi pi-exclamation-triangle text-2xl"></i>
      <p class="mt-2">{{ error }}</p>
    </div>
    <div v-else class="flex space-x-4 overflow-x-auto pb-4">
      <div
        v-for="column in columns"
        :key="column.id"
        class="flex-shrink-0 w-72 bg-gray-100 rounded-lg"
        :class="column.color || 'bg-gray-100'"
      >
        <div class="p-3 font-semibold border-b flex justify-between items-center">
          <span>{{ column.title }}</span>
          <span class="bg-white bg-opacity-50 text-xs px-2 py-1 rounded-full">
            {{ getTaskCountByStatus(column.id) }}
          </span>
        </div>
        <div
          class="p-2 space-y-2 min-h-[150px] transition-colors duration-200"
          :class="{
            'bg-blue-50 bg-opacity-50': isDraggingOver && dragOverColumnId === column.id,
          }"
          @dragover.prevent="onDragOver(column.id)"
          @dragleave="onDragLeave"
          @drop="onDrop(column.id)"
        >
          <KanbanTask
            v-for="task in getTasksByStatus(column.id)"
            :key="task.id"
            :task="task"
            @dragstart="onDragStart(task)"
            @edit="onEditTask"
            @delete="onDeleteTask"
          />
        </div>
        <div class="p-2 border-t">
          <Button
            icon="pi pi-plus"
            label="Add Task"
            class="p-button-text p-button-sm w-full justify-start"
            @click="openAddTaskDialog(column.id)"
          />
        </div>
      </div>
    </div>

    <!-- Dialog Thêm/Sửa Task (Giả lập) -->
    <Dialog
      v-model:visible="taskDialogVisible"
      :header="editingTask ? 'Edit Task' : 'Add New Task'"
      :modal="true"
      :style="{ width: '500px' }"
      :draggable="false"
    >
      <div class="p-fluid">
        <div class="field mb-4">
          <label for="task-title" class="block text-sm font-medium mb-1">Title *</label>
          <InputText
            id="task-title"
            v-model="taskForm.title"
            required
            placeholder="Enter task title"
            class="w-full"
          />
        </div>
        <div class="field mb-4">
          <label for="task-description" class="block text-sm font-medium mb-1"
            >Description</label
          >
          <Textarea
            id="task-description"
            v-model="taskForm.description"
            placeholder="Enter task description"
            rows="3"
            class="w-full"
          />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="field">
            <label for="task-assignee" class="block text-sm font-medium mb-1"
              >Assignee</label
            >
            <InputText
              id="task-assignee"
              v-model="taskForm.assignee"
              placeholder="Assign to..."
              class="w-full"
            />
          </div>
          <div class="field">
            <label for="task-due-date" class="block text-sm font-medium mb-1"
              >Due Date</label
            >
            <Calendar
              id="task-due-date"
              date-format="yy-mm-dd"
              placeholder="yyyy-mm-dd"
              class="w-full"
            />
          </div>
        </div>
        <div class="field mt-4">
          <label for="task-priority" class="block text-sm font-medium mb-1"
            >Priority</label
          >
          <Dropdown
            id="task-priority"
            v-model="taskForm.priority"
            :options="priorityOptions"
            option-label="name"
            option-value="value"
            placeholder="Select priority"
            class="w-full"
          />
        </div>
        <div class="field mt-4" v-if="!editingTask">
          <label class="block text-sm font-medium mb-1">Status</label>
          <Dropdown
            v-model="taskForm.status"
            :options="columns"
            option-label="title"
            option-value="id"
            placeholder="Select status"
            class="w-full"
            :disabled="!!editingTask"
          />
        </div>
      </div>
      <template #footer>
        <Button
          label="Cancel"
          icon="pi pi-times"
          class="p-button-text"
          @click="closeTaskDialog"
        />
        <Button
          label="Save"
          icon="pi pi-check"
          @click="saveTask"
          :disabled="!taskForm.title"
        />
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import Calendar from "primevue/calendar";
import Dropdown from "primevue/dropdown";

const props = defineProps({
  projectId: {
    type: String,
    required: true,
  },
  // Có thể nhận columns từ component cha nếu cần
  initialColumns: {
    type: Array as () => any[],
    default: () => [],
  },
});

// Dữ liệu giả lập cho Kanban (tương tự như trong pages/projects/[id]/kanban.vue)
const fakeKanbanData = {
  "1": [
    {
      id: 101,
      title: "Setup Development Environment",
      description: "Initialize project repository and install dependencies.",
      status: "todo",
      assignee: "Nguyen Van A",
      dueDate: "2024-06-10",
      priority: "high",
    },
    {
      id: 102,
      title: "Design Database Schema",
      description: "Create initial database schema for core entities.",
      status: "todo",
      assignee: "Tran Thi B",
      dueDate: "2024-06-15",
      priority: "medium",
    },
    {
      id: 103,
      title: "Implement User Authentication",
      description: "Develop login, registration, and session management.",
      status: "inprogress",
      assignee: "Le Van C",
      dueDate: "2024-06-25",
      priority: "high",
    },
    {
      id: 104,
      title: "API Endpoint: Get Projects",
      description: "Create REST API endpoint to fetch project list.",
      status: "inprogress",
      assignee: "Pham Minh D",
      dueDate: "2024-06-20",
      priority: "medium",
    },
    {
      id: 105,
      title: "UI Mockups for Dashboard",
      description: "Create wireframes and high-fidelity mockups for the main dashboard.",
      status: "done",
      assignee: "Hoang Thi E",
      dueDate: "2024-06-05",
      priority: "low",
    },
  ],
  "2": [
    {
      id: 201,
      title: "Research Health Tracking APIs",
      description: "Investigate existing APIs for fitness and health data integration.",
      status: "todo",
      assignee: "Tran Thi B",
      dueDate: "2024-07-20",
      priority: "medium",
    },
    {
      id: 202,
      title: "Design App Icon and Splash Screen",
      description: "Create visual assets for app branding.",
      status: "inprogress",
      assignee: "Nguyen Van A",
      dueDate: "2024-07-25",
      priority: "low",
    },
  ],
};

const fakeColumns = [
  { id: "todo", title: "To Do", color: "bg-gray-200" },
  { id: "inprogress", title: "In Progress", color: "bg-blue-200" },
  { id: "review", title: "Review", color: "bg-yellow-200" },
  { id: "done", title: "Done", color: "bg-green-200" },
];

const priorityOptions = [
  { name: "Low", value: "low" },
  { name: "Medium", value: "medium" },
  { name: "High", value: "high" },
];

// State
const isLoading = ref(false);
const error = ref<string | null>(null);
const columns = ref<any[]>(
  props.initialColumns.length > 0 ? props.initialColumns : fakeColumns
);
const tasks = ref<any[]>([]);
const taskDialogVisible = ref(false);
const editingTask = ref<any>(null);

// Form cho task
const taskForm = ref({
  id: null as number | null,
  title: "",
  description: "",
  status: "todo", // Mặc định là 'todo' khi tạo mới
  assignee: "",
  dueDate: null as string | Date | null,
  priority: "medium",
});

// Drag & Drop state
const draggedTask = ref<any>(null);
const isDraggingOver = ref(false);
const dragOverColumnId = ref<string | null>(null);

// Computed
const getTasksByStatus = computed(() => (status: string) => {
  return tasks.value.filter((task) => task.status === status);
});

const getTaskCountByStatus = computed(() => (status: string) => {
  return tasks.value.filter((task) => task.status === status).length;
});

// Methods
const fetchFakeTasks = () => {
  isLoading.value = true;
  error.value = null;
  try {
    // Giả lập độ trễ
    setTimeout(() => {
      const projectTasks =
        fakeKanbanData[props.projectId as keyof typeof fakeKanbanData] || [];
      tasks.value = [...projectTasks];
      isLoading.value = false;
    }, 600);
  } catch (err) {
    console.error("Error fetching fake tasks:", err);
    error.value = "Failed to load Kanban board data.";
    isLoading.value = false;
  }
};

const openAddTaskDialog = (columnId: string) => {
  taskForm.value = {
    id: null,
    title: "",
    description: "",
    status: columnId, // Đặt status theo column được chọn
    assignee: "",
    dueDate: null,
    priority: "medium",
  };
  editingTask.value = null;
  taskDialogVisible.value = true;
};

const onEditTask = (task: any) => {
  taskForm.value = { ...task };
  editingTask.value = task;
  taskDialogVisible.value = true;
};

const onDeleteTask = (taskId: number) => {
  if (confirm("Are you sure you want to delete this task?")) {
    tasks.value = tasks.value.filter((t) => t.id !== taskId);
    // Trong thực tế, bạn sẽ gọi API để xóa
    console.log("Task deleted (fake):", taskId);
  }
};

const closeTaskDialog = () => {
  taskDialogVisible.value = false;
  editingTask.value = null;
};

const saveTask = () => {
  if (!taskForm.value.title.trim()) return;

  if (editingTask.value) {
    // Update existing task
    const index = tasks.value.findIndex((t) => t.id === editingTask.value.id);
    if (index !== -1) {
      tasks.value[index] = { ...taskForm.value };
    }
  } else {
    // Add new task
    const newTask = {
      ...taskForm.value,
      id: Date.now(), // ID giả lập
    };
    tasks.value.push(newTask);
  }
  closeTaskDialog();
  // Trong thực tế, bạn sẽ gọi API để lưu
  console.log(editingTask.value ? "Task updated (fake)" : "Task added (fake)");
};

// Drag & Drop Handlers
const onDragStart = (task: any) => {
  draggedTask.value = task;
};

const onDragOver = (columnId: string) => {
  isDraggingOver.value = true;
  dragOverColumnId.value = columnId;
};

const onDragLeave = () => {
  // Có thể tinh chỉnh logic nếu cần
};

const onDrop = (columnId: string) => {
  isDraggingOver.value = false;
  dragOverColumnId.value = null;

  if (draggedTask.value && draggedTask.value.status !== columnId) {
    // Move task to new column
    const taskIndex = tasks.value.findIndex((t) => t.id === draggedTask.value.id);
    if (taskIndex !== -1) {
      tasks.value[taskIndex].status = columnId;
      // Trong thực tế, bạn sẽ gọi API để cập nhật status
      console.log(`Task ${draggedTask.value.id} moved to ${columnId} (fake)`);
    }
  }
  draggedTask.value = null;
};

onMounted(() => {
  fetchFakeTasks();
});
</script>

<style scoped>
/* Style tùy chỉnh nếu cần */
</style>
