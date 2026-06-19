// backend/server.js
import app from './src/app.js';
import connectDB from './src/config/database.js';
import logger from './src/utils/logger.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;

// MongoDB ga ulanish
connectDB();

// Server ishga tushirish
const server = app.listen(PORT, () => {
    logger.info(`🚀 Server ${PORT}-portda ishga tushdi`);
    logger.info(`📍 Environment: ${process.env.NODE_ENV}`);
    logger.info(`🔗 API URL: http://localhost:${PORT}/api`);
});

// Unhandled Promise Rejections
process.on('unhandledRejection', (err) => {
    logger.error(`❌ Xatolik: ${err.message}`);
    server.close(() => {
        process.exit(1);
    });
});

// SIGTERM handling
process.on('SIGTERM', () => {
    logger.info(' SIGTERM qabul qilindi. Server to\'xtatilmoqda...');
    server.close(() => {
        logger.info('💤 Server to\'xtatildi');
    });
});

export default server;