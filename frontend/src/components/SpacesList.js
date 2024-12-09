import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SpacesList = () => {
  const [spaces, setSpaces] = useState([]);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showModal, setShowModal] = useState(false); // Estado para mostrar el modal
  const [selectedSpace, setSelectedSpace] = useState(null); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSpaces = async () => {
      try {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));

        if (!token) {
          setError("Debes estar logueado para visualizar el portal.");
          return;
        }

        if (user && user.role === "admin") {
          setIsAdmin(true);
        } else {
          setError(
            "Debes ser administrador para poder visualizar esta sección."
          );
          return;
        }

        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(
          "https://api-nomad.onrender.com/api/spaces",
          config
        );
        setSpaces(response.data);
      } catch (error) {
        setError("Error al obtener los espacios: " + error.message);
      }
    };

    fetchSpaces();
  }, [navigate]);

  const handleSpaceDeleted = (spaceId) => {
    setSpaces(spaces.filter((space) => space._id !== spaceId));
    setShowModal(false); // Cerrar el modal después de eliminar
  };

  const confirmDelete = (space) => {
    setSelectedSpace(space);
    setShowModal(true); // Mostrar el modal
  };

  const deleteSpace = async () => {
    if (!selectedSpace) return;

    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      await axios.delete(
        `https://api-nomad.onrender.com/api/spaces/${selectedSpace._id}`,
        config
      );

      handleSpaceDeleted(selectedSpace._id);
    } catch (error) {
      setError("Error al eliminar el espacio: " + error.message);
    }
  };

  return (
    <div className="container bkg-container mt-4">
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="d-flex justify-content-between">
        <h2>Lista de espacios</h2>
        {isAdmin && (
          <button
            className="btn btn-primary mb-3"
            onClick={() => navigate("/addSpace")}
          >
            Crear espacio
          </button>
        )}
      </div>
      <table className="table table-striped mt-4">
        <thead>
          <tr>
            <th>Imagen</th>
            <th>Nombre</th>
            <th>Dirección</th>
            <th>Ciudad</th>
            <th>Precio</th>
            <th>Servicios</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {spaces.map((space) => (
            <tr key={space._id}>
              <td>
                {space.imagen && (
                  <img
                    src={`http://localhost:3000/${space.imagen}`}
                    alt={space.nombre}
                    className="space-image"
                  />
                )}
              </td>
              <td>{space.nombre}</td>
              <td>{space.direccion}</td>
              <td>{space.ciudad}</td>
              <td style={{ whiteSpace: "nowrap" }}>$ {space.precio}</td>
              <td>
                {space.servicios && Array.isArray(space.servicios)
                  ? space.servicios.map((service) => service.name).join(", ")
                  : "No services available"}
              </td>
              <td>
                <div className="d-flex align-items-center">
                  <button
                    className="btn btn-secondary me-2"
                    onClick={() => navigate(`/editSpace/${space._id}`)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => confirmDelete(space)}
                  >
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal para confirmar eliminación */}
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
                >
                  .
                </button>
              </div>
              <div className="modal-body">
                <p>
                  ¿Estás seguro de que deseas eliminar el espacio{" "}
                  <strong>{selectedSpace?.nombre}</strong>?
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
                  onClick={deleteSpace}
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

export default SpacesList;
