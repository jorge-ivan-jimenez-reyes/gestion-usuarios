# Gestión de Usuarios

Este proyecto consiste en una aplicación de gestión de usuarios con un backend en Node.js, un frontend en Angular, y un cliente Python para interactuar con la API.

## Estructura del Proyecto

- `Server/`: Contiene el backend de la aplicación (API Node.js)
- `Client/frontend/`: Contiene el frontend de la aplicación (Angular)
- `Client/`: Contiene un cliente Python para interactuar con la API

## Requisitos Previos

- Node.js (v14 o superior)
- npm (viene con Node.js)
- Python 3.9 o superior
- Docker y Docker Compose

## Configuración y Ejecución sin Docker

### Backend (API)

1. Navega al directorio del servidor:
   ```
   cd Server
   ```

2. Instala las dependencias:
   ```
   npm install
   ```

3. Inicia el servidor:
   ```
   npm start
   ```

El servidor estará disponible en `http://localhost:3000`.

### Frontend (Angular)

1. Navega al directorio del frontend:
   ```
   cd Client/frontend
   ```

2. Instala las dependencias:
   ```
   npm install
   ```

3. Inicia la aplicación Angular:
   ```
   ng serve
   ```

La aplicación estará disponible en `http://localhost:4200`.

### Cliente Python

1. Navega al directorio del cliente:
   ```
   cd Client
   ```

2. Instala las dependencias (asegúrate de tener pip instalado):
   ```
   pip install requests
   ```

3. Ejecuta el script:
   ```
   python api_interaction.py
   ```

## Ejecución con Docker

Para ejecutar todo el proyecto usando Docker:

1. Asegúrate de tener Docker y Docker Compose instalados en tu sistema.

2. Desde el directorio raíz del proyecto, ejecuta:
   ```
   docker-compose up --build
   ```

Esto construirá y iniciará todos los servicios definidos en `docker-compose.yml`:
- El servidor backend estará disponible en `http://localhost:3000`
- La aplicación frontend estará disponible en `http://localhost:4200`
- El cliente Python se ejecutará como un servicio
- La base de datos PostgreSQL se iniciará y estará disponible para el backend

Para detener todos los servicios, presiona `Ctrl+C` en la terminal donde ejecutaste `docker-compose up`, o ejecuta en otra terminal:
```
docker-compose down
```

## Desarrollo

- Para el desarrollo del backend, los cambios en los archivos del servidor se reflejarán automáticamente gracias a los volúmenes de Docker.
- Para el desarrollo del frontend, es recomendable ejecutar la aplicación Angular fuera de Docker para aprovechar la recarga en caliente.
- El cliente Python está principalmente para demostración y pruebas de la API.

## Notas Adicionales

- Asegúrate de que los puertos 3000, 4200 y 5432 estén disponibles en tu sistema cuando ejecutes la aplicación con Docker.
- Para cambios en la configuración de la base de datos, ajusta las variables de entorno en el archivo `docker-compose.yml`.
- Consulta los README individuales en los directorios `Server/`, `Client/frontend/`, y `Client/` para instrucciones más detalladas sobre cada componente.

Este repositorio contiene una aplicación completa (full stack) que integra Angular en el frontend y Node.js/Express en el backend, utilizando PostgreSQL como base de datos
