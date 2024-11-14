import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditCoworking = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [nombre, setNombre] = useState('');
    const [direccion, setDireccion] = useState('');
    const [ciudad, setCiudad] = useState('');
    const [servicios, setServicios] = useState('');
    const [error, setError] = useState(null);
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        const fetchCoworking = async () => {
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

                const response = await axios.get(`http://localhost:3000/api/coworkings/${id}`, config);
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
    }, [id]);

    // Validar los campos
    const validateForm = () => {
        const errors = {};
        if (!nombre) errors.nombre = 'El nombre es obligatorio.';
        if (!direccion) errors.direccion = 'La dirección es obligatoria.';
        if (!ciudad) errors.ciudad = 'La ciudad es obligatoria.';
        if (!servicios) errors.servicios = 'Los servicios son obligatorios.';

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

            const updatedCoworking = {
                nombre,
                direccion,
                ciudad,
                servicios: servicios.split(',').map(service => service.trim()),
            };

            await axios.put(`http://localhost:3000/api/coworkings/${id}`, updatedCoworking, config);
            navigate('/CoworkingsList');
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
                    <label htmlFor="servicios" className="form-label">Servicios</label>
                    <input
                        type="text"
                        id="servicios"
                        className={`form-control ${formErrors.servicios ? 'is-invalid' : ''}`}
                        value={servicios}
                        onChange={(e) => setServicios(e.target.value)}
                        placeholder="Ejemplo: Internet, Impresoras"
                    />
                    {formErrors.servicios && <div className="invalid-feedback">{formErrors.servicios}</div>}
                </div>
                <button type="submit" className="btn btn-primary">Guardar cambios</button>
            </form>
        </div>
    );
};

export default EditCoworking;
