<!-- components/EditTaskDialog.vue -->
<template>
  <div
    class="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
    @click.self="$emit('close')"
  >
    <div
      class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-95 animate-in fade-in zoom-in"
    >
      <div class="p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-slate-800">Edit Task</h2>
          <button
            class="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-slate-100 text-slate-500 hover:text-slate-700"
            @click="$emit('close')"
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
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="saveTask" class="space-y-6">
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-2">Title</label>
            <input
              v-model="form.title"
              type="text"
              class="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-slate-50 focus:bg-white"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-2"
              >Description</label
            >
            <textarea
              v-model="form.description"
              rows="4"
              class="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-slate-50 focus:bg-white resize-none"
              placeholder="Enter task description..."
            ></textarea>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-2"
                >Start Date</label
              >
              <input
                v-model="form.start_date"
                type="date"
                class="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-slate-50 focus:bg-white"
              />
            </div>
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-2"
                >End Date</label
              >
              <input
                v-model="form.end_date"
                type="date"
                class="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-slate-50 focus:bg-white"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-2"
                >Status</label
              >
              <select
                v-model="form.status"
                class="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-slate-50 focus:bg-white appearance-none"
              >
                <option :value="0">To Do</option>
                <option :value="1">In Progress</option>
                <option :value="2">Review</option>
                <option :value="3">Done</option>
                <option :value="4">Cancelled</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-2"
                >Priority</label
              >
              <select
                v-model="form.priority"
                class="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-slate-50 focus:bg-white appearance-none"
              >
                <option :value="0">Low</option>
                <option :value="1">Medium</option>
                <option :value="2">High</option>
                <option :value="3">Highest</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-2"
                >Estimated Hours</label
              >
              <input
                v-model.number="form.estimated_hours"
                type="number"
                min="0"
                step="0.5"
                class="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-slate-50 focus:bg-white"
                placeholder="Enter estimated hours"
              />
            </div>
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-2"
                >Actual Hours</label
              >
              <input
                v-model.number="form.actual_hours"
                type="number"
                min="0"
                step="0.5"
                class="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-slate-50 focus:bg-white"
                placeholder="Enter actual hours"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-2"
              >Assignee</label
            >
            <select
              v-model="form.assignee"
              class="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-slate-50 focus:bg-white appearance-none"
              :disabled="loadingUsers"
            >
              <option v-for="user in users" :key="user._id" :value="user._id">
                {{ user.username }}
              </option>
            </select>
          </div>

          <div class="flex justify-end gap-3 pt-4">
            <button
              type="button"
              class="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-all duration-200 hover:shadow-sm"
              @click="$emit('close')"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5"
              :disabled="loadingUsers"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TaskDetail, User } from "@/schema/kanban";
import { getApiRoutes } from "@/utils/api";
import { useProjectUsers } from "@/composables/useProjectUsers";
import { useToast } from "primevue/usetoast";

const api = getApiRoutes();
const { users, loading: loadingUsers, fetchUsersForProject } = useProjectUsers();
const toast = useToast();
const props = defineProps<{
  task: TaskDetail;
  projectId: string;
}>();

const emit = defineEmits(["close", "save"]);

// Xử lý assignee value
const getAssigneeValue = () => {
  if (!props.task.userAssignee) return "";

  if (typeof props.task.userAssignee === "object" && props.task.userAssignee !== null) {
    return (props.task.userAssignee as User)._id || "";
  }

  return props.task.userAssignee?.toString() || "";
};

const form = ref({
  _id: props.task._id,
  title: props.task.title,
  description: props.task.description || "",
  start_date: props.task.start_date
    ? new Date(props.task.start_date).toISOString().split("T")[0]
    : "",
  end_date: props.task.end_date
    ? new Date(props.task.end_date).toISOString().split("T")[0]
    : "",
  status: props.task.status !== undefined ? props.task.status : 0,
  priority: props.task.priority !== undefined ? props.task.priority : 0,
  estimated_hours: props.task.estimated_hours || 0,
  actual_hours: props.task.actual_hours || 0,
  assignee: getAssigneeValue(),
});

const saveTask = async () => {
  try {
    const payload = {
      _id: props.task._id,
      title: form.value.title,
      project_id: props.projectId,
      description: form.value.description,
      start_date: form.value.start_date,
      end_date: form.value.end_date,
      status: form.value.status,
      priority: form.value.priority,
      estimated_hours: form.value.estimated_hours || null,
      actual_hours: form.value.actual_hours || null,
      assignee: form.value.assignee || null,
    };

    const response = await useRequest(api.task.save, {
      method: "POST",
      body: payload,
    });
    if (!response.data) throw new Error("No response data");
    console.log("Task updated:", response.data);
    toast.add({
      severity: "success",
      summary: "Success",
      detail: "Task updated successfully!",
      life: 3000,
    });
    emit("save", payload);
    emit("close");
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Failed to update task. Please try again.",
      life: 3000,
    });
    console.error("Failed to update task:", error);
  }
};

onMounted(async () => {
  await fetchUsersForProject(props.projectId);
});
</script>

<style scoped>
/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: #c5c5c5;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Animation for dialog entrance */
@keyframes modalEnter {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-in {
  animation: modalEnter 0.2s ease-out forwards;
}
</style>
