# No Pain No Main - Frontend

Frontend del sistema de gestión y reserva de máquinas del gimnasio de la Universidad Nacional de Colombia, sede Bogotá.

Este proyecto fue desarrollado con Vue 3 y Vite para ofrecer una experiencia de usuario moderna, organizada y preparada para crecer hacia una integración con un backend real.

---

## Descripción general

La aplicación permite gestionar reservas de máquinas en un entorno académico o institucional, con dos tipos de usuarios principales:

### Estudiante

- Iniciar sesión y registrarse.
- Ver el panel principal con información relevante.
- Consultar y gestionar sus reservas.
- Explorar las máquinas disponibles.
- Realizar check-in de una reserva.
- Ver su perfil y estado de cuenta.

### Administrador

- Administrar máquinas.
- Gestionar usuarios.
- Revisar y controlar reservas.
- Consultar estadísticas y reportes administrativos.
- Navegar por un panel especializado para la gestión del sistema.

Actualmente la interfaz funciona con datos simulados, lo que permite probar el flujo completo de la aplicación antes de conectar el backend.

---

## Funcionalidades principales

- Landing page pública con información del proyecto.
- Autenticación con vistas diferenciadas para invitados, estudiantes y administradores.
- Rutas protegidas según el rol del usuario.
- Diseño modular con componentes reutilizables.
- Gestión de reservas y estado de máquinas.
- Vistas administrativas para administración completa del sistema.
- Preparado para integrar servicios HTTP mediante Axios y un cliente API centralizado.

---

## Tecnologías utilizadas

- Vue.js 3: framework principal para construir la interfaz.
- Vite: herramienta de desarrollo y build.
- Vue Router: manejo de rutas y navegación.
- Pinia: gestión del estado global de la aplicación.
- Axios: cliente HTTP preparado para futuras integraciones con backend.
- Font Awesome: iconografía para la interfaz.
- CSS personalizado y componentes UI reutilizables.

---

## Estructura del proyecto

- src/views: vistas principales de la aplicación.
- src/components: componentes reutilizables y secciones específicas.
- src/layouts: layouts por tipo de usuario.
- src/router: configuración de rutas y protección por rol.
- src/stores: estado global con Pinia.
- src/services: servicios para comunicación con APIs.
- src/mocks: datos simulados para desarrollo y pruebas.
- src/styles: estilos globales del proyecto.

---

## Instalación y ejecución

Clona el repositorio:

```bash
git clone https://github.com/No-pain-No-main/project-frontend.git
cd project-frontend
```

Instala las dependencias:

```bash
npm install
```

Ejecuta el proyecto en modo desarrollo:

```bash
npm run dev
```

Construye la aplicación para producción:

```bash
npm run build
```

Previsualiza el build generado:

```bash
npm run preview
```

> Se recomienda usar una versión reciente de Node, ya que el proyecto define soporte para Node 22+.

---

## Estado actual del proyecto

El frontend ya cuenta con la estructura completa de la interfaz, navegación por roles, vistas de estudiante y administrador, y flujo de reservas listo para ser conectado con un backend real.

La información que se muestra actualmente proviene de datos simulados, pero el proyecto está preparado para evolucionar hacia una arquitectura más completa con API y persistencia real.

---

## Créditos

Proyecto desarrollado para el curso de Ingeniería de Software I, con enfoque en arquitectura frontend, experiencia de usuario y organización del código.