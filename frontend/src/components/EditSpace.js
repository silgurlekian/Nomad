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
    selectedSpacesType: "",
    aceptaReservas: false,
    tiposReservas: {
      porHora: false,
      porDia: false,
      porMes: false,
      porAno: false,
    },
  });
  const [allServices, setAllServices] = useState([]);
  const [allSpacesType, setAllSpacesType] = useState([]);
  const [imagen, setImagen] = useState(null);
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token) {
      setGlobalError("Debes estar logueado para realizar esta acción.");
      setIsLoading(false);
      return;
    }

    if (user && user.role !== "admin") {
      setGlobalError("Debes ser administrador para editar espacios.");
      navigate("/SpacesList");
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch services and space types concurrently
        const [servicesResponse, spaceTypesResponse, spaceResponse] = await Promise.all([
          axios.get("http://localhost:3000/api/services"),
          axios.get("http://localhost:3000/api/spacesType"),
          axios.get(`http://localhost:3000/api/spaces/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        // Set services and space types
        setAllServices(servicesResponse.data);
        setAllSpacesType(spaceTypesResponse.data);

        // Prepare form data from the space
        const space = spaceResponse.data;
        setFormData({
          nombre: space.nombre || "",
          direccion: space.direccion || "",
          ciudad: space.ciudad || "",
          website: space.website || "",
          precio: space.precio || "",
          selectedServices: space.servicios.map(service => service._id),
          selectedSpacesType: space.spacesType[0]?._id || "",
          aceptaReservas: space.aceptaReservas || false,
          tiposReservas: {
            porHora: space.tiposReservas.includes('porHora'),
            porDia: space.tiposReservas.includes('porDia'),
            porMes: space.tiposReservas.includes('porMes'),
            porAno: space.tiposReservas.includes('porAno')
          }
        });

        setIsLoading(false);
      } catch (error) {
        setGlobalError("Error al cargar los datos del espacio: " + error.message);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      if (name === "aceptaReservas") {
        // Reset reservation types when toggling acceptance of reservations
        setFormData((prev) => ({
          ...prev,
          [name]: checked,
          tiposReservas: checked
            ? prev.tiposReservas
            : {
                porHora: false,
                porDia: false,
                porMes: false,
                porAno: false,
              },
        }));
      } else if (name.startsWith("tiposReservas.")) {
        // Handle reservation type checkboxes
        const reservationType = name.split(".")[1];
        setFormData((prev) => ({
          ...prev,
          tiposReservas: {
            ...prev.tiposReservas,
            [reservationType]: checked,
          },
        }));
      } else {
        // Handle other checkboxes (like services)
        setFormData((prev) => ({ ...prev, [name]: checked }));
      }
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
      aceptaReservas,
      tiposReservas,
    } = formData;
    const newErrors = {};

    if (!nombre.trim()) newErrors.nombre = "El nombre es obligatorio.";
    if (!direccion.trim()) newErrors.direccion = "La dirección es obligatoria.";
    if (!ciudad.trim()) newErrors.ciudad = "La ciudad es obligatoria.";
    if (!precio || precio <= 0)
      newErrors.precio = "El precio debe ser mayor que cero.";
    if (selectedServices.length === 0)
      newErrors.selectedServices = "Los servicios son obligatorios.";
    if (!selectedSpacesType)
      newErrors.selectedSpacesType = "Los tipos de espacio son obligatorios.";

    // If reservations are accepted, at least one reservation type must be selected
    if (aceptaReservas && !Object.values(tiposReservas).some((val) => val)) {
      newErrors.tiposReservas = "Debe seleccionar al menos un tipo de reserva.";
    }

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
        if (key === "selectedServices") {
          value.forEach((service) => spaceData.append("servicios", service));
        } else if (key === "selectedSpacesType") {
          spaceData.append("spacesType", value);
        } else if (key === "tiposReservas") {
          // Convert reservation types to an array of selected types
          const selectedReservationTypes = Object.entries(value)
            .filter(([_, isSelected]) => isSelected)
            .map(([type, _]) => type);
          selectedReservationTypes.forEach((type) =>
            spaceData.append("tiposReservas", type)
          );
        } else if (key === "aceptaReservas") {
          spaceData.append(key, value);
        } else {
          spaceData.append(key, value);
        }
      });

      if (imagen) spaceData.append("imagen", imagen);

      await axios.put(`http://localhost:3000/api/spaces/${id}`, spaceData, config);
      navigate("/SpacesList");
    } catch (error) {
      setGlobalError("Error al actualizar el espacio: " + error.message);
    }
  };

  // Loading state
  if (isLoading) {
    return <div className="container mt-4">Cargando...</div>;
  }

  return (
    <div className="container bkg-container mt-4">
      <h2>Editar espacio</h2>
      {globalError && <div className="alert alert-danger">{globalError}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Tipo de espacio</label>
          <select
            name="selectedSpacesType"
            value={formData.selectedSpacesType}
            onChange={handleChange}
            className={`form-control ${
              errors.selectedSpacesType ? "is-invalid" : ""
            }`}
          >
            <option value="">Seleccionar tipo de espacio</option>
            {allSpacesType.length > 0 ? (
              allSpacesType.map((spaceType) => (
                <option key={spaceType._id} value={spaceType._id}>
                  {spaceType.name}
                </option>
              ))
            ) : (
              <option disabled>No hay tipos de espacios disponibles.</option>
            )}
          </select>
          {errors.selectedSpacesType && (
            <div className="invalid-feedback">{errors.selectedSpacesType}</div>
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

        {/* New Reservation Toggle */}
        <div className="mb-3">
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              id="aceptaReservas"
              name="aceptaReservas"
              checked={formData.aceptaReservas}
              onChange={handleChange}
            />
            <label className="form-check-label" htmlFor="aceptaReservas">
              ¿Acepta reservas?
            </label>
          </div>
        </div>

        {formData.aceptaReservas && (
          <div className="mb-3">
            <label className="form-label">Tipos de reserva</label>
            <div>
              <input
                type="checkbox"
                name="tiposReservas.porHora"
                checked={formData.tiposReservas.porHora}
                onChange={handleChange}
                className="form-check-input"
              />
              <label className="ms-2">Por hora</label>
            </div>
            <div>
              <input
                type="checkbox"
                name="tiposReservas.porDia"
                checked={formData.tiposReservas.porDia}
                onChange={handleChange}
                className="form-check-input"
              />
              <label className="ms-2">Por día</label>
            </div>
            <div>
              <input
                type="checkbox"
                name="tiposReservas.porMes"
                checked={formData.tiposReservas.porMes}
                onChange={handleChange}
                className="form-check-input"
              />
              <label className="ms-2">Por mes</label>
            </div>
            <div>
              <input
                type="checkbox"
                name="tiposReservas.porAno"
                checked={formData.tiposReservas.porAno}
                onChange={handleChange}
                className="form-check-input"
              />
              <label className="ms-2">Por año</label>
            </div>
            {errors.tiposReservas && (
              <div className="text-danger">{errors.tiposReservas}</div>
            )}
          </div>
        )}

        <div className="mb-3">
          <label className="form-label">Imagen</label>
          <input
            type="file"
            name="imagen"
            onChange={handleFileChange}
            className="form-control"
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Guardar cambios
        </button>
      </form>
    </div>
  );
};

export default EditSpace;
