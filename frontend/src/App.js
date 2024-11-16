// App.js
import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import Header from "./components/Header";
import Login from "./components/Login";
import Register from "./components/Register";
import SpacesList from "./components/SpacesList";
import AddSpace from "./components/AddSpace";
import EditSpace from "./components/EditSpace";
import ServiceList from "./components/ServiceList";
import AddService from "./components/AddService";
import EditService from "./components/EditService";

import UserView from "./components/UserView"; // Asegúrate de la ruta correcta

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<UserView />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/SpacesList" element={<SpacesList />} />
        <Route path="/AddSpace" element={<AddSpace />} />
        <Route path="/EditSpace/:id" element={<EditSpace />} />

        <Route path="/ServiceList" element={<ServiceList />} />
        <Route path="/AddService" element={<AddService />} />
        <Route path="/EditService/:id" element={<EditService />} />
      </Routes>
    </Router>
  );
}

export default App;
