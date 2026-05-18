<template>
  <div class="select-group">
    <label :for="id">{{ label }}</label>

    <select
      :id="id"
      :value="modelValue"
      :required="required"
      @change="$emit('update:modelValue', $event.target.value)"
    >
      <option value="" disabled>{{ placeholder }}</option>

      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
  </div>
</template>

<script setup>
defineProps({
  id: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Seleccione una opción'
  },
  options: {
    type: Array,
    required: true
  },
  required: {
    type: Boolean,
    default: false
  }
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
.select-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

label {
  font-size: 14px;
  font-weight: 700;
  color: #1f2937;
}

select {
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 14px;
  font-size: 15px;
  background-color: white;
}

select:focus {
  outline: none;
  border-color: #142033;
  box-shadow: 0 0 0 2px rgba(20, 32, 51, 0.12);
}
</style>
