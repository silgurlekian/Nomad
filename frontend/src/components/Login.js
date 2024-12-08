import React, { useState } from "react";
import { loginUser } from "../services/AuthService";
import { useNavigate } from "react-router-dom"; // Para redirigir después del login
import "../App.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);

  const navigate = useNavigate(); // Hook para redirigir a otro componente

  const handleLogin = async (e) => {
    e.preventDefault();

    // Resetear errores
    setEmailError(null);
    setPasswordError(null);
    setError(null);
    setSuccessMessage(null);

    // Validación personalizada
    let formIsValid = true;

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setEmailError("Por favor, ingresa un email válido.");
      formIsValid = false;
    }

    if (!password || password.length < 6) {
      setPasswordError("La contraseña debe tener al menos 6 caracteres.");
      formIsValid = false;
    }

    // Si alguna validación falla, no envia el formulario
    if (!formIsValid) return;

    try {
      const data = await loginUser({ email, password });
      console.log("Inicio de sesión exitoso", data);

      // Guardar el token y los datos del usuario en localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data)); 

      setSuccessMessage("Inicio de sesión exitoso. Bienvenido!");

      // Redirigir a la página de espacios
      navigate("/SpacesList");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container bkg-container">
      <h2 className="text-center my-4">Iniciar Sesión</h2>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <form
            onSubmit={handleLogin}
            className="p-4"
          >
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                id="email"
                className={`form-control ${emailError ? "is-invalid" : ""}`}
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
                className={`form-control ${passwordError ? "is-invalid" : ""}`}
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {passwordError && (
                <div className="invalid-feedback">{passwordError}</div>
              )}
            </div>

            <button type="submit" className="btn btn-primary w-100">
              Iniciar Sesión
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

export default Login;
