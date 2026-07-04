<template>
  <RouterLink v-if="to" :to="to" class="ui-btn" :class="classes">
    <font-awesome-icon v-if="icon && iconPosition === 'left'" :icon="icon" />
    <span v-if="$slots.default"><slot /></span>
    <font-awesome-icon v-if="icon && iconPosition === 'right'" :icon="icon" />
  </RouterLink>

  <button v-else class="ui-btn" :class="classes" :type="type" :disabled="disabled || loading">
    <span v-if="loading" class="ui-btn__spinner" aria-hidden="true" />
    <font-awesome-icon v-else-if="icon && iconPosition === 'left'" :icon="icon" />
    <span v-if="$slots.default"><slot /></span>
    <font-awesome-icon v-if="!loading && icon && iconPosition === 'right'" :icon="icon" />
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: { type: String, default: 'primary' }, 
  size: { type: String, default: 'md' }, 
  icon: { type: Array, default: null },
  iconPosition: { type: String, default: 'left' },
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  block: { type: Boolean, default: false },
  type: { type: String, default: 'button' },
  to: { type: [String, Object], default: null },
})

const classes = computed(() => [
  `ui-btn--${props.variant}`,
  `ui-btn--${props.size}`,
  { 'ui-btn--block': props.block, 'is-loading': props.loading },
])
</script>
