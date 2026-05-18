<template>
  <section class="machine-status-view">
    <div class="page-header">
      <h1>Administrar Estados de Máquinas</h1>
      <p>Actualiza la disponibilidad operativa de las máquinas registradas.</p>
    </div>

    <p v-if="successMessage" class="success-message">
      {{ successMessage }}
    </p>

    <MachineStatusTable
      :machines="machines"
      @save="handleSaveChanges"
    />
  </section>
</template>

<script setup>
import { ref } from 'vue'
import MachineStatusTable from '../../components/machines/MachineStatusTable.vue'

const machines = ref([
  {
    id: 'ELP-001',
    name: 'Elíptica Pro',
    status: 'Activa'
  },
  {
    id: 'CAM-04',
    name: 'Caminadora',
    status: 'Mantenimiento'
  },
  {
    id: 'BIC-02',
    name: 'Bicicleta estática',
    status: 'Inactiva'
  },
  {
    id: 'PRE-07',
    name: 'Prensa de piernas',
    status: 'Reservada'
  }
])

const successMessage = ref('')

function handleSaveChanges(changes) {
  /*
    TODO:
    Cuando el backend tenga endpoint de máquinas,
    aquí se reemplaza la simulación por machineService.updateMachineStatus().
  */

  const changedMachines = changes.filter(
    machine => machine.previousStatus !== machine.newStatus
  )

  if (changedMachines.length === 0) {
    successMessage.value = 'No se realizaron cambios de estado.'
    return
  }

  successMessage.value = `Se actualizaron ${changedMachines.length} máquina(s) correctamente.`
}
</script>

<style scoped>
.machine-status-view {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.page-header h1 {
  margin: 0;
  color: #142033;
  font-size: 30px;
}

.page-header p {
  margin: 8px 0 0;
  color: #6b7280;
}

.success-message {
  background-color: #dcfce7;
  color: #166534;
  padding: 14px;
  border-radius: 8px;
  font-size: 14px;
}
</style>
