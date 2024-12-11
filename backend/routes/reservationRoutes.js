import express from "express";
import {
  createReservation,
  getAllReservations,
  getReservationsByUser,
  deleteReservation,  // Importa la nueva función
} from "../controllers/reservationController.js";

const router = express.Router();

// Obtener todas las reservas
router.get("/", getAllReservations);

// Obtener las reservas de un usuario
router.get("/user", getReservationsByUser);

// Crear una nueva reserva
router.post("/", createReservation);

// Eliminar una reserva por su ID
router.delete("/:id", deleteReservation);  // Ruta DELETE para eliminar una reserva

export default router;
