import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DeleteCoworking from "./DeleteCoworking";

const CoworkingsList = () => {
  const [coworkings, setCoworkings] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCoworkings = async () => {
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
          "http://localhost:3000/api/coworkings",
          config
        );
        setCoworkings(response.data);
      } catch (error) {
        setError("Error al obtener los coworkings: " + error.message);
      }
    };

    fetchCoworkings();
  }, []);

  const handleCoworkingDeleted = (coworkingId) => {
    setCoworkings(
      coworkings.filter((coworking) => coworking._id !== coworkingId)
    );
  };

  return (
    <div className="container mt-4">
      <h2>Lista de Coworkings</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <button
        className="btn btn-primary mb-3"
        onClick={() => navigate("/addCoworking")}
      >
        Agregar Coworking
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
          {coworkings.map((coworking) => (
            <tr key={coworking._id}>
              <td>{coworking.nombre}</td>
              <td>{coworking.direccion}</td>
              <td>{coworking.ciudad}</td>
              <td>
                {coworking.servicios && Array.isArray(coworking.servicios)
                  ? coworking.servicios
                      .map((service) => service.name)
                      .join(", ") 
                  : "No services available"}
              </td>

              <td>
                <button
                  className="btn btn-warning me-2"
                  onClick={() => navigate(`/editCoworking/${coworking._id}`)}
                >
                  Editar
                </button>
                <DeleteCoworking
                  coworkingId={coworking._id}
                  onCoworkingDeleted={handleCoworkingDeleted}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CoworkingsList;
