<template>
  <section class="reservations-page">
    <div class="section-heading">
      <div>
        <p class="section-kicker">Reservas</p>
        <h3>Agenda tu entrenamiento</h3>
      </div>

      <button class="primary-button" type="button">
        <font-awesome-icon :icon="['fas', 'calendar-check']" />
        Nueva reserva
      </button>
    </div>

    <div class="feature-grid">
      <article class="content-band">
        <p class="section-kicker">Disponibilidad</p>
        <h3>Franja horaria</h3>
        <div class="slot-list">
          <button class="slot-button is-selected" type="button">07:00 - 07:45</button>
          <button class="slot-button" type="button">08:00 - 08:45</button>
          <button class="slot-button" type="button">17:00 - 17:45</button>
        </div>
      </article>

      <article class="content-band">
        <p class="section-kicker">Maquina</p>
        <h3>Elige equipo</h3>
        <div class="activity-list">
          <article class="activity-item">
            <span><font-awesome-icon :icon="['fas', 'dumbbell']" /></span>
            <div>
              <strong>Prensa de piernas</strong>
              <p>Tiempo maximo: 45 minutos</p>
            </div>
          </article>

          <article class="activity-item">
            <span><font-awesome-icon :icon="['fas', 'dumbbell']" /></span>
            <div>
              <strong>Banco plano</strong>
              <p>Limite semanal: 3 reservas</p>
            </div>
          </article>
        </div>
      </article>
    </div>
  </section>
</template>
