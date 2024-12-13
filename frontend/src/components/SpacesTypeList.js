import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SpaceTypeList = () => {
  const [spacesType, setSpacesType] = useState([]);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false); // Estado para verificar si es admin
  const [showModal, setShowModal] = useState(false); // Estado para controlar el modal
  const [selectedSpaceType, setSelectedSpaceType] = useState(null); // Estado para el tipo de espacio seleccionado
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSpacesType = async () => {
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
          "https://nomad-vzpq.onrender.com/api/spacesType",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setSpacesType(response.data);
      } catch (error) {
        setError("Error al obtener los tipos de espacio: " + error.message);
      }
    };

    fetchSpacesType();
  }, [navigate]);

  const handleDeleteClick = (spaceType) => {
    setSelectedSpaceType(spaceType); // Guardar el tipo de espacio seleccionado
    setShowModal(true); // Mostrar el modal
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      await axios.delete(
        `https://nomad-vzpq.onrender.com/api/spacesType/${selectedSpaceType._id}`,
        config
      );

      // Actualizar la lista
      setSpacesType(
        spacesType.filter((spaceType) => spaceType._id !== selectedSpaceType._id)
      );
      setShowModal(false); // Cerrar el modal
    } catch (error) {
      setError("Error al eliminar el tipo de espacio: " + error.message);
    }
  };

  return (
    <div className="container bkg-container mt-4">
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="d-flex justify-content-between">
        <h2>Lista de tipos de espacios</h2>
        
        {/* Mostrar botón solo si es admin */}
        {isAdmin && (
          <button
            className="btn btn-primary mb-3"
            onClick={() => navigate("/addSpaceType")}
          >
            Crear tipo de espacio
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
          {spacesType.map((spaceType) => (
            <tr key={spaceType._id}>
              <td>{spaceType.name}</td>
              <td className="d-flex justify-content-end">
                <button
                  className="btn btn-secondary me-2 mt-0"
                  onClick={() => navigate(`/EditSpaceType/${spaceType._id}`)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDeleteClick(spaceType)}
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
                  ¿Estás seguro de que deseas eliminar el tipo de espacio{" "}
                  <strong>{selectedSpaceType?.name}</strong>?
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

export default SpaceTypeList;
