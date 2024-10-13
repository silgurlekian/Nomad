import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';
import { check } from 'express-validator';
import { validateRequest } from '../middlewares/validateRequest.js';

const router = express.Router();

router.post('/register', [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'Por favor, ingresa un email válido').isEmail(),
    check('password', 'La contraseña debe tener al menos 6 caracteres').isLength({ min: 6 })
], validateRequest, registerUser);

router.post('/login', [
    check('email', 'Por favor, ingresa un email válido').isEmail(),
    check('password', 'La contraseña es obligatoria').exists()
], validateRequest, loginUser);

export default router;
