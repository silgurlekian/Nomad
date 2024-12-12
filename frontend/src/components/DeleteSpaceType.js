import React, { useState } from "react";
import axios from "axios";

const DeleteSpaceType = ({ spaceTypeId, onSpaceTypeDeleted }) => {
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

      console.log("Eliminando tipo de espacio con ID:", spaceTypeId); // Verifica que el ID sea correcto

      await axios.delete(
        `https://nomad-j3w6.onrender.com/api/spacesType/${encodeURIComponent(spaceTypeId)}`,
        config
      );

      onSpaceTypeDeleted(spaceTypeId);
    } catch (error) {
      setError("Error al eliminar el tipo de espacio: " + error.message);
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
