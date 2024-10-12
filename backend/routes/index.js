import express from 'express';
import authRoutes from './auth.js';
import spaceRoutes from './space.js';

const router = express.Router();

router.use('/api/auth', authRoutes);
router.use('/api/spaces', spaceRoutes);

export default router;
