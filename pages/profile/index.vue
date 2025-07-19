<template>
  <div>
    <LoadingComponent :is-loading="isLoading" />
    <div>
      <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-2">
        <input-component
          v-model="emailInput.modelValue"
          label="Your Email"
          error-message=""
          :is-disabled="true"
          :is-required="true"
        />
        <input-component
          v-model="userNameInput.modelValue"
          label="Your Name"
          error-message=""
          input-class=""
          :is-required="true"
        />
      </div>

      <div class="flex flex-wrap gap-4 mt-3">
        <div v-for="role in roles" :key="role" class="flex items-center gap-2">
          <RadioButton
            v-model="selectedRole"
            :input-id="`role-${role}`"
            name="role"
            :value="role"
            :disabled="true"
          />
          <label :for="`role-${role}`">{{ getRoleDescription(role) }}</label>
        </div>
      </div>

      <div class="mt-3">
        <Button severity="info" label="Save" @click="updateProfile" />
        <Button class="ml-3" variant="outlined" severity="info" label="Change Password" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import Button from "primevue/button";
import { Roles, getRoleDescription } from "@/constants/Role";
import { useRequest } from "@/utils/base-request";
import { getApiRoutes } from "@/utils/api";
import LoadingComponent from "@/components/LoadingComponent.vue";

const authStore = useAuthStore();
const apiRoute = getApiRoutes();
const toast = useToast();

const isLoading = ref(true);

// Role logic
const roles = [Roles.ADMIN, Roles.LEADER, Roles.MEMBER];
const roleMap: Record<number, Roles> = {
  1: Roles.ADMIN,
  2: Roles.LEADER,
  3: Roles.MEMBER,
};

const selectedRole = ref<Roles | null>(null);

// Inputs
const emailInput = reactive({
  label: "Email",
  modelValue: "",
  errorMessage: "",
  inputId: "email-input",
  inputClass: "border-gray-300",
});

const userNameInput = reactive({
  label: "Username",
  modelValue: "",
  errorMessage: "",
  inputId: "username-input",
  inputClass: "border-gray-300",
});

const fetchUserProfile = async () => {
  isLoading.value = true;
  try {
    await authStore.fetchAndSaveProfile(); // API call
    const user = authStore.userInfo;
    emailInput.modelValue = user?.email ?? "";
    userNameInput.modelValue = user?.username ?? "";
    selectedRole.value = user?.role != null ? roleMap[user.role] : null;
  } catch (error) {
    console.error("Failed to load user profile", error);
  } finally {
    isLoading.value = false;
  }
};

const updateProfile = async () => {
  isLoading.value = true;
  try {
    const userId = authStore.userInfo?.id as string; // Assuming userInfo has an id field
    if (!userId) {
      toast.add({
        severity: "error",
        summary: "Message",
        detail: "User id not found!",
        life: 3000,
      });
    }

    const response = await useRequest(apiRoute.profile.getProfile(userId), {
      method: "POST",
      body: { userName: userNameInput.modelValue },
      auth: false,
    });

    if (response.statusCode == 200) {
      authStore.fetchAndSaveProfile();
      toast.add({
        severity: "success",
        summary: "Message",
        detail: "Update Successful!",
        life: 3000,
      });
    } else {
      toast.add({
        severity: "error",
        summary: "Message",
        detail: "Error in backend!",
        life: 3000,
      });
    }
  } catch (error) {
    console.error("Failed to update profile", error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchUserProfile();
});
</script>
