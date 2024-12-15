import express from "express";
import {
  createReservation,
  getAllReservations,
  getReservationsByUser,
  deleteReservation, 
  sendReservationEmail,
} from "../controllers/reservationController.js";

const router = express.Router();

// Obtener todas las reservas
router.get("/", getAllReservations);

// Obtener las reservas de un usuario
router.get("/user", getReservationsByUser);

// Crear una nueva reserva
router.post("/", createReservation);

// Eliminar una reserva por su ID
router.delete("/:id", deleteReservation); 

router.post('/send-reservation-email', sendReservationEmail);

export default router;
