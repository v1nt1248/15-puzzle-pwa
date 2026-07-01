<script setup lang="ts">
interface BaseButtonProps {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'gray'
  fullWidth?: boolean
}
withDefaults(defineProps<BaseButtonProps>(), {
  variant: 'primary',
  fullWidth: false,
})
</script>

<template>
  <button class="base-button" :class="['base-button', variant, { 'full-width': fullWidth }]">
    <slot />
  </button>
</template>

<style scoped lang="scss">
.base-button {
  padding: 12px 24px;
  font-size: 16px;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition:
    opacity 0.2s,
    background-color 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:active {
    opacity: 0.8;
  }

  &.full-width {
    width: 100%;
  }

  &.primary {
    background-color: var(--btn-primary);
  }

  &.secondary {
    background-color: var(--btn-secondary);
  }

  &.success {
    background-color: var(--btn-success);
  }

  &.warning {
    background-color: var(--btn-warning);
  }

  &.gray {
    background-color: var(--border-color);
    color: var(--color-text-dark);
  }
}
</style>
