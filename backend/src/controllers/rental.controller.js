import Rental from '../models/Rental.model.js';
import Equipment from '../models/Equipment.model.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import logger from '../utils/logger.js';
import telegramService from '../services/telegram.service.js';

export const createRental = asyncHandler(async (req, res) => {
    const {
        equipment: equipmentId,
        startDate,
        endDate,
        quantity = 1,
        notes,
        customerName,
        customerPhone,
        customerAddress
    } = req.body;

    const userId = req.user?._id || null;

    if (!userId && (!customerName || !customerPhone)) {
        throw ApiError.badRequest('Ism va telefon kiritilishi shart');
    }

    const equipment = await Equipment.findById(equipmentId);
    if (!equipment) throw ApiError.notFound('Jihoz topilmadi');

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end <= start) throw ApiError.badRequest('Sanalar noto\'g\'ri');

    const overlappingRentals = await Rental.find({
        'items.equipment': equipmentId,
        status: { $in: ['approved', 'active', 'pending'] },
        $or: [{ startDate: { $lte: end }, endDate: { $gte: start } }]
    });

    let bookedQty = 0;
    overlappingRentals.forEach(rental => {
        const item = rental.items.find(i => i.equipment.toString() === equipmentId);
        if (item) bookedQty += item.quantity;
    });

    if (bookedQty + quantity > equipment.stock.total) {
        throw ApiError.badRequest('Bu sanalarda yetarli jihoz yo\'q');
    }

    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    const dailyRate = equipment.pricing.dailyRate;
    const subtotal = dailyRate * days * quantity;
    const deposit = equipment.pricing.deposit * quantity;

    const rental = await Rental.create({
        user: userId,
        customer: userId ? null : {
            name: customerName,
            phone: customerPhone,
            address: customerAddress || ''
        },
        items: [{
            equipment: equipmentId,
            quantity,
            dailyRate,
            subtotal: dailyRate * days
        }],
        startDate: start,
        endDate: end,
        duration: days,
        pricing: {
            subtotal,
            deposit,
            discount: 0,
            total: subtotal + deposit
        },
        status: 'pending',
        notes
    });

    //  Telegram'ga xabar yuborish
    try {
        await telegramService.sendNewRentalNotification(rental);
    } catch (error) {
        logger.error('Telegram xabar yuborishda xatolik:', error);
    }

    res.status(201).json(new ApiResponse(201, rental, 'Buyurtma yaratildi'));
});

export const getMyRentals = asyncHandler(async (req, res) => {
    const rentals = await Rental.find({ user: req.user._id })
        .populate('items.equipment', 'name images')
        .sort({ createdAt: -1 });

    res.status(200).json(new ApiResponse(200, rentals, 'Buyurtmalar ro\'yxati'));
});

export const getRentalById = asyncHandler(async (req, res) => {
    const rental = await Rental.findById(req.params.id)
        .populate('items.equipment')
        .populate('user', 'firstName lastName phone');

    if (!rental) throw ApiError.notFound('Buyurtma topilmadi');

    if (req.user.role !== 'admin' && rental.user._id.toString() !== req.user._id.toString()) {
        throw ApiError.forbidden('Bu buyurtmani ko\'rish huquqi yo\'q');
    }

    res.status(200).json(new ApiResponse(200, rental, 'Buyurtma tafsilotlari'));
});

export const cancelRental = asyncHandler(async (req, res) => {
    const rental = await Rental.findById(req.params.id);
    if (!rental) throw ApiError.notFound('Buyurtma topilmadi');

    if (rental.user.toString() !== req.user._id.toString()) {
        throw ApiError.forbidden('Bu buyurtmani bekor qilish huquqi yo\'q');
    }

    if (['completed', 'cancelled'].includes(rental.status)) {
        throw ApiError.badRequest('Bu buyurtmani bekor qilib bo\'lmaydi');
    }

    rental.status = 'cancelled';
    await rental.save();

    res.status(200).json(new ApiResponse(200, rental, 'Buyurtma bekor qilindi'));
});

export const getAllRentals = asyncHandler(async (req, res) => {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status) query.status = status;

    const skip = (page - 1) * limit;
    const [rentals, total] = await Promise.all([
        Rental.find(query)
            .populate('user', 'firstName lastName phone')
            .populate('items.equipment', 'name images category')  // ✅ images qo'shildi!
            .skip(skip)
            .limit(Number(limit))
            .sort({ createdAt: -1 }),
        Rental.countDocuments(query)
    ]);

    res.status(200).json(new ApiResponse(200, {
        data: rentals,
        pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) }
    }, 'Barcha buyurtmalar'));
});

export const approveRental = asyncHandler(async (req, res) => {
    const rental = await Rental.findById(req.params.id);
    if (!rental) throw ApiError.notFound('Buyurtma topilmadi');

    if (rental.status !== 'pending') {
        throw ApiError.badRequest('Faqat pending statusdagi buyurtmani tasdiqlash mumkin');
    }

    rental.status = 'approved';
    await rental.save();

    // 📬 Telegram'ga xabar
    try {
        await telegramService.sendOrderStatusUpdate(rental, 'approved');
    } catch (error) {
        logger.error('Telegram xabar yuborishda xatolik:', error);
    }

    res.status(200).json(new ApiResponse(200, rental, 'Buyurtma tasdiqlandi'));
});

export const completeRental = asyncHandler(async (req, res) => {
    const rental = await Rental.findById(req.params.id);
    if (!rental) throw ApiError.notFound('Buyurtma topilmadi');

    if (rental.status !== 'active') {
        throw ApiError.badRequest('Faqat active statusdagi buyurtmani tugatish mumkin');
    }

    rental.status = 'completed';
    rental.actualReturnDate = new Date();
    await rental.save();

    // 📬 Telegram'ga xabar
    try {
        await telegramService.sendOrderStatusUpdate(rental, 'completed');
    } catch (error) {
        logger.error('Telegram xabar yuborishda xatolik:', error);
    }

    res.status(200).json(new ApiResponse(200, rental, 'Buyurtma tugatildi'));
});