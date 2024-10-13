import express from 'express';
import authRoutes from './auth.js';
import spaceRoutes from './space.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/spaces', spaceRoutes);

export default router;
