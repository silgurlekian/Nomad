import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DeleteService from "./DeleteService";

const ServiceList = () => {
  const [services, setServices] = useState([]);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false); // Estado para verificar si es admin
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user")); // Obtener datos del usuario

        if (!token) {
          setError("Debes estar logueado para visualizar el portal.");
          return;
        }

        // Verificar si el usuario tiene rol 'admin'
        if (user && user.role === 'admin') {
          setIsAdmin(true); // Establecer que es admin
        } else {
          setError("Debes ser administrador para poder visualizar esta sección.");
          return; // Salir si no es admin
        }

        const response = await axios.get("https://api-nomad.onrender.com/api/services", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setServices(response.data);
      } catch (error) {
        setError("Error al obtener los servicios: " + error.message);
      }
    };

    fetchServices();
  }, [navigate]);

  const handleServiceDeleted = (serviceId) => {
    setServices(services.filter((service) => service._id !== serviceId));
  };

  return (
    <div className="container mt-4">
      <h2>Lista de Servicios</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {/* Mostrar botón solo si es admin */}
      {isAdmin && (
        <button
          className="btn btn-primary mb-3"
          onClick={() => navigate("/addService")}
        >
          Crear Servicio
        </button>
      )}
      <table className="table table-striped mt-4">
        <thead>
          <tr>
            <th className="w-80">Nombre</th>
            <th className="text-end">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service) => (
            <tr key={service._id}>
              <td>{service.name}</td>
              <td className="d-flex justify-content-end">
                <button
                  className="btn btn-warning me-2 mt-0"
                  onClick={() => navigate(`/EditService/${service._id}`)}
                >
                  Editar
                </button>
                <DeleteService
                  serviceId={service._id}
                  onServiceDeleted={handleServiceDeleted}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ServiceList;