import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddSpace = () => {
  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [website, setWebsite] = useState("");
  const [precio, setPrecio] = useState("");
  const [selectedServices, setSelectedServices] = useState([]);
  const [allServices, setAllServices] = useState([]);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();
  const [imagen, setImagen] = useState(null);

  // Cargar los Servicios disponibles desde el backend
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user")); // Obtener datos del usuario

    if (!token) {
      setError("Debes estar logueado para realizar esta acción.");
      return;
    }

    // Verificar si el usuario tiene rol 'admin'
    if (user && user.role !== 'admin') {
      setError("Debes ser administrador para poder agregar espacios.");
      navigate("/SpacesList"); // Redirigir a la lista de espacios
      return;
    }

    const fetchServices = async () => {
      try {
        const response = await axios.get("https://api-nomad.onrender.com/api/services");
        setAllServices(response.data); // Guarda los Servicios disponibles
      } catch (error) {
        setError("Error al cargar los Servicios: " + error.message);
      }
    };
    
    fetchServices();
  }, [navigate]);

  // Manejar la selección de los checkboxes
  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setSelectedServices((prevSelected) =>
      checked
        ? [...prevSelected, value]
        : prevSelected.filter((id) => id !== value)
    );
  };

  // Validar los campos
  const validateForm = () => {
    const errors = {};
    if (!nombre) errors.nombre = "El nombre es obligatorio.";
    if (!direccion) errors.direccion = "La dirección es obligatoria.";
    if (!ciudad) errors.ciudad = "La ciudad es obligatoria.";
    if (!precio) errors.precio = "El precio es obligatorio.";
    if (selectedServices.length === 0)
      errors.Services = "Los Servicios son obligatorios.";

    return errors;
  };

  // Manejar cambio de archivo
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImagen(file);
    } else {
      setError("Por favor, sube un archivo de imagen válido.");
      setImagen(null);
    }
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
      newSpace.append("direccion", direccion);
      newSpace.append("ciudad", ciudad);
      newSpace.append("website", website);
      newSpace.append("precio", precio);

      selectedServices.forEach((serviceId) => {
        newSpace.append("servicios", serviceId);
      });

      if (imagen) newSpace.append("imagen", imagen);

      await axios.post("https://api-nomad.onrender.com/api/spaces", newSpace, config);
      navigate("/SpacesList");
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
          <label htmlFor="nombre" className="form-label">Nombre</label>
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
        <div className="mb-3">
          <label htmlFor="direccion" className="form-label">Dirección</label>
          <input
            type="text"
            id="direccion"
            className={`form-control ${formErrors.direccion ? "is-invalid" : ""}`}
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
          />
          {formErrors.direccion && (
            <div className="invalid-feedback">{formErrors.direccion}</div>
          )}
        </div>
        <div className="mb-3">
          <label htmlFor="ciudad" className="form-label">Ciudad</label>
          <input
            type="text"
            id="ciudad"
            className={`form-control ${formErrors.ciudad ? "is-invalid" : ""}`}
            value={ciudad}
            onChange={(e) => setCiudad(e.target.value)}
          />
          {formErrors.ciudad && (
            <div className="invalid-feedback">{formErrors.ciudad}</div>
          )}
        </div>
        <div className="mb-3">
          <label htmlFor="website" className="form-label">Sitio web</label>
          <input
            type="text"
            id="website"
            className={`form-control`}
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="precio" className="form-label">Precio</label>
          <input
            type="number"
            id="precio"
            className={`form-control ${formErrors.precio ? "is-invalid" : ""}`}
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
          />
          {formErrors.precio && (
            <div className="invalid-feedback">{formErrors.precio}</div>
          )}
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
          {formErrors.Services && (
            <div className="invalid-feedback">{formErrors.Services}</div>
          )}
        </div>
        <div className="mb-3">
          <label className="form-label">Imagen</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="form-control"
          />
        </div>
        <button type="submit" className="btn btn-primary">Agregar</button>
      </form>
    </div>
  );
};

export default AddSpace;