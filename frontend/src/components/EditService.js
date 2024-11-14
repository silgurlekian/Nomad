import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditService = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [nombre, setNombre] = useState('');
    const [error, setError] = useState(null);
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        const fetchService = async () => {
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

                const response = await axios.get(`http://localhost:3000/api/services/${id}`, config);
                const { nombre } = response.data;
                setNombre(nombre);
            } catch (error) {
                setError('Error al obtener los datos del servicio: ' + error.message);
            }
        };

        fetchService();
    }, [id]);

    // Validar los campos
    const validateForm = () => {
        const errors = {};
        if (!nombre) errors.nombre = 'El nombre es obligatorio.';

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const errors = validateForm();
        setFormErrors(errors);

        if (Object.keys(errors).length > 0) return;

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

            const updatedService = {
                nombre,
            };

            await axios.put(`http://localhost:3000/api/services/${id}`, updatedService, config);
            navigate('/ServiceList');
        } catch (error) {
            setError('Error al actualizar el servicio: ' + error.message);
        }
    };

    return (
        <div className="container mt-4">
            <h2>Editar Servicio</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="nombre" className="form-label">Nombre</label>
                    <input
                        type="text"
                        id="nombre"
                        className={`form-control ${formErrors.nombre ? 'is-invalid' : ''}`}
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                    />
                    {formErrors.nombre && <div className="invalid-feedback">{formErrors.nombre}</div>}
                </div>
                <button type="submit" className="btn btn-primary">Guardar cambios</button>
            </form>
        </div>
    );
};

export default EditService;
