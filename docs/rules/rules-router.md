# Reglas — Enrutador

Este documento define las reglas para la configuración de rutas del proyecto.

## Objetivo

Mantener una navegación clara, segura y escalable, separando correctamente las rutas públicas, de estudiante y de administrador.

---

## Reglas obligatorias

### R-M1 — Lazy loading en todas las rutas
Todas las rutas que carguen vistas deben usar importación dinámica.

```js
// Incorrecto
import AdminDashboard from '@/views/admin/AdminDashboard.vue'

// Correcto
{
  path: '/admin/dashboard',
  component: () => import('@/views/admin/AdminDashboard.vue')
}
```

### R-M2 — Segregación por rol
Las rutas deben organizarse de forma coherente en los siguientes grupos:

- `/` para autenticación y vistas públicas.
- `/student/*` para el área del estudiante.
- `/admin/*` para el área del administrador.

### R-M3 — El router no debe contener lógica de negocio
El archivo del router solo debe declarar rutas y guards de autenticación o autorización. No debe hacer llamadas HTTP ni albergar lógica de dominio.

---

## Recomendaciones

### R-S1 — Proteger rutas con guards
Es recomendable agregar guards que impidan el acceso a rutas sensibles si el usuario no está autenticado o no tiene el rol adecuado.

### R-S2 — Ruta catch-all para 404
Se recomienda incluir una ruta de fallback para manejar URLs inexistentes.

### R-S3 — Usar nombres de ruta
Es preferible usar `name` en cada ruta para facilitar la navegación y evitar hardcodear paths.
