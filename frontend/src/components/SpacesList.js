import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";

const SpacesList = () => {
  const [spaces, setSpaces] = useState([]);
  const [filteredSpaces, setFilteredSpaces] = useState([]);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [spaceTypes, setSpaceTypes] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSpaces = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));

        if (!token || !user || user.role !== "admin") {
          setError(
            "Debes estar logueado como administrador para poder visualizar esta sección."
          );
          return;
        }

        setIsAdmin(true);

        const config = { headers: { Authorization: `Bearer ${token}` } };
        const [spacesResponse, typesResponse] = await Promise.all([
          axios.get("https://nomad-znm2.onrender.com/api/spaces", config),
          axios.get("https://nomad-znm2.onrender.com/api/spacesType", config),
        ]);

        setSpaces(spacesResponse.data);
        setFilteredSpaces(spacesResponse.data);
        setSpaceTypes(typesResponse.data);
      } catch (error) {
        setError("Error al obtener los datos: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSpaces();
  }, []);

  useEffect(() => {
    const normalizeString = (str) =>
      str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase();

    let filtered = spaces.filter((space) =>
      Object.values(space).some((value) =>
        value
          ? normalizeString(value.toString()).includes(
              normalizeString(searchTerm)
            )
          : false
      )
    );

    if (selectedTypes.length > 0) {
      filtered = filtered.filter(
        (space) =>
          space.spacesType &&
          space.spacesType.some((type) => selectedTypes.includes(type.name))
      );
    }

    setFilteredSpaces(filtered);
  }, [searchTerm, selectedTypes, spaces]);

  const handleSpaceDeleted = (spaceId) => {
    setSpaces((prev) => prev.filter((space) => space._id !== spaceId));
    setFilteredSpaces((prev) => prev.filter((space) => space._id !== spaceId));
    setShowModal(false);
  };

  const confirmDelete = (space) => {
    setSelectedSpace(space);
    setShowModal(true);
  };

  const deleteSpace = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      await axios.delete(
        `https://nomad-znm2.onrender.com/api/spaces/${selectedSpace._id}`,
        config
      );

      handleSpaceDeleted(selectedSpace._id);
    } catch (error) {
      setError("Error al eliminar el espacio: " + error.message);
    }
  };

  const handleCheckboxChange = (event) => {
    const value = event.target.value;
    setSelectedTypes((prev) =>
      prev.includes(value)
        ? prev.filter((type) => type !== value)
        : [...prev, value]
    );
  };

  if (loading) return <Loading />;

  return (
    <div className="container bkg-container mt-4">
      {error && <div className="alert alert-danger">{error}</div>}
      {isAdmin && (
        <>
          <div className="d-flex justify-content-between">
            <h2>Lista de espacios</h2>
            <button
              className="btn btn-primary mb-3"
              onClick={() => navigate("/addSpace")}
            >
              Crear espacio
            </button>
          </div>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Buscar espacios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="mb-3">
            {spaceTypes.map((type) => (
              <div key={type._id} className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value={type.name}
                  id={`checkbox-${type._id}`}
                  onChange={handleCheckboxChange}
                />
                <label
                  className="form-check-label"
                  htmlFor={`checkbox-${type._id}`}
                >
                  {type.name}
                </label>
              </div>
            ))}
          </div>

          {filteredSpaces.length > 0 ? (
            <table className="table table-striped mt-4">
              <thead>
                <tr>
                  <th>Imagen</th>
                  <th>Nombre</th>
                  <th>Dirección</th>
                  <th>Ciudad</th>
                  <th>Precio</th>
                  <th>Servicios</th>
                  <th>Tipos de Espacio</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredSpaces.map((space) => (
                  <tr key={space._id}>
                    <td className="align-middle">
                      {space.imagen && (
                        <img
                          src={`${space.imagen}`}
                          loading="lazy"
                          alt={space.nombre}
                          className="space-image"
                        />
                      )}
                    </td>
                    <td className="align-middle">{space.nombre}</td>
                    <td className="align-middle">{space.direccion}</td>
                    <td className="align-middle">{space.ciudad}</td>
                    <td className="align-middle">${space.precio}</td>
                    <td className="align-middle">
                      {space.servicios
                        ?.map((service) => service.name)
                        .join(", ") || "Sin servicios"}
                    </td>
                    <td className="align-middle">
                      {space.spacesType?.map((type) => (
                        <span
                          key={type._id}
                          className={`badge ${
                            {
                              Coworking: "bg-primary",
                              Cafetería: "bg-warning",
                              Hotel: "bg-success",
                            }[type.name] || "bg-light text-dark"
                          } me-1`}
                        >
                          {type.name}
                        </span>
                      )) || (
                        <span className="badge bg-light text-dark">
                          Sin tipos
                        </span>
                      )}
                    </td>
                    <td className="align-middle">
                      <div className="d-flex align-items-center">
                        <button
                          className="btn btn-secondary me-2"
                          onClick={() => navigate(`/editSpace/${space._id}`)}
                        >
                          Editar
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => confirmDelete(space)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="alert alert-info mt-4" role="alert">
              No se encontraron resultados para los criterios de búsqueda
              seleccionados.
            </div>
          )}
        </>
      )}
      {showModal && (
        <div className="modal fade show" style={{ display: "block" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirmar eliminación</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                >
                  .
                </button>
              </div>
              <div className="modal-body">
                <p>
                  ¿Estás seguro de que deseas eliminar el espacio{" "}
                  <strong>{selectedSpace?.nombre}</strong>?
                </p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
                <button className="btn btn-danger" onClick={deleteSpace}>
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

export default SpacesList;
