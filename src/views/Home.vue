<template>
  <section class="hero">

    <div class="hero__slides">
      <div
        v-for="(slide, index) in slides"
        :key="slide.image"
        class="hero__slide"
        :class="{ 'is-active': index === activeSlide }"
        :style="{ backgroundImage: `url(/${slide.image})` }"
      >
        <div class="hero__panel">
          <p class="section-kicker"><span class="hero__badge">{{ slide.kicker }}</span></p>
          <h1>{{ slide.title }}</h1>
          <p class="hero__lead">{{ slide.lead }}</p>

          <div class="hero__cta">
            <RouterLink to="/register" class="primary-button">
              <font-awesome-icon :icon="['fas', 'chevron-right']" />
              Crear cuenta
            </RouterLink>
            <RouterLink to="/login" class="ghost-button">Ya tengo cuenta</RouterLink>
          </div>
        </div>
      </div>
    </div>

    <div class="hero__dots">
      <button
        v-for="(slide, index) in slides"
        :key="slide.image"
        class="hero__dot"
        :class="{ 'is-active': index === activeSlide }"
        type="button"
        :aria-label="`Ir al slide ${index + 1}`"
        @click="activeSlide = index"
      />
    </div>
  </section>

  <StoryCarousel />

  <section class="info-band">
    <article class="info-card">
      <span class="card-icon blue">
        <font-awesome-icon :icon="['fas', 'user-graduate']" />
      </span>
      <h3>Para estudiantes</h3>
      <p class="muted-text">
        Reserva máquinas dentro de la semana en curso, cancela sin complicaciones y consulta tu
        historial de uso en cualquier momento.
      </p>
    </article>

    <article class="info-card">
      <span class="card-icon green">
        <font-awesome-icon :icon="['fas', 'shield-halved']" />
      </span>
      <h3>Acceso equitativo</h3>
      <p class="muted-text">
        Límites diarios de reservas y franjas horarias justas para un entorno universitario con
        alto volumen de estudiantes.
      </p>
    </article>
  </section>

  <HowItWorks />

  <MachinesShowcase />

  <Benefits />
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import StoryCarousel from '../components/landing/StoryCarousel.vue'
import HowItWorks from '../components/landing/HowItWorks.vue'
import MachinesShowcase from '../components/landing/MachinesShowcase.vue'
import Benefits from '../components/landing/Benefits.vue'

const slides = [
  {
    image: 'fondo_inicio.jpg',
    kicker: 'No pain · No main()',
    title: 'Reserva tu máquina sin filas ni acuerdos verbales.',
    lead: 'FitBook organiza el uso del gimnasio de la Universidad Nacional de Colombia sede Bogotá.',
  },
  {
    image: 'fondo_inicio_2.jpg',
    kicker: 'Disponibilidad en tiempo real',
    title: 'Consulta qué máquinas están libres antes de salir de tu casa.',
    lead: 'Reserva tu franja horaria y confirma tu asistencia desde una sola plataforma.',
  },
  {
    image: 'fondo_inicio_3.jpg',
    kicker: 'Acceso equitativo',
    title: 'Franjas horarias justas para toda la comunidad universitaria.',
    lead: 'Límites diarios de reservas para que todos tengan las mismas oportunidades.',
  },
]

const activeSlide = ref(0)
let intervalId = null

onMounted(() => {

  intervalId = setInterval(() => {
    activeSlide.value = (activeSlide.value + 1) % slides.length
  }, 6000)
})

onBeforeUnmount(() => {
  clearInterval(intervalId)
})
</script>
