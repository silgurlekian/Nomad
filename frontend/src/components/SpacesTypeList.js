import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DeleteSpaceType from "./DeleteSpaceType";

const SpacesType = () => {
  const [spaces, setSpacesType] = useState([]);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false); // Estado para verificar si es admin
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSpaceType = async () => {
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

        const response = await axios.get("https://api-nomad.onrender.com/api/spacesType", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSpacesType(response.data);
      } catch (error) {
        setError("Error al obtener los servicios: " + error.message);
      }
    };

    fetchSpaceType();
  }, [navigate]);

  const handleSpaceTypeDeleted = (spaceId) => {
    setSpacesType(spaces.filter((space) => space._id !== spaceId));
  };

  return (
    <div className="container mt-4">
      <h2>Lista de tipos de espacios</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {/* Mostrar botón solo si es admin */}
      {isAdmin && (
        <button
          className="btn btn-primary mb-3"
          onClick={() => navigate("/addSpaceType")}
        >
          Crear tipo de espacio
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
          {spaces.map((space) => (
            <tr key={space._id}>
              <td>{space.name}</td>
              <td className="d-flex justify-content-end">
                <button
                  className="btn btn-warning me-2 mt-0"
                  onClick={() => navigate(`/EditSpaceType/${space._id}`)}
                >
                  Editar
                </button>
                <DeleteSpaceType
                  spaceId={space._id}
                  onSpaceTypeDeleted={handleSpaceTypeDeleted}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SpacesType;