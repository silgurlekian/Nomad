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
import multerStorageCloudinary from "multer-storage-cloudinary";
import cloudinary from "cloudinary";

// Configura Cloudinary
const storage = multerStorageCloudinary({
  cloudinary: cloudinary.v2,
  allowedFormats: ['jpeg', 'jpg', 'png', 'webp'],
  transformation: [{ width: 500, height: 500, crop: "limit" }] // Redimensiona la imagen
});

const upload = multer({ storage });

const router = express.Router();

// Ruta pública para obtener todos los espacios
router.get("/", getSpaces); 
// Obtener un espacio por ID
router.get("/:id", getSpaceById);

// Rutas protegidas (requieren autenticación)
router.use(protect);

// Crear un nuevo espacio con imagen
router.post("/", upload.single("imagen"), createSpace);

// Actualizar un espacio existente con imagen
router.put("/:id", upload.single("imagen"), updateSpace);

// Eliminar un espacio
router.delete("/:id", deleteSpace);

export default router;
