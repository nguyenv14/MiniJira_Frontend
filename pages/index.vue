<template>
  <layouts-default v-if="authStore.isAuthenticated" />
</template>
<script setup lang="ts">
import { useAuthStore } from "../stores/auth";
const router = useRouter();
const authStore = useAuthStore();

onBeforeMount(() => {
  // Check if the user is authenticated
  authStore.loadFromStorage();
  if (authStore.isAuthenticated) {
    return navigateTo("/dashboard");
  } else {
    router.replace("/login");
  }
});
</script>
