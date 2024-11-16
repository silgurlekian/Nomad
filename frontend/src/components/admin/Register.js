import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../services/AuthService';

const Register = () => {
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const [nombreError, setNombreError] = useState(null);
    const [emailError, setEmailError] = useState(null);
    const [passwordError, setPasswordError] = useState(null);

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        // Resetear errores
        setNombreError(null);
        setEmailError(null);
        setPasswordError(null);
        setError(null);
        setSuccessMessage(null);

        // Validación personalizada
        let formIsValid = true;

        if (!nombre.trim()) {
            setNombreError('El nombre es obligatorio.');
            formIsValid = false;
        }

        if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
            setEmailError('Por favor, ingresa un email válido.');
            formIsValid = false;
        }

        if (!password || password.length < 6) {
            setPasswordError('La contraseña debe tener al menos 6 caracteres.');
            formIsValid = false;
        }

        if (!formIsValid) return;

        try {
            const data = await registerUser({ nombre, email, password });
            console.log('Registro exitoso', data);
            setSuccessMessage('¡Registro exitoso! Ya puedes iniciar sesión.');

            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="container">
            <h2 className="text-center my-4">Registro</h2>
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <form
                        onSubmit={handleRegister}
                        className="bg-light p-4 rounded shadow-sm"
                    >
                        <div className="mb-3">
                            <label htmlFor="nombre" className="form-label">
                                Nombre
                            </label>
                            <input
                                type="text"
                                id="nombre"
                                className={`form-control ${nombreError ? 'is-invalid' : ''}`}
                                placeholder="Nombre"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                            />
                            {nombreError && (
                                <div className="invalid-feedback">{nombreError}</div>
                            )}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                className={`form-control ${emailError ? 'is-invalid' : ''}`}
                                placeholder="Correo electrónico"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            {emailError && (
                                <div className="invalid-feedback">{emailError}</div>
                            )}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">
                                Contraseña
                            </label>
                            <input
                                type="password"
                                id="password"
                                className={`form-control ${passwordError ? 'is-invalid' : ''}`}
                                placeholder="Contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {passwordError && (
                                <div className="invalid-feedback">{passwordError}</div>
                            )}
                        </div>

                        <button type="submit" className="btn btn-primary w-100">
                            Registrarse
                        </button>
                    </form>

                    {/* Mensaje de éxito */}
                    {successMessage && (
                        <div className="alert alert-success mt-3" role="alert">
                            {successMessage}
                        </div>
                    )}

                    {/* Mensaje de error general */}
                    {error && (
                        <div className="alert alert-danger mt-3" role="alert">
                            {error}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Register;
