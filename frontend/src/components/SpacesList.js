import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DeleteSpace from "./DeleteSpace";

const SpacesList = () => {
  const [spaces, setSpaces] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false); // Estado para verificar si es admin

  useEffect(() => {
    const fetchSpaces = async () => {
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
  };

  return (
    <div className="container mt-4">
      <h2>Lista de espacios</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {/* Mostrar botón solo si es admin */}
      {isAdmin && (
        <button
          className="btn btn-primary mb-3"
          onClick={() => navigate("/addSpace")}
        >
          Agregar espacio
        </button>
      )}
      <table className="table table-striped mt-4">
        <thead>
          <tr>
            <th>Imagen</th>
            <th>Nombre</th>
            <th>Dirección</th>
            <th>Ciudad</th>
            <th>Web</th>
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
                    src={`https://api-nomad.onrender.com/${space.imagen}`}
                    alt={space.nombre}
                    style={{ width: "100px" }}
                  />
                )}
              </td>
              <td>{space.nombre}</td>
              <td>{space.direccion}</td>
              <td>{space.ciudad}</td>
              <td>{space.website}</td>
              <td>$ {space.precio}</td>
              <td>
                {space.servicios && Array.isArray(space.servicios)
                  ? space.servicios.map((service) => service.name).join(", ")
                  : "No services available"}
              </td>

              <td>
                <button
                  className="btn btn-warning me-2"
                  onClick={() => navigate(`/editSpace/${space._id}`)}
                >
                  Editar
                </button>

                <DeleteSpace
                  spaceId={space._id}
                  onSpaceDeleted={handleSpaceDeleted}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SpacesList;