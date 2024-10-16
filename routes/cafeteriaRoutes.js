import express from 'express';
import {
    getCafeterias,
    getCafeteriaById,  // Cambiar a singular
    createCafeteria,   // Cambiar a singular
    updateCafeteria,   // Cambiar a singular
    deleteCafeteria,   // Cambiar a singular
} from '../controllers/cafeteriasController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Rutas protegidas
router.use(protect);

// Obtener todas las cafeterías con filtrado, orden y paginado
router.get('/', getCafeterias);

// Obtener una cafetería por ID
router.get('/:id', getCafeteriaById);

// Crear una nueva cafetería
router.post('/', createCafeteria);

// Actualizar una cafetería existente
router.put('/:id', updateCafeteria);

// Eliminar una cafetería
router.delete('/:id', deleteCafeteria);

export default router;
