<script setup lang="ts">
defineProps<{
  modelValue: string
  label?: string
  placeholder?: string
}>()

const emits = defineEmits(['update:modelValue'])
</script>

<template>
  <div class="input-wrapper">
    <label v-if="label" class="input-label">
      {{ label }}
    </label>

    <input
      type="text"
      :value="modelValue"
      @input="emits('update:modelValue', ($event.target as HTMLInputElement).value)"
      :placeholder="placeholder"
      class="base-input"
    />
  </div>
</template>

<style scoped lang="scss">
.input-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 15px;
}

.input-label {
  font-weight: bold;
  margin-bottom: 6px;
  color: var(--color-text-muted);
  font-size: 14px;
}

.base-input {
  padding: 11px;
  font-size: 16px;
  border: 1px solid var(--border-color);
  background-color: var(--bg-surface);
  color: var(--color-text-dark);
  border-radius: 6px;
  width: 100%;
  box-sizing: border-box;
  outline: none;
  &:focus {
    border-color: var(--btn-primary);
  }
}
</style>
