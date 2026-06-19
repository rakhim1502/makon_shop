import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getImageUrl, formatCurrency } from '../../utils/helpers';

const EquipmentCard = ({ item }) => {
    const isAvailable = item.status === 'available' && item.stock?.available > 0;

    return (
        <motion.div
            whileHover={{ y: -5 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-medium transition-shadow duration-300 border border-neutral-100"
        >
            {/* Rasm qismi */}
            <div className="relative h-56 overflow-hidden bg-neutral-200">
                <img
                    src={getImageUrl(item.images?.[0]?.url)}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    onError={(e) => {
                        e.target.src = '/placeholder.jpg';
                    }}
                />

                {/* Status Badge */}
                <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold shadow-lg ${isAvailable
                        ? 'bg-primary-600 text-white'
                        : 'bg-red-500 text-white'
                    }`}>
                    {isAvailable ? 'Mavjud' : 'Band'}
                </div>

                {/* Kategoriya Badge */}
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-sm text-neutral-800">
                    {item.category === 'tent' ? '🏕️ Palatka' :
                        item.category === 'sleeping_bag' ? '🛏️ Uyqu qopi' :
                            item.category === 'backpack' ? '🎒 Ryukzak' : '⚙️ Jihoz'}
                </div>
            </div>

            {/* Ma'lumotlar qismi */}
            <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-neutral-900 line-clamp-1">
                        {item.name}
                    </h3>
                    <div className="flex items-center gap-1 text-accent-600">
                        <span className="text-sm font-semibold">⭐ {item.rating?.average || '4.8'}</span>
                    </div>
                </div>

                <p className="text-sm text-neutral-500 line-clamp-2 mb-4">
                    {item.description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                    <div>
                        <p className="text-xs text-neutral-400 font-medium">Kunlik narx</p>
                        <p className="text-lg font-bold text-primary-700">
                            {formatCurrency(item.pricing?.dailyRate)}
                        </p>
                    </div>

                    <Link
                        to={`/equipment/${item._id}`}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${isAvailable
                                ? 'bg-neutral-900 text-white hover:bg-primary-700 shadow-lg'
                                : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                            }`}
                    >
                        {isAvailable ? 'Tanlash' : 'Batafsil'}
                    </Link>
                </div>
            </div>
        </motion.div>
    );
};

export default EquipmentCard;