import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ServiceList = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    // Obtener todos los servicios
    axios
      .get("http://localhost:3000/api/servicios")
      .then((response) => setServices(response.data))
      .catch((error) => console.error(error));
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/servicios/${id}`);
      setServices(services.filter((service) => service._id !== id));
    } catch (error) {
      console.error("Error al eliminar el servicio", error);
    }
  };

  return (
    <div className="container">
      <h2>Lista de Servicios</h2>
      <ul>
        {services.map((service) => (
          <li key={service._id}>
            <span>{service.name}</span>
            <Link to={`/services/edit/${service._id}`}>Editar</Link>
            <button onClick={() => handleDelete(service._id)}>Eliminar</button>
          </li>
        ))}
      </ul>
      <Link to="/services/create" className="btn btn-primary">
        Crear Servicio
      </Link>
    </div>
  );
};

export default ServiceList;
