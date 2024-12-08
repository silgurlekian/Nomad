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
  const [imagen, setImagen] = useState(null);
  const [aceptaReservas, setAceptaReservas] = useState(false);
  const [tiposReservas, setTiposReservas] = useState({
    hora: false,
    dia: false,
    mes: false,
    anual: false,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token) {
      setError("Debes estar logueado para realizar esta acción.");
      return;
    }

    if (user && user.role !== "admin") {
      setError("Debes ser administrador para poder agregar espacios.");
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
        setError("Error al cargar los Servicios: " + error.message);
      }
    };

    fetchServices();
  }, [navigate]);

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setSelectedServices((prevSelected) =>
      checked
        ? [...prevSelected, value]
        : prevSelected.filter((id) => id !== value)
    );
  };

  const handleReservaChange = (e) => {
    setAceptaReservas(e.target.checked);
    if (!e.target.checked) {
      setTiposReservas({ hora: false, dia: false, mes: false, anual: false });
    }
  };

  const handleTipoReservaChange = (e) => {
    const { name, checked } = e.target;
    setTiposReservas((prevTipos) => ({
      ...prevTipos,
      [name]: checked,
    }));
  };

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

      newSpace.append("aceptaReservas", aceptaReservas);
      if (aceptaReservas) {
        newSpace.append("tiposReservas", JSON.stringify(tiposReservas));
      }

      await axios.post(
        "https://api-nomad.onrender.com/api/spaces",
        newSpace,
        config
      );

      navigate("/SpacesList");
    } catch (error) {
      setError("Error al agregar el espacio: " + error.message);
    }
  };

  return (
    <div className="container bkg-container mt-4">
      <h2 className="mb-3">Agregar espacio</h2>
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
            placeholder="Ingrese el nombre del espacio"
          />
          {formErrors.nombre && (
            <div className="invalid-feedback">{formErrors.nombre}</div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="direccion" className="form-label">
            Dirección
          </label>
          <input
            type="text"
            id="direccion"
            className={`form-control ${
              formErrors.direccion ? "is-invalid" : ""
            }`}
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            placeholder="Ejemplo: Calle Falsa 123"
          />
          {formErrors.direccion && (
            <div className="invalid-feedback">{formErrors.direccion}</div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="ciudad" className="form-label">
            Ciudad
          </label>
          <input
            type="text"
            id="ciudad"
            className={`form-control ${formErrors.ciudad ? "is-invalid" : ""}`}
            value={ciudad}
            onChange={(e) => setCiudad(e.target.value)}
            placeholder="Ingrese la ciudad"
          />
          {formErrors.ciudad && (
            <div className="invalid-feedback">{formErrors.ciudad}</div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="website" className="form-label">
            Sitio web
          </label>
          <input
            type="text"
            id="website"
            className="form-control"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="Ejemplo: https://www.mi-espacio.com"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="precio" className="form-label">
            Precio
          </label>
          <input
            type="number"
            id="precio"
            className={`form-control ${formErrors.precio ? "is-invalid" : ""}`}
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            placeholder="Ingrese el precio por hora"
          />
          {formErrors.precio && (
            <div className="invalid-feedback">{formErrors.precio}</div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Servicios</label>
          <div>
            {allServices.length > 0 ? ( // Verifica si hay servicios
              allServices.map((service) => (
                <div key={service._id} className="d-flex gap-2 mb-2">
                  <input
                    type="checkbox"
                    id={service._id}
                    value={service._id}
                    checked={selectedServices.includes(service._id)}
                    onChange={handleCheckboxChange}
                  />
                  <label htmlFor={service._id}>{service.name}</label>
                </div>
              ))
            ) : (
              <p>No hay servicios disponibles.</p> // Mensaje si no hay servicios
            )}
          </div>
          {formErrors.Services && (
            <div className="invalid-feedback">{formErrors.Services}</div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">¿Acepta reservas?</label>
          <input
            type="checkbox"
            className="form-check-input"
            checked={aceptaReservas}
            onChange={handleReservaChange}
          />
        </div>

        {aceptaReservas && (
          <div className="mb-3">
            <label className="form-label">Tipos de reserva</label>
            <div className="d-flex gap-2">
              {["hora", "dia", "mes", "anual"].map((tipo) => (
                <div key={tipo}>
                  <input
                    type="checkbox"
                    name={tipo}
                    checked={tiposReservas[tipo]}
                    onChange={handleTipoReservaChange}
                  />
                  <label>{`Por ${tipo}`}</label>
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
            className="form-control"
            onChange={handleFileChange}
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
