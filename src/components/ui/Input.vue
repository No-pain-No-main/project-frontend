<template>
  <label class="ui-field" :class="{ 'is-error': !!error }">
    <span v-if="label" class="ui-field__label">{{ label }}</span>

    <span class="ui-field__control">
      <font-awesome-icon v-if="icon" class="ui-field__icon" :icon="icon" />

      <input
        :type="isPassword ? (showPassword ? 'text' : 'password') : type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :autocomplete="autocomplete"
        @input="$emit('update:modelValue', $event.target.value)"
        @blur="$emit('blur', $event)"
      />

      <button
        v-if="isPassword"
        type="button"
        class="ui-field__toggle"
        :aria-label="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
        @click="showPassword = !showPassword"
      >
        <font-awesome-icon :icon="['fas', showPassword ? 'eye-slash' : 'eye']" />
      </button>
    </span>

    <span v-if="error" class="ui-field__error">{{ error }}</span>
    <span v-else-if="hint" class="ui-field__hint">{{ hint }}</span>
  </label>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  label: { type: String, default: '' },
  type: { type: String, default: 'text' },
  placeholder: { type: String, default: '' },
  icon: { type: Array, default: null },
  error: { type: String, default: '' },
  hint: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  autocomplete: { type: String, default: 'off' },
})

defineEmits(['update:modelValue', 'blur'])

const showPassword = ref(false)
const isPassword = computed(() => props.type === 'password')
</script>
