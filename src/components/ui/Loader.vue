<template>
  <div class="ui-loader" :class="`ui-loader--${size}`" role="status" aria-live="polite">
    <span class="ui-loader__spinner" aria-hidden="true" />
    <span v-if="label" class="ui-loader__label">{{ label }}</span>
  </div>
</template>

<script setup>
defineProps({
  size: { type: String, default: 'md' }, 
  label: { type: String, default: '' },
})
</script>
