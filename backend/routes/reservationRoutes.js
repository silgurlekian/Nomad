import express from "express";
import {
//   getAllReservations,
//   getReservationById,
  createReservation,
//   updateReservation,
//   deleteReservation,
} from "../controllers/reservationController.js";

const router = express.Router();

// router.get("/", getAllReservations);
// router.get("/:id", getReservationById);
router.post("/", createReservation); // Aquí se maneja la creación de reservas
// router.put("/:id", updateReservation);
// router.delete("/:id", deleteReservation);

export default router;
