# Reglas — Vistas (`views/`) y Componentes (`components/`)

Estas dos capas comparten varias reglas base. Las diferencias están marcadas explícitamente.

---

## MUST — Comunes a Vistas y Componentes

### VC-M1 — Sin llamadas Axios directas
**Regla:** Ningún archivo `.vue` en `views/` ni `components/` puede importar `axios` directamente
ni construir URLs hardcodeadas para llamadas HTTP. Toda comunicación con el backend debe delegarse
a un módulo en `services/` o `api/`.

```vue
<!-- ❌ Incorrecto — axios directo en una vista -->
<script setup>
import axios from 'axios'
const data = await axios.get('http://localhost:8080/api/administrators')
</script>

<!-- ✅ Correcto — delega al service -->
<script setup>
import { getAdministrators } from '@/services/administratorService'
const data = await getAdministrators()
</script>
```

### VC-M2 — Sin mutación directa del estado de Pinia
**Regla:** Los componentes y vistas no pueden modificar propiedades del store directamente
(`store.user = x`). Toda mutación debe pasar por las `actions` del store.

```javascript
// ❌ Incorrecto — mutación directa
const authStore = useAuthStore()
authStore.user = responseData

// ✅ Correcto — a través de action
authStore.setUser(responseData)
```

### VC-M3 — Composition API con `<script setup>`
**Regla:** Todos los componentes deben usar `<script setup>` (Composition API). No usar Options API
(`data()`, `methods:`, `computed:` como propiedades de objeto) en código nuevo.

```vue
<!-- ❌ Incorrecto — Options API -->
<script>
export default {
  data() { return { name: '' } },
  methods: { submit() {} }
}
</script>

<!-- ✅ Correcto — Composition API -->
<script setup>
import { ref } from 'vue'
const name = ref('')
function submit() {}
</script>
```

---

## MUST — Solo para Vistas (`views/`)

### V-M1 — Las vistas no se registran como componentes globales
**Regla:** Los archivos en `views/` son páginas completas cargadas por el router. No deben ser
importados e instanciados como componentes dentro de otros `.vue`. Si un fragmento de UI se
necesita en múltiples vistas, debe extraerse a `components/`.

### V-M2 — Lógica de negocio reside en las vistas, no en los layouts
**Regla:** Los formularios, llamadas a servicios, y lógica de dominio (crear cita, registrar
administrador) deben estar en archivos de `views/`, no en `layouts/`. Ver también `rules-layouts.md`.

---

## MUST — Solo para Componentes (`components/`)

### C-M1 — Componentes sin estado global propio
**Regla:** Los componentes de UI (`components/`) deben ser lo más puros posible. No deben
inicializar ni poseer stores de Pinia para lógica de negocio. Pueden *leer* un store si necesitan
datos de sesión para renderizado (ej. mostrar el nombre del usuario), pero no deben ser el
responsable de acciones de negocio.

### C-M2 — Comunicación por props y emits, no por acceso directo al padre
**Regla:** Los componentes reciben datos vía `props` y notifican al padre vía `emit`. No deben
acceder a datos del componente padre por refs externas ni por stores compartidos para lógica
que debería ser prop/emit.

```vue
<!-- ✅ Correcto -->
<script setup>
const props = defineProps({ label: String })
const emit = defineEmits(['click'])
</script>
```

---

## SHOULD — Comunes

### VC-S1 — Manejo explícito de estados de carga y error
Las vistas que hacen llamadas asíncronas deben manejar visualmente los estados `loading` y `error`.
No dejar la UI en blanco mientras carga ni swallow silencioso de errores.

```vue
<template>
  <div v-if="loading">Cargando...</div>
  <div v-else-if="error">{{ error }}</div>
  <div v-else>{{ data }}</div>
</template>
```

### VC-S2 — `defineProps` con tipos explícitos
Declarar los tipos de props usando la sintaxis de TypeScript o el objeto de validación de Vue.
Evitar `defineProps(['label'])` sin tipo.

```javascript
// ✅ Con validación
defineProps({ label: { type: String, required: true } })
```

### VC-S3 — Evitar lógica compleja en el template
Expresiones con más de una condición anidada en `v-if` o cálculos en el template deben extraerse
a una `computed`. Mantener el template declarativo.