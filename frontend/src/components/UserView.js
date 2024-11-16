import React, { useEffect, useState } from "react";
import axios from "axios";

const UserView = () => {
  const [spaces, setSpaces] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSpaces = async () => {
      try {
        // No se necesita token para acceder a esta ruta
        const response = await axios.get("http://localhost:3000/api/spaces");
        setSpaces(response.data);
      } catch (error) {
        setError("Error al obtener los espacios: " + error.message);
      }
    };

    fetchSpaces();
  }, []);

  return (
    <div className="container mt-4">
      <h2>Espacios Disponibles</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="row">
        {spaces.map((space) => (
          <div className="col-md-4" key={space._id}>
            <div className="card mb-4">
              {space.imagen && (
                <img
                  src={`http://localhost:3000/${space.imagen}`}
                  alt={space.nombre}
                  className="card-img-top"
                  style={{ height: "200px", objectFit: "cover" }}
                />
              )}
              <div className="card-body">
                <h5 className="card-title">{space.nombre}</h5>
                <p className="card-text">Dirección: {space.direccion}</p>
                <p className="card-text">Ciudad: {space.ciudad}</p>
                <p className="card-text">
                  Servicios:{" "}
                  {space.servicios && space.servicios.length > 0
                    ? space.servicios.map((service) => service.name).join(", ")
                    : "No hay servicios disponibles"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserView;