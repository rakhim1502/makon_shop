import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

export const verifyToken = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        throw ApiError.unauthorized('Access token topilmadi');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        req.user = await User.findById(decoded.userId).select('-refreshToken');

        if (!req.user) {
            throw ApiError.unauthorized('Foydalanuvchi topilmadi');
        }

        if (!req.user.isActive) {
            throw ApiError.forbidden('Hisobingiz bloklangan');
        }

        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            throw ApiError.unauthorized('Noto\'g\'ri token');
        }
        if (error.name === 'TokenExpiredError') {
            throw ApiError.unauthorized('Token muddati tugagan');
        }
        throw error;
    }
});

export const isAdmin = asyncHandler(async (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        throw ApiError.forbidden('Admin huquqlari talab qilinadi');
    }
});

// ✅ YANGI - Ixtiyoriy auth (token bo'lmasa ham davom etadi)
export const optionalAuth = asyncHandler(async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
            req.user = await User.findById(decoded.userId).select('-refreshToken');
        }
    } catch (error) {
        // Token bo'lmasa ham davom etamiz
    }
    next();
});