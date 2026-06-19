import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import uploadDir from '../config/upload.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const uploadImage = asyncHandler(async (req, res) => {
    console.log('📥 Upload so\'rovi:', req.file);

    if (!req.file) {
        console.log('❌ Fayl topilmadi');
        throw ApiError.badRequest('Rasm fayli topilmadi');
    }

    // ✅ URL yaratish - /uploads/equipment/filename.jpg
    const imageUrl = `/uploads/equipment/${req.file.filename}`;
    const fullUrl = `http://localhost:${process.env.PORT || 5000}${imageUrl}`;

    console.log('✅ Rasm yuklandi:', {
        filename: req.file.filename,
        originalname: req.file.originalname,
        size: req.file.size,
        url: fullUrl
    });

    res.status(200).json(new ApiResponse(200, {
        url: imageUrl,  // /uploads/equipment/...
        fullUrl: fullUrl,  // http://localhost:5000/uploads/...
        filename: req.file.filename,
    }, 'Rasm muvaffaqiyatli yuklandi'));
});

export const deleteImage = asyncHandler(async (req, res) => {
    const { filename } = req.body;

    if (!filename) {
        throw ApiError.badRequest('Fayl nomi kiritilishi shart');
    }

    const filePath = path.join(uploadDir, filename);

    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log('🗑️ Rasm o\'chirildi:', filename);
    }

    res.status(200).json(new ApiResponse(200, null, 'Rasm o\'chirildi'));
});