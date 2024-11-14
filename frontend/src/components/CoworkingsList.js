import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CoworkingsList = () => {
    const [coworkings, setCoworkings] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCoworkings = async () => {
            try {
                // Obtener el token de localStorage o sessionStorage
                const token = localStorage.getItem('token'); // O usa sessionStorage si prefieres

                if (!token) {
                    setError("No se encontró el token de autenticación.");
                    return;
                }

                // Configuración de encabezado con el token
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`, // Incluye el token en el encabezado
                    },
                };

                // Realizar la solicitud a la API con los encabezados
                const response = await axios.get('http://localhost:3000/api/coworkings', config);

                setCoworkings(response.data);
            } catch (error) {
                setError("Error al obtener los coworkings: " + error.message);
                console.error(error);
            }
        };

        fetchCoworkings();
    }, []);

    return (
        <div>
            <h2>Lista de Coworkings</h2>
            {error && <p>{error}</p>}
            <table className="table">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Dirección</th>
                        <th>Ciudad</th>
                        <th>Servicios</th>
                    </tr>
                </thead>
                <tbody>
                    {coworkings.map((coworking) => (
                        <tr key={coworking._id}>
                            <td>{coworking.nombre}</td>
                            <td>{coworking.direccion}</td>
                            <td>{coworking.ciudad}</td>
                            <td>{coworking.servicios.join(', ')}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CoworkingsList;
