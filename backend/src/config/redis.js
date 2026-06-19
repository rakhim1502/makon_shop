// backend/src/config/redis.js
import { createClient } from 'redis';
import logger from '../utils/logger.js';

class RedisClient {
    constructor() {
        this.client = null;
    }

    async connect() {
        try {
            this.client = createClient({
                url: process.env.REDIS_URL || 'redis://localhost:6379',
            });

            this.client.on('error', (err) => {
                logger.error(`❌ Redis xatolik: ${err.message}`);
            });

            this.client.on('connect', () => {
                logger.info('✅ Redis ga muvaffaqiyatli ulandi');
            });

            await this.client.connect();
        } catch (error) {
            logger.error(`❌ Redis ga ulanishda xatolik: ${error.message}`);
        }
    }

    async set(key, value, expireSeconds = 3600) {
        try {
            await this.client.setEx(key, expireSeconds, JSON.stringify(value));
        } catch (error) {
            logger.error(`Redis SET xatolik: ${error.message}`);
        }
    }

    async get(key) {
        try {
            const data = await this.client.get(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            logger.error(`Redis GET xatolik: ${error.message}`);
            return null;
        }
    }

    async del(key) {
        try {
            await this.client.del(key);
        } catch (error) {
            logger.error(`Redis DEL xatolik: ${error.message}`);
        }
    }

    async disconnect() {
        if (this.client) {
            await this.client.quit();
        }
    }
}

export default new RedisClient(); F