<template>
  <div class="flex justify-center items-center">
    <dialog ref="passwordDialog" modal class="">
      <form @submit.prevent="handleChangePassword">
        <h1 class="text-lg font-bold mb-5">Change Password</h1>
        <input-password-component
          v-model="currentPassword"
          input-class=""
          :error-message="errors.currentPassword"
          label="Current Password"
          :is-required="true"
          class="input-text"
        />
        <input-password-component
          v-model="newPassword"
          input-class=""
          :error-message="errors.newPassword"
          label="New Password"
          :is-required="true"
          class="input-text"
        />
        <input-password-component
          v-model="confirmPassword"
          input-class=""
          error-message=""
          :is-required="true"
          label="Confirm Password"
          class="input-text"
        />
        <div class="actions">
          <Button class="mr-2" severity="secondary" type="button" @click="closeDialog"
            >Cancel</Button
          >
          <Button severity="info" type="submit">Confirm</Button>
        </div>
      </form>
    </dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, defineExpose } from "vue";
import { getApiRoutes } from "@/utils/api";
import { useAuthStore } from "@/stores/auth";

const passwordDialog = ref<HTMLDialogElement | null>(null);
const api = getApiRoutes();
const authStore = useAuthStore();
const toast = useToast();
const currentPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");
const errors = ref<Record<string, string>>({
  currentPassword: "",
  newPassword: "",
});

function open() {
  currentPassword.value = "";
  newPassword.value = "";
  confirmPassword.value = "";
  errors.value = {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  };
  passwordDialog.value?.showModal();
}

function closeDialog() {
  passwordDialog.value?.close();
}

async function handleChangePassword() {
  if (newPassword.value !== confirmPassword.value) {
    toast.add({
      severity: "warn",
      summary: "Message",
      detail: "The new password and confirm password don't same!",
      life: 3000,
    });
    return;
  }
  const userId = authStore.userInfo?.id as string;
  const response = await useRequest(api.profile.changePassword(userId), {
    method: "POST",
    body: { currentPassword: currentPassword.value, newPassword: newPassword.value },
    auth: false,
  });

  if (response.statusCode == 200) {
    toast.add({
      severity: "success",
      summary: "Message",
      detail: "Change password successful!",
      life: 3000,
    });
    closeDialog();
  } else if (response.statusCode == 400) {
    toast.add({
      severity: "success",
      summary: "Message",
      detail: response.message,
      life: 3000,
    });
  } else {
    const fieldErrors: Record<string, string> = {};
    const messages = response.message;
    for (const key in messages) {
      if (
        Object.prototype.hasOwnProperty.call(messages, key) &&
        Array.isArray(messages[key]) &&
        messages[key].length > 0
      ) {
        fieldErrors[key] = messages[key][0]; // ✅ chỉ lấy lỗi đầu tiên của mỗi field
      }
    }
    errors.value = fieldErrors;
  }
}
defineExpose({ open });
</script>

<style scoped>
.flex {
  /* min-height: 100vh; */
  align-items: center;
}

dialog {
  padding: 1rem;
  border: none;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  width: 400px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.actions {
  margin-top: 1rem;
  display: flex;
  justify-content: end;
}
.input-text {
  width: 100%;
  padding-bottom: 0.5rem;
  margin-bottom: 0.5rem;
}
</style>
