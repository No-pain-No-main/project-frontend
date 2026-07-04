# Reglas — Componentes

Este documento define las buenas prácticas para la carpeta de componentes del proyecto.

## Objetivo

Mantener los componentes reutilizables, puros y fáciles de probar, evitando que acumulen lógica de negocio innecesaria.

---

## Reglas obligatorias

### C-M1 — No hacer llamadas HTTP directas
Los componentes no deben importar Axios ni realizar peticiones directamente al backend. Deben recibir datos por props y delegar la lógica a las vistas o servicios.

### C-M2 — Sin acceso directo a stores de Pinia
Los componentes de UI puros no deberían consultar stores directamente. Deben recibir datos por props o eventos.

### C-M3 — Declarar props y emits explícitamente
Todo componente debe definir claramente sus props y emits.

```vue
<script setup>
defineProps({
  title: { type: String, required: true },
  isLoading: { type: Boolean, default: false }
})

defineEmits(['confirm', 'cancel'])
</script>
```

---

## Recomendaciones

### C-S1 — Un componente, una responsabilidad
Cada componente debe enfocarse en una sola unidad visual o funcional.

### C-S2 — Nombres descriptivos
Los nombres deben ser claros y expresar la tarea del componente, por ejemplo `ReservationCard` o `MachineForm`.

### C-S3 — Mantener el template simple
La lógica compleja debe moverse a funciones o computed, dejando el template declarativo y fácil de leer.
