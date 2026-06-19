import express from 'express';
import * as adminAuthController from '../controllers/adminAuth.controller.js';
import { verifyToken, isAdmin } from '../middleware/auth.middleware.js';
import { body } from 'express-validator';
import validate from '../middleware/validation.middleware.js';

const router = express.Router();

const loginValidator = [
    body('email').isEmail().withMessage('Email noto\'g\'ri'),
    body('password').notEmpty().withMessage('Parol kiritilishi shart'),
];

router.post('/login', loginValidator, validate, adminAuthController.adminLogin);
router.post('/logout', verifyToken, isAdmin, adminAuthController.adminLogout);
router.get('/me', verifyToken, isAdmin, adminAuthController.getAdminProfile);

export default router;