// App.js
import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Header from "./components/Header";
import Login from "./components/Login";
import Register from "./components/Register";
import CoworkingsList from "./components/CoworkingsList";
import AddCoworking from "./components/AddCoworking";
import EditCoworking from "./components/EditCoworking";
import ServiceList from "./components/ServiceList";
import AddService from "./components/AddService";
import EditService from "./components/EditService";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Navigate to="/register" />} />{" "}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/CoworkingsList" element={<CoworkingsList />} />
        <Route path="/addCoworking" element={<AddCoworking />} />
        <Route path="/editCoworking/:id" element={<EditCoworking />} />

        <Route path="/ServiceList" element={<ServiceList />} />
        <Route path="/AddService" element={<AddService />} />
        <Route path="/EditService/:id" element={<EditService />} />
      </Routes>
    </Router>
  );
}

export default App;
