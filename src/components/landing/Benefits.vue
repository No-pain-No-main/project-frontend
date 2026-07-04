<template>
  <section class="benefits">
    <p class="section-kicker">Beneficios</p>
    <h2 class="story__title">Todo lo que ganas al usar FitBook</h2>

    <div class="benefits__grid">
      <article v-for="item in items" :key="item.title" class="benefits__card">
        <span class="card-icon" :class="item.tone">
          <font-awesome-icon :icon="['fas', item.icon]" />
        </span>
        <h3>{{ item.title }}</h3>
        <p class="muted-text">{{ item.text }}</p>
      </article>
    </div>
  </section>
</template>

<script setup>

const items = [
  {
    icon: 'bolt',
    tone: 'blue',
    title: 'Reserva rápida',
    text: 'Aparta tu máquina en segundos, desde el celular o el computador.',
  },
  {
    icon: 'people-line',
    tone: 'green',
    title: 'Sin filas',
    text: 'Olvídate de esperar frente a la máquina o de acuerdos verbales con otros estudiantes.',
  },
  {
    icon: 'chart-line',
    tone: 'blue',
    title: 'Disponibilidad en tiempo real',
    text: 'Consulta al instante qué máquinas están libres, reservadas o en mantenimiento.',
  },
  {
    icon: 'gauge-high',
    tone: 'amber',
    title: 'Control de uso',
    text: 'Cada franja horaria tiene un tiempo máximo, así que el gimnasio rinde para todos.',
  },
  {
    icon: 'shield-halved',
    tone: 'green',
    title: 'Acceso equitativo',
    text: 'Límites diarios de reservas para que la demanda se reparta de forma justa.',
  },
  {
    icon: 'clock-rotate-left',
    tone: 'amber',
    title: 'Historial',
    text: 'Revisa tus reservas pasadas y tu frecuencia de entrenamiento cuando quieras.',
  },
]
</script>
