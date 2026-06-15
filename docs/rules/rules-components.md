# Reglas — Capa de Componentes (`components/`)

Los componentes son elementos de UI puros y reutilizables: botones, tarjetas, modales, inputs personalizados. No tienen estado global ni lógica de negocio propia.

---

## MUST (bloqueantes)

### C-M1 — Sin llamadas HTTP directas
**Regla:** Los componentes no pueden importar `axios` ni llamar a servicios HTTP. Reciben datos via `props` y emiten eventos al padre con `emit`. La lógica de fetching pertenece a las vistas.

```vue
<!-- ❌ Incorrecto -->
<script setup>
import axios from 'axios'
const result = await axios.post('/api/appointments', props.data)
</script>

<!-- ✅ Correcto — delegar al padre via emit -->
<script setup>
const emit = defineEmits(['submit'])
const handleSubmit = (data) => emit('submit', data)
</script>
```

### C-M2 — Sin acceso directo a stores de Pinia (regla general)
**Regla:** Los componentes puros de UI no deberían acceder a stores de Pinia directamente. Deben recibir sus datos por `props`. Excepción justificada: componentes de alto nivel que son más "contenedores" que "presentacionales" (documentar la excepción con un comentario).

### C-M3 — Declarar props y emits explícitamente
**Regla:** Todo componente debe declarar sus `defineProps` y `defineEmits` de forma explícita con tipos. Sin esta declaración, el contrato del componente es opaco.

```vue
<!-- ✅ Correcto -->
<script setup>
defineProps({
  title: { type: String, required: true },
  isLoading: { type: Boolean, default: false }
})
defineEmits(['confirm', 'cancel'])
</script>
```

---

## SHOULD (recomendaciones)

### C-S1 — Un componente, una responsabilidad
Si un componente renderiza más de una "unidad visual" claramente diferenciada (ej. un formulario Y una tabla de resultados), considerar dividirlo en dos componentes separados.

### C-S2 — Nombres descriptivos en PascalCase
Los componentes deben nombrarse en PascalCase y con nombres que expresen su función: `AppointmentCard.vue`, no `Card.vue`. Facilita la búsqueda y el debug.