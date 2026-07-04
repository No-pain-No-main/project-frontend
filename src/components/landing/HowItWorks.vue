<template>
  <section class="timeline">
    <p class="section-kicker">Paso a paso</p>
    <h2 class="story__title">¿Cómo funciona?</h2>

    <ol class="timeline__list">
      <li v-for="(step, index) in steps" :key="step.title" class="timeline__step">
        <div class="timeline__marker">
          <span class="card-icon" :class="step.tone">
            <font-awesome-icon :icon="['fas', step.icon]" />
          </span>
          <span v-if="index < steps.length - 1" class="timeline__connector" />
        </div>

        <div class="timeline__copy">
          <span class="timeline__step-number">Paso {{ index + 1 }}</span>
          <h3>{{ step.title }}</h3>
          <p class="muted-text">{{ step.text }}</p>
        </div>
      </li>
    </ol>
  </section>
</template>

<script setup>

const steps = [
  {
    icon: 'user-plus',
    tone: 'blue',
    title: 'Regístrate',
    text: 'Crea tu cuenta con tu documento de identificación y tus datos personales.',
  },
  {
    icon: 'magnifying-glass',
    tone: 'blue',
    title: 'Busca máquina',
    text: 'Consulta la disponibilidad en tiempo real y filtra por tipo de máquina.',
  },
  {
    icon: 'calendar-check',
    tone: 'green',
    title: 'Reserva horario',
    text: 'Elige tu franja horaria dentro de la semana en curso, sin que se solape con otra reserva.',
  },
  {
    icon: 'clipboard-check',
    tone: 'amber',
    title: 'Confirma asistencia',
    text: 'Confirma dentro de los primeros 5 minutos de tu franja para no perder la reserva.',
  },
  {
    icon: 'dumbbell',
    tone: 'green',
    title: 'Entrena',
    text: 'Usa la máquina durante tu franja; al terminar, queda disponible para el siguiente estudiante.',
  },
]
</script>
