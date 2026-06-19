// backend/src/services/rental.service.js
import Rental from '../models/Rental.model.js';

class RentalService {
    async getUserRentalStats(userId) {
        const stats = await Rental.aggregate([
            { $match: { user: userId } },
            {
                $group: {
                    _id: null,
                    totalRentals: { $sum: 1 },
                    totalSpent: { $sum: '$pricing.subtotal' },
                    activeRentals: { $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } }
                }
            }
        ]);
        return stats[0] || { totalRentals: 0, totalSpent: 0, activeRentals: 0 };
    }
}

export default new RentalService();