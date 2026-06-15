# Reglas — Enrutador (`router/`)

El router orquesta los tres flujos: `/` (Auth), `/student`, `/admin`.

---

## MUST

### R-M1 — Lazy loading obligatorio en todas las rutas
**Regla:** Toda ruta que cargue una vista debe usar importación dinámica. Jamás importar
vistas estáticamente en el archivo del router.

```javascript
// ❌ Incorrecto — import estático, carga todo el bundle al inicio
import AdminDashboard from '@/views/admin/AdminDashboard.vue'
{ path: '/admin/dashboard', component: AdminDashboard }

// ✅ Correcto — lazy loading
{
  path: '/admin/dashboard',
  component: () => import('@/views/admin/AdminDashboard.vue')
}
```

### R-M2 — Segregación de rutas por rol
**Regla:** Las rutas deben organizarse en tres grupos con su layout correspondiente:
- `/` → `AuthLayout` (login, registro)
- `/student/*` → `StudentLayout`
- `/admin/*` → `AdminLayout`

Una vista de estudiante no puede anidarse bajo `/admin` ni viceversa.

### R-M3 — El router no contiene lógica de negocio
**Regla:** El archivo del router solo declara rutas y, opcionalmente, navigation guards de
autenticación/autorización. No debe llamar a servicios HTTP directamente ni contener
lógica de dominio.

---

## SHOULD

### R-S1 — Navigation guards para protección de rutas
Si el proyecto no tiene un `beforeEach` o guards por ruta (`meta.requiresAuth`), sugerirlo.
Un usuario no autenticado no debería poder acceder a `/student` o `/admin`. Un estudiante
no debería poder acceder a `/admin`.

```javascript
// Patrón sugerido
router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    next('/login')
  } else if (to.meta.role && auth.user?.role !== to.meta.role) {
    next('/unauthorized')
  } else {
    next()
  }
})
```

### R-S2 — Ruta catch-all para 404
Si no existe `/:pathMatch(.*)*`, sugerirla para evitar pantallas en blanco ante rutas
inexistentes.

### R-S3 — Nombres de ruta (`name`) en todas las rutas
Usar `name` en cada ruta para poder navegar con `{ name: 'AdminDashboard' }` en lugar de
strings de path hardcodeados.