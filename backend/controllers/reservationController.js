import Reservation from "../models/ReservationModel.js";
import jwt from "jsonwebtoken";
import sendReservationEmail from "../services/sendReservationEmail.js";

// Obtener todas las reservas
export const getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find().populate(
      "userId",
      "fullName"
    );
    res.status(200).json(reservations);
  } catch (error) {
    console.error("Error obteniendo las reservas:", error);
    res.status(500).json({
      message: "Error al obtener las reservas",
      error: error.message,
    });
  }
};

// Obtener las reservas de un usuario
export const getReservationsByUser = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; // Obtener el token del header Authorization
    if (!token) {
      return res
        .status(401)
        .json({ message: "No se proporcionó token de autenticación" });
    }

    // Verificar el token y extraer el userId
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Decodificar el token
    const userId = decoded.id; // El ID del usuario extraído del token

    const reservations = await Reservation.find({ userId }).populate(
      "userId",
      "fullName"
    );
    res.status(200).json(reservations);
  } catch (error) {
    console.error("Error obteniendo las reservas del usuario:", error);
    res.status(500).json({
      message: "Error al obtener las reservas del usuario",
      error: error.message,
    });
  }
};

// Crear una nueva reserva
export const createReservation = async (req, res) => {
  try {
    console.log("Received reservation data:", req.body); // Log incoming data

    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ message: "No se proporcionó token de autenticación" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const {
      spaceId,
      fullName,
      date,
      startTime,
      endTime,
      numberOfPlaces,
      additionalNotes,
      code,
    } = req.body;
    console.log("Decoded user ID:", userId); // Log decoded user ID

    const newReservation = new Reservation({
      userId,
      spaceId,
      fullName,
      date,
      startTime,
      endTime,
      numberOfPlaces,
      additionalNotes,
      code,
    });

    await sendReservationEmail(req.body); // Pass full request body to email function

    await newReservation.save();
    console.log("Reservation created:", newReservation); // Log the created reservation

    res.status(201).json(newReservation); // Return the created reservation
  } catch (error) {
    console.error("Error creating reservation:", error); // Log error details
    res.status(500).json({
      message: "Error al crear la reserva",
      error: error.message,
    });
  }
};

// Eliminar una reserva por su ID
export const deleteReservation = async (req, res) => {
  try {
    const reservationId = req.params.id; // Obtener el ID de la reserva desde los parámetros

    // Buscar y eliminar la reserva
    const reservation = await Reservation.findByIdAndDelete(reservationId);

    if (!reservation) {
      return res.status(404).json({ message: "Reserva no encontrada" });
    }

    res.status(200).json({ message: "Reserva eliminada con éxito" });
  } catch (error) {
    console.error("Error al eliminar la reserva:", error);
    res.status(500).json({
      message: "Error al eliminar la reserva",
      error: error.message,
    });
  }
};
