import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddSpace = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    direccion: "",
    ciudad: "",
    website: "",
    precio: "",
    selectedServices: [],
    aceptaReservas: false,
    tiposReservas: { hora: false, dia: false, mes: false, anual: false },
  });
  const [allServices, setAllServices] = useState([]);
  const [imagen, setImagen] = useState(null);
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token) {
      setGlobalError("Debes estar logueado para realizar esta acción.");
      return;
    }

    if (user && user.role !== "admin") {
      setGlobalError("Debes ser administrador para agregar espacios.");
      navigate("/SpacesList");
      return;
    }

    const fetchServices = async () => {
      try {
        const response = await axios.get(
          "https://api-nomad.onrender.com/api/services"
        );
        setAllServices(response.data);
      } catch (error) {
        setGlobalError("Error al cargar los servicios: " + error.message);
      }
    };

    fetchServices();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox" && name in formData.tiposReservas) {
      setFormData((prev) => ({
        ...prev,
        tiposReservas: { ...prev.tiposReservas, [name]: checked },
      }));
    } else if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file?.type.startsWith("image/")) {
      setImagen(file);
    } else {
      setGlobalError("Por favor, sube un archivo de imagen válido.");
      setImagen(null);
    }
  };

  const validateForm = () => {
    const { nombre, direccion, ciudad, precio, selectedServices } = formData;
    const newErrors = {};
    if (!nombre.trim()) newErrors.nombre = "El nombre es obligatorio.";
    if (!direccion.trim()) newErrors.direccion = "La dirección es obligatoria.";
    if (!ciudad.trim()) newErrors.ciudad = "La ciudad es obligatoria.";
    if (!precio || precio <= 0)
      newErrors.precio = "El precio debe ser mayor que cero.";
    if (selectedServices.length === 0)
      newErrors.selectedServices = "Los servicios son obligatorios.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      const spaceData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "tiposReservas") {
          spaceData.append(key, JSON.stringify(value));
        } else if (key === "selectedServices") {
          value.forEach((service) => spaceData.append("servicios", service));
        } else {
          spaceData.append(key, value);
        }
      });
      if (imagen) spaceData.append("imagen", imagen);

      await axios.post("http://localhost:3000/api/spaces", spaceData, config);
      navigate("/SpacesList");
    } catch (error) {
      setGlobalError("Error al agregar el espacio: " + error.message);
    }
  };

  return (
    <div className="container bkg-container mt-4">
      <h2>Agregar espacio</h2>
      {globalError && <div className="alert alert-danger">{globalError}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="nombre" className="form-label">
            Nombre
          </label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Ingrese el nombre del espacio"
            className={`form-control ${errors.nombre ? "is-invalid" : ""}`}
          />
          {errors.nombre && (
            <div className="invalid-feedback">{errors.nombre}</div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="direccion" className="form-label">
            Dirección
          </label>
          <input
            type="text"
            id="direccion"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            placeholder="Ejemplo: Calle Falsa 123"
            className={`form-control ${errors.direccion ? "is-invalid" : ""}`}
          />
          {errors.direccion && (
            <div className="invalid-feedback">{errors.direccion}</div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="ciudad" className="form-label">
            Ciudad
          </label>
          <input
            type="text"
            id="ciudad"
            name="ciudad"
            value={formData.ciudad}
            onChange={handleChange}
            placeholder="Ejemplo: Buenos Aires"
            className={`form-control ${errors.ciudad ? "is-invalid" : ""}`}
          />
          {errors.ciudad && (
            <div className="invalid-feedback">{errors.ciudad}</div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="website" className="form-label">
            Sitio web
          </label>
          <input
            type="url"
            id="website"
            name="website"
            value={formData.website}
            onChange={handleChange}
            placeholder="Ejemplo: https://www.mi-espacio.com"
            className={`form-control ${errors.website ? "is-invalid" : ""}`}
          />
          {errors.website && (
            <div className="invalid-feedback">{errors.website}</div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="precio" className="form-label">
            Precio
          </label>
          <input
            type="number"
            id="precio"
            name="precio"
            value={formData.precio}
            onChange={handleChange}
            placeholder="Ingrese el precio por hora"
            className={`form-control ${errors.precio ? "is-invalid" : ""}`}
          />
          {errors.precio && (
            <div className="invalid-feedback">{errors.precio}</div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Servicios</label>
          <div>
            {allServices.length > 0 ? (
              allServices.map((service) => (
                <div key={service._id} className="form-check">
                  <input
                    type="checkbox"
                    id={`service-${service._id}`}
                    value={service._id}
                    checked={formData.selectedServices.includes(service._id)}
                    onChange={(e) => {
                      const { value, checked } = e.target;
                      setFormData((prev) => ({
                        ...prev,
                        selectedServices: checked
                          ? [...prev.selectedServices, value]
                          : prev.selectedServices.filter((id) => id !== value),
                      }));
                    }}
                    className="form-check-input"
                  />

                  <label
                    htmlFor={`service-${service._id}`}
                    className="form-check-label"
                  >
                    {service.name}
                  </label>
                </div>
              ))
            ) : (
              <p>No hay servicios disponibles.</p>
            )}
          </div>
          {errors.services && (
            <div className="invalid-feedback">{errors.services}</div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">¿Acepta reservas?</label>
          <input
            type="checkbox"
            id="aceptaReservas"
            checked={formData.aceptaReservas}
            onChange={(e) => {
              const { checked } = e.target;
              setFormData((prev) => ({ ...prev, aceptaReservas: checked }));
            }}
            className="form-check-input"
          />
        </div>

        {formData.aceptaReservas && (
          <div className="mb-3">
            <label className="form-label">Tipos de reserva</label>
            <div>
              {["hora", "dia", "mes", "anual"].map((tipo) => (
                <div key={tipo} className="form-check">
                  <input
                    type="checkbox"
                    id={`reserva-${tipo}`}
                    name={tipo}
                    checked={formData.tiposReservas[tipo]}
                    onChange={(e) => {
                      const { name, checked } = e.target;
                      setFormData((prev) => ({
                        ...prev,
                        tiposReservas: {
                          ...prev.tiposReservas,
                          [name]: checked,
                        },
                      }));
                    }}
                    className="form-check-input"
                  />
                  <label
                    htmlFor={`reserva-${tipo}`}
                    className="form-check-label"
                  >
                    Por {tipo}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mb-3">
          <label htmlFor="imagen" className="form-label">
            Imagen del espacio
          </label>
          <input
            type="file"
            id="imagen"
            name="imagen"
            onChange={handleFileChange}
            className="form-control"
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Agregar Espacio
        </button>
      </form>
    </div>
  );
};

export default AddSpace;
