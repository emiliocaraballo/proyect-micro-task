# Bienvenido al MicroTask Manager

## Descripción
Desarrolla un sistema de gestión de tareas llamado "MicroTask Manager" utilizando NestJS y
adoptando una arquitectura de microservicios. El sistema debe permitir a los usuarios crear,
actualizar, asignar y visualizar tareas en un entorno colaborativo distribuido.


# Installation

## Configuración del Entorno de Desarrollo

Este documento explica cómo configurar un entorno de desarrollo para el proyecto. Para ello, se utilizará Docker y Visual Studio Code para crear y gestionar las imágenes de Docker.

## **Requisitos previos**

Antes de comenzar, asegúrate de tener instalado:

1. [Docker](https://www.docker.com/)  
2. [Visual Studio Code](https://code.visualstudio.com/)  

---
### Configurar Base de datos y ejecutación del proyecto.
```bash

# Ubicación del archivo docker-compose.yml
$ cd /raiz/del/proyecto
# ejecución de la aplicación
$ docker compose up -d
# debe haber instalado previamente docker y docker-compose en
# tu ordenador, para que funcione correctamente, si todo está correcto

# ya puede acceder a la aplicación en http://localhost:81
```

## Endpoints

```bash
# the default paths of the project are:

url: http://localhost:81

# Users

# registrar usuario
$ /api/service-users/v1/user/register              # POST

# login
$ /api/service-users/v1/auth/login                # POST

# refrescar token
$ /api/service-users/v1/auth/refresh              # POST

# obtener usuario actual
$ /api/service-users/v1/user/me                   # GET

# actualizar usuario
$ /api/service-users/v1/user/update/{id}          # PUT

# Tasks

# crear tarea
$ /api/service-tasks/v1/tasks/create              # POST

# obtener tareas
$ /api/service-tasks/v1/tasks/all                 # GET

# obtener tareas del equipo
$ /api/service-tasks/v1/tasks/team/{teamId}/all   # GET

# obtener tareas del usuario
$ /api/service-tasks/v1/tasks/user/{userId}/all   # GET

# detalle de tarea
$ /api/service-tasks/v1/tasks/{id}                # GET

# eliminar tarea
$ /api/service-tasks/v1/tasks/{id}                # DELETE

# actualizar tarea
$ /api/service-tasks/v1/tasks/{id}/status         # PATCH

# asignar tarea
$ /api/service-tasks/v1/tasks/{id}/assign         # PATCH

# actualizar tarea
$ /api/service-tasks/v1/tasks/update/{id}         # PUT

# Teams

# crear equipo
$ /api/service-teams/v1/teams/create              # POST

# actualizar equipo
$ /api/service-teams/v1/teams/update/{id}         # PUT

# agregar miembro a equipo
$ /api/service-teams/v1/teams/{id}/members        # POST

# obtener listado de equipos
$ /api/service-teams/v1/teams/all                 # GET


# Collecion de postman
url: https://api.postman.com/collections/5551641-fa8c8d8e-6069-46ac-b96b-6bfe458b999d?access_key=PMAT-01JHMYH33KT1CDNXSK57X3X7G1
Aqui puedes encontrar todas las colecciones de postman que he creado para este proyecto.
Donde tiene la información de la API REST.

Nota: estoy exponiendo el access_key=PMAT-01JHMYH33KT1CDNXSK57X3X7G1. Esto es para que puedas probar la API REST. 

Documentación en Swagger 
$ http://localhost:81/api/service-users/v1/docs#/
$ http://localhost:81/api/service-tasks/v1/docs#/
$ http://localhost:81/api/service-teams/v1/docs#/

```

## Test

```bash
# unit tests
$ npm run test

Resultados de los tests:

> jest

 PASS  test/modules/auth/auth.controller.spec.ts
 PASS  test/modules/user/user.controller.spec.ts

Test Suites: 2 passed, 2 total
Tests:       10 passed, 10 total
Snapshots:   0 total
Time:        2.452 s, estimated 3 s
Ran all test suites.