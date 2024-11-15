import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DeleteSpace from "./DeleteSpace";

const SpacesList = () => {
  const [spaces, setSpaces] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSpaces = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Debes estar logueado para visualizar el portal.");
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.get(
          "http://localhost:3000/api/spaces",
          config
        );
        setSpaces(response.data);
      } catch (error) {
        setError("Error al obtener los espacios: " + error.message);
      }
    };

    fetchSpaces();
  }, []);

  const handleSpaceDeleted = (spaceId) => {
    setSpaces(
      spaces.filter((space) => space._id !== spaceId)
    );
  };

  return (
    <div className="container mt-4">
      <h2>Lista de espacios</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <button
        className="btn btn-primary mb-3"
        onClick={() => navigate("/addSpace")}
      >
        Agregar espacio
      </button>
      <table className="table table-striped mt-4">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Dirección</th>
            <th>Ciudad</th>
            <th>Servicios</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {spaces.map((space) => (
            <tr key={space._id}>
              <td>{space.nombre}</td>
              <td>{space.direccion}</td>
              <td>{space.ciudad}</td>
              <td>
                {space.servicios && Array.isArray(space.servicios)
                  ? space.servicios
                      .map((service) => service.name)
                      .join(", ") 
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
