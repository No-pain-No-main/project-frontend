<template>
  <span class="col-filter" @click="$emit('toggle')">
    {{ label }}
    <font-awesome-icon :icon="['fas', 'filter']" class="col-filter__icon" />
  </span>
</template>

<script setup>
defineProps({
  label: { type: String, required: true },
})

defineEmits(['toggle'])
</script>

<style scoped>
.col-filter {
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  user-select: none;
  white-space: nowrap;
}

.col-filter:hover {
  color: var(--blue);
}

.col-filter__icon {
  font-size: 0.7rem;
  opacity: 0.5;
}

.col-filter:hover .col-filter__icon {
  opacity: 1;
}
</style>