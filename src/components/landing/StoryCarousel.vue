<template>
  <section class="story">
    <p class="section-kicker">Sobre FitBook</p>
    <h2 class="story__title">Una idea nacida de las filas del gimnasio</h2>

    <div class="story__viewport">
      <div class="story__track" :style="{ transform: `translateX(-${active * 100}%)` }">
        <article v-for="slide in slides" :key="slide.title" class="story__slide">
          <div class="story__slide-card">
            <span class="card-icon" :class="slide.tone">
              <font-awesome-icon :icon="['fas', slide.icon]" />
            </span>
            <h3>{{ slide.title }}</h3>
            <p class="muted-text">{{ slide.text }}</p>
          </div>
        </article>
      </div>
    </div>

    <div class="story__dots">
      <button
        v-for="(slide, index) in slides"
        :key="slide.title"
        class="hero__dot"
        :class="{ 'is-active': index === active }"
        type="button"
        :aria-label="`Ir a: ${slide.title}`"
        @click="goTo(index)"
      />
    </div>
  </section>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

const slides = [
  {
    icon: 'circle-info',
    tone: 'blue',
    title: '¿Qué es FitBook?',
    text: 'Una plataforma digital para reservar máquinas del gimnasio de la Universidad Nacional de Colombia sede Bogotá, sin filas ni acuerdos verbales.',
  },
  {
    icon: 'seedling',
    tone: 'green',
    title: '¿Cómo nació?',
    text: 'Como proyecto de Ingeniería de Software, a partir de una observación directa: el gimnasio universitario no tenía forma de organizar la demanda en horarios pico.',
  },
  {
    icon: 'lightbulb',
    tone: 'amber',
    title: '¿Por qué se creó?',
    text: 'Porque un entorno universitario público, con alto volumen de estudiantes en horarios académicos concentrados, necesita una gestión distinta a la de un gimnasio privado.',
  },
  {
    icon: 'triangle-exclamation',
    tone: 'amber',
    title: 'Problema que soluciona',
    text: 'Elimina la dependencia de filas físicas y acuerdos informales entre estudiantes, que generaban desorganización y uso ineficiente de las máquinas.',
  },
  {
    icon: 'chart-line',
    tone: 'blue',
    title: 'Beneficios',
    text: 'Disponibilidad en tiempo real, franjas horarias justas, historial de uso y menos tiempo de espera para toda la comunidad académica.',
  },
  {
    icon: 'bullseye',
    tone: 'green',
    title: 'Objetivo',
    text: 'Automatizar la gestión del gimnasio sin requerir más personal administrativo, garantizando acceso equitativo a los recursos disponibles.',
  },
]

const active = ref(0)
let intervalId = null

function goTo(index) {
  active.value = index
  restartAutoplay()
}

function restartAutoplay() {
  clearInterval(intervalId)
  intervalId = setInterval(() => {
    active.value = (active.value + 1) % slides.length
  }, 5000)
}

onMounted(restartAutoplay)
onBeforeUnmount(() => clearInterval(intervalId))
</script>
