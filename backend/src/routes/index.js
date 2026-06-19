import express from 'express';
import authRoutes from './auth.routes.js';
import equipmentRoutes from './equipment.routes.js';
import rentalRoutes from './rental.routes.js';
import userRoutes from './user.routes.js';
import adminAuthRoutes from './adminAuth.routes.js';
import uploadRoutes from './upload.routes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/admin/auth', adminAuthRoutes);
router.use('/equipment', equipmentRoutes);
router.use('/rentals', rentalRoutes);
router.use('/users', userRoutes);
router.use('/upload', uploadRoutes);

export default router;
