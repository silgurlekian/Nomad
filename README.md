# API de Coworkings Nomad

## Descripción

Esta API RESTful permite centralizar y gestionar todos los espacios de coworking y cafeterías de una ciudad. Incluye funcionalidades de autenticación, CRUD completo para los espacios de coworking y cafeterías, filtrado, ordenamiento y paginado.

## Tecnologías Utilizadas

- **Node.js**
- **Express**
- **MongoDB** con **Mongo Compass**
- **JSON Web Tokens (JWT)**
- **Postman** para pruebas

## Instalación

Repositorio: https://github.com/silgurlekian/Nomad.git

## Endpoints

### Autenticación

| **Método** | **Endpoint**             | **Descripción**                |
|------------|--------------------------|--------------------------------|
| POST       | `/api/auth/register`     | Registrar un nuevo usuario     |
| POST       | `/api/auth/login`        | Iniciar sesión                 |

### Coworkings

| **Método** | **Endpoint**                                               | **Descripción**                                   |
|------------|------------------------------------------------------------|---------------------------------------------------|
| GET        | `/api/coworkings`                                          | Obtener todos los coworkings                      |
| GET        | `/api/coworkings/:id`                                      | Obtener un coworking por ID                        |
| GET        | `/api/coworkings?ciudad=CABA`                              | Filtrar coworkings por ciudad                      |
| GET        | `/api/coworkings?nombre=Central`                            | Filtrar coworkings por nombre                      |
| GET        | `/api/coworkings?ordenarPor=nombre&orden=desc`              | Ordenar coworkings por nombre en orden descendente  |
| POST       | `/api/coworkings`                                          | Crear un nuevo coworking                            |
| PUT        | `/api/coworkings/:id`                                      | Actualizar un coworking                             |
| DELETE     | `/api/coworkings/:id`                                      | Eliminar un coworking                               |

### Cafeterías

| **Método** | **Endpoint**                                               | **Descripción**                                   |
|------------|------------------------------------------------------------|---------------------------------------------------|
| GET        | `/api/cafeterias`                                          | Obtener todas las cafeterías                      |
| GET        | `/api/cafeterias/:id`                                      | Obtener una cafetería por ID                      |
| POST       | `/api/cafeterias`                                          | Crear una nueva cafetería                          |
| PUT        | `/api/cafeterias/:id`                                      | Actualizar una cafetería                           |
| DELETE     | `/api/cafeterias/:id`                                      | Eliminar una cafetería                             |

### Usuarios

| **Método** | **Endpoint**                     | **Descripción**                                   |
|------------|----------------------------------|---------------------------------------------------|
| PUT        | `/api/usuarios/cambiar-password` | Cambiar la contraseña de un usuario autenticado    |

**Nota:** Todos los endpoints relacionados con los **coworkings**, **cafeterías** y **usuarios** están protegidos y requieren autenticación mediante un **Token JWT**. 

## Pruebas con Postman

A continuación, se describen los pasos básicos para realizar las pruebas:

1. **Registrar un nuevo usuario**

    - **Método:** POST
    - **URL:** `http://localhost:3000/api/auth/register`

        ```json
        {
            "nombre": "Juan Pérez",
            "email": "juan.perez@mail.com",
            "password": "password123"
        }
        ```

2. **Iniciar sesión**

    - **Método:** POST
    - **URL:** `http://localhost:3000/api/auth/login`

        ```json
        {
            "email": "juan.perez@example.com",
            "password": "password123"
        }
        ```

    - **Respuesta esperada:** Un objeto con el **Token JWT** que se utilizará para autenticar las siguientes solicitudes.

3. **Obtener todos los Coworkings**

    - **Método:** GET
    - **URL:** `http://localhost:3000/api/coworkings`

4. **Obtener todas las Cafeterías**

    - **Método:** GET
    - **URL:** `http://localhost:3000/api/cafeterias`

5. **Filtrar Coworkings por ciudad**

    - **Método:** GET
    - **URL:** `http://localhost:3000/api/coworkings?ciudad=CABA`

6. **Filtrar Coworkings por nombre**

    - **Método:** GET
    - **URL:** `http://localhost:3000/api/coworkings?nombre=Central`

7. **Ordenar Coworkings por nombre descendente**

    - **Método:** GET
    - **URL:** `http://localhost:3000/api/coworkings?ordenarPor=nombre&orden=desc`

8. **Crear un nuevo Coworking**

    - **Método:** POST
    - **URL:** `http://localhost:3000/api/coworkings`

        ```json
        {
            "nombre": "Coworking Central",
            "direccion": "Calle Falsa 123",
            "ciudad": "Ciudad Ejemplo",
            "telefono": "123456789",
            "email": "contacto@coworkingcentral.com",
            "website": "https://coworkingcentral.com",
            "descripcion": "Espacio de coworking en el centro de la ciudad.",
            "servicios": ["WiFi", "Café", "Salas de reunión"]
        }
        ```

9. **Crear una nueva Cafetería**

    - **Método:** POST
    - **URL:** `http://localhost:3000/api/cafeterias`

        ```json
        {
            "nombre": "Cafetería Ejemplo",
            "direccion": "Calle Falsa 456",
            "ciudad": "Ciudad Ejemplo",
            "telefono": "987654321",
            "email": "contacto@cafeteriaejemplo.com",
            "website": "https://cafeteriaejemplo.com",
            "descripcion": "Una cafetería acogedora.",
            "servicios": ["WiFi", "Pasteles", "Café"],
            "horarioApertura": "08:00",
            "horarioCierre": "20:00"
        }
        ```

10. **Actualizar un Coworking**

    - **Método:** PUT
    - **URL:** `http://localhost:3000/api/coworkings/<id>`

        ```json
        {
            "telefono": "987654321",
            "servicios": ["WiFi", "Café", "Salas de reunión", "Impresoras"]
        }
        ```

11. **Actualizar una Cafetería**

    - **Método:** PUT
    - **URL:** `http://localhost:3000/api/cafeterias/<id>`

        ```json
        {
            "telefono": "321654987",
            "servicios": ["WiFi", "Café", "Pasteles", "Libros"]
        }
        ```

12. **Eliminar un Coworking**

    - **Método:** DELETE
    - **URL:** `http://localhost:3000/api/coworkings/<id>`

13. **Eliminar una Cafetería**

    - **Método:** DELETE
    - **URL:** `http://localhost:3000/api/cafeterias/<id>`

## Autor

- **Silvana Gurlekian**
- **Aplicaciones Híbridas**
- **Camila Belén Marcos Galban**
- **[DWN4AV]**
