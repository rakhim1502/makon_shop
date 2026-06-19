import Equipment from '../models/Equipment.model.js';
import Rental from '../models/Rental.model.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getEquipmentList = asyncHandler(async (req, res) => {
    const { category, search, minPrice, maxPrice, page = 1, limit = 12 } = req.query;

    const query = { isActive: true };
    if (category) query.category = category;
    if (search) query.name = { $regex: search, $options: 'i' };

    const skip = (page - 1) * limit;
    const [equipment, total] = await Promise.all([
        Equipment.find(query).skip(skip).limit(Number(limit)).sort({ createdAt: -1 }),
        Equipment.countDocuments(query)
    ]);

    res.status(200).json(new ApiResponse(200, {
        data: equipment,
        pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) }
    }, 'Jihozlar ro\'yxati'));
});

export const getEquipmentById = asyncHandler(async (req, res) => {
    const equipment = await Equipment.findById(req.params.id);
    if (!equipment) throw ApiError.notFound('Jihoz topilmadi');
    res.status(200).json(new ApiResponse(200, equipment, 'Jihoz ma\'lumotlari'));
});

export const checkAvailability = asyncHandler(async (req, res) => {
    const { equipmentId } = req.params;
    const { startDate, endDate, quantity = 1 } = req.query;

    const equipment = await Equipment.findById(equipmentId);
    if (!equipment) throw ApiError.notFound('Jihoz topilmadi');

    const overlappingRentals = await Rental.find({
        'items.equipment': equipmentId,
        status: { $in: ['approved', 'active'] },
        $or: [{ startDate: { $lte: new Date(endDate) }, endDate: { $gte: new Date(startDate) } }]
    });

    let bookedQty = 0;
    overlappingRentals.forEach(rental => {
        const item = rental.items.find(i => i.equipment.toString() === equipmentId);
        if (item) bookedQty += item.quantity;
    });

    const availableQty = equipment.stock.total - bookedQty;

    res.status(200).json(new ApiResponse(200, {
        isAvailable: availableQty >= quantity,
        availableQuantity: availableQty,
        totalStock: equipment.stock.total,
        requestedQuantity: Number(quantity)
    }, 'Mavjudlik tekshirildi'));
});

export const createEquipment = asyncHandler(async (req, res) => {
    const equipment = await Equipment.create(req.body);
    res.status(201).json(new ApiResponse(201, equipment, 'Jihoz yaratildi'));
});

export const updateEquipment = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    console.log('🔍 Update so\'rovi:', { id, updateData }); // Debug log

    const equipment = await Equipment.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
    );

    if (!equipment) {
        throw ApiError.notFound('Jihoz topilmadi');
    }

    console.log('✅ Jihoz yangilandi:', equipment.name);
    res.status(200).json(new ApiResponse(200, equipment, 'Jihoz muvaffaqiyatli yangilandi'));
});

export const deleteEquipment = asyncHandler(async (req, res) => {
    const { id } = req.params;

    console.log('🗑️ Delete so\'rovi:', id); // Debug log

    const equipment = await Equipment.findByIdAndUpdate(
        id,
        { isActive: false }, // Soft delete
        { new: true }
    );

    if (!equipment) {
        throw ApiError.notFound('Jihoz topilmadi');
    }

    console.log('✅ Jihoz o\'chirildi:', equipment.name);
    res.status(200).json(new ApiResponse(200, null, 'Jihoz muvaffaqiyatli o\'chirildi'));
});

export const updateEquipmentStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const equipment = await Equipment.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!equipment) throw ApiError.notFound('Jihoz topilmadi');
    res.status(200).json(new ApiResponse(200, equipment, 'Status yangilandi'));
});