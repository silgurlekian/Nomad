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

  return (
    <header className="bg-dark text-white p-3">
      <div className="container d-flex justify-content-between align-items-center">
        <Link to="/" className="text-white text-decoration-none">
          <img
            src="/images/logo.png"
            alt="Nomad Logo"
            className="logo"
            style={{ width: "150px", height: "auto" }}
          />
        </Link>

        <nav>
          <ul className="d-flex list-unstyled m-0">
            <li className="me-3">
              <Link
                to="/CoworkingsList"
                className="text-white text-decoration-none"
              >
                Coworkings
              </Link>
            </li>
            {token && (
              <>
                <li className="me-3">
                  <Link
                    to="/add-coworking"
                    className="text-white text-decoration-none"
                  >
                    Agregar Coworking
                  </Link>
                </li>
                <li className="me-3">
                  <button
                    onClick={handleLogout}
                    className="btn btn-outline-light btn-sm"
                  >
                    Logout
                  </button>
                </li>
              </>
            )}
            {!token && (
              <>
                <li className="me-3">
                  <Link to="/login" className="text-white text-decoration-none">
                    Login
                  </Link>
                </li>
                <li className="me-3">
                  <Link to="/register" className="btn btn-outline-light btn-sm">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>

        {/* Usuario logueado */}
        {token && user && (
          <div className="d-flex align-items-center">
            <span className="me-2">Hola, {user}</span>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
