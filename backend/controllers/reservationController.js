import Reservation from "../models/ReservationModel.js";
import jwt from "jsonwebtoken";

// Crear una nueva reserva
export const createReservation = async (req, res) => {
  try {
    // Verificar el token JWT
    const token = req.headers.authorization.split(" ")[1]; // Obtener el token del header Authorization
    if (!token) {
      return res.status(401).json({ message: "No se proporcionó token de autenticación" });
    }

    // Verificar el token y extraer el userId
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Decodificar el token
    const userId = decoded.id; // El ID del usuario extraído del token

    // Crear la nueva reserva con los datos recibidos
    const newReservation = new Reservation({
      ...req.body,
      userId, // Añadir el userId extraído del token
    });

    await newReservation.save();
    res.status(201).json(newReservation); // Enviar la reserva creada como respuesta
  } catch (error) {
    console.error("Error creando la reserva:", error);
    res.status(500).json({
      message: "Error al crear la reserva",
      error: error.message,
    });
  }
};
