<template>
  <div class="flex-1 overflow-y-auto p-8">
    <div v-if="selectedTask" class="max-w-6xl mx-auto">
      <div class="flex justify-between items-start mb-8 pb-6 border-b border-slate-200">
        <div class="flex-1">
          <h1 class="text-3xl font-extrabold text-slate-800 mb-4 leading-tight">
            {{ selectedTask.title }}
          </h1>
          <div v-if="selectedTask.tags?.length" class="flex flex-wrap gap-2">
            <span
              v-for="(tag, index) in selectedTask.tags"
              :key="index"
              class="bg-gradient-to-r from-slate-100 to-slate-200 text-slate-600 px-3 py-1.5 rounded-full text-xs font-medium"
            >
              {{ tag }}
            </span>
          </div>
        </div>
        <div class="flex gap-3">
          <button
            class="w-10 h-10 rounded-xl border border-slate-200 bg-white flex items-center justify-center cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-indigo-500 hover:text-indigo-500"
            @click="editTask"
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
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
          <button
            class="w-10 h-10 rounded-xl border border-slate-200 bg-white flex items-center justify-center cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-red-500 hover:text-red-500"
            @click="deleteTask"
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
            >
              <polyline points="3 6 5 6 21 6" />
              <path
                d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
              />
              <line x1="10" y1="11" x2="10" y2="17" />
              <line x1="14" y1="11" x2="14" y2="17" />
            </svg>
          </button>
        </div>
      </div>

      <div class="mt-6">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="flex flex-col gap-6">
            <div
              class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 transition-all duration-300 hover:shadow-md"
            >
              <h3 class="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                Description
              </h3>
              <p class="text-slate-600 leading-relaxed">
                {{ selectedTask.description || "No description provided" }}
              </p>
            </div>

            <div
              class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 transition-all duration-300 hover:shadow-md"
            >
              <h3 class="text-lg font-bold text-slate-800 mb-4">Timeline</h3>
              <div class="flex flex-col gap-4">
                <div class="flex justify-between py-2 border-b border-slate-50">
                  <span class="font-medium text-slate-500">Start Date</span>
                  <span class="font-medium text-slate-800">{{
                    formatDate(selectedTask.start_date)
                  }}</span>
                </div>
                <div class="flex justify-between py-2 border-b border-slate-50">
                  <span class="font-medium text-slate-500">End Date</span>
                  <span class="font-medium text-slate-800">{{
                    formatDate(selectedTask.end_date)
                  }}</span>
                </div>
                <div class="flex justify-between py-2">
                  <span class="font-medium text-slate-500">Created</span>
                  <span class="font-medium text-slate-800">{{
                    formatDate(selectedTask.createdAt)
                  }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="flex flex-col gap-6">
            <div
              class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 transition-all duration-300 hover:shadow-md"
            >
              <h3 class="text-lg font-bold text-slate-800 mb-4">Details</h3>
              <div class="grid grid-cols-2 gap-4">
                <div class="flex flex-col gap-1.5">
                  <span class="text-xs text-slate-500 font-medium">Status</span>
                  <span class="font-medium text-slate-800">
                    <span
                      :class="[
                          'px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide',
                          getStatusClass(selectedTask.status!),
                        ]"
                    >
                      {{ getStatusText(selectedTask.status!) }}
                    </span>
                  </span>
                </div>

                <div class="flex flex-col gap-1.5">
                  <span class="text-xs text-slate-500 font-medium">Priority</span>
                  <span class="font-medium text-slate-800">
                    <span
                      :class="[
                        'px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide',
                        getPriorityClass(selectedTask.priority),
                      ]"
                    >
                      {{ getPriorityText(selectedTask.priority) }}
                    </span>
                  </span>
                </div>

                <div class="flex flex-col gap-1.5">
                  <span class="text-xs text-slate-500 font-medium">Assignee</span>
                  <span class="font-medium text-slate-800">{{
                    selectedTask.userAssignee?.username || "Unassigned"
                  }}</span>
                </div>

                <div class="flex flex-col gap-1.5">
                  <span class="text-xs text-slate-500 font-medium">Created by</span>
                  <span class="font-medium text-slate-800">{{
                    selectedTask.userCreated?.username
                  }}</span>
                </div>
              </div>
            </div>

            <div
              class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 transition-all duration-300 hover:shadow-md"
            >
              <h3 class="text-lg font-bold text-slate-800 mb-4">Estimate</h3>

              <!-- Accuracy -->
              <div class="mb-4">
                <div class="flex items-center justify-between mb-1">
                  <span class="text-sm font-medium text-slate-700">Accuracy:</span>
                  <span class="text-sm font-medium text-slate-600">
                    {{ selectedTask.estimated_hours || "0" }}h
                  </span>
                </div>
                <div class="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    class="h-full bg-blue-500 transition-all duration-300"
                    :style="{ width: `${getAccuracyPercentage()}%` }"
                  />
                </div>
              </div>

              <!-- Progress Bar -->
              <div class="mb-4">
                <div class="flex items-center justify-between mb-1">
                  <span class="text-sm font-medium text-slate-700">Progress:</span>
                  <span class="text-sm font-medium text-slate-600">
                    {{ selectedTask.actual_hours || "0" }}h
                  </span>
                </div>
                <div class="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    class="h-full bg-emerald-500 transition-all duration-300"
                    :style="{ width: `${getProgressPercentage()}%` }"
                  />
                  <div
                    class="h-full bg-orange-500 transition-all duration-300"
                    :style="{ width: `${100 - getProgressPercentage()}%` }"
                  />
                </div>
              </div>

              <!-- Description -->
              <div class="text-sm text-slate-600 mt-2">
                {{ getProgressText() }}
              </div>
            </div>

            <div
              v-if="selectedTask.attachments?.length"
              class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 transition-all duration-300 hover:shadow-md"
            >
              <h3 class="text-lg font-bold text-slate-800 mb-4">Attachments</h3>
              <div class="flex flex-col gap-3">
                <div
                  v-for="(attachment, index) in selectedTask.attachments"
                  :key="index"
                  class="flex items-center gap-2.5 p-3 rounded-lg bg-slate-50 transition-all duration-200 cursor-pointer hover:bg-slate-100"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path
                      d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"
                    />
                  </svg>
                  <span class="text-sm font-medium text-slate-700">{{
                    attachment.name
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Checklists Section - Luôn hiển thị -->
    <div
      v-if="selectedTask"
      class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 transition-all duration-300 hover:shadow-md mt-6"
    >
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-bold text-slate-800">Checklists</h3>
        <button
          v-if="!showAddChecklistInput"
          class="text-sm font-medium text-indigo-600 hover:text-indigo-800"
          @click="showAddChecklistInput = true"
        >
          + Add Checklist
        </button>
      </div>

      <!-- Overall Progress Bar -->
      <div
        v-if="selectedTask.checklists && selectedTask.checklists.length > 0"
        class="mb-6"
      >
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-slate-700">Overall Progress</span>
          <span class="text-sm font-medium text-slate-600">
            {{ getOverallProgress().completed }}/{{ getOverallProgress().total }}
            completed
          </span>
        </div>
        <div class="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
          <div
            class="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500 ease-out"
            :style="{ width: `${getOverallProgress().percentage}%` }"
          />
        </div>
        <div class="mt-1 text-xs text-slate-500">
          {{ Math.round(getOverallProgress().percentage) }}% complete
        </div>
      </div>

      <!-- Add Checklist Input -->
      <div v-if="showAddChecklistInput" class="mb-4">
        <input
          v-model="newChecklistTitle"
          type="text"
          placeholder="Checklist title"
          class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          @keyup.enter="addChecklist"
        />
        <div class="flex gap-2 mt-2">
          <button
            class="px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
            @click="addChecklist"
          >
            Save
          </button>
          <button
            class="px-4 py-1.5 bg-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-300"
            @click="showAddChecklistInput = false"
          >
            Cancel
          </button>
        </div>
      </div>

      <!-- Existing Checklists -->
      <div class="space-y-3">
        <div
          v-for="checklist in selectedTask.checklists"
          :key="checklist._id"
          class="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
        >
          <input
            type="checkbox"
            :checked="checklist.completed"
            class="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
            @change="(e) => toggleChecklist(checklist._id)"
          />
          <div class="flex-1">
            <span
              :class="{
                'line-through text-slate-400': checklist.completed,
              }"
              class="text-sm font-medium text-slate-800"
            >
              {{ checklist.title }}
            </span>
          </div>
          <div class="flex items-center gap-2">
            <span
              :class="[
                'px-2 py-1 rounded-full text-xs font-medium',
                checklist.completed
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-slate-100 text-slate-600',
              ]"
            >
              {{ checklist.completed ? "Done" : "Pending" }}
            </span>
          </div>
        </div>
      </div>

      <!-- Thông báo khi chưa có checklist -->
      <div
        v-if="!selectedTask.checklists?.length && !showAddChecklistInput"
        class="text-center py-8 text-slate-500"
      >
        <p>No checklists yet. Click "Add Checklist" to create one.</p>
      </div>
    </div>
    <!-- <div v-else class="flex items-center justify-center h-full">
      <div class="text-center max-w-80 mx-auto">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="text-slate-400 mx-auto mb-6"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
        <h2 class="text-xl font-bold text-slate-800 mb-2">No Task Selected</h2>
        <p class="text-slate-500 leading-relaxed">
          Select a task from the list or create a new one to get started
        </p>
      </div>
    </div> -->

    <!-- Add this section after the checklists section -->
    <div
      v-if="selectedTask"
      class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 transition-all duration-300 hover:shadow-md mt-6"
    >
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-bold text-slate-800">Comments</h3>
      </div>

      <!-- Add Comment Form -->
      <div class="mb-6">
        <textarea
          v-model="newComment"
          placeholder="Add a comment..."
          rows="3"
          class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
        />
        <div class="flex justify-end mt-2">
          <button
            :disabled="!newComment.trim()"
            class="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            @click="addComment"
          >
            Add Comment
          </button>
        </div>
      </div>

      <!-- Comments List -->
      <div class="space-y-4">
        <div
          v-for="comment in selectedTask.comments"
          :key="comment._id"
          class="flex gap-3 p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
        >
          <div class="flex-shrink-0">
            <div
              class="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center"
            >
              <span class="text-indigo-800 font-medium text-sm">
                {{ comment.user?.username?.charAt(0).toUpperCase() || "U" }}
              </span>
            </div>
          </div>
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1">
              <span class="font-medium text-slate-800">
                {{ comment.user?.username || "Unknown User" }}
              </span>
              <span class="text-xs text-slate-500">
                {{ formatCommentDate(comment.createdAt) }}
              </span>
            </div>
            <p class="text-slate-600 text-sm leading-relaxed">
              {{ comment.content }}
            </p>
          </div>
        </div>

        <!-- No Comments Message -->
        <div
          v-if="selectedTask.comments.length == 0"
          class="text-center py-8 text-slate-500"
        >
          <p>No comments yet. Be the first to comment!</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  getTaskPriority,
  getTaskStatus,
  TaskPriority,
  TaskStatus,
} from "@/constants/project_type";
import type { TaskChecklist, TaskComment, TaskDetail } from "@/schema/kanban";

