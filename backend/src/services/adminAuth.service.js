import User from '../models/User.model.js';
import ApiError from '../utils/ApiError.js';
import jwt from 'jsonwebtoken';

class AdminAuthService {
    async login(email, password) {
        if (!email || !password) {
            throw ApiError.badRequest('Email va parol kiritilishi shart');
        }

        console.log('🔍 Login urinishi:', email); // Debug log

        // Admin foydalanuvchini topish (password bilan)
        const admin = await User.findOne({
            email: email.toLowerCase().trim(),
            role: 'admin',
            isActive: true
        }).select('+password');

        if (!admin) {
            console.log('❌ Admin topilmadi');
            throw ApiError.unauthorized('Email yoki parol noto\'g\'ri');
        }

        console.log('✅ Admin topildi:', admin.email);

        // Parolni tekshirish
        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            console.log('❌ Parol noto\'g\'ri');
            throw ApiError.unauthorized('Email yoki parol noto\'g\'ri');
        }

        console.log('✅ Parol to\'g\'ri');

        // Tokenlarni yaratish
        const tokens = admin.generateTokens();
        admin.refreshToken = tokens.refreshToken;
        admin.lastLogin = new Date();
        await admin.save();

        return {
            user: {
                id: admin._id,
                email: admin.email,
                firstName: admin.firstName,
                lastName: admin.lastName,
                role: admin.role,
            },
            tokens,
        };
    }

    async logout(adminId) {
        await User.findByIdAndUpdate(adminId, { refreshToken: null });
    }
}

export default new AdminAuthService();