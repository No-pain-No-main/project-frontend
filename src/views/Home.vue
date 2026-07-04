<template>
  <section class="hero">
    <!--
      Espacio para el fondo. Coloca tu imagen en /public/fondo_inicio.jpg
      y este bloque la usará automáticamente como fondo del hero.
      Mientras tanto se ve un degradado + textura de marca.
    -->
    <div class="hero__background" />

    <div class="hero__panel">
      <p class="section-kicker">No pain · No main()</p>
      <h1>Reserva tu máquina sin filas ni acuerdos verbales.</h1>
      <p class="hero__lead">
        FitBook organiza el uso del gimnasio de la Universidad Nacional de Colombia sede Bogotá:
        consulta disponibilidad en tiempo real, reserva tu franja horaria y confirma tu asistencia
        desde una sola plataforma.
      </p>

      <div class="hero__cta">
        <RouterLink to="/register" class="primary-button">
          <font-awesome-icon :icon="['fas', 'chevron-right']" />
          Crear cuenta
        </RouterLink>
        <RouterLink to="/login" class="ghost-button">Ya tengo cuenta</RouterLink>
      </div>
    </div>

    <div class="hero__stats">
      <article class="soft-card">
        <span class="card-icon blue">
          <font-awesome-icon :icon="['fas', 'calendar-check']" />
        </span>
        <p>Reservas por franja horaria</p>
        <strong>Semanales</strong>
      </article>

      <article class="soft-card">
        <span class="card-icon green">
          <font-awesome-icon :icon="['fas', 'clipboard-check']" />
        </span>
        <p>Confirmación de asistencia</p>
        <strong>En 5 min</strong>
      </article>

      <article class="soft-card">
        <span class="card-icon amber">
          <font-awesome-icon :icon="['fas', 'dumbbell']" />
        </span>
        <p>Disponibilidad</p>
        <strong>Tiempo real</strong>
      </article>
    </div>
  </section>

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
      <span class="card-icon amber">
        <font-awesome-icon :icon="['fas', 'users-gear']" />
      </span>
      <h3>Para administradores</h3>
      <p class="muted-text">
        Gestiona el catálogo de máquinas, controla estados y usuarios, y consulta reportes
        semanales de uso desde un panel dedicado.
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
</template>
