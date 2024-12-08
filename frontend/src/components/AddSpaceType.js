import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddSpaceType = () => {
  const [nombre, setNombre] = useState("");
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [success, setSuccess] = useState(false); 
  const navigate = useNavigate();

  // Cargar los tipos de espacios disponibles desde el backend
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user")); // Obtener datos del usuario

    if (!token) {
      setError("Debes estar logueado para realizar esta acción.");
      return;
    }

    // Verificar si el usuario tiene rol 'admin'
    if (user && user.role !== "admin") {
      setError("Debes ser administrador para poder agregar espacios.");
      navigate("/SpacesTypeList"); // Redirigir a la lista de espacios
      return;
    }
  }, [navigate]);

  // Validar los campos
  const validateForm = () => {
    const errors = {};
    if (!nombre) errors.nombre = "El nombre es obligatorio.";

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) return; // Si hay errores, no hace submit

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Debes estar logueado para realizar esta acción.");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json", 
        },
      };

      const newSpaceType = { nombre };

      await axios.post(
        "https://api-nomad.onrender.com/api/spacesType",
        newSpaceType,
        config
      );

      setSuccess(true); // Mostrar mensaje de éxito
      setTimeout(() => navigate("/SpacesTypeList"), 2000);
    } catch (error) {
      setError(
        "Error al agregar el espacio: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  return (
    <div className="container mt-4">
      <h2>Agregar espacio</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && (
        <div className="alert alert-success">
          Espacio agregado correctamente!
        </div>
      )}{" "}
      {/* Mostrar mensaje de éxito */}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="nombre" className="form-label">
            Nombre
          </label>
          <input
            type="text"
            id="nombre"
            className={`form-control ${formErrors.nombre ? "is-invalid" : ""}`}
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          {formErrors.nombre && (
            <div className="invalid-feedback">{formErrors.nombre}</div>
          )}
        </div>
        <button type="submit" className="btn btn-primary">
          Agregar
        </button>
      </form>
    </div>
  );
};

export default AddSpaceType;
