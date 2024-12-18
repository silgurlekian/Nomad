import express from "express";
import {
  getSpaces,
  getSpaceById,
  createSpace,
  updateSpace,
  deleteSpace,
} from "../controllers/spaceController.js";
import fileUpload from "express-fileupload";
import { protect } from "../middleware/authMiddleware.js"; 

const router = express.Router();

// Ruta pública para obtener todos los espacios
router.get("/", getSpaces); 
// Obtener un espacio por ID
router.get("/:id", getSpaceById);

// Rutas protegidas (requieren autenticación)
router.use(protect);

router.post("/",fileUpload({
    useTempFiles: true,
    tempFileDir: "./uploads",
}), createSpace);
router.put("/:id", updateSpace);
router.delete("/:id", deleteSpace);

export default router;
