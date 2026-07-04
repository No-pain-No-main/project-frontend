<template>
  <article class="reservation-card">
    <div class="reservation-card__icon">
      <font-awesome-icon :icon="['fas', 'dumbbell']" />
    </div>

    <div class="reservation-card__info">
      <h3>{{ reservation.machineName }}</h3>
      <p class="muted-text">
        <font-awesome-icon :icon="['fas', 'calendar']" /> {{ reservation.date }}
        &nbsp;·&nbsp;
        <font-awesome-icon :icon="['fas', 'clock']" /> {{ reservation.time }}
      </p>
    </div>

    <Badge :tone="statusTone">{{ statusLabel }}</Badge>

    <div class="reservation-card__actions">
      <Button v-if="showDetail" variant="outline" size="sm" @click="$emit('detail', reservation)">
        Ver detalle
      </Button>
      <Button
        v-if="reservation.status === 'activa'"
        variant="primary"
        size="sm"
        @click="$emit('confirm', reservation)"
      >
        Confirmar asistencia
      </Button>
      <Button
        v-if="reservation.status === 'activa'"
        variant="danger"
        size="sm"
        @click="$emit('cancel', reservation)"
      >
        Cancelar
      </Button>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'
import Badge from '../ui/Badge.vue'
import Button from '../ui/Button.vue'

const props = defineProps({
  reservation: { type: Object, required: true }, 
  showDetail: { type: Boolean, default: true },
})

defineEmits(['cancel', 'confirm', 'detail'])

const statusMap = {
  activa: { tone: 'info', label: 'Activa' },
  confirmada: { tone: 'success', label: 'Confirmada' },
  cancelada: { tone: 'danger', label: 'Cancelada' },
  completada: { tone: 'neutral', label: 'Completada' },
  vencida: { tone: 'warning', label: 'Vencida' },
}

const statusTone = computed(() => statusMap[props.reservation.status]?.tone || 'neutral')
const statusLabel = computed(() => statusMap[props.reservation.status]?.label || props.reservation.status)
</script>
