<template>
  <div class="ui-filterbar" role="group" aria-label="Filtros">
    <button
      v-for="opt in options"
      :key="opt.value"
      type="button"
      class="ui-filterbar__chip"
      :class="{ 'is-active': opt.value === modelValue }"
      @click="$emit('update:modelValue', opt.value)"
    >
      <font-awesome-icon v-if="opt.icon" :icon="opt.icon" />
      {{ opt.label }}
    </button>
  </div>
</template>

<script setup>
defineProps({
  modelValue: { type: [String, Number], default: '' },
  options: { type: Array, default: () => [] }, 
})

defineEmits(['update:modelValue'])
</script>
