# Reglas — Layouts (`layouts/`)

Los layouts son las "cáscaras" de la aplicación: `AuthLayout.vue`, `StudentLayout.vue`,
`AdminLayout.vue`. Su única responsabilidad es estructura visual global.

---

## MUST

### L-M1 — Solo estructura, nunca lógica de negocio
**Regla:** Los layouts no pueden contener formularios, llamadas a servicios, lógica de creación
o edición de datos de dominio (citas, administradores, pacientes, etc.). Solo deben contener
elementos estructurales: navbar, sidebar, footer, y un `<router-view />`.

```vue
<!-- ❌ Incorrecto — lógica de negocio en layout -->
<script setup>
import { createAppointment } from '@/services/appointmentService'
async function submit() { await createAppointment(form) }
</script>

<!-- ✅ Correcto — solo estructura -->
<template>
  <nav><!-- navbar --></nav>
  <main><router-view /></main>
  <footer><!-- footer --></footer>
</template>
```

### L-M2 — `<router-view />` obligatorio
**Regla:** Todo layout debe renderizar `<router-view />` exactamente una vez como punto de
inyección de las vistas hijas. Sin él, las vistas no se renderizan aunque el router funcione.

### L-M3 — Sin llamadas Axios directas
**Regla:** Ningún layout puede importar `axios` ni hacer llamadas HTTP directas. Si el layout
necesita datos de sesión (ej. nombre del usuario en la navbar), los lee desde un store de Pinia.

```vue
<!-- ✅ Correcto — leer sesión desde store, no desde HTTP -->
<script setup>
import { useAuthStore } from '@/stores/authStore'
const auth = useAuthStore()
</script>
<template>
  <nav>Hola, {{ auth.user?.name }}</nav>
  <router-view />
</template>
```

### L-M4 — No mutar estado de Pinia directamente
**Regla:** Si el layout necesita interactuar con el store (ej. botón de logout), debe llamar
una `action`, no mutar la propiedad directamente. Misma regla que VC-M2.

---

## SHOULD

### L-S1 — Un layout por rol, sin condicionales de rol dentro
Si hay lógica `v-if="user.role === 'admin'"` para secciones enteras de navegación dentro de
un mismo layout, considera si debería ser un layout separado. Los condicionales menores
(ej. un ítem de menú) son aceptables.

### L-S2 — Slots nombrados para zonas opcionales
Si el layout tiene zonas opcionales (ej. un panel lateral que algunas vistas no usan),
preferir `<slot name="sidebar" />` sobre condicionales que detecten qué vista está activa.