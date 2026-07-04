<template>
  <RouterLink class="sidebar-link" :to="to" @click="$emit('navigate')">
    <span class="sidebar-link__icon" aria-hidden="true">
      <font-awesome-icon :icon="icon" />
    </span>
    <span class="sidebar-link__label">{{ label }}</span>
  </RouterLink>
</template>

<script setup>
defineProps({
  to: {
    type: String,
    required: true,
  },
  icon: {
    type: Array,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
})

defineEmits(['navigate'])
</script>
