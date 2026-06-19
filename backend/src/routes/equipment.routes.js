import express from 'express';
import * as equipmentController from '../controllers/equipment.controller.js';
import { equipmentValidators } from '../utils/validators.js';
import validate from '../middleware/validation.middleware.js';
import { verifyToken, isAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes (hamma ko'rishi mumkin)
router.get('/', equipmentController.getEquipmentList);
router.get('/:id', equipmentController.getEquipmentById);
router.get('/:equipmentId/check-availability',
    equipmentValidators.checkAvailability,
    validate,
    equipmentController.checkAvailability
);

// Admin routes (faqat admin)
router.post('/', verifyToken, isAdmin, equipmentController.createEquipment);
router.put('/:id', verifyToken, isAdmin, equipmentController.updateEquipment);
router.delete('/:id', verifyToken, isAdmin, equipmentController.deleteEquipment);
router.patch('/:id/status', verifyToken, isAdmin, equipmentController.updateEquipmentStatus);

export default router;