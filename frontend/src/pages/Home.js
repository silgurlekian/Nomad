import React from 'react';
import './Home.css';

const Home = () => {
    return (
        <div className="home-container">
            <h1>Bienvenido a la API de Coworking</h1>
            <p>Esta API centraliza todos los coworkings y espacios de trabajo de la ciudad.</p>
            <h2>Endpoints Disponibles</h2>
            <ul>
                <li><a href="/api/auth/register">POST /api/auth/register</a> - Registrar usuario</li>
                <li><a href="/api/auth/login">POST /api/auth/login</a> - Iniciar sesión</li>
                <li><a href="/api/spaces">GET /api/spaces</a> - Obtener todos los espacios</li>
                <li><a href="/api/spaces/:id">GET /api/spaces/:id</a> - Obtener espacio por ID</li>
                <li><a href="/api/spaces">POST /api/spaces</a> - Crear espacio</li>
                <li><a href="/api/spaces/:id">PUT /api/spaces/:id</a> - Actualizar espacio</li>
                <li><a href="/api/spaces/:id">DELETE /api/spaces/:id</a> - Eliminar espacio</li>
            </ul>
            <footer>
                <p>Nombre Apellido</p>
                <p>Nombre de la materia</p>
                <p>Nombre del docente</p>
                <p>Comisión</p>
            </footer>
        </div>
    );
}

export default Home;
