# Reglas — Layouts

Este documento describe las reglas para la capa de layouts del proyecto.

## Objetivo

Mantener una estructura visual clara y consistente, separando la presentación global de la lógica de negocio.

---

## Reglas obligatorias

### L-M1 — Los layouts solo deben definir estructura
Los layouts deben encargarse de la estructura visual general: barra de navegación, sidebar, footer y contenedor principal. No deben contener lógica de negocio ni formularios.

```vue
<!-- Correcto -->
<template>
  <nav>Navbar</nav>
  <main><router-view /></main>
  <footer>Footer</footer>
</template>
```

### L-M2 — Deben renderizar `<router-view />`
Todo layout debe incluir un `<router-view />` para permitir que las vistas hijas se rendericen correctamente.

### L-M3 — No usar Axios en layouts
Los layouts no deben hacer peticiones HTTP directas. Si necesitan datos de sesión, deben obtenerlos desde un store.

### L-M4 — No mutar stores directamente
Si un layout necesita interactuar con un store, debe hacerlo mediante acciones del mismo.

---

## Recomendaciones

### L-S1 — Un layout por rol
Es recomendable mantener un layout distinto para autenticación, estudiante y administrador para evitar condicionales complejos.

### L-S2 — Usar slots cuando sean necesarios
Si algunas vistas requieren zonas visuales opcionales, se pueden usar slots en lugar de condicionales excesivos.
