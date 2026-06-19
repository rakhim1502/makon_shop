import User from '../models/User.model.js';
import OTP from '../models/OTP.model.js';
import smsService from './sms.service.js';
import ApiError from '../utils/ApiError.js';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

class AuthService {
    async sendOTP(phone) {
        const cleanPhone = phone.replace(/\s/g, '');
        if (!/^\+998\d{9}$/.test(cleanPhone)) {
            throw ApiError.badRequest('Telefon formati noto\'g\'ri');
        }

        await OTP.deleteMany({ phone: cleanPhone, isUsed: false });

        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const otpHash = crypto.createHash('sha256').update(otpCode).digest('hex');

        const otp = new OTP({
            phone: cleanPhone,
            otpHash,
            expiresAt: new Date(Date.now() + 2 * 60 * 1000),
        });
        await otp.save();

        await smsService.sendSMS(cleanPhone, 'Makon.Shop: Tasdiqlash kodingiz: ' + otpCode + '. 2 daqiqa amal qiladi.');

        return { message: 'OTP yuborildi', expiresIn: 120 };
    }

    async verifyOTP(phone, otpCode) {
        const cleanPhone = phone.replace(/\s/g, '');
        const otpHash = crypto.createHash('sha256').update(otpCode).digest('hex');

        const otp = await OTP.findOne({
            phone: cleanPhone,
            otpHash,
            isUsed: false,
            expiresAt: { $gt: new Date() },
        });

        if (!otp) throw ApiError.badRequest('OTP noto\'g\'ri yoki muddati tugagan');

        otp.isUsed = true;
        await otp.save();

        let user = await User.findOne({ phone: cleanPhone });
        if (!user) {
            user = await User.create({ phone: cleanPhone });
        }

        const tokens = user.generateTokens();
        user.refreshToken = tokens.refreshToken;
        user.lastLogin = new Date();
        await user.save();

        return { user: user.toSafeObject(), tokens };
    }

    async refreshToken(oldRefreshToken) {
        const decoded = jwt.verify(oldRefreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user || user.refreshToken !== oldRefreshToken) {
            throw ApiError.unauthorized('Refresh token noto\'g\'ri');
        }

        const tokens = user.generateTokens();
        user.refreshToken = tokens.refreshToken;
        await user.save();

        return tokens;
    }

    async logout(userId) {
        await User.findByIdAndUpdate(userId, { refreshToken: null });
    }
}

export default new AuthService();