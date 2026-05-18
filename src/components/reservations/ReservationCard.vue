<template>
  <article class="reservation-card">
    <div class="reservation-info">
      <h3>{{ reservation.machineName }} <span>(ID: {{ reservation.machineId }})</span></h3>

      <p>
        Fecha: {{ reservation.day }} |
        {{ reservation.slot }}
      </p>

      <small>Reserva ID: {{ reservation.id }}</small>
    </div>

    <button class="cancel-button" @click="$emit('cancel', reservation.id)">
      Cancelar
    </button>
  </article>
</template>

<script setup>
defineProps({
  reservation: {
    type: Object,
    required: true
  }
})

defineEmits(['cancel'])
</script>

<style scoped>
.reservation-card {
  background-color: white;
  border-left: 5px solid #142033;
  border-radius: 8px;
  padding: 22px;
  box-shadow: 0 6px 18px rgba(15, 23, 42, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.reservation-info h3 {
  margin: 0;
  color: #142033;
  font-size: 20px;
}

.reservation-info h3 span {
  color: #6b7280;
  font-size: 15px;
}

.reservation-info p {
  margin: 8px 0;
  color: #6b7280;
}

.reservation-info small {
  color: #16a34a;
  font-weight: 700;
}

.cancel-button {
  background-color: #fee2e2;
  color: #b91c1c;
  border: none;
  border-radius: 8px;
  padding: 12px 18px;
  cursor: pointer;
  font-weight: 700;
}

.cancel-button:hover {
  background-color: #fecaca;
}

@media (max-width: 700px) {
  .reservation-card {
    flex-direction: column;
    align-items: flex-start;
  }

  .cancel-button {
    width: 100%;
  }
}
</style>
