<template>
  <label class="ui-field" :class="{ 'is-error': !!error }">
    <span v-if="label" class="ui-field__label">{{ label }}</span>

    <span class="ui-field__control">
      <select
        :value="modelValue"
        :disabled="disabled"
        @change="$emit('update:modelValue', $event.target.value)"
      >
        <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
        <option v-for="opt in options" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
      </select>
      <font-awesome-icon class="ui-field__chevron" :icon="['fas', 'chevron-down']" />
    </span>

    <span v-if="error" class="ui-field__error">{{ error }}</span>
  </label>
</template>

<script setup>
defineProps({
  modelValue: { type: [String, Number], default: '' },
  label: { type: String, default: '' },
  placeholder: { type: String, default: 'Selecciona una opción' },
  options: { type: Array, default: () => [] }, 
  error: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
})

defineEmits(['update:modelValue'])
</script>
