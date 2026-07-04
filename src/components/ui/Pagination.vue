<template>
  <nav class="ui-pagination" aria-label="Paginación">
    <button type="button" class="ui-pagination__nav" :disabled="modelValue <= 1" @click="go(modelValue - 1)">
      <font-awesome-icon :icon="['fas', 'chevron-left']" />
    </button>

    <button
      v-for="page in pages"
      :key="page"
      type="button"
      class="ui-pagination__page"
      :class="{ 'is-active': page === modelValue }"
      @click="go(page)"
    >
      {{ page }}
    </button>

    <button
      type="button"
      class="ui-pagination__nav"
      :disabled="modelValue >= totalPages"
      @click="go(modelValue + 1)"
    >
      <font-awesome-icon :icon="['fas', 'chevron-right']" />
    </button>
  </nav>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: Number, default: 1 },
  totalPages: { type: Number, default: 1 },
})

const emit = defineEmits(['update:modelValue'])

const pages = computed(() => Array.from({ length: props.totalPages }, (_, i) => i + 1))

function go(page) {
  if (page < 1 || page > props.totalPages) return
  emit('update:modelValue', page)
}
</script>
