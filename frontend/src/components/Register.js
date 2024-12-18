import React, { useState } from "react";
import { registerUser } from "../services/AuthService";
import "../App.css";

const Register = () => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorNombre, setErrorNombre] = useState(null);
  const [errorEmail, setErrorEmail] = useState(null);
  const [errorPassword, setErrorPassword] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState(""); // Estado para el mensaje de éxito

  const validateForm = () => {
    let isValid = true;
    setErrorNombre(null);
    setErrorEmail(null);
    setErrorPassword(null);

    if (!nombre) {
      setErrorNombre("El nombre completo es obligatorio.");
      isValid = false;
    }

    if (!email) {
      setErrorEmail("El correo electrónico es obligatorio.");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setErrorEmail("Por favor ingresa un correo electrónico válido.");
      isValid = false;
    }

    if (!password) {
      setErrorPassword("La contraseña es obligatoria.");
      isValid = false;
    } else if (password.length < 6) {
      setErrorPassword("La contraseña debe tener al menos 6 caracteres.");
      isValid = false;
    }

    if (password !== confirmPassword) {
      setErrorPassword("Las contraseñas no coinciden.");
      isValid = false;
    }

    return isValid;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
  
    if (!validateForm()) {
      return;
    }
  
    try {
      await registerUser({ nombre, email, password });
  
      // Mostrar el mensaje de éxito sin iniciar sesión automáticamente
      setSuccessMessage(
        "¡Cuenta creada con éxito! Inicia sesión para comenzar."
      );
  
      // Reiniciar los campos después de registrarse
      setNombre("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setErrorEmail(
        err.response ? err.response.data.message : "Error al registrar"
      );
    }
  };
  
  return (
    <div className="container bkg-container">
      <div className="row justify-content-center">
        <h2 className="text-center">Registro</h2>
        <div className="col-md-6">
          {successMessage && (
            <div className="alert alert-success my-4">
              <img
                src="./images/tick-circle.svg"
                alt="Éxito"
                style={{ width: "20px", marginRight: "8px" }}
              />
              {successMessage}
            </div>
          )}

          <form onSubmit={handleRegister}>
            <div className="form-group my-4">
              <label htmlFor="nombre" className="form-label">Nombre completo</label>
              <input
                type="text"
                className={`form-control ${errorNombre ? "error" : ""}`}
                value={nombre}
                onChange={(e) => {
                  setNombre(e.target.value);
                  setErrorNombre(null);
                }}
                placeholder="Ingresa tu nombre completo"
              />
              {errorNombre && (
                <p className="d-flex align-items-center gap-1 error-message mt-2">
                  <img
                    src="./images/warning.svg"
                    alt="Advertencia"
                    style={{ width: "16px", height: "16px" }}
                  />
                  {errorNombre}
                </p>
              )}
            </div>
            <div className="form-group my-4">
              <label htmlFor="email" className="form-label">Correo electrónico</label>
              <input
                type="email"
                className={`form-control ${errorEmail ? "error" : ""}`}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrorEmail(null); // Reiniciar error al cambiar el valor
                }}
                placeholder="Ingresa tu correo electrónico"
              />
              {errorEmail && (
                <p className="d-flex align-items-center gap-1 error-message mt-2">
                  <img
                    src="./images/warning.svg"
                    alt="Advertencia"
                    style={{ width: "16px", height: "16px" }}
                  />
                  {errorEmail}
                </p>
              )}
            </div>
            <div className="form-group my-4">
              <label htmlFor="password" className="form-label">Contraseña</label>
              <div className="password-input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  className={`form-control ${errorPassword ? "error" : ""}`}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrorPassword(null); // Reiniciar error al cambiar el valor
                  }}
                  placeholder="Ingresa tu contraseña"
                />
                <span
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <img
                    src={
                      showPassword
                        ? "./images/eye-slash.svg"
                        : "./images/eye.svg"
                    }
                    alt={
                      showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                    }
                    style={{ width: "20px", height: "20px" }}
                  />
                </span>
              </div>
              {errorPassword && (
                <p className="d-flex align-items-center gap-1 error-message mt-2">
                  <img
                    src="./images/warning.svg"
                    alt="Advertencia"
                    style={{ width: "16px", height: "16px" }}
                  />
                  {errorPassword}
                </p>
              )}
            </div>
            <div className="form-group my-4">
              <label htmlFor="confirmPassword" className="form-label">Confirmar contraseña</label>
              <div className="password-input-container">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className={`form-control ${errorPassword ? "error" : ""}`}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    // Reiniciar error solo si se está cambiando la confirmación
                    if (e.target.value === password) {
                      setErrorPassword(null);
                    }
                  }}
                  placeholder="Confirma tu contraseña"
                />
                <span
                  className="toggle-password"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <img
                    src={
                      showConfirmPassword
                        ? "./images/eye-slash.svg"
                        : "./images/eye.svg"
                    }
                    alt={
                      showConfirmPassword
                        ? "Ocultar contraseña"
                        : "Mostrar contraseña"
                    }
                    style={{ width: "20px", height: "20px" }}
                  />
                </span>
              </div>
              {/* Mostrar error específico para confirmación si es necesario */}
              {password && confirmPassword && password !== confirmPassword && (
                <p className="d-flex align-items-center gap-1 error-message mt-2">
                  <img
                    src="./images/warning.svg"
                    alt="Advertencia"
                    style={{ width: "16px", height: "16px" }}
                  />
                  Las contraseñas no coinciden.
                </p>
              )}
            </div>
            <button type="submit" className="btn btn-primary">
              Registrarse
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
