<template>
  <section class="checkin-page">
    <div class="hero-panel hero-panel--compact">
      <div>
        <p class="section-kicker">Porteria</p>
        <h2>Validacion de ingreso</h2>
        <p>
          Pantalla pensada para confirmar asistencia, validar documento y controlar el tiempo de uso.
        </p>
      </div>

      <button class="primary-button" type="button">
        <font-awesome-icon :icon="['fas', 'arrow-right-to-bracket']" />
        Registrar ingreso
      </button>
    </div>

    <section class="content-band">
      <div class="activity-list">
        <article class="activity-item">
          <span>CC</span>
          <div>
            <strong>Documento validado</strong>
            <p>Reserva activa encontrada para la franja actual</p>
          </div>
        </article>

        <article class="activity-item">
          <span>45</span>
          <div>
            <strong>Tiempo de uso</strong>
            <p>Se libera la maquina automaticamente al finalizar</p>
          </div>
        </article>
      </div>
    </section>
  </section>
</template>
