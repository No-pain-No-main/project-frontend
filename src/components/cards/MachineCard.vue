<template>
  <article class="machine-card machine-card--full">
    <div class="machine-card__media">
      <img :src="imageSrc" :alt="machine.name" loading="lazy" />
      <Badge class="machine-card__status" :tone="statusTone">{{ statusLabel }}</Badge>
    </div>

    <div class="machine-card__body">
      <p class="machine-card__type">{{ machine.typeLabel || machine.type }}</p>
      <h3>{{ machine.name }}</h3>
    </div>

    <!-- Modo estudiante: solo puede consultar y reservar -->
    <div v-if="mode === 'student'" class="machine-card__actions">
      <Button variant="outline" size="sm" @click="$emit('details', machine)">Más información</Button>
      <Button
        variant="primary"
        size="sm"
        :disabled="machine.status !== 'disponible'"
        @click="$emit('reserve', machine)"
      >
        Reservar
      </Button>
    </div>

    <!-- Modo admin: gestión del catálogo -->
    <div v-else class="machine-card__actions machine-card__actions--admin">
      <Button variant="outline" size="sm" :icon="['fas', 'pen']" @click="$emit('edit', machine)">Editar</Button>
      <Button
        variant="subtle"
        size="sm"
        :icon="machine.status === 'inactiva' ? ['fas', 'toggle-on'] : ['fas', 'toggle-off']"
        @click="$emit('toggle-status', machine)"
      >
        {{ machine.status === 'inactiva' ? 'Activar' : 'Desactivar' }}
      </Button>
      <Button variant="danger" size="sm" :icon="['fas', 'trash']" @click="$emit('delete', machine)">Eliminar</Button>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'
import Badge from '../ui/Badge.vue'
import Button from '../ui/Button.vue'

const props = defineProps({
  machine: { type: Object, required: true }, 
  mode: { type: String, default: 'student' }, 
})

defineEmits(['reserve', 'details', 'edit', 'delete', 'toggle-status'])

// Estados reales del dominio Disponible | Reservada | Inactiva

const statusMap = {
  disponible: { tone: 'success', label: 'Disponible' },
  reservada: { tone: 'warning', label: 'Reservada' },
  inactiva: { tone: 'danger', label: 'Inactiva' },
}

const statusTone = computed(() => statusMap[props.machine.status]?.tone || 'neutral')
const statusLabel = computed(() => statusMap[props.machine.status]?.label || props.machine.status)

// Imagen por defecto según categoría cuando no se provee `machine.image`.

const defaultImageMap = {
  'cardio': 'cardio.png',
  'funcional': 'brazo.png',
  'fuerza-libre': 'pecho.png',
  'guiada': 'piernas.png',
}

const imageSrc = computed(() => {
  const img = props.machine.image
  if (img) return img
  const mapped = defaultImageMap[props.machine.type]
  return mapped ? `/maquinas/${mapped}` : '/maquinas/pecho.png'
})
</script>
