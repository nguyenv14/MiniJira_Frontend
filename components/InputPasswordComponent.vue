<template>
  <div class="w-full">
    <label :for="inputId" class="font-bold">
      {{ label }}
      <span v-if="isRequired" class="pl-1 text-red-500">*</span>
    </label>
    <Password
      v-model="modelValue"
      :input-id="inputId"
      toggle-mask
      fluid
      :invalid="!!errorMessage"
      :feedback="false"
      class="mt-2"
      :class="inputClass"
    />
    <Message
      v-if="errorMessage"
      class="mt-2 text-xs"
      severity="error"
      variant="simple"
      size="small"
    >
      {{ errorMessage }}
    </Message>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  label?: string;
  errorMessage?: string;
  unStyled?: boolean;
  inputClass?: string;
  modelValue: string;
  isRequired: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const modelValue = computed({
  get: () => props.modelValue,
  set: (val: string) => emit("update:modelValue", val),
});

const inputId = computed(
  () => `input-${props.label?.toLowerCase().replace(/\s+/g, "-") || "field"}`
);
</script>
