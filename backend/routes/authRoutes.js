import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { check } from 'express-validator';
import { resetPassword, resetPasswordRequest } from '../controllers/authController.js'; 

const router = express.Router();

router.post('/register', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'Por favor, incluye un email válido').isEmail(),
    check('password', 'La contraseña debe tener al menos 6 caracteres').isLength({ min: 6 }),
], registerUser);

router.post('/login', [
    check('email', 'Por favor, incluye un email válido').isEmail(),
    check('password', 'La contraseña es obligatoria').exists(),
], loginUser);

// Ruta protegida que solo puede ser accedida por administradores
router.get('/admin', protect, admin, (req, res) => {
   res.json({ message: 'Bienvenido al portal de administración' });
});

router.post('/reset-password', [
    check('email', 'Por favor, incluye un email válido').isEmail(),
], resetPasswordRequest);

router.post('/reset-password/:token', [
    check('newPassword', 'La nueva contraseña es obligatoria').not().isEmpty(),
], resetPassword);

export default router;