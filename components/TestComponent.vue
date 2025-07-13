<script lang="ts" setup>
const count = ref(0);
const increment = () => {
  count.value++;
};
</script>

<template>
  <div>
    <Button :label="`Count: ${count}`" @click="increment" class="p-button-raised" />
  </div>
</template>