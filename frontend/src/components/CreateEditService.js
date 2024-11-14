import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const CreateEditService = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const { id } = useParams(); // Usado para editar un servicio existente
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      // Si estamos editando, obtener el servicio por ID
      axios
        .get(`http://localhost:3000/api/servicios/${id}`)
        .then((response) => {
          setName(response.data.name);
          setDescription(response.data.description);
        })
        .catch((error) => console.error("Error obteniendo el servicio", error));
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const serviceData = { name, description };
    try {
      if (id) {
        // Editar servicio
        await axios.put(`http://localhost:3000/api/servicios/${id}`, serviceData);
      } else {
        // Crear servicio
        await axios.post("http://localhost:3000/api/servicios/create", serviceData);
      }
      navigate("/services"); // Redirigir a la lista de servicios
    } catch (error) {
      console.error("Error al guardar el servicio", error);
    }
  };

  return (
    <div className="container">
      <h2>{id ? "Editar Servicio" : "Crear Servicio"}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Descripción</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        <button type="submit">{id ? "Actualizar" : "Crear"}</button>
      </form>
    </div>
  );
};

export default CreateEditService;
