# Reglas — Stores Pinia (`stores/`) y Servicios HTTP (`services/` o `api/`)

---

## STORES PINIA

### ST-M1 — Definir con `defineStore`, nunca con objeto reactivo manual
**Regla:** El estado global debe definirse exclusivamente con `defineStore` de Pinia. No usar
`reactive({})` o `ref()` exportados directamente desde un módulo como sustituto de store.

```javascript
// ❌ Incorrecto — estado global manual
export const authState = reactive({ user: null })

// ✅ Correcto — store de Pinia
export const useAuthStore = defineStore('auth', {
  state: () => ({ user: null }),
  actions: {
    setUser(user) { this.user = user }
  }
})
```

### ST-M2 — Mutaciones solo en `actions`
**Regla:** El estado del store solo puede modificarse dentro de sus propias `actions`. Los
componentes que usen el store no pueden asignar directamente a sus propiedades.
(Esta regla es espejo de VC-M2 — si se detecta la violación en un `.vue`, reportar allí;
si se detecta en el store mismo, reportar aquí.)

### ST-M3 — Los stores no importan directamente desde `views/` ni `components/`
**Regla:** El flujo de dependencias es unidireccional: `views/components → stores → services`.
Un store no puede importar ni instanciar componentes Vue. Puede llamar a servicios HTTP.

### ST-M4 — Sin lógica de presentación en el store
**Regla:** Los stores no manejan mensajes de UI, clases CSS, ni lógica de visibilidad de
elementos. Esa responsabilidad es de los componentes/vistas. El store solo gestiona estado
de datos y acciones de negocio del cliente.

---

## SHOULD — Stores

### ST-S1 — Getters para datos derivados
Si hay lógica calculada a partir del estado (ej. `isAuthenticated = user !== null`), usar
`getters` en lugar de calcularla en cada componente.

```javascript
getters: {
  isAuthenticated: (state) => state.user !== null
}
```

### ST-S2 — Nombre del store descriptivo y en camelCase
El ID del store (`defineStore('auth', ...)`) debe ser descriptivo y único. Evitar nombres
genéricos como `'store'` o `'data'`.

---

## SERVICIOS HTTP (`services/` o `api/`)

### SV-M1 — Toda llamada Axios centralizada aquí
**Regla:** Los archivos de `services/` o `api/` son el **único lugar** donde se instancia o
importa Axios y se construyen URLs del backend. Ninguna otra capa puede hacerlo.
(Si la violación se detecta en un `.vue`, reportar como VC-M1.)

### SV-M2 — Sin lógica de UI en los servicios
**Regla:** Los servicios no deben manipular el DOM, llamar a `router.push()`, ni modificar
stores directamente. Retornan datos o lanzan errores; quién los llama decide qué hacer.

```javascript
// ❌ Incorrecto — el service decide la navegación
async function login(credentials) {
  const res = await axios.post('/auth/login', credentials)
  router.push('/dashboard') // no le corresponde
}

// ✅ Correcto — retorna y el caller decide
async function login(credentials) {
  const res = await axios.post('/auth/login', credentials)
  return res.data
}
```

### SV-M3 — URLs relativas o desde variable de entorno, no hardcodeadas con host
**Regla:** No hardcodear `http://localhost:8080` en los servicios. Usar una instancia de
Axios con `baseURL` configurada desde `import.meta.env.VITE_API_URL` o similar.

```javascript
// ❌ Incorrecto
await axios.get('http://localhost:8080/api/administrators')

// ✅ Correcto
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL })
await api.get('/administrators')
```

---

## SHOULD — Servicios

### SV-S1 — Instancia de Axios compartida con interceptores
Preferir una instancia única de Axios (`axios.create(...)`) configurada con interceptores
para inyectar el token de autenticación y manejar errores 401/403 globalmente, en lugar de
configurar headers manualmente en cada llamada.

### SV-S2 — Agrupación por dominio
Un archivo de servicio por dominio de negocio: `appointmentService.js`,
`administratorService.js`. Evitar un único `api.js` que concentre todas las llamadas
de todos los dominios.