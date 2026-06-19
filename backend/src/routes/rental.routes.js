import express from 'express';
import * as rentalController from '../controllers/rental.controller.js';
import { rentalValidators } from '../utils/validators.js';
import validate from '../middleware/validation.middleware.js';
import { verifyToken, isAdmin } from '../middleware/auth.middleware.js';
import { optionalAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

// Guest va user uchun (login shart emas)
router.post('/', rentalValidators.createRental, validate, rentalController.createRental);

// Faqat tizimga kirgan foydalanuvchilar uchun
router.get('/my', verifyToken, rentalController.getMyRentals);
router.get('/:id', verifyToken, rentalController.getRentalById);
router.patch('/:id/cancel', verifyToken, rentalController.cancelRental);

// Admin uchun
router.get('/admin/all', verifyToken, isAdmin, rentalController.getAllRentals);
router.patch('/admin/:id/approve', verifyToken, isAdmin, rentalController.approveRental);
router.patch('/admin/:id/complete', verifyToken, isAdmin, rentalController.completeRental);

export default router;