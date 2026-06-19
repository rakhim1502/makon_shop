import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Upload papkasini yaratish
const uploadDir = path.join(__dirname, '../../uploads/equipment');

console.log('📁 Upload directory:', uploadDir);

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log('✅ Upload papkasi yaratildi:', uploadDir);
}

// Storage sozlamalari
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log('💾 Fayl saqlanmoqda:', uploadDir);
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname).toLowerCase();
        const filename = 'eq-' + uniqueSuffix + ext;
        console.log('📝 Yangi fayl nomi:', filename);
        cb(null, filename);
    }
});

// Fayl filtri
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        cb(null, true);
    } else {
        cb(new Error('Faqat rasm fayllari (JPEG, PNG, GIF, WebP)'));
    }
};

export const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
    fileFilter: fileFilter,
});

export default uploadDir;