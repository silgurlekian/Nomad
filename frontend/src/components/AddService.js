import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddService = () => {
    const [name, setName] = useState(''); 
    const [error, setError] = useState(null);
    const [formErrors, setFormErrors] = useState({});
    const navigate = useNavigate();

    // Validar los campos
    const validateForm = () => {
        const errors = {};
        if (!name) errors.name = 'El nombre es obligatorio.';

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

            const newService = {
                name,
            };

            await axios.post('http://localhost:3000/api/services', newService, config); 

            navigate('/ServiceList'); 
        } catch (error) {
            setError('Error al agregar el servicio: ' + error.message);
        }
    };

    return (
        <div className="container mt-4">
            <h2>Agregar Servicio</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Nombre</label>
                    <input
                        type="text"
                        id="name"
                        className={`form-control ${formErrors.name ? 'is-invalid' : ''}`}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    {formErrors.name && <div className="invalid-feedback">{formErrors.name}</div>}
                </div>
                <button type="submit" className="btn btn-primary">Agregar</button>
            </form>
        </div>
    );
};

export default AddService;
