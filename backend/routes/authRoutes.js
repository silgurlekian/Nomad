import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';
import { check, validationResult } from 'express-validator';

const router = express.Router();

// Registro de usuarios con validaciones
router.post('/register', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'Por favor, incluye un email válido').isEmail(),
    check('password', 'La contraseña debe tener al menos 6 caracteres').isLength({ min: 6 }),
], registerUser);

// Login de usuarios con validaciones
router.post('/login', [
    check('email', 'Por favor, incluye un email válido').isEmail(),
    check('password', 'La contraseña es obligatoria').exists(),
], loginUser);

export default router;
