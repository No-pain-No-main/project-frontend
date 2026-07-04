<template>
  <section class="machines-page">
    <div class="section-heading">
      <div>
        <p class="section-kicker">Maquinas</p>
        <h3>Estado del gimnasio</h3>
      </div>
    </div>

    <div class="stats-grid">
      <article class="soft-card">
        <span class="card-icon blue">
          <font-awesome-icon :icon="['fas', 'dumbbell']" />
        </span>
        <p>Disponibles</p>
        <strong>18</strong>
      </article>

      <article class="soft-card">
        <span class="card-icon green">
          <font-awesome-icon :icon="['fas', 'calendar-check']" />
        </span>
        <p>Reservadas</p>
        <strong>7</strong>
      </article>

      <article class="soft-card">
        <span class="card-icon amber">
          <font-awesome-icon :icon="['fas', 'shield-halved']" />
        </span>
        <p>Mantenimiento</p>
        <strong>2</strong>
      </article>
    </div>

    <section class="content-band">
      <div class="activity-list">
        <article class="activity-item">
          <span>01</span>
          <div>
            <strong>Caminadora</strong>
            <p>Disponible para reserva</p>
          </div>
        </article>

        <article class="activity-item">
          <span>02</span>
          <div>
            <strong>Rack de sentadilla</strong>
            <p>Reservada hasta las 18:00</p>
          </div>
        </article>
      </div>
    </section>
  </section>
</template>
