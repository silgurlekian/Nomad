import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import Header from "./components/admin/Header";
import Login from "./components/admin/Login";
import Register from "./components/admin/Register";
import SpacesList from "./components/admin/SpacesList";
import AddSpace from "./components/admin/AddSpace";
import EditSpace from "./components/admin/EditSpace";
import ServiceList from "./components/admin/ServiceList";
import AddService from "./components/admin/AddService";
import EditService from "./components/admin/EditService";

import UserView from "./components/user/UserView";

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
