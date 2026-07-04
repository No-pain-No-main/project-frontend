# Reglas — Vistas y componentes

Este documento define las reglas de arquitectura y organización para las capas de vistas y componentes del frontend.

## Objetivo

Mantener el proyecto ordenado, consistente y fácil de mantener, separando claramente la lógica de negocio, la presentación y la comunicación con servicios externos.

---

## Reglas generales aplicables a vistas y componentes

### VC-M1 — No usar Axios directamente en vistas ni componentes
Ningún archivo en las carpetas de vistas o componentes puede importar Axios ni construir URLs de backend directamente. Toda comunicación con el servidor debe delegarse a los servicios del proyecto.

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

### VC-M2 — No mutar stores directamente
Los componentes y vistas no deben modificar propiedades de un store de Pinia directamente. Toda modificación debe realizarse mediante las acciones del store.

```js
// Incorrecto
const authStore = useAuthStore()
authStore.user = responseData

// Correcto
authStore.setUser(responseData)
```

### VC-M3 — Usar Composition API con `<script setup>`
Todo componente nuevo debe desarrollarse con la Composition API y `<script setup>`.

```vue
<script setup>
import { ref } from 'vue'

const name = ref('')

function submit() {}
</script>
```

---

## Reglas específicas para vistas

### V-M1 — Las vistas son páginas completas
Los archivos ubicados en la carpeta de vistas representan pantallas completas cargadas por el router. No deben usarse como componentes internos de otra vista.

Si una parte de la interfaz se reutiliza, debe extraerse a la carpeta de componentes.

### V-M2 — La lógica de negocio pertenece a las vistas
Formularios, llamadas a servicios y acciones del dominio deben ubicarse en las vistas, no en los layouts.

---

## Reglas específicas para componentes

### C-M1 — Componentes con responsabilidad visual
Los componentes deben ser lo más puros posible. No deben poseer lógica de negocio compleja ni manejar directamente datos globales.

### C-M2 — Comunicación por props y emits
Los componentes deben recibir datos mediante props y comunicar eventos al componente padre con emits.

```vue
<script setup>
defineProps({
  label: { type: String, required: true },
  isLoading: { type: Boolean, default: false }
})

defineEmits(['confirm', 'cancel'])
</script>
```

---

## Recomendaciones

### VC-S1 — Manejar estados de carga y error
Cuando una vista o componente realice una petición asíncrona, debe mostrar explícitamente estados de carga, error o vacío.

### VC-S2 — Evitar lógica compleja en el template
Si una condición o cálculo se vuelve muy complejo, debe extraerse a una computed o función.

### VC-S3 — Nombres descriptivos
Los componentes deben nombrarse de forma clara y descriptiva, preferiblemente en PascalCase.
