import React, { useEffect, useState } from 'react';
import axios from 'axios';

const EditCoworking = ({ coworkingId, onCoworkingUpdated }) => {
    const [nombre, setNombre] = useState('');
    const [direccion, setDireccion] = useState('');
    const [ciudad, setCiudad] = useState('');
    const [servicios, setServicios] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCoworking = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('No se encontró el token de autenticación');
                    return;
                }

                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };

                const response = await axios.get(`http://localhost:3000/api/coworkings/${coworkingId}`, config);
                const { nombre, direccion, ciudad, servicios } = response.data;
                setNombre(nombre);
                setDireccion(direccion);
                setCiudad(ciudad);
                setServicios(servicios.join(', '));
            } catch (error) {
                setError('Error al obtener los datos del coworking: ' + error.message);
            }
        };

        fetchCoworking();
    }, [coworkingId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('No se encontró el token de autenticación');
                return;
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const updatedCoworking = {
                nombre,
                direccion,
                ciudad,
                servicios: servicios.split(',').map(service => service.trim()),
            };

            const response = await axios.put(`http://localhost:3000/api/coworkings/${coworkingId}`, updatedCoworking, config);
            onCoworkingUpdated(response.data);
        } catch (error) {
            setError('Error al actualizar el coworking: ' + error.message);
        }
    };

    return (
        <div className="container mt-4">
            <h2>Editar Coworking</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="nombre" className="form-label">Nombre</label>
                    <input
                        type="text"
                        id="nombre"
                        className="form-control"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="direccion" className="form-label">Dirección</label>
                    <input
                        type="text"
                        id="direccion"
                        className="form-control"
                        value={direccion}
                        onChange={(e) => setDireccion(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="ciudad" className="form-label">Ciudad</label>
                    <input
                        type="text"
                        id="ciudad"
                        className="form-control"
                        value={ciudad}
                        onChange={(e) => setCiudad(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="servicios" className="form-label">Servicios</label>
                    <input
                        type="text"
                        id="servicios"
                        className="form-control"
                        value={servicios}
                        onChange={(e) => setServicios(e.target.value)}
                        placeholder="Ejemplo: Internet, Impresoras"
                    />
                </div>
                <button type="submit" className="btn btn-primary">Actualizar</button>
            </form>
        </div>
    );
};

export default EditCoworking;
