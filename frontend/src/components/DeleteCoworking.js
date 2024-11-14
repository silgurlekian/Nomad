import React, { useState } from 'react';
import axios from 'axios';

const DeleteCoworking = ({ coworkingId, onCoworkingDeleted }) => {
    const [error, setError] = useState(null);

    const handleDelete = async () => {
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

            await axios.delete(`http://localhost:3000/api/coworkings/${coworkingId}`, config);
            onCoworkingDeleted(coworkingId);
        } catch (error) {
            setError('Error al eliminar el coworking: ' + error.message);
        }
    };

    return (
        <div>
            {error && <div className="alert alert-danger">{error}</div>}
            <button className="btn btn-danger" onClick={handleDelete}>Eliminar</button>
        </div>
    );
};

export default DeleteCoworking;
