<template>
  <div class="container mx-auto">
    <LoadingComponent :is-loading="isLoading" />
    <!-- Search Section -->
    <div class="bg-white p-4 rounded-lg mb-5">
      <div class="flex flex-wrap gap-4 items-end">
        <!-- Search -->
        <div class="flex flex-col flex-grow min-w-[250px] max-w-[320px]">
          <label class="text-sm font-medium mb-1">Search</label>
          <InputText
            v-model="filters.search"
            placeholder="Enter keyword"
            class="p-inputtext-sm w-full h-9"
          />
        </div>

        <!-- Role -->
        <div class="flex flex-col flex-grow min-w-[200px] max-w-[220px]">
          <label class="text-sm font-medium mb-1">Role</label>
          <Dropdown
            v-model="filters.role"
            :options="roles"
            option-label="name"
            option-value="value"
            placeholder="Select role"
            class="w-full"
            :show-clear="true"
          />
        </div>

        <!-- Position -->
        <div class="flex flex-col flex-grow min-w-[200px] max-w-[220px]">
          <label class="text-sm font-medium mb-1">Position</label>
          <Dropdown
            v-model="filters.position"
            :options="positions"
            option-label="name"
            option-value="value"
            placeholder="Select position"
            class="w-full"
            :show-clear="true"
          />
        </div>

        <!-- Department -->
        <div class="flex flex-col flex-grow min-w-[200px] max-w-[220px]">
          <label class="text-sm font-medium mb-1">Department</label>
          <Dropdown
            v-model="filters.department"
            :options="departments"
            option-label="name"
            option-value="value"
            placeholder="Select department"
            class="w-full"
            :show-clear="true"
          />
        </div>

        <!-- Status -->
        <div class="flex flex-col flex-grow min-w-[200px] max-w-[220px]">
          <label class="text-sm font-medium mb-1">Status</label>
          <Dropdown
            v-model="filters.active"
            :options="statusOptions"
            option-label="name"
            option-value="value"
            placeholder="Select status"
            class="w-full"
            :show-clear="true"
          />
        </div>

        <div class="flex flex-col flex-grow min-w-[200px] max-w-[220px]">
          <Button
            severity="info"
            icon="pi pi-search"
            label="Search"
            class="p-button-sm"
            @click="fetchDataSearch"
          />
        </div>
        <!-- Buttons -->
        <div class="flex flex-col flex-grow min-w-[100px] max-w-[120px]">
          <Button
            severity="secondary"
            icon="pi pi-times"
            label="Clear"
            class="p-button-outlined p-button-sm"
            @click="onClearFilter"
          />
        </div>
      </div>
    </div>

    <!-- Data Table -->
    <div class="flex flex-col bg-white rounded-lg shadow-md overflow-hidden w-full h-105">
      <!-- DataTable with internal scroll -->
      <div class="flex-grow overflow-hidden">
        <DataTable
          :value="users"
          :rows="rowsPerPage"
          class="p-datatable-sm w-full h-full"
          responsive-layout="scroll"
          :row-hover="true"
          scrollable
          scroll-height="flex"
          :scroll-direction="'both'"
          :virtual-scroller-options="{ itemSize: 50 }"
        >
          <!-- ID Column -->
          <Column header="ID" :style="{ 'min-width': '80px', 'max-width': '100px' }">
            <template #body="slotProps">
              <div class="text-center">
                {{ (currentPage - 1) * rowsPerPage + slotProps.index + 1 }}
              </div>
            </template>
          </Column>

          <Column
            field="username"
            sortable
            :style="{ 'min-width': '150px', 'max-width': '250px' }"
          >
            <template #header>
              <span class="font-semibold text-gray-700">Name</span>
            </template>
            <template #body="{ data }">
              <span class="text-gray-600">{{ data.username }}</span>
            </template>
          </Column>

          <!-- Name Column -->
          <Column
            field="name"
            sortable
            :style="{ 'min-width': '150px', 'max-width': '250px' }"
          >
            <template #header>
              <span class="font-semibold text-gray-700">Email</span>
            </template>
            <template #body="{ data }">
              <span class="text-gray-800 font-medium truncate block">{{
                data.email
              }}</span>
            </template>
          </Column>

          <Column
            field="role"
            sortable
            :style="{ 'min-width': '120px', 'max-width': '150px' }"
          >
            <template #header>
              <span class="font-semibold text-gray-700">Role</span>
            </template>
            <template #body="{ data }">
              <span class="text-gray-800 font-medium truncate block">{{
                getRoleDescription(data.role)
              }}</span>
            </template>
          </Column>

          <Column
            field="department"
            sortable
            :style="{ 'min-width': '120px', 'max-width': '170px' }"
          >
            <template #header>
              <span class="font-semibold text-gray-700">Department</span>
            </template>
            <template #body="{ data }">
              <span class="text-gray-800 font-medium truncate block">{{
                getDepartmentDescription(data.department)
              }}</span>
            </template>
          </Column>

          <Column
            field="position"
            sortable
            :style="{ 'min-width': '120px', 'max-width': '170px' }"
          >
            <template #header>
              <span class="font-semibold text-gray-700">Position</span>
            </template>
            <template #body="{ data }">
              <span class="text-gray-800 font-medium truncate block">{{
                getPositionDescription(data.position)
              }}</span>
            </template>
          </Column>

          <Column
            field="active"
            sortable
            :style="{ 'min-width': '120px', 'max-width': '150px' }"
          >
            <template #header>
              <span class="font-semibold text-gray-700">Active</span>
            </template>
            <template #body="{ data }">
              <div class="flex justify-center items-center">
                <Tag
                  :value="data.isActive ? 'Active' : 'Inactive'"
                  :severity="data.isActive ? 'success' : 'danger'"
                  class="text-sm rounded-full px-3 py-1"
                />
              </div>
            </template>
          </Column>

          <!-- Fixed Actions Column -->
          <Column
            :frozen="true"
            align-frozen="right"
            :style="{ 'min-width': '120px', right: '0', 'background-color': 'white' }"
          >
            <template #header>
              <span class="font-semibold text-gray-700">Actions</span>
            </template>
            <template #body="{ data }">
              <div class="flex gap-2 justify-center">
                <Button
                  icon="pi pi-pencil"
                  class="p-button-rounded p-button-warning p-button-text"
                  title="Update"
                  @click="updateUser(data)"
                />
                <Button
                  icon="pi pi-trash"
                  class="p-button-rounded p-button-danger p-button-text"
                  title="Delete"
                  @click="deleteUser(data)"
                />
              </div>
            </template>
          </Column>
        </DataTable>
      </div>

      <!-- External Pagination -->
      <div
        class="flex items-center justify-between p-4 border-t border-gray-200 bg-white"
      >
        <div class="flex items-center space-x-2">
          <span class="text-sm text-gray-600">Rows per page:</span>
          <Dropdown v-model="rowsPerPage" :options="[5, 10, 20, 50]" class="w-20" />
        </div>

        <div class="flex items-center space-x-4">
          <span class="text-sm text-gray-600">
            {{ firstItemIndex }} - {{ lastItemIndex }} of {{ totalRecords }}
          </span>
          <Button
            icon="pi pi-angle-left"
            class="p-button-text p-button-rounded"
            :disabled="currentPage === 1"
            @click="currentPage--"
          />
          <Button
            icon="pi pi-angle-right"
            class="p-button-text p-button-rounded"
            :disabled="lastItemIndex >= totalRecords"
            @click="currentPage++"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from "vue";
