import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ServiceList = () => {
  const [services, setServices] = useState([]);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false); // Estado para verificar si es admin
  const [showModal, setShowModal] = useState(false); // Controla el modal
  const [selectedService, setSelectedService] = useState(null); // Servicio seleccionado para eliminar
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
        if (user && user.role === "admin") {
          setIsAdmin(true); // Establecer que es admin
        } else {
          setError(
            "Debes ser administrador para poder visualizar esta sección."
          );
          return; // Salir si no es admin
        }

        const response = await axios.get(
          "https://api-nomad.onrender.com/api/services",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setServices(response.data);
      } catch (error) {
        setError("Error al obtener los servicios: " + error.message);
      }
    };

    fetchServices();
  }, [navigate]);

  const handleDeleteClick = (service) => {
    setSelectedService(service); // Guardar el servicio seleccionado
    setShowModal(true); // Mostrar el modal
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      await axios.delete(
        `https://api-nomad.onrender.com/api/services/${selectedService._id}`,
        config
      );

      // Actualizar la lista
      setServices(
        services.filter((service) => service._id !== selectedService._id)
      );
      setShowModal(false); // Cerrar el modal
    } catch (error) {
      setError("Error al eliminar el servicio: " + error.message);
    }
  };

  return (
    <div className="container bkg-container mt-4">
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="d-flex justify-content-between">
        <h2>Lista de Servicios</h2>
        
        {/* Mostrar botón solo si es admin */}
        {isAdmin && (
          <button
            className="btn btn-primary mb-3"
            onClick={() => navigate("/addService")}
          >
            Crear servicio
          </button>
        )}
      </div>
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
                  className="btn btn-secondary me-2 mt-0"
                  onClick={() => navigate(`/EditService/${service._id}`)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDeleteClick(service)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal de confirmación */}
      {showModal && (
        <div
          className="modal fade show"
          tabIndex="-1"
          style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirmar eliminación</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                >.</button>
              </div>
              <div className="modal-body">
                <p>
                  ¿Estás seguro de que deseas eliminar el servicio{" "}
                  <strong>{selectedService?.name}</strong>?
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={confirmDelete}
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceList;
