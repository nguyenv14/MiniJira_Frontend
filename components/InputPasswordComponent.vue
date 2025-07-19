<template>
  <div class="w-full">
    <FloatLabel variant="on" class="w-full">
      <Password v-model="modelValue" :inputId="label" toggleMask fluid :invalid="!!errorMessage" :feedback="false"/>
      <label :for="label">{{ label }}</label>
    </FloatLabel>

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
  label?: string
  errorMessage?: string
  unStyled?: boolean
  inputClass?: string
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const modelValue = computed({
  get: () => props.modelValue,
  set: (val: string) => emit('update:modelValue', val),
})
</script>