import InputText from "primevue/inputtext";
import Dropdown from "primevue/dropdown";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import { Departments, getDepartmentDescription } from "@/constants/department";
import { getPositionDescription, Positions } from "@/constants/positions";
import { getRoleDescription, Roles } from "@/constants/Role";
import { getApiRoutes } from "@/utils/api";

const api = getApiRoutes();
const users = ref([]);
const toast = useToast();
const totalRecords = ref(0);
const currentPage = ref(1);
const rowsPerPage = ref(10);
const isLoading = ref(true);

// Computed properties
const firstItemIndex = computed(() => {
  return (currentPage.value - 1) * rowsPerPage.value + 1;
});

const lastItemIndex = computed(() => {
  return Math.min(currentPage.value * rowsPerPage.value, totalRecords.value);
});

// Filters
const filters = ref({
  search: "",
  role: null,
  position: null,
  department: null,
  active: null,
});

const fetchDataSearch = async () => {
  isLoading.value = true;
  try {
    const response = await useRequest(api.user.search, {
      method: "POST",
      body: {
        key: filters.value.search,
        role: filters.value.role,
        position: filters.value.position,
        department: filters.value.department,
        active: filters.value.active,
        page: currentPage.value,
        limit: rowsPerPage.value,
      },
    });
    if (response && response.data) {
      users.value = response.data;
      currentPage.value = response.page;

      totalRecords.value = response.total || 0;
    }
  } catch (error) {
    console.error("Failed to fetch users:", error);
    users.value = [];
    totalRecords.value = 0;
  } finally {
    isLoading.value = false;
  }
};

// Dropdown options
const roles = ref(
  Object.values(Roles)
    .filter((value) => typeof value === "number")
    .map((value) => ({
      name: getRoleDescription(value),
      value,
    }))
);

const departments = ref(
  Object.values(Departments)
    .filter((value) => typeof value === "number")
    .map((value) => ({
      name: getDepartmentDescription(value),
      value,
    }))
);

const positions = ref(
  Object.values(Positions)
    .filter((value) => typeof value === "number")
    .map((value) => ({
      name: getPositionDescription(value),
      value,
    }))
);

const statusOptions = ref([
  { name: "Active", value: true },
  { name: "Inactive", value: false },
]);

// Methods
const updateUser = (user) => {
  console.log("Update user:", user);
};

const deleteUser = async (data) => {
  isLoading.value = true;
  try {
    const response = await useRequest(api.user.user(data._id), {
      method: "DELETE",
      body: {},
    });
    if (response && response.statusCode == 200) {
      isLoading.value = false;
      toast.add({
        severity: "success",
        summary: "Message",
        detail: response.message,
        life: 3000,
      });
      fetchDataSearch();
    }
  } catch (error) {
    console.error("Failed to fetch users:", error);
    users.value = [];
    totalRecords.value = 0;
  } finally {
    isLoading.value = false;
  }
};

const onClearFilter = () => {
  filters.value = {
    search: "",
    role: null,
    position: null,
    department: null,
    active: null,
  };
  currentPage.value = 1;
  fetchDataSearch();
};

// Watch for pagination changes
watch([currentPage, rowsPerPage], async () => {
  await fetchDataSearch();
});

onMounted(async () => {
  await fetchDataSearch();
});
</script>

<style scoped></style>
