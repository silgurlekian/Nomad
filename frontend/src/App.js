// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import CoworkingsList from './components/CoworkingsList';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/register" />} /> {/* Redirige a /register */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/CoworkingsList" element={<CoworkingsList />} />
            </Routes>
        </Router>
    );
}

export default App;
