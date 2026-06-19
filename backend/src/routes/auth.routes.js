import express from 'express';
import * as authController from '../controllers/auth.controller.js';
import { authValidators } from '../utils/validators.js';
import validate from '../middleware/validation.middleware.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/send-otp', authValidators.sendOTP, validate, authController.sendOTP);
router.post('/verify-otp', authValidators.verifyOTP, validate, authController.verifyOTP);
router.post('/refresh', authController.refreshToken);
router.post('/logout', verifyToken, authController.logout);
router.get('/me', verifyToken, authController.getCurrentUser);

export default router;
