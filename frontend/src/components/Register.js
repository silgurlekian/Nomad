import React, { useState } from 'react';
import { registerUser } from '../services/AuthService';
import '../styles/Register.css'; // Para cualquier estilo adicional si es necesario

const Register = () => {
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null); // Nuevo estado para el mensaje de éxito

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const data = await registerUser({ nombre, email, password });
            console.log('Registro exitoso', data);
            setSuccessMessage('¡Registro exitoso! Ya puedes iniciar sesión.'); // Mensaje de éxito
            setError(null); // Limpiar cualquier mensaje de error previo
        } catch (err) {
            setError(err.message);
            setSuccessMessage(null); // Limpiar el mensaje de éxito en caso de error
        }
    };

    return (
        <div className="container col-md-4 mt-5">
            <h2 className="text-center mb-4">Registro</h2>
            <form onSubmit={handleRegister}>
                <div className="mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Nombre"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="email"
                        className="form-control"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="password"
                        className="form-control"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit" className="btn btn-primary w-100">Registrarse</button>
            </form>

            {/* Mostrar mensaje de éxito */}
            {successMessage && <p className="text-success text-center mt-3">{successMessage}</p>}

            {/* Mostrar mensaje de error */}
            {error && <p className="text-danger text-center mt-3">{error}</p>}
        </div>
    );
};

export default Register;
