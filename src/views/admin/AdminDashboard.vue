<template>
  <div class="admin-dashboard">
    <h1>Panel de Administración</h1>
    <p class="muted-text">Bienvenido al panel de administración de FitBook.</p>

    <div class="stats-grid">
      <div class="stat-card">
        <font-awesome-icon :icon="['fas', 'users']" class="stat-icon" />
        <div>
          <strong>Estudiantes</strong>
          <span class="stat-value">—</span>
        </div>
      </div>

      <div class="stat-card">
        <font-awesome-icon :icon="['fas', 'dumbbell']" class="stat-icon" />
        <div>
          <strong>Máquinas</strong>
          <span class="stat-value">—</span>
        </div>
      </div>

      <div class="stat-card">
        <font-awesome-icon :icon="['fas', 'calendar-check']" class="stat-icon" />
        <div>
          <strong>Reservas hoy</strong>
          <span class="stat-value">—</span>
        </div>
      </div>

      <div class="stat-card">
        <font-awesome-icon :icon="['fas', 'clock']" class="stat-icon" />
        <div>
          <strong>Validaciones</strong>
          <span class="stat-value">—</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-dashboard {
  padding: 24px;
}

.admin-dashboard h1 {
  margin-bottom: 8px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
  margin-top: 24px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  background: #fff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

.stat-icon {
  font-size: 2rem;
  color: var(--blue);
}

.stat-card strong {
  display: block;
  font-size: 0.9rem;
  color: var(--gray-600);
  margin-bottom: 4px;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--gray-900);
}
</style>