import express from "express";
import {
  getAllSpacesType,
  getSpaceTypeById,
  createSpaceType,
  updateSpaceType,
  deleteSpaceType,
} from "../controllers/spaceTypeController.js";

const router = express.Router();

router.get("/", getAllSpacesType); // Para obtener todos los tipos de espacio
router.get("/:id", getSpaceTypeById); // Para obtener un tipo de espacio por ID
router.post("/", createSpaceType); // Para crear un nuevo tipo de espacio
router.put("/:id", updateSpaceType); // Para actualizar un tipo de espacio por ID
router.delete("/:id", deleteSpaceType); // Para eliminar un tipo de espacio por ID

export default router;