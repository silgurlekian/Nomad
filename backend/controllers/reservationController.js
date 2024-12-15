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

    // Detalles de la reserva
    const reservationDetails = {
      spaceName: "Nombre del espacio", // Aquí puedes incluir el nombre real del espacio
      date,
      startTime,
      endTime,
      numberOfPlaces,
      code,
    };

    // Enviar el correo de confirmación
    sendConfirmationEmail(fullName, req.body.email, reservationDetails);

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

// Configuración de Nodemailer para enviar correos electrónicos
const transporter = nodemailer.createTransport({
  service: "gmail", // Puedes usar el servicio que prefieras (Ejemplo: Gmail)
  auth: {
    user: process.env.EMAIL_USER, // Tu correo electrónico
    pass: process.env.EMAIL_PASS, // Tu contraseña o un App Password
  },
});

// Función para enviar correo electrónico
const sendConfirmationEmail = (email, fullName, reservationDetails) => {
  const mailOptions = {
    from: process.env.EMAIL_USER, // Dirección de correo electrónico desde la cual se envía el correo
    to: email, // Dirección de correo electrónico del destinatario
    subject: `Confirmación de reserva - ${fullName}`,
    text: `
      Hola ${fullName},

      Gracias por realizar tu reserva. Aquí están los detalles:

      Espacio: ${reservationDetails.spaceName}
      Fecha: ${reservationDetails.date}
      Hora de inicio: ${reservationDetails.startTime}
      Hora de fin: ${reservationDetails.endTime}
      Número de lugares: ${reservationDetails.numberOfPlaces}
      
      Código de reserva: ${reservationDetails.code}

      Si tienes alguna pregunta o necesitas realizar algún cambio, no dudes en contactarnos.

      ¡Te esperamos!

      Saludos,
      El equipo de Nomad
    `,
  };

  // Enviar el correo
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error enviando correo: ", error);
    } else {
      console.log("Correo enviado: " + info.response);
    }
  });
};
