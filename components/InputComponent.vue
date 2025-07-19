<template>
  <div>
    <label :for="inputId" class="font-bold"
      >{{ label }} <span v-if="isRequired" class="pl-1 text-red-500">*</span></label
    >
    <IconField>
      <slot name="icon" />
      <InputText
        v-bind="$attrs"
        :id="inputId"
        v-model="modelValue"
        class="mt-2"
        :class="`h-[40px] w-full px-3 ${inputClass}`"
        :invalid="!!errorMessage"
        :style="errorMessage ? `border: 1px solid red` : `border: 1px solid #d1d5db;`"
        :disabled="isDisabled"
      />
      <slot name="icon-after" />
    </IconField>

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
const props = withDefaults(
  defineProps<{
    label?: string;
    errorMessage?: string;
    unStyled?: boolean;
    inputClass?: string;
    modelValue: string;
    isRequired?: boolean;
    isDisabled?: boolean;
  }>(),
  {
    label: "Field",
    errorMessage: "",
    inputClass: "",
    isRequired: false,
    isDisabled: false,
  }
);

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
const isRequired = computed(() => props.isRequired ?? false);
const isDisabled = computed(() => props.isDisabled ?? false);
</script>
