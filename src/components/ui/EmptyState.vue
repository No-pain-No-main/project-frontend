<template>
  <div class="ui-empty">
    <span class="ui-empty__icon">
      <font-awesome-icon :icon="icon" />
    </span>
    <h3>{{ title }}</h3>
    <p v-if="description" class="muted-text">{{ description }}</p>
    <div v-if="$slots.action" class="ui-empty__action">
      <slot name="action" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  icon: { type: Array, default: () => ['fas', 'inbox'] },
  title: { type: String, default: 'Nada por aquí todavía' },
  description: { type: String, default: '' },
})
</script>
