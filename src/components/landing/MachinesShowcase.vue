<template>
  <section class="machines-showcase">
    <p class="section-kicker">Catálogo</p>
    <h2 class="story__title">Máquinas en el gimnasio</h2>

    <!-- Menú de categorías seleccionable -->
    <div class="machines-showcase__tabs" role="tablist" aria-label="Categorías de máquinas">
      <button
        v-for="category in categories"
        :key="category.id"
        class="machines-showcase__tab"
        :class="{ 'is-active': category.id === activeCategory.id }"
        type="button"
        role="tab"
        :aria-selected="category.id === activeCategory.id"
        @click="activeCategory = category"
      >
        <font-awesome-icon :icon="['fas', category.icon]" />
        {{ category.label }}
      </button>
    </div>

    <div class="machines-showcase__hero-image">
      <img :src="`/maquinas/${activeCategory.image}`" :alt="activeCategory.label" />
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const categories = ref([
  {
    id: 'pecho',
    label: 'Pecho',
    icon: 'heart',
    image: 'pecho.png',
  },
  {
    id: 'espalda',
    label: 'Espalda',
    icon: 'user',
    image: 'espalda.png',
  },
  {
    id: 'piernas',
    label: 'Piernas',
    icon: 'person-running',
    image: 'piernas.png',
  },
  {
    id: 'cardio',
    label: 'Cardio',
    icon: 'heart-pulse',
    image: 'cardio.png',
  },
  {
    id: 'funcional',
    label: 'Brazo',
    icon: 'hand-rock',
    image: 'brazo.png',
  },
])

const activeCategory = ref(categories.value[0])
</script>
