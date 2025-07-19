<template>
  <div
    v-if="isLoading"
    class="fixed inset-0 flex items-center justify-center bg-black/50 z-[1000]"
  >
    <ProgressSpinner
      style="width: 50px; height: 50px"
      strokeWidth="8"
      fill="var(--surface-ground)"
      animationDuration=".5s"
    />
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from "vue";
import ProgressSpinner from "primevue/progressspinner";

defineProps<{
  isLoading: boolean;
}>();
</script>

<style scoped>
.fixed.inset-0 {
  backdrop-filter: blur(2px); /* Tùy chọn: Thêm hiệu ứng mờ */
}
</style>
