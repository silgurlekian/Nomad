// controllers/authController.js
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";

const generarToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// Registro de Usuario
export const registerUser = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  const { nombre, email, password } = req.body;
  try {
    const existeUsuario = await User.findOne({ email });
    if (existeUsuario) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    const usuario = await User.create({ nombre, email, password });
    res.status(201).json({
      _id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      token: generarToken(usuario._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Error al registrar el usuario", error });
  }
};

// Login de Usuario
export const loginUser = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  const { email, password } = req.body;
  try {
    const usuario = await User.findOne({ email });
    console.log("Usuario encontrado:", usuario); // Log para verificar el usuario

    if (usuario) {
      const isPasswordValid = await usuario.matchPassword(password);
      console.log("Contraseña válida:", isPasswordValid); // Verificar si la contraseña es correcta

      if (isPasswordValid) {
        res.json({
          _id: usuario._id,
          nombre: usuario.nombre,
          email: usuario.email,
          token: generarToken(usuario._id),
        });
      } else {
        res.status(401).json({ message: "Credenciales inválidas" });
      }
    } else {
      res.status(401).json({ message: "Usuario no encontrado" });
    }
  } catch (error) {
    console.error("Error al autenticar:", error); // Log para errores generales
    res.status(500).json({ message: "Error al autenticar el usuario", error });
  }
};
