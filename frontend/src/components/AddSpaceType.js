import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddTypeSpace = () => {
  const [nombre, setNombre] = useState("");
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});
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

    if (Object.keys(errors).length > 0) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Debes estar logueado para realizar esta acción.");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      const newSpace = new FormData();
      newSpace.append("nombre", nombre);

      await axios.post(
        "https://api-nomad.onrender.com/api/spacesType",
        newSpace,
        config
      );
      navigate("/SpacesTypeList");
    } catch (error) {
      setError("Error al agregar el espacio: " + error.message);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Agregar espacio</h2>
      {error && <div className="alert alert-danger">{error}</div>}
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

export default AddTypeSpace;
