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

// Rutas públicas: No requieren autenticación
router.get("/", getSpaces); // Ruta pública para obtener todos los espacios
router.get("/:id", getSpaceById); // Ruta pública para obtener el detalle de un espacio por ID

// Rutas protegidas: Requieren autenticación
router.use(protect); // Esta línea se aplica solo a las rutas que siguen
router.post("/", upload.single("imagen"), createSpace); // Crear un nuevo espacio con imagen
router.put("/:id", upload.single("imagen"), updateSpace); // Actualizar un espacio existente con imagen
router.delete("/:id", deleteSpace); // Eliminar un espacio

export default router;
