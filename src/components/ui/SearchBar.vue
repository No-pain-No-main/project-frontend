<template>
  <label class="ui-search">
    <font-awesome-icon :icon="['fas', 'magnifying-glass']" />
    <input
      type="search"
      :value="modelValue"
      :placeholder="placeholder"
      @input="onInput($event.target.value)"
    />
  </label>
</template>

<script setup>
let timer = null

const props = defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: 'Buscar...' },
  debounce: { type: Number, default: 250 },
})

const emit = defineEmits(['update:modelValue'])

function onInput(value) {
  clearTimeout(timer)
  timer = setTimeout(() => emit('update:modelValue', value), props.debounce)
}
</script>
