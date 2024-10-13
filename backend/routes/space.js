import express from 'express';
import { getAllSpaces, getSpaceById, createSpace, updateSpace, deleteSpace } from '../controllers/spaceController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { check } from 'express-validator';
import { validateRequest } from '../middlewares/validateRequest.js';

const router = express.Router();

// Rutas públicas
router.get('/', getAllSpaces);
router.get('/:id', getSpaceById);

// Rutas protegidas
router.post('/', protect, [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('pricePerDay', 'El precio por día debe ser un número').isNumeric(),
    check('capacity', 'La capacidad debe ser un número').isNumeric(),
], validateRequest, createSpace);

router.put('/:id', protect, [
    check('pricePerDay', 'El precio por día debe ser un número').optional().isNumeric(),
    check('capacity', 'La capacidad debe ser un número').optional().isNumeric(),
], validateRequest, updateSpace);

router.delete('/:id', protect, deleteSpace);

export default router;
