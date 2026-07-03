<template>
  <section class="admin-page">
    <div class="section-heading">
      <div>
        <p class="section-kicker">Administracion</p>
        <h3>Gestion del gimnasio</h3>
      </div>
    </div>

    <div class="stats-grid">
      <article class="soft-card">
        <span class="card-icon blue">
          <font-awesome-icon :icon="['fas', 'users-gear']" />
        </span>
        <p>Usuarios activos</p>
        <strong>128</strong>
      </article>

      <article class="soft-card">
        <span class="card-icon green">
          <font-awesome-icon :icon="['fas', 'dumbbell']" />
        </span>
        <p>Maquinas registradas</p>
        <strong>27</strong>
      </article>

      <article class="soft-card">
        <span class="card-icon amber">
          <font-awesome-icon :icon="['fas', 'chart-line']" />
        </span>
        <p>Uso semanal</p>
        <strong>84%</strong>
      </article>
    </div>
  </section>
</template>
