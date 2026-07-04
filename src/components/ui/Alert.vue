<template>
  <div class="ui-alert" :class="`ui-alert--${tone}`" role="alert">
    <font-awesome-icon :icon="['fas', icons[tone]]" />
    <div class="ui-alert__body">
      <strong v-if="title">{{ title }}</strong>
      <p v-if="$slots.default"><slot /></p>
    </div>
    <button v-if="dismissible" type="button" class="ui-alert__close" aria-label="Cerrar" @click="$emit('close')">
      <font-awesome-icon :icon="['fas', 'xmark']" />
    </button>
  </div>
</template>

<script setup>
defineProps({
  tone: { type: String, default: 'info' }, 
  title: { type: String, default: '' },
  dismissible: { type: Boolean, default: false },
})

defineEmits(['close'])

const icons = {
  success: 'circle-check',
  warning: 'triangle-exclamation',
  danger: 'circle-exclamation',
  info: 'circle-info',
}
</script>
