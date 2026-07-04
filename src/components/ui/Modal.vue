<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="modelValue" class="ui-modal-overlay" @click.self="close">
        <div class="ui-modal" :class="`ui-modal--${size}`" role="dialog" aria-modal="true">
          <header class="ui-modal__header">
            <h3>{{ title }}</h3>
            <button type="button" class="ui-modal__close" aria-label="Cerrar" @click="close">
              <font-awesome-icon :icon="['fas', 'xmark']" />
            </button>
          </header>

          <div class="ui-modal__body">
            <slot />
          </div>

          <footer v-if="$slots.footer" class="ui-modal__footer">
            <slot name="footer" />
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: '' },
  size: { type: String, default: 'md' }, 
})

const emit = defineEmits(['update:modelValue', 'close'])

function close() {
  emit('update:modelValue', false)
  emit('close')
}
</script>
