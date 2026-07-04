<template>
  <section class="admin-page">
    <div class="section-heading">
      <div>
        <p class="section-kicker">Administración</p>
        <h3>Configuración del sistema</h3>
      </div>
    </div>

    <div class="settings-grid">
      <article class="settings-card">
        <h4>Notificaciones</h4>
        <p>Activa alertas cuando se crea o cancela una reserva.</p>
        <label class="switch">
          <input type="checkbox" v-model="settings.notifications" />
          <span class="slider"></span>
        </label>
      </article>
      <article class="settings-card">
        <h4>Modo mantenimiento</h4>
        <p>Desactiva temporalmente nuevas reservas mientras realizas ajustes en el gimnasio.</p>
        <label class="switch">
          <input type="checkbox" v-model="settings.maintenanceMode" />
          <span class="slider"></span>
        </label>
      </article>
      <article class="settings-card">
        <h4>Permitir registro</h4>
        <p>Controla si los nuevos estudiantes pueden registrarse desde el portal público.</p>
        <label class="switch">
          <input type="checkbox" v-model="settings.allowRegistration" />
          <span class="slider"></span>
        </label>
      </article>
    </div>

    <div class="settings-footer">
      <button class="primary-button" type="button" @click="saveSettings">Guardar configuración</button>
      <p class="muted-text">Los cambios se guardan localmente en esta versión de prueba.</p>
    </div>
  </section>
</template>

<script setup>
import { reactive } from 'vue'

const settings = reactive({
  notifications: true,
  maintenanceMode: false,
  allowRegistration: true,
})

function saveSettings() {
  console.log('Configuración guardada', { ...settings })
}
</script>

<style scoped>
.settings-grid { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 18px; margin-top: 22px; }
.settings-card { background: #fff; border-radius: 24px; padding: 24px; border: 1px solid rgba(15,23,42,0.06); box-shadow: 0 18px 36px rgba(15,23,42,0.05); }
.settings-card h4 { margin-bottom: 10px; }
.switch { position: relative; display: inline-block; width: 54px; height: 28px; }
.switch input { opacity: 0; width: 0; height: 0; }
.slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #d1d5db; border-radius: 999px; transition: 0.3s; }
.slider:before { position: absolute; content: ""; height: 22px; width: 22px; left: 4px; bottom: 3px; background: white; border-radius: 50%; transition: 0.3s; }
input:checked + .slider { background-color: #2f6fed; }
input:checked + .slider:before { transform: translateX(26px); }
.settings-footer { margin-top: 24px; display: flex; flex-direction: column; gap: 10px; }
@media (max-width: 960px) {
  .settings-grid { grid-template-columns: 1fr; }
}
</style>
