import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const EditSpace = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [website, setWebsite] = useState("");
  const [precio, setPrecio] = useState("");
  const [servicios, setServicios] = useState([]);
  const [tiposReservas, setTiposReservas] = useState({
    hora: false,
    dia: false,
    mes: false,
    anual: false,
  });
  const [aceptaReservas, setAceptaReservas] = useState(false);
  const [availableServices, setAvailableServices] = useState([]);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [imagen, setImagen] = useState(null);
  const [currentImage, setCurrentImage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token) {
      setError("Debes estar logueado para visualizar el portal.");
      return;
    }

    if (user && user.role !== 'admin') {
      setError("Debes ser administrador para poder editar espacios.");
      navigate("/SpacesList");
      return;
    }

    const fetchSpace = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await axios.get(`https://api-nomad.onrender.com/api/spaces/${id}`, config);
        const { nombre, direccion, ciudad, website, precio, servicios, aceptaReservas, tiposReservas, imagen } = response.data;
        
        setNombre(nombre);
        setDireccion(direccion);
        setCiudad(ciudad);
        setWebsite(website);
        setPrecio(precio);
        setServicios(servicios.map((service) => service._id));
        setAceptaReservas(aceptaReservas);
        setTiposReservas(tiposReservas || { hora: false, dia: false, mes: false, anual: false });
        setCurrentImage(imagen);
      } catch (error) {
        setError("Error al obtener los datos del espacio: " + error.message);
      }
    };

    const fetchAvailableServices = async () => {
      try {
        const response = await axios.get("https://api-nomad.onrender.com/api/services");
        setAvailableServices(response.data);
      } catch (error) {
        setError("Error al obtener los servicios disponibles: " + error.message);
      }
    };

    fetchSpace();
    fetchAvailableServices();
  }, [id, navigate]);

  const validateForm = () => {
    const errors = {};
    if (!nombre) errors.nombre = "El nombre es obligatorio.";
    if (!direccion) errors.direccion = "La dirección es obligatoria.";
    if (!ciudad) errors.ciudad = "La ciudad es obligatoria.";
    if (!precio) errors.precio = "El precio es obligatorio.";
    if (servicios.length === 0) errors.servicios = "Los servicios son obligatorios.";
    return errors;
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setImagen(e.target.files[0]);
    }
  };

  const handleTipoReservaChange = (e) => {
    const { name, checked } = e.target;
    setTiposReservas((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    setFormErrors(errors);
    
    if (Object.keys(errors).length > 0) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Debes estar logueado para visualizar el portal.");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      const updatedSpace = new FormData();
      updatedSpace.append("nombre", nombre);
      updatedSpace.append("direccion", direccion);
      updatedSpace.append("ciudad", ciudad);
      updatedSpace.append("website", website);
      updatedSpace.append("precio", precio);
      updatedSpace.append("aceptaReservas", aceptaReservas);
      updatedSpace.append("tiposReservas", JSON.stringify(tiposReservas));
      
      servicios.forEach((serviceId) => {
        updatedSpace.append("servicios", serviceId);
      });

      if (imagen) updatedSpace.append("imagen", imagen);

      await axios.put(`https://api-nomad.onrender.com/api/spaces/${id}`, updatedSpace, config);
      
      navigate("/SpacesList");
      
    } catch (error) {
      setError("Error al actualizar el espacio: " + error.message);
    }
  };

  const handleServicioChange = (e) => {
    const { value, checked } = e.target;
    setServicios((prev) =>
      checked ? [...prev, value] : prev.filter((serviceId) => serviceId !== value)
    );
  };

  return (
    <div className="container bkg-container mt-4">
      <h2>Editar espacio</h2>
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
          {formErrors.nombre && <div className="invalid-feedback">{formErrors.nombre}</div>}
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
          {formErrors.direccion && <div className="invalid-feedback">{formErrors.direccion}</div>}
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
          {formErrors.ciudad && <div className="invalid-feedback">{formErrors.ciudad}</div>}
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
          {formErrors.precio && <div className="invalid-feedback">{formErrors.precio}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="aceptaReservas" className="form-label">Acepta reservas</label>
          <input
            type="checkbox"
            id="aceptaReservas"
            checked={aceptaReservas}
            onChange={(e) => setAceptaReservas(e.target.checked)}
            className="form-check-input"
          />
        </div>

        {aceptaReservas && (
          <div className="mb-3">
            <label className="form-label">Tipos de reserva</label>
            <div>
              <input
                type="checkbox"
                name="hora"
                checked={tiposReservas.hora}
                onChange={handleTipoReservaChange}
              />
              <label>Por hora</label>
              <br />
              <input
                type="checkbox"
                name="dia"
                checked={tiposReservas.dia}
                onChange={handleTipoReservaChange}
              />
              <label>Por día</label>
              <br />
              <input
                type="checkbox"
                name="mes"
                checked={tiposReservas.mes}
                onChange={handleTipoReservaChange}
              />
              <label>Por mes</label>
              <br />
              <input
                type="checkbox"
                name="anual"
                checked={tiposReservas.anual}
                onChange={handleTipoReservaChange}
              />
              <label>Por año</label>
            </div>
          </div>
        )}

        <div className="mb-3">
          <label className="form-label">Servicios</label>
          {availableServices.map((service) => (
            <div key={service._id}>
              <input
                type="checkbox"
                value={service._id}
                checked={servicios.includes(service._id)}
                onChange={handleServicioChange}
              />
              <label>{service.name}</label>
            </div>
          ))}
          {formErrors.servicios && (
            <div className="invalid-feedback">{formErrors.servicios}</div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="imagen" className="form-label">Imagen</label>
          <input
            type="file"
            id="imagen"
            className="form-control"
            onChange={handleFileChange}
          />
          {currentImage && (
            <>
              <p>Imagen actual:</p>
              <img src={currentImage} alt="Imagen actual" width="100" />
            </>
          )}
        </div>

        <button type="submit" className="btn btn-primary">Actualizar espacio</button>
      </form>
    </div>
  );
};

export default EditSpace;