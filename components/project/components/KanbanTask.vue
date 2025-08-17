<template>
  <div class="kanban-task" draggable="true" @dragstart="onDragStart">
    <div class="status-indicator" :style="{ backgroundColor: statusColor }" />

    <div class="task-header">
      <div class="task-title-container">
        <div class="task-title">{{ task.title }}</div>
        <!-- Icon đang cháy khi start_date lớn hơn ngày hiện tại -->
      </div>
      <div class="task-avatar">{{ getAvatarText() }}</div>
    </div>

    <div class="task-footer">
      <div class="flex items-center">
        <span class="task-priority" :style="{ backgroundColor: priorityColor }" />
        <span class="task-status">{{ getTaskPriority(task.priority) }}</span>
      </div>

      <div>
        <i v-if="isBurning" class="" title="Burning Task">🔥</i>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TaskPriority, TaskStatus, getTaskPriority } from "@/constants/project_type";
import type { TaskDetail } from "@/schema/kanban";
import { computed } from "vue";

const props = defineProps({
  task: {
    type: Object as () => TaskDetail,
    required: true,
  },
});

const emit = defineEmits<{
  (e: "dragstart", task: TaskDetail): void;
}>();

const isBurning = computed(() => {
  const burningStatuses = [TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.REVIEW];

  if (!props.task.start_date || !burningStatuses.includes(props.task.status!)) {
    return false;
  }
  const startDate = new Date(props.task.start_date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return startDate < today;
});

// Màu sắc cho priority
const priorityColor = computed(() => {
  switch (props.task.priority) {
    case TaskPriority.HIGH:
      return "#f87171"; // Red-400
    case TaskPriority.MEDIUM:
      return "#facc15"; // Yellow-400
    case TaskPriority.LOW:
      return "#60a5fa"; // Blue-400
    default:
      return "#FF0000"; // Gray-300
  }
});

// Màu sắc cho status
const statusColor = computed(() => {
  switch (props.task.status) {
    case TaskStatus.TODO:
      return "#9ca3af"; // Xám - TODO
    case TaskStatus.IN_PROGRESS:
      return "#3b82f6"; // Xanh dương - IN_PROGRESS
    case TaskStatus.REVIEW:
      return "#f59e0b"; // Vàng - REVIEW
    case TaskStatus.DONE:
      return "#10b981"; // Xanh lá - DONE
    default:
      return "#d1d5db"; // Xám nhạt - Mặc định
  }
});

const getAvatarText = (): string => {
  return props.task.userAssignee?.username?.slice(0, 2).toUpperCase() || "??";
};

const onDragStart = (event: DragEvent) => {
  if (event.dataTransfer) {
    event.dataTransfer.setData("taskId", props.task._id!);
  }
  emit("dragstart", props.task);
};
</script>

<style scoped>
.kanban-task {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  border: 1px solid #e5e7eb;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
}

.kanban-task:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

/* Status Indicator - Top bar */
.status-indicator {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 10px;
  border-radius: 8px 8px 0 0;
}

.task-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 4px; /* Khoảng cách cho status indicator */
}

.task-title-container {
  display: flex;
  align-items: center;
  overflow: hidden;
}

.task-avatar {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #60a5fa, #3b82f6);
  color: white;
  font-size: 14px;
  font-weight: bold;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.task-title {
  font-size: 15px;
  font-weight: 600;
  color: #111827;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.task-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
}

.task-priority {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 8px;
}

.task-status {
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
}

/* Animation cho icon đang cháy */
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
