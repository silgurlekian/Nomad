import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Parsear los datos del usuario
  const parsedUser = user ? JSON.parse(user) : null;

  return (
    <header className="bg-light p-3">
      <div className="container d-flex justify-content-between align-items-center">
        <Link to="/SpacesList" className="text-decoration-none">
          <img
            src="./images/logo.png"
            alt="Nomad Logo"
            className="logo"
            style={{ width: "150px", height: "auto" }}
          />
        </Link>
        <h1 style={{ visibility: "hidden" }}>nomad</h1>

        <nav>
          <ul className="d-flex align-items-center list-unstyled m-0">
            <li className="me-3">
              <Link to="/SpacesList" className="text-decoration-none">
                Espacios
              </Link>
            </li>

            <li className="me-3">
              <Link to="/SpacesTypeList" className="text-decoration-none">
                Tipos de espacios
              </Link>
            </li>

            <li className="me-3">
              <Link to="/ServiceList" className="text-decoration-none">
                Servicios
              </Link>
            </li>
            {token && parsedUser && (
              <>
                <li className="d-flex align-items-center">
                  <span className="me-2">Hola, {parsedUser.nombre}</span>{" "}
                </li>
                <li className="me-3">
                  <button
                    onClick={handleLogout}
                    className="btn btn-outline-dark text-decoration-none mt-0"
                  >
                    Cerrar sesión
                  </button>
                </li>
              </>
            )}
            {!token && (
              <>
                <li className="me-3">
                  <Link to="/login" className="text-decoration-none">
                    Iniciar sesión
                  </Link>
                </li>
                <li className="me-3">
                  <Link to="/register" className="btn btn-outline-dark btn-sm">
                    Registrarse
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
