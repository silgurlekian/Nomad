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

import SpacesTypeList from "./components/SpacesTypeList";
import AddSpaceType from "./components/AddSpaceType";
import EditSpaceType from "./components/EditSpaceType";

import ServiceList from "./components/ServiceList";
import AddService from "./components/AddService";
import EditService from "./components/EditService";

function App() {
  return (
    <Router
      basename="/portal"
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Header />
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/SpacesList" element={<SpacesList />} />
        <Route path="/AddSpace" element={<AddSpace />} />
        <Route path="/EditSpace/:id" element={<EditSpace />} />

        <Route path="/SpacesTypeList" element={<SpacesTypeList />} />
        <Route path="/AddSpaceType" element={<AddSpaceType />} />
        <Route path="/EditSpaceType/:id" element={<EditSpaceType />} />

        <Route path="/ServiceList" element={<ServiceList />} />
        <Route path="/AddService" element={<AddService />} />
        <Route path="/EditService/:id" element={<EditService />} />
      </Routes>
    </Router>
  );
}

export default App;
