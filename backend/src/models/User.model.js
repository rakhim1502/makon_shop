import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
    phone: {
        type: String,
        unique: true,
        sparse: true,
        trim: true,
        match: [/^\+998\d{9}$/, 'Telefon formati noto\'g\'ri'],
    },
    email: {
        type: String,
        unique: true,
        sparse: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Email noto\'g\'ri'],
    },
    password: {
        type: String,
        select: false,
    },
    firstName: {
        type: String,
        trim: true,
        maxlength: 50,
    },
    lastName: {
        type: String,
        trim: true,
        maxlength: 50,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    avatar: {
        type: String,
        default: null,
    },
    refreshToken: {
        type: String,
        default: null,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    lastLogin: {
        type: Date,
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

// Virtual - to'liq ism
userSchema.virtual('fullName').get(function () {
    return `${this.firstName || ''} ${this.lastName || ''}`.trim();
});

// ✅ MONGOOSE 8+ UCHUN - next KERAK EMAS!
userSchema.pre('save', async function () {
    // Agar password o'zgartirilmasa, hech narsa qilmaslik
    if (!this.isModified('password')) return;

    // Parolni hash qilish
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Parolni tekshirish metodi
userSchema.methods.comparePassword = async function (candidatePassword) {
    if (!this.password) return false;
    return await bcrypt.compare(candidatePassword, this.password);
};

// Tokenlarni generatsiya qilish
userSchema.methods.generateTokens = function () {
    const accessToken = jwt.sign(
        { userId: this._id, phone: this.phone, role: this.role },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: process.env.JWT_ACCESS_EXPIRY || '15m' }
    );

    const refreshToken = jwt.sign(
        { userId: this._id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: process.env.JWT_REFRESH_EXPIRY || '7d' }
    );

    return { accessToken, refreshToken };
};

// Xavfsiz object qaytarish
userSchema.methods.toSafeObject = function () {
    const obj = this.toObject();
    delete obj.refreshToken;
    delete obj.password;
    return obj;
};

const User = mongoose.model('User', userSchema);
export default User;