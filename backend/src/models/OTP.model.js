// backend/src/models/OTP.model.js
import mongoose from 'mongoose';
import crypto from 'crypto';

const otpSchema = new mongoose.Schema({
    phone: {
        type: String,
        required: [true, 'Telefon raqam kiritilishi shart'],
        trim: true,
        match: [/^\+998\d{9}$/, 'Telefon raqam formati noto\'g\'ri'],
    },
    otpHash: {
        type: String,
        required: true,
    },
    purpose: {
        type: String,
        enum: ['login', 'verify'],
        default: 'login',
    },
    expiresAt: {
        type: Date,
        required: true,
        index: { expires: 0 }, // TTL index - avtomatik o'chirish
    },
    attempts: {
        type: Number,
        default: 0,
        max: 3,
    },
    isUsed: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

// OTP generatsiya qilish
otpSchema.statics.generateOTP = function () {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// OTP ni hash qilish
otpSchema.methods.hashOTP = function (otp) {
    return crypto.createHash('sha256').update(otp).digest('hex');
};

// OTP ni tekshirish
otpSchema.methods.verifyOTP = async function (otp) {
    if (this.isUsed) throw new Error('OTP allaqachon ishlatilgan');
    if (this.attempts >= 3) throw new Error('Juda ko\'p urinish');
    if (new Date() > this.expiresAt) throw new Error('OTP muddati tugagan');

    const hashedOTP = this.hashOTP(otp);
    if (hashedOTP !== this.otpHash) {
        this.attempts += 1;
        await this.save();
        throw new Error('OTP noto\'g\'ri');
    }

    this.isUsed = true;
    await this.save();
    return true;
};

// ✅ ES MODULES EXPORT
const OTP = mongoose.model('OTP', otpSchema);
export default OTP;