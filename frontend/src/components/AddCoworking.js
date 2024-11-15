import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddCoworking = () => {
    const [nombre, setNombre] = useState('');
    const [direccion, setDireccion] = useState('');
    const [ciudad, setCiudad] = useState('');
    const [selectedServices, setSelectedServices] = useState([]); // Servicios seleccionados por el usuario
    const [allServices, setAllServices] = useState([]); // Todos los Servicios disponibles
    const [error, setError] = useState(null);
    const [formErrors, setFormErrors] = useState({});
    const navigate = useNavigate();

    // Cargar los Servicios disponibles desde el backend
    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/services');
                setAllServices(response.data); // Guarda los Servicios disponibles
            } catch (error) {
                setError('Error al cargar los Servicios: ' + error.message);
            }
        };
        fetchServices();
    }, []);

    // Manejar la selección de los checkboxes
    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;
        setSelectedServices((prevSelected) =>
            checked ? [...prevSelected, value] : prevSelected.filter((id) => id !== value)
        );
    };

    // Validar los campos
    const validateForm = () => {
        const errors = {};
        if (!nombre) errors.nombre = 'El nombre es obligatorio.';
        if (!direccion) errors.direccion = 'La dirección es obligatoria.';
        if (!ciudad) errors.ciudad = 'La ciudad es obligatoria.';
        if (selectedServices.length === 0) errors.Services = 'Los Servicios son obligatorios.';

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validación de los campos
        const errors = validateForm();
        setFormErrors(errors);

        if (Object.keys(errors).length > 0) return;

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Debes estar logueado para realizar esta acción.');
                return;
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const newCoworking = {
                nombre,
                direccion,
                ciudad,
                servicios: selectedServices,
            };

            await axios.post('http://localhost:3000/api/coworkings', newCoworking, config);
            navigate('/CoworkingsList');
        } catch (error) {
            setError('Error al agregar el coworking: ' + error.message);
        }
    };

    return (
        <div className="container mt-4">
            <h2>Agregar Coworking</h2>
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
                <div className="mb-3">
                    <label htmlFor="direccion" className="form-label">Dirección</label>
                    <input
                        type="text"
                        id="direccion"
                        className={`form-control ${formErrors.direccion ? 'is-invalid' : ''}`}
                        value={direccion}
                        onChange={(e) => setDireccion(e.target.value)}
                    />
                    {formErrors.direccion && <div className="invalid-feedback">{formErrors.direccion}</div>}
                </div>
                <div className="mb-3">
                    <label htmlFor="ciudad" className="form-label">Ciudad</label>
                    <input
                        type="text"
                        id="ciudad"
                        className={`form-control ${formErrors.ciudad ? 'is-invalid' : ''}`}
                        value={ciudad}
                        onChange={(e) => setCiudad(e.target.value)}
                    />
                    {formErrors.ciudad && <div className="invalid-feedback">{formErrors.ciudad}</div>}
                </div>
                <div className="mb-3">
                    <label className="form-label">Servicios</label>
                    <div>
                        {allServices.map((service) => (
                            <div key={service._id}>
                                <input
                                    type="checkbox"
                                    id={service._id}
                                    value={service._id}
                                    checked={selectedServices.includes(service._id)}
                                    onChange={handleCheckboxChange}
                                />
                                <label htmlFor={service._id}>{service.name}</label>
                            </div>
                        ))}
                    </div>
                    {formErrors.Services && <div className="invalid-feedback">{formErrors.Services}</div>}
                </div>
                <button type="submit" className="btn btn-primary">Agregar</button>
            </form>
        </div>
    );
};

export default AddCoworking;
