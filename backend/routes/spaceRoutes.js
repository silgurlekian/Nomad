import express from "express";
import {
  getSpaces,
  getSpaceById,
  createSpace,
  updateSpace,
  deleteSpace,
} from "../controllers/spaceController.js";
import { protect } from "../middleware/authMiddleware.js"; // Middleware de protección
import multer from "multer";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Ruta pública para obtener todos los espacios
router.get("/", getSpaces); // Esta ruta no requiere autenticación

// Rutas protegidas (requieren autenticación)
router.use(protect);

// Obtener un espacio por ID
router.get("/:id", getSpaceById);

// Crear un nuevo espacio con imagen
router.post("/", upload.single("imagen"), createSpace);

// Actualizar un espacio existente con imagen
router.put("/:id", upload.single("imagen"), updateSpace);

// Eliminar un espacio
router.delete("/:id", deleteSpace);

export default router;