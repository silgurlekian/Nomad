# **nomad**

nomad es una aplicación web para gestionar y descubrir espacios de trabajo. Permite a los usuarios buscar, crear, editar y eliminar espacios de coworking, así como administrar los servicios que ofrecen. La aplicación utiliza **React** para el frontend y **Node.js** con **MongoDB** para el backend.

## **Tabla de Contenidos**

1. [Características](#características)
2. [Tecnologías utilizadas](#tecnologías-utilizadas)
3. [Instalación](#instalación)

## **Características**

- **Autenticación de usuarios**: Los usuarios deben estar autenticados para poder ver los detalles completos de los espacios y realizar acciones.
- **CRUD de coworking**: Los administradores pueden crear, leer, actualizar y eliminar espacios de coworking.
- **Gestión de servicios**: Los usuarios pueden ver los servicios disponibles en cada espacio de coworking, y los administradores pueden añadir nuevos servicios.
- **Interfaz de usuario intuitiva**: UI/UX amigable para la gestión de coworkings.

## **Tecnologías utilizadas**

- **Frontend**:
  - React.js
  - React Router (para la navegación)
  - Axios (para las peticiones HTTP)
  - Bootstrap (para el diseño responsivo)
  - React Hooks (useState, useEffect)

- **Backend**:
  - Node.js
  - Express.js
  - MongoDB (con Mongoose)
  - JWT (para la autenticación)
  - Bcrypt.js (para el cifrado de contraseñas)

- **Otras herramientas**:
  - MongoDB (para la base de datos)

## **Instalación**

### **Archivo .env**

PORT=3000
MONGODB_URI=mongodb://localhost:27017/coworkingDB
JWT_SECRET=189bfeab1db5b4e530f27ef4f47833a56df17ee5af7b00035a51e0e2bf7d737832053416ceefc64d33d9e1a0a16cd9b9277ad686932304e3ee35cf882b69b6e2379a52b8caeebc251e8f413e20ab575c265a19eb2536fc479d29eca902e482548d59fef210a85eedca92d2ab2dd9ce7f11602c7708c1797b8c5edd983cc05282e7d0dd2910e3a0dcf83a7c51bd04a68bb962eedca1716a3703c75644dffecc1b89d2b537dfee25522a47ff523333a7cf42e151db080f7bc3983271015a99359c3874a38468273661c51ab3e1f6f7a2eb23da4c32ff1aad6813aae4e18cce871e100c95e0d1a0ae3dc496ad66be9d79b6cf71c5bb2f3ba6fca7ef797fc19da466

### **Clonar el repositorio**

```bash
git clone https://github.com/silgurlekian/nomad.git

