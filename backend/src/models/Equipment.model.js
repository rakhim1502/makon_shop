import mongoose from 'mongoose';

const equipmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Jihoz nomi kiritilishi shart'],
        trim: true,
        maxlength: [100, 'Nomi 100 belgidan oshmasligi kerak'],
    },
    slug: {
        type: String,
        unique: true,
        sparse: true,
        lowercase: true,
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Tavsif kiritilishi shart'],
        maxlength: [1000, 'Tavsif 1000 belgidan oshmasligi kerak'],
    },
    category: {
        type: String,
        required: [true, 'Kategoriya tanlanishi shart'],
        enum: ['tent', 'sleeping_bag', 'backpack', 'hiking_gear', 'cooking', 'clothing', 'other'],
    },
    brand: {
        type: String,
        trim: true,
    },
    images: [{
        url: { type: String, required: true },
        filename: String,
        isPrimary: { type: Boolean, default: false },
    }],
    pricing: {
        dailyRate: {
            type: Number,
            required: [true, 'Kunlik narx kiritilishi shart'],
            min: [0, 'Narx 0 dan katta bo\'lishi kerak'],
        },
        weeklyRate: {
            type: Number,
            min: 0,
        },
        deposit: {
            type: Number,
            required: [true, 'Depozit kiritilishi shart'],
            min: [0, 'Depozit 0 dan katta bo\'lishi kerak'],
        },
        currency: {
            type: String,
            default: 'UZS',
        },
    },
    specifications: {
        weight: String,
        dimensions: String,
        capacity: String,
        material: String,
        color: String,
    },
    stock: {
        total: {
            type: Number,
            required: [true, 'Zahira soni kiritilishi shart'],
            min: [1, 'Zahira soni kamida 1 bo\'lishi kerak'],
            default: 1,
        },
        available: {
            type: Number,
            min: 0,
        },
    },
    status: {
        type: String,
        enum: ['available', 'rented', 'maintenance', 'retired'],
        default: 'available',
    },
    condition: {
        type: String,
        enum: ['new', 'excellent', 'good', 'fair'],
        default: 'good',
    },
    rentalCount: {
        type: Number,
        default: 0,
    },
    rating: {
        average: {
            type: Number,
            min: 0,
            max: 5,
            default: 0,
        },
        count: {
            type: Number,
            default: 0,
        },
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

// Indexes
equipmentSchema.index({ name: 'text', description: 'text' });
equipmentSchema.index({ category: 1 });

// Virtual - mavjudlik
equipmentSchema.virtual('isAvailable').get(function () {
    return this.status === 'available' && this.stock.available > 0;
});

// ✅ MONGOOSE 8+ UCHUN - next KERAK EMAS!
equipmentSchema.pre('save', function () {
    // Slug generatsiya qilish
    if (this.isModified('name')) {
        this.slug = this.name.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }

    // Available stock ni yangilash
    if (this.isModified('status') || this.isModified('stock.total')) {
        if (this.status === 'available') {
            this.stock.available = this.stock.total;
        } else if (this.status === 'rented') {
            this.stock.available = 0;
        }
    }
});

// ✅ ES MODULES EXPORT
const Equipment = mongoose.model('Equipment', equipmentSchema);
export default Equipment;