<template>
  <article class="machine-card">
    <div class="machine-header">
      <div>
        <h3>{{ machine.name }}</h3>
        <p>ID: {{ machine.id }}</p>
      </div>

      <span class="status">
        {{ machine.status }}
      </span>
    </div>

    <p class="machine-type">
      Tipo: {{ machine.type }}
    </p>

    <label class="slot-label" :for="`slot-${machine.id}`">
      Franja horaria:
    </label>

    <select
      :id="`slot-${machine.id}`"
      v-model="selectedSlot"
      class="slot-select"
    >
      <option value="" disabled>Seleccione un horario</option>
      <option
        v-for="slot in machine.availableSlots"
        :key="slot"
        :value="slot"
      >
        {{ slot }}
      </option>
    </select>

    <button class="reserve-button" @click="confirmReservation">
      Confirmar Reserva
    </button>
  </article>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  machine: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['reserve'])

const selectedSlot = ref('')

function confirmReservation() {
  emit('reserve', {
    machineId: props.machine.id,
    machineName: props.machine.name,
    slot: selectedSlot.value
  })
}
</script>

<style scoped>
.machine-card {
  background-color: white;
  border-left: 5px solid #142033;
  border-radius: 8px;
  padding: 22px;
  box-shadow: 0 6px 18px rgba(15, 23, 42, 0.1);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.machine-header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
}

.machine-header h3 {
  margin: 0;
  color: #142033;
  font-size: 20px;
}

.machine-header p,
.machine-type {
  margin: 6px 0 0;
  color: #6b7280;
  font-size: 14px;
}

.status {
  background-color: #dcfce7;
  color: #166534;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  height: fit-content;
}

.slot-label {
  font-weight: 700;
  color: #1f2937;
  font-size: 14px;
}

.slot-select {
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 12px;
  font-size: 15px;
  background-color: white;
}

.reserve-button {
  background-color: #142033;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 13px 16px;
  font-weight: 700;
  cursor: pointer;
}

.reserve-button:hover {
  background-color: #1f2f46;
}
</style>
