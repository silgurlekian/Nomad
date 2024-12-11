import express from "express";
import {
  createReservation,
  getAllReservations,
  getReservationsByUser,
} from "../controllers/reservationController.js";

const router = express.Router();

// Obtener todas las reservas
router.get("/", getAllReservations);

// Obtener las reservas de un usuario
router.get("/user", getReservationsByUser);

// Crear una nueva reserva
router.post("/", createReservation);

export default router;
