<template>
  <div class="member-management">
    <!-- Search Section -->
    <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div class="flex flex-col md:flex-row md:items-center gap-4">
        <!-- Search Input -->
        <div class="flex-grow">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search members by username, email..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            @keyup.enter="handleSearch"
          />
        </div>
        <!-- Action Buttons -->
        <div class="flex gap-2">
          <Button
            severity="info"
            icon="pi pi-search"
            label="Search"
            class="p-button-sm"
            @click="fetchAllMembers"
          />
          <Button
            severity="secondary"
            icon="pi pi-times"
            label="Clear"
            class="p-button-outlined p-button-sm"
            @click="handleClear"
          />
          <Button
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:outline-none transition flex items-center gap-2"
            @click="openDialog()"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Add Member
          </Button>
        </div>
      </div>
    </div>
    <!-- Members Table -->
    <div
      class="bg-white rounded-lg shadow-sm overflow-hidden overflow-y-scroll w-full h-115"
    >
      <DataTable
        :value="members"
        :rows="10"
        scrollable
        responsive-layout="scroll"
        class="p-datatable-sm"
      >
        <Column field="user.username" header="Username" sortable>
          <template #body="{ data }">
            <span class="text-sm font-medium text-gray-900">{{
              data.user?.username
            }}</span>
          </template>
        </Column>

        <Column field="user.email" header="Email" sortable>
          <template #body="{ data }">
            <span class="text-sm text-gray-900">{{ data.user?.email }}</span>
          </template>
        </Column>

        <Column
          header="Admin"
          header-class="text-center"
          body-class="text-center"
          :style="{ width: '80px' }"
        >
          <template #body="{ data }">
            <input
              type="radio"
              :name="'role-' + data.id"
              :value="1"
              :checked="data.role === 1"
              class="h-4 w-4 text-purple-600 focus:ring-purple-500"
              @change="updateMemberRole(data.id, 1)"
            />
          </template>
        </Column>

        <Column
          header="Leader"
          header-class="text-center"
          body-class="text-center"
          :style="{ width: '80px' }"
        >
          <template #body="{ data }">
            <input
              type="radio"
              :name="'role-' + data.id"
              :value="2"
              :checked="data.role === 2"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500"
              @change="updateMemberRole(data.id, 2)"
            />
          </template>
        </Column>

        <Column
          header="Member"
          header-class="text-center"
          body-class="text-center"
          :style="{ width: '80px' }"
        >
          <template #body="{ data }">
            <input
              type="radio"
              :name="'role-' + data.id"
              :value="3"
              :checked="data.role === 3"
              class="h-4 w-4 text-green-600 focus:ring-green-500"
              @change="updateMemberRole(data.id, 3)"
            />
          </template>
        </Column>

        <Column header="Actions" header-class="text-left" :style="{ width: '100px' }">
          <template #body="{ data }">
            <Button
              v-tooltip="'Remove member'"
              icon="pi pi-trash"
              class="p-button-rounded p-button-danger p-button-text"
              @click="openRemoveDialog(data.id)"
            />
          </template>
        </Column>
        <template #empty>
          <div class="text-center py-4 text-gray-500">No members found</div>
        </template>
      </DataTable>
    </div>
    <AddUser
      ref="addUserDialogRef"
      v-model:visible="displayCreateDialog"
      :project-id="props.projectId"
      @member-created="updateMembersSearch"
    />

    <!-- Confirm Remove Dialog -->
    <Dialog
      v-model:visible="showRemoveDialog"
      modal
      header="Confirm Remove Member"
      :style="{ width: '450px' }"
      :draggable="false"
      :resizable="false"
    >
      <div class="flex items-center gap-4 mb-6">
        <div class="bg-red-100 p-3 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <div>
          <p class="font-medium text-gray-900">
            Are you sure you want to remove this member?
          </p>
          <p class="text-sm text-gray-500 mt-1">This action cannot be undone.</p>
        </div>
      </div>

      <div class="flex justify-end gap-2">
        <Button
          type="button"
          label="Cancel"
          severity="secondary"
          @click="showRemoveDialog = false"
        />
        <Button
          type="button"
          label="Remove"
          severity="danger"
          :loading="isRemoving"
          @click="confirmRemoveMember"
        />
      </div>
    </Dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import Button from "primevue/button";
import AddUser from "./AddUser.vue";
const api = getApiRoutes();
const addUserDialogRef = ref();
const displayCreateDialog = ref(false);
function openDialog() {
  addUserDialogRef.value?.open();
}

// State
const toast = useToast();
const searchQuery = ref("");
const props = defineProps({
  projectId: {
    type: String,
    required: true,
  },
});
const members = ref<
  Array<{
    id: string;
    project_id: string;
    user_id: string;
    role: number;
    joined_at: string;
    createdAt: string;
    updatedAt: string;
    user: {
      _id: string;
      username: string;
      email: string;
      role: number;
      isActive: boolean;
      isAdmin: boolean;
    };
  }>
>([]);
const showRemoveDialog = ref(false);
const memberToRemove = ref<string | null>(null);
const isRemoving = ref(false);

// Methods
const openRemoveDialog = (id: string) => {
  memberToRemove.value = id;
  showRemoveDialog.value = true;
};

const confirmRemoveMember = async () => {
  if (!memberToRemove.value) return;

  isRemoving.value = true;
  try {
    const response = await useRequest(api.project.removeMember, {
      method: "POST",
      body: { projectId: props.projectId, userId: memberToRemove.value },
    });

    if (response.statusCode === 200) {
      // Refresh member list
      fetchAllMembers();
      showRemoveDialog.value = false;
      memberToRemove.value = null;
    }
  } catch (error) {
    console.error("Failed to remove member:", error);
  } finally {
    isRemoving.value = false;
  }
};

const fetchAllMembers = async () => {
  try {
    // Simulate API call to fetch members
    const response = await useRequest(api.project.findByMember, {
      method: "POST",
      body: { project_id: props.projectId, key: searchQuery.value },
    });
    if (response && response.data) {
      members.value = response.data;
    }
  } catch (error) {
    console.error("Failed to fetch members:", error);
  }
};
onMounted(() => {
  fetchAllMembers();
});
// Methods
const handleSearch = () => {
  fetchAllMembers();
};
const handleClear = () => {
  searchQuery.value = "";
  fetchAllMembers();
};

const updateMembersSearch = () => {
  searchQuery.value = "";
  fetchAllMembers();
};

const updateMemberRole = async (id: string, newRole: number) => {
  const member = members.value.find((m) => m.id === id);
  if (!member) return;
  const oldRole = member.role;
  member.role = newRole;
  try {
    const response = await useRequest(api.project.updateMemberRole, {
      method: "POST",
      body: {
        projectId: props.projectId,
        userId: id,
        role: newRole,
      },
    });

    if (!response?.statusCode || response.statusCode != 200) {
      member.role = oldRole;
      toast.add({
        severity: "error",
        summary: "Error",
        detail: "Failed to update member role: " + (response?.message || "Unknown error"),
        life: 3000,
      });
    } else {
      toast.add({
        severity: "success",
        summary: "Success!",
        detail: response.message || "Member role updated successfully",
        life: 3000,
      });
      fetchAllMembers();
    }
  } catch (error) {
    console.error("Failed to update member role:", error);
    member.role = oldRole;
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Failed to update member role",
      life: 3000,
    });
  }
};
</script>

<style scoped>
/* Custom scrollbar for table */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}
.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
}
.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #c5c5c5;
  border-radius: 3px;
}
.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a0a0a0;
}
</style>