const api = getApiRoutes();
const props = defineProps<{
  taskId: string;
}>();

const selectedTask = ref<TaskDetail>();
const showAddChecklistInput = ref(false);
const newChecklistTitle = ref("");
// Add these refs with your other refs
const comments = ref<TaskComment[]>([]);
const newComment = ref("");

const addComment = async () => {
  if (!newComment.value.trim()) return;
  console.log("Adding comment:", newComment.value);
  try {
    await useRequest(api.task.addComment, {
      method: "POST",
      body: {
        taskId: props.taskId,
        content: newComment.value,
      },
    });
    fetchTaskDetail();
  } catch (error) {
    console.error("Failed to add comment:", error);
  }
};

const formatCommentDate = (date: Date | string | undefined): string => {
  if (!date) return "Just now";

  const commentDate = new Date(date);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - commentDate.getTime()) / (1000 * 60));

  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;

  const diffInDays = Math.floor(diffInDays / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;

  return commentDate.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

// Add new checklist
const addChecklist = async () => {
  if (!newChecklistTitle.value.trim()) return;

  try {
    const response = await useRequest(api.task.addChecklist, {
      method: "POST",
      body: {
        taskId: props.taskId,
        title: newChecklistTitle.value,
      },
    });

    // Update local data
    if (!selectedTask.value!.checklists) {
      selectedTask.value!.checklists = [];
    }

    const newChecklist: TaskChecklist = {
      _id: response.data!._id as string,
      task_id: props.taskId,
      title: newChecklistTitle.value as string,
      completed: false,
    };

    selectedTask.value!.checklists.push(newChecklist);

    newChecklistTitle.value = "";
    showAddChecklistInput.value = false;
  } catch (error) {
    console.error("Failed to add checklist:", error);
  }
};

const toggleChecklist = async (checklistId: string) => {
  try {
    await useRequest(api.task.changeStatusChecklist, {
      method: "POST",
      body: {
        checklistId: checklistId,
      },
    });

    selectedTask.value!.checklists?.find((cl) => cl._id === checklistId);
    await fetchTaskDetail();
  } catch (error) {
    console.error("Failed to update checklist:", error);
  }
};

const getOverallProgress = (): {
  completed: number;
  total: number;
  percentage: number;
} => {
  if (!selectedTask.value?.checklists || selectedTask.value.checklists.length === 0) {
    return { completed: 0, total: 0, percentage: 0 };
  }

  const total = selectedTask.value.checklists.length;
  const completed = selectedTask.value.checklists.filter((cl) => cl.completed).length;
  const percentage = total > 0 ? (completed / total) * 100 : 0;

  return {
    completed,
    total,
    percentage,
  };
};

const formatDate = (date: Date | string | undefined): string => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("vi-Vn", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
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

const fetchTaskDetail = async () => {
  try {
    const response = await useRequest(api.task.taskDetail, {
      method: "POST",
      body: {
        taskId: props.taskId,
      },
    });
    selectedTask.value = response.data;
  } catch (error) {
    console.log("tag", error);
  }
};

// Format hours to weeks and days
const formatHours = (hours: number): string => {
  if (!hours || hours <= 0) return "0d";

  const weeks = Math.floor(hours / 40);
  const days = Math.floor((hours % 40) / 8);
  const remainingHours = hours % 8;

  let result = "";
  if (weeks > 0) result += `${weeks}w `;
  if (days > 0) result += `${days}d `;
  if (remainingHours > 0) result += `${remainingHours}h`;

  return result.trim();
};

// Get progress percentage
const getProgressPercentage = (): number => {
  const task = selectedTask.value;

  if (!task?.estimated_hours || task.estimated_hours === 0) return 0;

  // Nếu actual_hours là null/undefined thì progress = 0%
  if (task.actual_hours === null || task.actual_hours === undefined) {
    return 0;
  }

  const percentage = (task.actual_hours / task.estimated_hours) * 100;
  return Math.min(100, Math.round(percentage));
};

// Get accuracy percentage
const getAccuracyPercentage = (): number => {
  const task = selectedTask.value;

  // Nếu không có estimated_hours thì accuracy = 0%
  if (!task?.estimated_hours) return 0;

  // Nếu có estimated_hours nhưng actual_hours là null/undefined thì accuracy = 100%
  if (
    task.estimated_hours &&
    (task.actual_hours === null || task.actual_hours === undefined)
  ) {
    return 100;
  }

  // Nếu cả hai đều có giá trị thì tính accuracy bình thường
  if (task.estimated_hours && task.actual_hours) {
    const diff = Math.abs(task.actual_hours - task.estimated_hours);
    const max = Math.max(task.estimated_hours, task.actual_hours);

    // Tránh chia cho 0
    if (max === 0) return 100;

    const accuracy = 100 - (diff / max) * 100;
    return Math.max(0, Math.round(accuracy));
  }

  // Trường hợp còn lại
  return 0;
};

// Get progress text like in image
const getProgressText = (): string => {
  const task = selectedTask.value;
  if (!task?.estimated_hours) {
    return "No time estimate available";
  }
  const estimated = formatHours(task.estimated_hours);
  if (task.actual_hours === null || task.actual_hours === undefined) {
    return `0h completed from current total estimate of ${estimated}`;
  }
  const completed = formatHours(task.actual_hours);
  return `${completed} completed from current total estimate of ${estimated}`;
};

watch(
  () => props.taskId,
  () => {
    fetchTaskDetail();
  },
  { immediate: true }
);

onMounted(() => {
  fetchTaskDetail();
});
</script>

<style scoped>
/* Add smooth animation */
.bg-emerald-500,
.bg-orange-500,
.bg-blue-500 {
  transition: width 0.3s ease-in-out;
}
</style>
