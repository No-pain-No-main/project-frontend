<template>
  <div class="ui-card" :class="{ 'ui-card--hover': hover, 'ui-card--pad-sm': padding === 'sm' }">
    <header v-if="$slots.header || title" class="ui-card__header">
      <slot name="header">
        <div>
          <h3>{{ title }}</h3>
          <p v-if="subtitle" class="muted-text">{{ subtitle }}</p>
        </div>
      </slot>
    </header>

    <div class="ui-card__body">
      <slot />
    </div>

    <footer v-if="$slots.footer" class="ui-card__footer">
      <slot name="footer" />
    </footer>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  hover: { type: Boolean, default: false },
  padding: { type: String, default: 'md' }, 
})
</script>
