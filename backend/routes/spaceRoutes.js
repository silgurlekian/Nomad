import express from 'express';
import {
    getSpaces,
    getSpaceById,
    createSpace,
    updateSpace,
    deleteSpace,
} from '../controllers/spacesController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Rutas protegidas
router.use(protect);

// Obtener todos los espacios con filtrado, orden y paginado
router.get('/', getSpaces);

// Obtener un espacio por ID
router.get('/:id', getSpaceById);

// Crear un nuevo espacio
router.post('/', createSpace);

// Actualizar un espacio existente
router.put('/:id', updateSpace);

// Eliminar un espacio
router.delete('/:id', deleteSpace);

export default router;
