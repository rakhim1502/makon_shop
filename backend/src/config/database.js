// backend/src/config/database.js
import mongoose from 'mongoose';
import logger from '../utils/logger.js';

const connectDB = async () => {
    try {
        // ✅ Mongoose 7+ uchun - parametrsiz ulanish
        const conn = await mongoose.connect(process.env.MONGODB_URI);

        logger.info(`✅ MongoDB ga muvaffaqiyatli ulandi: ${conn.connection.host}`);

        // Connection event listeners
        mongoose.connection.on('error', (err) => {
            logger.error(`❌ MongoDB xatolik: ${err.message}`);
        });

        mongoose.connection.on('disconnected', () => {
            logger.warn('⚠️ MongoDB dan uzildi');
        });

        mongoose.connection.on('reconnected', () => {
            logger.info('♻️ MongoDB ga qayta ulandi');
        });

    } catch (error) {
        logger.error(`❌ MongoDB ga ulanishda xatolik: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;