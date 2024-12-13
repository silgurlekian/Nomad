import React, { useState } from 'react';
import axios from 'axios';

const DeleteSpace = ({ spaceId, onSpaceDeleted }) => {
    const [error, setError] = useState(null);

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Debes estar logueado para visualizar el portal.');
                return;
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            await axios.delete(`https://nomad-739samscb-silgurlekians-projects.vercel.app/api/spaces/${spaceId}`, config);
            onSpaceDeleted(spaceId);
        } catch (error) {
            setError('Error al eliminar el espacio: ' + error.message);
        }
    };

    return (
        <div>
            {error && <div className="alert alert-danger">{error}</div>}
            <button className="btn btn-danger" onClick={handleDelete}>Eliminar</button>
        </div>
    );
};

export default DeleteSpace;
