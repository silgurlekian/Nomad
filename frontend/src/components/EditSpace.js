import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const EditSpace = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    direccion: "",
    ciudad: "",
    website: "",
    precio: "",
    selectedServices: [],
    selectedSpacesType: [], // Ensure this is initialized as an empty array
    aceptaReservas: false,
    tiposReservas: { hora: false, dia: false, mes: false, anual: false },
  });
  const [allServices, setAllServices] = useState([]);
  const [allSpacesType, setAllSpacesType] = useState([]);
  const [imagen, setImagen] = useState(null);
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState(null);
  const [imagenPreview, setImagenPreview] = useState(null);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token) {
      setGlobalError("Debes estar logueado para realizar esta acción.");
      return;
    }

    if (user && user.role !== "admin") {
      setGlobalError("Debes ser administrador para editar espacios.");
      navigate("/SpacesList");
      return;
    }

    const fetchServices = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/services");
        setAllServices(response.data);
      } catch (error) {
        setGlobalError("Error al cargar los servicios: " + error.message);
      }
    };

    const fetchSpacesType = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/spacesType"
        );
        setAllSpacesType(response.data);
      } catch (error) {
        setGlobalError(
          "Error al cargar los tipos de espacio: " + error.message
        );
      }
    };

    const fetchSpaceData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/spaces/${id}`
        );
        setFormData({
          nombre: response.data.nombre,
          direccion: response.data.direccion,
          ciudad: response.data.ciudad,
          website: response.data.website,
          precio: response.data.precio,
          selectedServices: response.data.servicios.map(
            (service) => service._id
          ),
          selectedSpacesType: response.data.spacesType
            ? response.data.spacesType.map((spaceType) => spaceType._id)
            : [], // Add a fallback to empty array
          aceptaReservas: response.data.aceptaReservas,
          tiposReservas: response.data.tiposReservas.reduce(
            (acc, tipo) => {
              acc[tipo] = true;
              return acc;
            },
            { hora: false, dia: false, mes: false, anual: false }
          ),
        });
        // Asignar la imagen actual
        if (response.data.imagen) {
          setImagenPreview(`http://localhost:3000/${response.data.imagen}`);
        }
      } catch (error) {
        setGlobalError(
          "Error al cargar los datos del espacio: " + error.message
        );
      }
    };

    fetchServices();
    fetchSpacesType();
    fetchSpaceData();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox" && name === "aceptaReservas") {
      // Si cambia "aceptaReservas", vaciar tipos de reserva
      if (!checked) {
        setFormData((prev) => ({
          ...prev,
          aceptaReservas: checked,
          tiposReservas: { hora: false, dia: false, mes: false, anual: false },
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          aceptaReservas: checked,
        }));
      }
    } else if (type === "checkbox" && name in formData.tiposReservas) {
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
    const {
      nombre,
      direccion,
      ciudad,
      precio,
      selectedServices,
      selectedSpacesType,
    } = formData;
    const newErrors = {};
    if (!nombre.trim()) newErrors.nombre = "El nombre es obligatorio.";
    if (!direccion.trim()) newErrors.direccion = "La dirección es obligatoria.";
    if (!ciudad.trim()) newErrors.ciudad = "La ciudad es obligatoria.";
    if (!precio || precio <= 0)
      newErrors.precio = "El precio debe ser mayor que cero.";
    if (selectedServices.length === 0)
      newErrors.selectedServices = "Los servicios son obligatorios.";
    if (selectedSpacesType.length === 0)
      newErrors.selectedSpacesType = "Los tipos de espacio son obligatorios.";
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
        } else if (key === "selectedSpacesType") {
          value.forEach((spaceType) =>
            spaceData.append("spacesType", spaceType)
          );
        } else {
          spaceData.append(key, value);
        }
      });
      if (imagen) spaceData.append("imagen", imagen);

      await axios.put(
        `http://localhost:3000/api/spaces/${id}`,
        spaceData,
        config
      );
      navigate("/SpacesList");
    } catch (error) {
      setGlobalError("Error al editar el espacio: " + error.message);
    }
  };

  return (
    <div className="container bkg-container mt-4">
      <h2>Editar espacio</h2>
      {globalError && <div className="alert alert-danger">{globalError}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="tipoEspacio" className="form-label">
            Tipo de Espacio
          </label>
          <select
            id="tipoEspacio"
            name="selectedSpacesType"
            value={formData.selectedSpacesType}
            onChange={(e) => {
              const value = e.target.value;
              setFormData((prev) => ({
                ...prev,
                selectedSpacesType: value ? [value] : [], // Permite seleccionar solo un tipo
              }));
            }}
            className={`form-control ${
              errors.selectedSpacesType ? "is-invalid" : ""
            }`}
          >
            <option value="">Seleccione un tipo de espacio</option>
            {allSpacesType.length > 0 ? (
              allSpacesType.map((spaceType) => (
                <option key={spaceType._id} value={spaceType._id}>
                  {spaceType.name}
                </option>
              ))
            ) : (
              <option disabled>Cargando tipos de espacio...</option>
            )}
          </select>
          {errors.selectedSpacesType && (
            <div className="invalid-feedback d-block">
              {errors.selectedSpacesType}
            </div>
          )}
        </div>

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
                      setFormData((prev) => {
                        const updatedServices = checked
                          ? [...prev.selectedServices, value]
                          : prev.selectedServices.filter(
                              (serviceId) => serviceId !== value
                            );
                        return { ...prev, selectedServices: updatedServices };
                      });
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
              <p>Cargando servicios...</p>
            )}
          </div>
          {errors.selectedServices && (
            <div className="invalid-feedback d-block">
              {errors.selectedServices}
            </div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="aceptaReservas" className="form-label">
            ¿Acepta reservas?
          </label>
          <input
            type="checkbox"
            id="aceptaReservas"
            name="aceptaReservas"
            checked={formData.aceptaReservas}
            onChange={handleChange}
            className="form-check-input"
          />
        </div>

        {formData.aceptaReservas && (
          <div className="mb-3">
            <label className="form-label">Tipos de reservas</label>
            <div>
              {["hora", "dia", "mes", "anual"].map((tipo) => (
                <div key={tipo} className="form-check">
                  <input
                    type="checkbox"
                    id={`tipo-${tipo}`}
                    name={tipo}
                    checked={formData.tiposReservas[tipo]}
                    onChange={handleChange}
                    className="form-check-input"
                  />
                  <label htmlFor={`tipo-${tipo}`} className="form-check-label">
                    {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mb-3">
          <label htmlFor="imagen" className="form-label">
            Imagen
          </label>
          <input
            type="file"
            id="imagen"
            onChange={handleFileChange}
            className="form-control"
          />
        </div>

        {imagenPreview && (
          <div className="mb-3">
            <img
              src={imagenPreview}
              alt="Vista previa"
              className="space-image"
            />
          </div>
        )}

        <button type="submit" className="btn btn-primary">
          Guardar cambios
        </button>
      </form>
    </div>
  );
};

export default EditSpace;
