import React, { useState } from "react";
import axios from "axios";

const DeleteService = ({ serviceId, onServiceDeleted }) => {
  const [error, setError] = useState(null);

  const handleDelete = async () => {
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

      console.log("Eliminando servicio con ID:", serviceId); // Verifica que el ID sea correcto

      await axios.delete(
        `https://nomad-znm2.onrender.com/api/services/${encodeURIComponent(serviceId)}`,
        config
      );

      onServiceDeleted(serviceId);
    } catch (error) {
      setError("Error al eliminar el servicio: " + error.message);
    }
  };

  return (
    <div>
      {error && <div className="alert alert-danger">{error}</div>}
      <button className="btn btn-danger" onClick={handleDelete}>
        Eliminar
      </button>
    </div>
  );
};

export default DeleteService;
