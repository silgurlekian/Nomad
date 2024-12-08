import React, { useState } from "react";
import axios from "axios";

const DeleteSpaceType = ({ spaceId, onSpaceTypeDeleted }) => {
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

      console.log("Eliminando tipo de espacio con ID:", spaceId); // Verifica que el ID sea correcto

      await axios.delete(
        `https://api-nomad.onrender.com/api/spaces/${encodeURIComponent(spaceId)}`,
        config
      );

      onSpaceTypeDeleted(spaceId);
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

export default DeleteSpaceType;
