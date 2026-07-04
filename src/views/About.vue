<template>
  <section class="progress-page">
    <section class="content-band">
      <div class="section-heading">
        <div>
          <p class="section-kicker">Progreso</p>
          <h3>Resumen personal</h3>
        </div>
      </div>

      <p class="muted-text">
        Aqui puedes conectar las metricas reales del backend: asistencia, reservas completadas, maquinas usadas y racha semanal.
      </p>

      <div class="stats-grid">
        <article class="soft-card">
          <span class="card-icon blue">
            <font-awesome-icon :icon="['fas', 'chart-line']" />
          </span>
          <p>Progreso mensual</p>
          <strong>72%</strong>
        </article>

        <article class="soft-card">
          <span class="card-icon green">
            <font-awesome-icon :icon="['fas', 'calendar-check']" />
          </span>
          <p>Reservas usadas</p>
          <strong>12</strong>
        </article>

        <article class="soft-card">
          <span class="card-icon amber">
            <font-awesome-icon :icon="['fas', 'clipboard-check']" />
          </span>
          <p>Racha</p>
          <strong>4 dias</strong>
        </article>
      </div>
    </section>
  </section>
</template>
