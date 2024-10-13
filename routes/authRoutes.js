import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';

const router = express.Router();

// Registro de usuarios
router.post('/register', registerUser);

// Login de usuarios
router.post('/login', loginUser);

export default router;
