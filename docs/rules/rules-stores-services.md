# Reglas — Stores Pinia y servicios HTTP

Este documento establece las reglas para el manejo del estado global y la comunicación con el backend.

## Objetivo

Asegurar que la lógica de negocio y la integración con servicios externos estén bien organizadas, evitando acoplamientos innecesarios entre capas.

---

## Stores Pinia

### ST-M1 — Definir stores con `defineStore`
El estado global debe manejarse exclusivamente mediante stores de Pinia. No se deben usar objetos reactivos manuales como sustituto de un store.

```js
// Incorrecto
export const authState = reactive({ user: null })

// Correcto
export const useAuthStore = defineStore('auth', {
  state: () => ({ user: null }),
  actions: {
    setUser(user) {
      this.user = user
    }
  }
})
```

### ST-M2 — Las mutaciones solo deben hacerse dentro de actions
Los componentes y vistas no deben modificar directamente el estado del store. Deben invocar acciones del store.

### ST-M3 — Los stores no deben importar vistas ni componentes
La relación de dependencias debe ser unidireccional: vistas y componentes consumen stores, y los stores consumen servicios.

### ST-M4 — Los stores no deben manejar presentación visual
Los stores no deben controlar mensajes visuales, clases CSS ni visibilidad de UI. Eso corresponde a las vistas o componentes.

---

## Recomendaciones para stores

### ST-S1 — Usar getters para datos derivados
Si un valor se calcula a partir del estado, conviene definirlo como getter.

```js
getters: {
  isAuthenticated: (state) => state.user !== null
}
```

### ST-S2 — Usar nombres descriptivos
Los stores deben tener identificadores claros y únicos, como `auth`, `reservations` o `machines`.

---

## Servicios HTTP

### SV-M1 — Toda llamada HTTP debe centralizarse en servicios
Los archivos ubicados en services o api son el único lugar donde debe existir la lógica de conexión con el backend.

### SV-M2 — Los servicios no deben manejar UI
Los servicios no deben manipular el DOM, hacer navegación ni modificar stores directamente. Solo deben retornar datos o lanzar errores.

```js
// Incorrecto
async function login(credentials) {
  const res = await axios.post('/auth/login', credentials)
  router.push('/dashboard')
}

// Correcto
async function login(credentials) {
  const res = await axios.post('/auth/login', credentials)
  return res.data
}
```

### SV-M3 — Usar baseURL desde variables de entorno
No se deben hardcodear URLs completas como `http://localhost:8080` en cada servicio.

```js
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
})
```

---

## Recomendaciones para servicios

### SV-S1 — Usar una instancia compartida de Axios
Es preferible trabajar con una instancia centralizada y reutilizable, con interceptores y manejo de errores.

### SV-S2 — Agrupar servicios por dominio
Cada dominio del negocio puede tener su propio servicio, por ejemplo `authService`, `reservationService` o `machineService`.
