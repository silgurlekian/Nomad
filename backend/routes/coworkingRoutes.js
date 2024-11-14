import express from 'express';
import {
    getCoworkings,
    getCoworkingById,
    createCoworking,
    updateCoworking,
    deleteCoworking,
} from '../controllers/coworkingController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Rutas protegidas
router.use(protect);

// Obtener todos los coworkings con filtrado, orden y paginado
router.get('/', getCoworkings);

// Obtener un coworking por ID
router.get('/:id', getCoworkingById);

// Crear un nuevo coworking
router.post('/', createCoworking);

// Actualizar un coworking existente
router.put('/:id', updateCoworking);

// Eliminar un coworking
router.delete('/:id', deleteCoworking);

export default router;
