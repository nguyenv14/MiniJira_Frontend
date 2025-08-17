<template>
  <Dialog
    ref="addUserDialogRef"
    v-model:visible="dialogVisible"
    modal
    header="Add New Member"
    :draggable="false"
    :resizable="false"
    class="p-2"
  >
    <form class="w-100" @submit.prevent="saveMember">
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">Select User</label>
        <Select
          v-model="selectedUserId"
          :options="availableUsers"
          option-label="label"
          option-value="id"
          placeholder="Choose a user"
          class="w-full z-30"
          filter
          required
        />
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">Role</label>
        <div class="flex space-x-4 mt-2">
          <label class="inline-flex items-center">
            <input
              v-model="selectedRole"
              type="radio"
              :value="RoleInProject.ADMIN"
              class="h-4 w-4 text-purple-600 focus:ring-purple-500"
            />
            <span class="ml-2">Admin</span>
          </label>
          <label class="inline-flex items-center">
            <input
              v-model="selectedRole"
              type="radio"
              :value="RoleInProject.LEADER"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500"
            />
            <span class="ml-2">Leader</span>
          </label>
          <label class="inline-flex items-center">
            <input
              v-model="selectedRole"
              type="radio"
              :value="RoleInProject.MEMBER"
              class="h-4 w-4 text-green-600 focus:ring-green-500"
            />
            <span class="ml-2">Member</span>
          </label>
        </div>
      </div>

      <div class="flex justify-end gap-2 mt-6">
        <Button type="button" label="Cancel" severity="secondary" @click="close()" />
        <Button
          type="submit"
          label="Add"
          severity="info"
          :disabled="!selectedUserId || !selectedRole"
        />
      </div>
    </form>
  </Dialog>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import Button from "primevue/button";
import { getApiRoutes } from "@/utils/api";
import { RoleInProject } from "@/constants/enum";

const api = getApiRoutes();

const props = defineProps({
  projectId: {
    type: String,
    required: true,
  },
  visible: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:visible", "member-created"]);

const dialogVisible = computed({
  get: () => props.visible,
  set: (val) => emit("update:visible", val),
});

const close = () => {
  dialogVisible.value = false;
};

const availableUsers = ref<{ id: string; label: string }[]>([]);
const selectedUserId = ref<string | null>(null);
const selectedRole = ref<number | null>(null);
const addUserDialogRef = ref<HTMLDialogElement | null>(null);
const toast = useToast();

function open() {
  selectedUserId.value = null;
  selectedRole.value = null;
  fetchAvailableUsers();
  dialogVisible.value = true;
}

defineExpose({
  open,
});

// Gọi API để lấy users chưa thuộc project
const fetchAvailableUsers = async () => {
  try {
    const response = await useRequest(api.user.getUserToAddProject, {
      method: "POST",
      body: { project_id: props.projectId },
    });

    if (response?.data) {
      availableUsers.value = response.data.map(
        (user: { _id: string; username: string; email: string }) => ({
          id: user._id,
          label: `${user.username} (${user.email})`,
        })
      );
    }
  } catch (error) {
    console.error("Failed to fetch users:", error);
  }
};

// Save member
const saveMember = async () => {
  if (!selectedUserId.value || !selectedRole.value) return;

  try {
    const payload = {
      projectId: props.projectId,
      userId: selectedUserId.value,
      role: selectedRole.value,
    };

    const res = await useRequest(api.project.addMember, {
      method: "POST",
      body: payload,
    });

    if (res.data) {
      toast.add({
        severity: "success",
        summary: "Success",
        detail: "Member added successfully",
        life: 3000,
      });
      close();
      emit("member-created", res.data);
    } else {
      toast.add({
        severity: "error",
        summary: "Error",
        detail: "Failed to add member",
        life: 3000,
      });
    }
  } catch (error) {
    console.error("Failed to add member:", error);
  }
};
</script>

<style scoped>
dialog {
  padding: 1rem;
  border: none;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  position: fixed;
  z-index: 1;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
