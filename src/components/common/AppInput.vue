<template>
  <div class="input-group">
    <label :for="id">{{ label }}</label>

    <input
      :id="id"
      :type="type"
      :placeholder="placeholder"
      :value="modelValue"
      :required="required"
      @input="$emit('update:modelValue', $event.target.value)"
    />
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
  type: {
    type: String,
    default: 'text'
  },
  placeholder: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  }
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

label {
  font-size: 14px;
  font-weight: 700;
  color: #1f2937;
}

input {
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 14px;
  font-size: 15px;
  background-color: white;
}

input:focus {
  outline: none;
  border-color: #142033;
  box-shadow: 0 0 0 2px rgba(20, 32, 51, 0.12);
}
</style>
