import express from "express";
import multer from 'multer';
import {
  getSpaces,
  getSpaceById,
  createSpace,
  updateSpace,
  deleteSpace,
} from "../controllers/spaceController.js";
import { protect } from "../middleware/authMiddleware.js"; 

const router = express.Router();

// Configuración de multer para manejar archivos temporales
const upload = multer({ 
  dest: 'uploads/', // Directorio temporal para subir archivos
  limits: {
    fileSize: 5 * 1024 * 1024 // Límite de 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de archivo no permitido. Solo se aceptan imágenes.'), false);
    }
  }
});

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