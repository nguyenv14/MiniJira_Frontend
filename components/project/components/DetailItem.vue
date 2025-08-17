<template>
  <div class="flex flex-col">
    <label class="font-semibold text-gray-700">{{ label }}</label>
    <p class="mt-1 text-sm text-gray-900">{{ value }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
  value: string | number | null | undefined;
}>();
</script>
