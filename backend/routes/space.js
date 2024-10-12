import express from 'express';
import { getAllSpaces, getSpaceById, createSpace, updateSpace, deleteSpace } from '../controllers/spaceController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Rutas públicas
router.get('/', getAllSpaces);
router.get('/:id', getSpaceById);

// Rutas protegidas
router.post('/', protect, createSpace);
router.put('/:id', protect, updateSpace);
router.delete('/:id', protect, deleteSpace);

export default router;
