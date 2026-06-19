import mongoose from 'mongoose';

const rentalItemSchema = new mongoose.Schema({
    equipment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Equipment',
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, 'Miqdor kamida 1 bo\'lishi kerak'],
        default: 1,
    },
    dailyRate: {
        type: Number,
        required: true,
    },
    subtotal: {
        type: Number,
        required: true,
    },
}, { _id: true });

const rentalSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false,  // Guest uchun null bo'lishi mumkin
        index: true,
    },
    customer: {
        name: String,
        phone: String,
        address: String,
    },
    items: [rentalItemSchema],
    startDate: {
        type: Date,
        required: [true, 'Boshlanish sanasi kiritilishi shart'],
    },
    endDate: {
        type: Date,
        required: [true, 'Tugash sanasi kiritilishi shart'],
    },
    duration: {
        type: Number,
        required: true,
    },
    pricing: {
        subtotal: {
            type: Number,
            required: true,
        },
        deposit: {
            type: Number,
            required: true,
        },
        discount: {
            type: Number,
            default: 0,
        },
        total: {
            type: Number,
            required: true,
        },
        currency: {
            type: String,
            default: 'UZS',
        },
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'active', 'completed', 'cancelled', 'rejected'],
        default: 'pending',
    },
    pickupLocation: {
        type: String,
        default: 'Makon Shop Office',
    },
    returnLocation: {
        type: String,
        default: 'Makon Shop Office',
    },
    notes: {
        type: String,
        maxlength: [500, 'Izoh 500 belgidan oshmasligi kerak'],
    },
    adminNotes: {
        type: String,
        maxlength: [500, 'Admin izohi 500 belgidan oshmasligi kerak'],
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'refunded'],
        default: 'pending',
    },
    paymentMethod: {
        type: String,
        enum: ['cash', 'card', 'click', 'payme'],
        default: 'cash',
    },
    pickupDate: Date,
    returnDate: Date,
    actualReturnDate: Date,
    isLate: {
        type: Boolean,
        default: false,
    },
    lateFee: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

// Indexes
rentalSchema.index({ user: 1, createdAt: -1 });
rentalSchema.index({ startDate: 1, endDate: 1 });

// Virtual - jami kunlar
rentalSchema.virtual('totalDays').get(function () {
    const oneDay = 24 * 60 * 60 * 1000;
    return Math.round(Math.abs((this.endDate - this.startDate) / oneDay)) + 1;
});

// ✅ MONGOOSE 8+ UCHUN - next KERAK EMAS!
rentalSchema.pre('save', async function () {
    // Agar startDate yoki endDate o'zgartirilmasa, hech narsa qilmaslik
    if (!this.isModified('startDate') && !this.isModified('endDate')) return;

    // Kunlar sonini hisoblash
    const oneDay = 24 * 60 * 60 * 1000;
    this.duration = Math.round(Math.abs((this.endDate - this.startDate) / oneDay)) + 1;

    // Narxlarni hisoblash
    let subtotal = 0;
    let deposit = 0;

    for (const item of this.items) {
        item.subtotal = item.dailyRate * this.duration;
        subtotal += item.subtotal;

        const equipment = await mongoose.model('Equipment').findById(item.equipment);
        if (equipment) {
            deposit += equipment.pricing.deposit * item.quantity;
        }
    }

    this.pricing.subtotal = subtotal;
    this.pricing.deposit = deposit;
    this.pricing.total = subtotal + deposit - this.pricing.discount;
});

const Rental = mongoose.model('Rental', rentalSchema);
export default Rental;