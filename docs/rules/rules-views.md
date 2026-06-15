# Reglas — Capa de Vistas (`views/`)

Las vistas son páginas completas agrupadas por dominio (`auth/`, `student/`, `admin/`). Son los contenedores principales de lógica de negocio y formularios.

---

## MUST (bloqueantes)

### V-M1 — Sin llamadas Axios directas
**Regla:** Ninguna vista puede importar `axios` directamente ni construir llamadas HTTP con URLs hardcoded. Toda comunicación con el backend debe delegarse a un módulo en `services/` o `api/`.

```vue
<!-- ❌ Incorrecto en una vista -->
<script setup>
import axios from 'axios'
const data = await axios.get('http://localhost:8080/api/administrators')
</script>

<!-- ✅ Correcto -->
<script setup>
import { getAdministrators } from '@/services/administratorService'
const data = await getAdministrators()
</script>
```

### V-M2 — Estado global solo a través de Pinia
**Regla:** Si la vista necesita leer o mutar estado que persiste entre rutas (sesión, usuario autenticado, datos compartidos), debe hacerlo exclusivamente a través de las acciones y getters de un store de Pinia. Prohibido mutar propiedades del store directamente desde la vista.

```vue
<!-- ❌ Incorrecto — mutación directa del store -->
<script setup>
import { useAuthStore } from '@/stores/authStore'
const auth = useAuthStore()
auth.user = { name: 'Juan' } // mutación directa
</script>

<!-- ✅ Correcto — a través de una action -->
<script setup>
import { useAuthStore } from '@/stores/authStore'
const auth = useAuthStore()
auth.setUser({ name: 'Juan' }) // action del store
</script>
```

### V-M3 — Las vistas no contienen elementos estructurales de navegación
**Regla:** Navbars, sidebars, footers y menús de navegación global no pertenecen a las vistas. Si una vista renderiza estos elementos directamente (fuera de un `<router-view>`), es una violación. Esos elementos deben estar en `layouts/`.

### V-M4 — Dominio correcto por subdirectorio
**Regla:** Una vista en `views/admin/` no puede ser accedida ni lógicamente pertenecer al flujo de `student/`, y viceversa. Si la vista contiene lógica mezclada de roles, debe dividirse.

---

## SHOULD (recomendaciones)

### V-S1 — Composition API con `<script setup>`
Preferir `<script setup>` (Composition API) sobre Options API (`export default { data(), methods: {} }`). Es el estándar de Vue 3 y produce componentes más legibles y testeables.

### V-S2 — Manejo explícito de estados de carga y error
Las vistas que consumen servicios deben manejar tres estados: cargando, éxito, error. Usar refs reactivas (`isLoading`, `error`) para reflejar esto en el template.

```vue
<!-- ✅ Recomendado -->
<script setup>
const isLoading = ref(false)
const error = ref(null)

async function loadData() {
  isLoading.value = true
  try {
    data.value = await getAdministrators()
  } catch (e) {
    error.value = e.message
  } finally {
    isLoading.value = false
  }
}
</script>
```

### V-S3 — No lógica de presentación compleja en el template
Si el template tiene expresiones JavaScript largas o condiciones anidadas complejas, extraerlas a `computed` properties para mantener el template limpio.