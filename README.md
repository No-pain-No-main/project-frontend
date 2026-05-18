# No Pain No Main - Frontend

Frontend del sistema de gestión y reserva de máquinas del gimnasio de la Universidad Nacional de Colombia, sede Bogotá.

El proyecto fue desarrollado con Vue.js y Vite, siguiendo una arquitectura por capas para mantener el código organizado, fácil de entender y preparado para conectarse posteriormente con el backend.

---

## Descripción general

El sistema contempla dos tipos principales de usuario:

### Estudiante

- Iniciar sesión.
- Registrarse.
- Reservar máquinas.
- Consultar sus reservas activas.
- Cancelar reservas.

### Administrador

- Registrar máquinas.
- Modificar estados de máquinas.
- Consultar historial de reservas.
- Generar reportes administrativos.

Actualmente el frontend funciona con datos simulados, ya que el backend todavía no tiene implementados los endpoints necesarios. Estos datos simulados se encuentran en la carpeta `mocks`.

---

## Tecnologías utilizadas

- Vue.js: framework principal para construir la interfaz.
- Vite: herramienta para crear y ejecutar el proyecto frontend.
- Vue Router: manejo de rutas y navegación.
- Pinia: preparado para manejar estado global.
- Axios: preparado para futuras peticiones HTTP al backend.
- Git y GitHub: control de versiones y trabajo por ramas.

---

## Instalación y ejecución

Clonar el repositorio:

```bash
git clone https://github.com/No-pain-No-main/project-frontend.git