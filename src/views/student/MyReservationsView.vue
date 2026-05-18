<template>
  <section class="my-reservations-view">
    <div class="page-header">
      <div>
        <h1>Mis Reservas Activas</h1>
        <p>Consulta y cancela tus reservas actuales.</p>
      </div>
    </div>

    <p v-if="successMessage" class="success-message">
      {{ successMessage }}
    </p>

    <div v-if="reservations.length > 0" class="reservations-list">
      <ReservationCard
        v-for="reservation in reservations"
        :key="reservation.id"
        :reservation="reservation"
        @cancel="handleCancel"
      />
    </div>

    <div v-else class="empty-state">
      <h2>No tienes reservas activas</h2>
      <p>Cuando reserves una máquina, aparecerá en esta sección.</p>
      <RouterLink to="/student/reservations/create">
        Crear reserva
      </RouterLink>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import ReservationCard from '../../components/reservations/ReservationCard.vue'
import { reservationsMock } from '../../mocks/reservations.mock'

const reservations = ref([...reservationsMock])
const successMessage = ref('')

function handleCancel(reservationId) {
  /*
    TODO:
    Cuando el backend tenga endpoint de cancelación,
    aquí se reemplaza la simulación por reservationService.cancelReservation(id).
  */

  reservations.value = reservations.value.filter(
    reservation => reservation.id !== reservationId
  )

  successMessage.value = `Reserva ${reservationId} cancelada correctamente.`
}
</script>

<style scoped>
.my-reservations-view {
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

.reservations-list {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.success-message {
  background-color: #dcfce7;
  color: #166534;
  padding: 14px;
  border-radius: 8px;
  font-size: 14px;
}

.empty-state {
  background-color: white;
  border-radius: 8px;
  padding: 36px;
  text-align: center;
  box-shadow: 0 6px 18px rgba(15, 23, 42, 0.1);
}

.empty-state h2 {
  margin: 0;
  color: #142033;
}

.empty-state p {
  color: #6b7280;
}

.empty-state a {
  display: inline-block;
  margin-top: 12px;
  background-color: #142033;
  color: white;
  padding: 12px 18px;
  border-radius: 8px;
  font-weight: 700;
}
</style>
