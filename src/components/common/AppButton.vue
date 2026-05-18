<template>
  <button
    class="app-button"
    :class="variant"
    :type="type"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    default: 'button'
  },
  variant: {
    type: String,
    default: 'primary'
  },
  disabled: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.app-button {
  width: 100%;
  border: none;
  border-radius: 8px;
  padding: 14px 18px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s ease;
}

.app-button.primary {
  background-color: #142033;
  color: white;
}

.app-button.primary:hover:not(:disabled) {
  background-color: #1f2f46;
  transform: translateY(-1px);
}

.app-button.secondary {
  background-color: #e5e7eb;
  color: #142033;
}

.app-button.danger {
  background-color: #fee2e2;
  color: #b91c1c;
}

.app-button:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}
</style>
