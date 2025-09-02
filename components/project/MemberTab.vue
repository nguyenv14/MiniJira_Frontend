<template>
  <div class="member-management">
    <!-- Search Section -->
    <div class="bg-white rounded-xl shadow-sm p-6 mb-6">
      <div class="flex flex-col md:flex-row md:items-center gap-4">
        <!-- Search Input -->
        <div class="flex-grow relative">
          <div
            class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search members by username, email..."
            class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition shadow-sm"
            @keyup.enter="handleSearch"
          />
        </div>
        <!-- Action Buttons -->
        <div class="flex gap-3">
          <Button
            severity="info"
            class="p-button-sm flex items-center gap-2 px-4 py-2.5"
            @click="handleSearch"
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
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            Search
          </Button>
          <Button
            severity="secondary"
            class="p-button-outlined p-button-sm flex items-center gap-2 px-4 py-2.5"
            @click="handleClear"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            Clear
          </Button>
          <Button
            class="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 focus:outline-none transition flex items-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0"
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
    <div class="bg-white rounded-xl shadow-sm overflow-hidden">
      <DataTable
        :value="members"
        :rows="10"
        scrollable
        responsive-layout="scroll"
        class="p-datatable-sm"
        :paginator="members.length > 10"
      >
        <Column field="user.username" header="Username" sortable>
          <template #header>
            <div class="flex items-center gap-2">
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
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Username
            </div>
          </template>
          <template #body="{ data }">
            <div class="flex items-center gap-3 py-1">
              <div
                class="bg-gray-200 border-2 border-dashed rounded-xl w-8 h-8 flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <span class="text-sm font-medium text-gray-900">
                {{ data.user?.username }}
              </span>
            </div>
          </template>
        </Column>

        <Column field="user.email" header="Email" sortable>
          <template #header>
            <div class="flex items-center gap-2">
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
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Email
            </div>
          </template>
          <template #body="{ data }">
            <span class="text-sm text-gray-900">{{ data.user?.email }}</span>
          </template>
        </Column>

        <Column header="Role" header-class="text-center" body-class="text-center">
          <template #header>
            <div class="flex items-center justify-center gap-2">
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
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              Role
            </div>
          </template>
          <template #body="{ data }">
            <div class="flex justify-center gap-6 py-2">
              <div class="flex items-center">
                <input
                  :id="`admin-${data.id}`"
                  type="radio"
                  :name="'role-' + data.id"
                  :value="1"
                  :checked="data.role === 1"
                  class="h-4 w-4 text-purple-600 focus:ring-purple-500"
                  @change="updateMemberRole(data.id, 1)"
                />
                <label
                  :for="`admin-${data.id}`"
                  class="ml-2 flex items-center gap-1 text-sm font-medium text-gray-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4 text-purple-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                  Admin
                </label>
              </div>
              <div class="flex items-center">
                <input
                  :id="`leader-${data.id}`"
                  type="radio"
                  :name="'role-' + data.id"
                  :value="2"
                  :checked="data.role === 2"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  @change="updateMemberRole(data.id, 2)"
                />
                <label
                  :for="`leader-${data.id}`"
                  class="ml-2 flex items-center gap-1 text-sm font-medium text-gray-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4 text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Leader
                </label>
              </div>
              <div class="flex items-center">
                <input
                  :id="`member-${data.id}`"
                  type="radio"
                  :name="'role-' + data.id"
                  :value="3"
                  :checked="data.role === 3"
                  class="h-4 w-4 text-green-600 focus:ring-green-500"
                  @change="updateMemberRole(data.id, 3)"
                />
                <label
                  :for="`member-${data.id}`"
                  class="ml-2 flex items-center gap-1 text-sm font-medium text-gray-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  Member
                </label>
              </div>
            </div>
          </template>
        </Column>

        <Column header="Actions" header-class="text-center" body-class="text-center">
          <template #header>
            <div class="flex items-center justify-center gap-2">
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
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Actions
            </div>
          </template>
          <template #body="{ data }">
            <div class="flex justify-center py-1">
              <Button
                v-tooltip="'Remove member'"
                icon="pi pi-trash"
                class="p-button-rounded p-button-danger p-button-text"
                @click="openRemoveDialog(data.id)"
              />
            </div>
          </template>
        </Column>

        <template #empty>
          <div class="text-center py-12 text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-16 w-16 mx-auto text-gray-300 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <p class="font-medium text-lg">No members found</p>
            <p class="text-sm mt-1">Try adjusting your search criteria</p>
          </div>
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
      <div class="flex items-start gap-4 mb-6">
        <div class="bg-red-100 p-3 rounded-full flex-shrink-0">
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
          <p class="font-medium text-gray-900 text-lg">Remove Member</p>
          <p class="text-gray-600 mt-2">
            Are you sure you want to remove this member from the project? This action
            cannot be undone.
          </p>
        </div>
      </div>

      <div class="flex justify-end gap-3">
        <Button
          type="button"
          label="Cancel"
          severity="secondary"
          class="px-4 py-2"
          @click="showRemoveDialog = false"
        />
        <Button
          type="button"
          label="Remove"
          severity="danger"
          :loading="isRemoving"
          class="px-4 py-2"
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
import { useToast } from "primevue/usetoast";

const api = getApiRoutes();
const addUserDialogRef = ref();
const displayCreateDialog = ref(false);
const toast = useToast();

function openDialog() {
  addUserDialogRef.value?.open();
}

// State
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
      toast.add({
        severity: "success",
        summary: "Success",
        detail: "Member removed successfully",
        life: 3000,
      });
    }
  } catch (error) {
    console.error("Failed to remove member:", error);
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Failed to remove member",
      life: 3000,
    });
  } finally {
    isRemoving.value = false;
  }
};

const fetchAllMembers = async () => {
  try {
    const response = await useRequest(api.project.findByMember, {
      method: "POST",
      body: { project_id: props.projectId, key: searchQuery.value },
    });
    if (response && response.data) {
      members.value = response.data;
    }
  } catch (error) {
    console.error("Failed to fetch members:", error);
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Failed to load members",
      life: 3000,
    });
  }
};

// Lifecycle
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
.p-datatable-wrapper::-webkit-scrollbar {
  height: 6px;
}
.p-datatable-wrapper::-webkit-scrollbar-track {
  background: #f1f1f1;
}
.p-datatable-wrapper::-webkit-scrollbar-thumb {
  background: #c5c5c5;
  border-radius: 3px;
}
.p-datatable-wrapper::-webkit-scrollbar-thumb:hover {
  background: #a0a0a0;
}

/* Table header styling */
:deep(.p-datatable-thead th) {
  background-color: #f9fafb;
  font-weight: 600;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
}

/* Table row hover effect */
:deep(.p-datatable-tbody tr:hover) {
  background-color: #f9fafb;
}

/* Input radio styling */
input[type="radio"] {
  accent-color: #4f46e5;
}
</style>
