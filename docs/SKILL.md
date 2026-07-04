# Documentación del frontend del sistema de reservas del gimnasio UNAL

## Introducción

Este documento describe el trabajo realizado en el frontend del sistema de reservas de máquinas del gimnasio de la Universidad Nacional de Colombia, sede Bogotá. El proyecto fue reconstruido con Vue 3 y Vite, con una estructura modular pensada para facilitar el desarrollo, el mantenimiento y la integración futura con un backend real.

El frontend fue desarrollado en una rama independiente para evitar afectar la rama principal del repositorio mientras se definían las bases del sistema.

---

## Objetivo del proyecto

El objetivo principal fue construir una interfaz funcional, organizada y visualmente coherente para el sistema de reservas, permitiendo probar los flujos principales del negocio aunque el backend aún no estuviera completamente implementado.

### Objetivos específicos

- Reconstruir el frontend desde cero con Vue y Vite.
- Organizar el proyecto con una arquitectura por capas.
- Implementar las pantallas principales del sistema.
- Preparar la app para integrarse con servicios reales en el futuro.
- Utilizar datos simulados mientras se terminan los endpoints del backend.
- Documentar la estructura y las decisiones técnicas del desarrollo.

---

## Alcance del frontend

La interfaz desarrollada permite cubrir los principales procesos del sistema, tanto para estudiantes como para administradores.

### Funcionalidades para estudiantes

- Inicio de sesión.
- Registro de usuario.
- Visualización del panel principal.
- Consulta y gestión de reservas.
- Exploración de máquinas disponibles.
- Realización de check-in.
- Consulta del perfil del usuario.

### Funcionalidades para administradores

- Gestión de máquinas.
- Gestión de usuarios.
- Consulta y control de reservas.
- Visualización de estadísticas y reportes administrativos.
- Navegación por un panel especializado del administrador.

---

## Tecnologías utilizadas

El proyecto fue desarrollado con las siguientes tecnologías:

- Vue.js 3: framework principal para la interfaz.
- Vite: herramienta de desarrollo y compilación.
- Vue Router: manejo de rutas y navegación.
- Pinia: gestión del estado global.
- Axios: cliente HTTP preparado para futuras integraciones con backend.
- Font Awesome: iconografía de la interfaz.
- CSS y componentes reutilizables para la experiencia visual.

---

## Estructura del proyecto

La organización del proyecto se realizó de forma modular para separar responsabilidades y facilitar el mantenimiento.

```text
src/
├── components/
├── layouts/
├── mocks/
├── router/
├── services/
├── stores/
├── styles/
├── views/
└── App.vue
```

### Descripción de las carpetas principales

- components: componentes reutilizables como formularios, tarjetas, botones y otros elementos de interfaz.
- layouts: estructuras visuales por tipo de usuario, como autenticación, estudiante y administrador.
- mocks: datos simulados para probar el flujo completo de la aplicación.
- router: configuración de rutas y protección de acceso por roles.
- services: servicios preparados para conectar el frontend con una API real.
- stores: estado global de la aplicación mediante Pinia.
- views: pantallas principales del sistema.

---

## Navegación y rutas

El sistema implementa rutas públicas y rutas protegidas, diferenciadas según el tipo de usuario.

### Rutas públicas

- Inicio.
- Inicio de sesión.
- Registro.

### Rutas de estudiante

- Dashboard.
- Perfil.
- Reservas.
- Máquinas.
- Check-in.
- Acerca de.

### Rutas de administrador

- Panel administrativo.
- Gestión de máquinas.
- Gestión de usuarios.
- Gestión de reservas.
- Estadísticas.

La navegación está organizada de forma que las rutas del estudiante y del administrador se cargan dentro de sus respectivos layouts, mejorando la experiencia visual y la estructura del proyecto.

---

## Diseño de arquitectura

El frontend se organizó en capas con el fin de separar responsabilidades y facilitar la futura integración con el backend.

### Capa de vistas

Contiene las pantallas principales del sistema. Cada vista representa una funcionalidad o un módulo completo del producto.

### Capa de componentes

Agrupa elementos reutilizables para evitar duplicación de código y mantener consistencia visual.

### Capa de servicios

Se diseñó para encapsular la lógica de comunicación con el backend. En esta fase se encuentra preparada, pero todavía se usa de forma limitada mientras no exista una API completa.

### Capa de mocks

Permite simular datos y probar el comportamiento de la interfaz sin depender de la API real. Esto fue clave para avanzar el frontend mientras el backend estaba en desarrollo.

### Capa de estado

Se implementó una base para manejar información global del usuario, autenticación y estados de la aplicación mediante Pinia.

---

## Estado actual del proyecto

Actualmente el frontend ya cuenta con:

- una estructura base sólida,
- navegación funcional,
- vistas principales implementadas,
- formularios y componentes reutilizables,
- gestión visual de reservas y máquinas,
- lógica de acceso por roles,
- datos simulados para probar el sistema.

El proyecto está listo para continuar creciendo y conectarse con un backend real en una siguiente etapa.

---

## Instalación y ejecución

Para correr el proyecto localmente, se deben seguir estos pasos:

```bash
git clone https://github.com/No-pain-No-main/project-frontend.git
cd project-frontend
npm install
npm run dev
```

También es posible compilar la aplicación para producción con:

```bash
npm run build
```

Y previsualizar el build generado con:

```bash
npm run preview
```

---

## Consideraciones técnicas importantes

### Uso de datos simulados

Se optó por trabajar con mocks porque el backend todavía no tenía los endpoints necesarios. Esto permitió avanzar en la experiencia de usuario y verificar el flujo del sistema sin bloquearse por la integración.

### Preparación para backend real

El proyecto fue construido pensando en una transición sencilla hacia una arquitectura conectada a una API. La separación por servicios, rutas y componentes facilita ese cambio.

### Escalabilidad

La estructura actual permite agregar nuevas pantallas, módulos y reglas de negocio sin afectar demasiado la base del sistema.

---

## Trabajo pendiente

Aún quedan varias mejoras y tareas para completar, entre ellas:

- conectar el frontend con los endpoints reales del backend,
- implementar autenticación real,
- persistir reservas y cambios de estado en base de datos,
- integrar reportes reales,
- mejorar la validación de formularios,
- ampliar la cobertura de pruebas y la calidad del código.

---

## Conclusión

El frontend del sistema de reservas del gimnasio fue reconstruido con una arquitectura organizada, moderna y escalable. La aplicación ya cuenta con una base sólida para la interacción del usuario, con vistas claras para estudiantes y administradores, además de una estructura preparada para integrarse con un backend real en una siguiente fase del proyecto.

Este avance representa una base confiable para continuar desarrollando el sistema de forma más completa y profesional.
