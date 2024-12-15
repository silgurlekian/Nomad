import Reservation from "../models/ReservationModel.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

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
    const token = req.headers.authorization.split(" ")[1]; // Obtener el token del header Authorization
    if (!token) {
      return res
        .status(401)
        .json({ message: "No se proporcionó token de autenticación" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Decodificar el token
    const userId = decoded.id; // El ID del usuario extraído del token

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

    // Crear la nueva reserva con los datos recibidos, incluyendo el espacio reservado
    const newReservation = new Reservation({
      userId,
      spaceId, // Guardar el ID del espacio reservado
      fullName,
      date,
      startTime,
      endTime,
      numberOfPlaces,
      additionalNotes,
      code,
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

export const sendReservationEmail = async (req, res) => {
  const { reservationData, userEmail } = req.body;

  // Configuración del transportador de nodemailer
  const transporter = nodemailer.createTransport({
    service: "gmail", // O el servicio que estés utilizando
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Configuración del correo
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: "Confirmación de Reserva",
    text: `Hola ${reservationData.fullName},\n\nTu reserva ha sido confirmada.\nDetalles:\nFecha: ${reservationData.date}\nHora de inicio: ${reservationData.startTime}\nHora de fin: ${reservationData.endTime}\nCantidad de lugares: ${reservationData.numberOfPlaces}\n\nGracias por elegirnos!`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send({ message: "Correo enviado exitosamente" });
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    res.status(500).send({ message: "Error al enviar el correo" });
  }
};
