<script lang="ts" setup>
const count = ref(0);
const increment = () => {
  count.value++;
};
</script>

<template>
  <div>
    <Button class="p-button-raised" :label="`Count: ${count}`" @click="increment" />
  </div>
</template>
