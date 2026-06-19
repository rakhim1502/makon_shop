import express from 'express';
import { uploadImage, deleteImage } from '../controllers/upload.controller.js';
import { upload } from '../config/upload.js';
import { verifyToken, isAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/image', verifyToken, isAdmin, upload.single('image'), uploadImage);
router.delete('/image', verifyToken, isAdmin, deleteImage);

export default router;