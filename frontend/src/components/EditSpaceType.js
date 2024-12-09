import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const EditSpaceType = () => {
  const { id } = useParams(); 
  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user")); // Obtener datos del usuario

    if (!token) {
      setError("Debes estar logueado para visualizar el portal.");
      return;
    }

    // Verificar si el usuario tiene rol 'admin'
    if (user && user.role !== 'admin') {
      setError("Debes ser administrador para poder editar tipos de espacio.");
      navigate("/SpacesTypeList"); // Redirigir a la lista de tipos de espacios
      return;
    }

    const fetchSpaceType = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/spacesType/${id}`);
        const { name } = response.data;
        setName(name);
      } catch (error) {
        setError("Error al obtener el tipo de espacio: " + error.message);
      }
    };

    fetchSpaceType();
  }, [id, navigate]);

  // Validar los campos del formulario
  const validateForm = () => {
    const errors = {};
    if (!name) errors.name = "El nombre es obligatorio.";
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) return;

    try {
      const updatedSpaceType = { name };
      await axios.put(`http://localhost:3000/api/spacesType/${id}`, updatedSpaceType);
      navigate("/SpacesTypeList"); 
    } catch (error) {
      setError("Error al actualizar el tipo de espacio: " + error.message);
    }
  };

  return (
    <div className="container bkg-container mt-4">
      <h2>Editar tipo de espacio</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Nombre</label>
          <input
            type="text"
            id="name"
            className={`form-control ${formErrors.name ? "is-invalid" : ""}`}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {formErrors.name && <div className="invalid-feedback">{formErrors.name}</div>}
        </div>
        <button type="submit" className="btn btn-primary">Guardar Cambios</button>
      </form>
    </div>
  );
};

export default EditSpaceType;