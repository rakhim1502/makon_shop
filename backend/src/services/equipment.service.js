// services/equipment.service.js
const Equipment = require('../models/Equipment.model');
const Rental = require('../models/Rental.model');
const ApiError = require('../utils/ApiError');

class EquipmentService {
    async checkAvailability(equipmentId, startDate, endDate, quantity = 1) {
        const equipment = await Equipment.findById(equipmentId);

        if (!equipment) {
            throw new ApiError(404, 'Equipment not found');
        }

        if (!equipment.isActive) {
            throw new ApiError(400, 'Equipment is not available for rent');
        }

        // Check date overlap with existing rentals
        const overlappingRentals = await Rental.find({
            equipment: equipmentId,
            status: { $in: ['approved', 'active'] },
            $or: [
                {
                    startDate: { $lte: new Date(endDate) },
                    endDate: { $gte: new Date(startDate) }
                }
            ]
        });

        // Calculate already booked quantity
        let bookedQuantity = 0;
        for (const rental of overlappingRentals) {
            bookedQuantity += rental.items.find(item =>
                item.equipment.toString() === equipmentId.toString()
            )?.quantity || 0;
        }

        const availableQuantity = equipment.stock.total - bookedQuantity;

        return {
            isAvailable: availableQuantity >= quantity,
            availableQuantity,
            requestedQuantity: quantity,
            equipment: {
                id: equipment._id,
                name: equipment.name,
                totalStock: equipment.stock.total,
                dailyRate: equipment.pricing.dailyRate
            },
            overlappingDates: overlappingRentals.map(rental => ({
                startDate: rental.startDate,
                endDate: rental.endDate
            }))
        };
    }

    async getAvailableEquipment(filters) {
        const {
            category,
            startDate,
            endDate,
            minPrice,
            maxPrice,
            search,
            page = 1,
            limit = 12
        } = filters;

        const query = {
            isActive: true,
            status: 'available'
        };

        if (category) {
            query.category = category;
        }

        if (minPrice || maxPrice) {
            query['pricing.dailyRate'] = {};
            if (minPrice) query['pricing.dailyRate'].$gte = minPrice;
            if (maxPrice) query['pricing.dailyRate'].$lte = maxPrice;
        }

        if (search) {
            query.$text = { $search: search };
        }

        // Get equipment matching basic filters
        let equipmentList = await Equipment.find(query)
            .populate('category')
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .sort({ 'rating.average': -1, createdAt: -1 });

        // If date range provided, filter by availability
        if (startDate && endDate) {
            const availableEquipment = [];

            for (const item of equipmentList) {
                const availability = await this.checkAvailability(
                    item._id,
                    startDate,
                    endDate,
                    1
                );

                if (availability.isAvailable) {
                    availableEquipment.push({
                        ...item.toObject(),
                        availability
                    });
                }
            }

            equipmentList = availableEquipment;
        }

        const total = await Equipment.countDocuments(query);

        return {
            data: equipmentList,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        };
    }
}

module.exports = new EquipmentService();