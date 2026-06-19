import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import routes from './routes/index.js';
import errorHandler from './middleware/error.middleware.js';
import logger from './utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ✅ CORS SOZLAMALARI - MUHIM!
const corsOptions = {
    origin: [
        'https://makon-shop.vercel.app/',  // Production frontend
        'http://localhost:5173',  // Vite frontend
        'http://localhost:3000',  // React default
        process.env.CORS_ORIGIN  // .env dan keladigan URL
    ].filter(Boolean),
    credentials: true,  // Cookie'lar uchun
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    maxAge: 600  // 10 daqiqa cache
};

app.use(cors(corsOptions));

// Security headers
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }  // Rasmlar uchun muhim!
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// ✅ STATIC FILES - RASMLAR UCHUN MUHIM!
// Bu qator /uploads/ papkasini to'g'ridan-to'g'ri ochadi
app.use('/uploads', express.static(path.join(__dirname, '../uploads'), {
    setHeaders: (res, path) => {
        // Rasmlar uchun CORS header qo'shish
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET');
        res.header('Cache-Control', 'public, max-age=86400'); // 1 kun cache
    }
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
    message: { success: false, message: 'Juda ko\'p so\'rovlar' },
    standardHeaders: true,
    legacyHeaders: false,
});

app.use('/api/', limiter);

// API Routes
app.use('/api', routes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV,
    });
});

// Test endpoint for CORS
app.get('/test-cors', (req, res) => {
    res.json({ message: 'CORS is working!' });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: '👋 Makon Shop API ga xush kelibsiz!',
        version: '1.0.0',
        uploads: 'http://localhost:5000/uploads/',
    });
});

// 404 handler
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} topilmadi`,
    });
});

// Error handler
app.use(errorHandler);

export default app;