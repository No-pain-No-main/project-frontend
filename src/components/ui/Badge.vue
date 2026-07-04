<template>
  <span class="ui-badge" :class="`ui-badge--${tone}`">
    <span class="ui-badge__dot" aria-hidden="true" />
    <slot />
  </span>
</template>

<script setup>

defineProps({
  tone: { type: String, default: 'neutral' },
})
</script>
