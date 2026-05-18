<template>
  <section class="reservation-view">
    <div class="page-header">
      <div>
        <h1>Reservar Máquina</h1>
        <p>Selecciona una máquina activa y una franja horaria disponible.</p>
      </div>

      <select v-model="selectedDay" class="day-select">
        <option
          v-for="day in days"
          :key="day"
          :value="day"
        >
          {{ day }}
        </option>
      </select>
    </div>

    <p v-if="successMessage" class="success-message">
      {{ successMessage }}
    </p>

    <p v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </p>

    <div class="machines-grid">
      <MachineCard
        v-for="machine in machines"
        :key="machine.id"
        :machine="machine"
        @reserve="handleReserve"
      />
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import MachineCard from '../../components/machines/MachineCard.vue'
import { machinesMock } from '../../mocks/machines.mock'

const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes']
const selectedDay = ref('Lunes')

const machines = ref(machinesMock)

const successMessage = ref('')
const errorMessage = ref('')

function handleReserve(reservationData) {
  successMessage.value = ''
  errorMessage.value = ''

  if (!reservationData.slot) {
    errorMessage.value = 'Debe seleccionar una franja horaria antes de confirmar la reserva.'
    return
  }

  /*
    TODO:
    Cuando el backend tenga endpoints, aquí se llamará a reservationService.createReservation().
    El backend deberá validar conflictos de horario y límite de reservas.
  */

  successMessage.value = `Reserva confirmada para ${reservationData.machineName} el día ${selectedDay.value} de ${reservationData.slot}.`
}
</script>

<style scoped>
.reservation-view {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.day-select {
  width: 160px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 12px;
  background-color: white;
  font-size: 15px;
}

.machines-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 22px;
}

.success-message {
  background-color: #dcfce7;
  color: #166534;
  padding: 14px;
  border-radius: 8px;
  font-size: 14px;
}

.error-message {
  background-color: #fee2e2;
  color: #b91c1c;
  padding: 14px;
  border-radius: 8px;
  font-size: 14px;
}

@media (max-width: 760px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .day-select {
    width: 100%;
  }
}
</style>
