<template>
  <div class="flex justify-center items-center h-screen bg-sky-50">
    <Card style="width: 25rem; overflow: hidden" class="shadow-2xl">
      <template #header>
        <img alt="user header" src="../assets/images/jira.png" class="w-50 m-auto py-2" />
      </template>
      <template #content>
        <!-- <p class="m-0">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam deserunt quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate neque
              quas!
          </p> -->
        <div class="m-5">
          <InputComponent
            v-bind="$attrs"
            v-model="emailInput.modelValue"
            :label="emailInput.label"
            :input-class="emailInput.inputClass"
            :input-id="emailInput.inputId"
            :is-required="true"
            class="w-full pb-5"
          />
          <InputPasswordComponent
            v-model="passwordInput.modelValue"
            :label="passwordInput.label"
            :error-message="passwordInput.errorMessage"
            :input-class="passwordInput.inputClass"
            :input-id="passwordInput.inputId"
            :is-required="true"
            class="w-full pb-3"
          />
          <div class="w-full pb-5 flex justify-end">
            <span class="text-sky cursor-pointer">Forgot Password</span>
          </div>
          <Button class="w-full bg-sky hover:!bg-sky-400 !border-0" @click="submitLogin"
            >Login</Button
          >
        </div>
      </template>
    </Card>
  </div>
</template>

<script lang="ts" setup>
import { getApiRoutes } from "../utils/api";
import { useAuthStore } from "../stores/auth";

definePageMeta({
  layout: "empty", // 👈 dùng layout rỗng
});
const authStore = useAuthStore();
onBeforeMount(() => {
  // Check if the user is authenticated
  authStore.loadFromStorage();
  if (authStore.isAuthenticated) {
    return navigateTo("/dashboard");
  }
});

const toast = useToast();
const api = getApiRoutes();
const emailInput = reactive({
  label: "Email",
  modelValue: "",
  errorMessage: "",
  inputId: "email-input",
  inputClass: "border-gray-300",
});

const passwordInput = reactive({
  label: "Password",
  modelValue: "",
  errorMessage: "",
  inputId: "password-input",
  inputClass: "border-gray-300",
});

const submitLogin = async () => {
  // const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
  // Validate inputs
  if (!emailInput.modelValue) {
    emailInput.errorMessage = "The email is required";
  } else {
    emailInput.errorMessage = "";
  }

  if (!passwordInput.modelValue) {
    passwordInput.errorMessage = "The password is required";
  } else {
    passwordInput.errorMessage = "";
  }

  // const isValid = regex.test(passwordInput.modelValue);
  // if (!isValid) {
  //   passwordInput.errorMessage =
  //     "The password must contain at least one uppercase letter, one lowercase letter, and one number";
  // } else {
  //   passwordInput.errorMessage = "";
  // }

  // If both fields are valid, proceed with login logic
  if (emailInput.modelValue && passwordInput.modelValue) {
    try {
      // Simulate login logic
      const response = await useRequest(api.auth.login, {
        method: "POST",
        body: { email: emailInput.modelValue, password: passwordInput.modelValue },
        auth: false,
      });
      // const loginResponse = response.data;
      if (response.statusCode == 200) {
        toast.add({
          severity: "success",
          summary: "Message",
          detail: "Login successful",
          life: 3000,
        });
        authStore.login(response.data.access_token, response.data.user);
        return navigateTo("/dashboard");
      } else {
        toast.add({
          severity: "error",
          summary: "Login Failed",
          detail: response.message,
          life: 3000,
        });
        return;
      }
    } catch (error) {
      console.log(error);
      toast.add({
        severity: "error",
        summary: "Login Failed",
        detail: error.message,
        life: 3000,
      });
    }
  }
};
</script>
