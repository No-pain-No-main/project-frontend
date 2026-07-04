# Reglas — Vistas y componentes

Estas dos capas comparten varias reglas base. Las diferencias están marcadas explícitamente.

---

## MUST — Comunes a vistas y componentes

### VC-M1 — Sin llamadas Axios directas
Ningún archivo `.vue` en `views/` ni `components/` puede importar `axios` directamente ni construir URLs hardcodeadas para llamadas HTTP. Toda comunicación con el backend debe delegarse a un módulo en `services/` o `api/`.

```vue
<!-- Incorrecto -->
<script setup>
import axios from 'axios'
const data = await axios.get('http://localhost:8080/api/administrators')
</script>

<!-- Correcto -->
<script setup>
import { getAdministrators } from '@/services/administratorService'
const data = await getAdministrators()
</script>
```

### VC-M2 — Sin mutación directa del estado de Pinia
Los componentes y vistas no pueden modificar propiedades del store directamente. Toda mutación debe pasar por las acciones del store.

```js
// Incorrecto
const authStore = useAuthStore()
authStore.user = responseData

// Correcto
authStore.setUser(responseData)
```

### VC-M3 — Composition API con `<script setup>`
Todos los componentes deben usar `<script setup>` con Composition API. No se recomienda usar Options API en código nuevo.

```vue
<!-- Incorrecto -->
<script>
export default {
  data() {
    return { name: '' }
  },
  methods: {
    submit() {}
  }
}
</script>

<!-- Correcto -->
<script setup>
import { ref } from 'vue'

const name = ref('')

function submit() {}
</script>
```

---

## MUST — Solo para vistas

### V-M1 — Las vistas no se registran como componentes globales
Los archivos en `views/` son páginas completas cargadas por el router. No deben importarse e instanciarse como componentes dentro de otros `.vue`.

Si un fragmento de interfaz se reutiliza, debe extraerse a `components/`.

### V-M2 — La lógica de negocio reside en las vistas, no en los layouts
Los formularios, llamadas a servicios y lógica de dominio deben estar en archivos de `views/`, no en `layouts/`.

---

## MUST — Solo para componentes

### C-M1 — Componentes sin estado global propio
Los componentes de UI deben ser lo más puros posible. No deben inicializar ni poseer stores de Pinia para lógica de negocio. Pueden leer un store para renderizado, pero no deben ser los responsables de acciones de negocio.

### C-M2 — Comunicación por props y emits
Los componentes reciben datos mediante props y notifican al componente padre a través de emits. No deben acceder a datos del padre por refs externas ni por stores compartidos para lógica que debería ser prop/emit.

```vue
<script setup>
const props = defineProps({ label: String })
const emit = defineEmits(['click'])
</script>
```

---

## SHOULD — Comunes

### VC-S1 — Manejo explícito de estados de carga y error
Las vistas que hagan llamadas asíncronas deben manejar estados de carga, error y vacío de forma visual.

```vue
<template>
  <div v-if="loading">Cargando...</div>
  <div v-else-if="error">{{ error }}</div>
  <div v-else>{{ data }}</div>
</template>
```

### VC-S2 — `defineProps` con tipos explícitos
Es preferible declarar las props con validación explícita en lugar de usar `defineProps(['label'])` sin contexto.

```js
defineProps({ label: { type: String, required: true } })
```

### VC-S3 — Evitar lógica compleja en el template
Expresiones con más de una condición anidada o cálculos complejos en el template deben extraerse a `computed` o funciones.
