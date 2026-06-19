import  { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import EquipmentCard from '../../components/equipment/EquipmentCard';

const EquipmentList = () => {
    const [equipment, setEquipment] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        category: '',
        search: '',
    });

    useEffect(() => {
        fetchEquipment();
    }, [filters]);

    const fetchEquipment = async () => {
        try {
            setLoading(true);
            const response = await api.get('/equipment', { params: filters });

            // ✅ TO'G'RI: response.data.data.data (chunki backend'da nested structure)
            const equipmentData = response.data.data?.data || response.data.data || [];
            setEquipment(Array.isArray(equipmentData) ? equipmentData : []);
        } catch (error) {
            console.error('Xatolik:', error);
            setEquipment([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl font-bold text-neutral-900 mb-4">
                        Ijara uchun jihozlar
                    </h1>
                    <p className="text-lg text-neutral-600">
                        Sayohatingiz uchun kerakli jihozlarni tanlang
                    </p>
                </motion.div>

                {/* Filtrlar */}
                <div className="mb-8 flex flex-wrap gap-4">
                    <input
                        type="text"
                        placeholder="🔍 Qidirish..."
                        value={filters.search}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                        className="px-4 py-2 rounded-lg border border-neutral-300 focus:border-primary-600 focus:ring-2 focus:ring-primary-200 outline-none"
                    />
                    <select
                        value={filters.category}
                        onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                        className="px-4 py-2 rounded-lg border border-neutral-300 focus:border-primary-600 focus:ring-2 focus:ring-primary-200 outline-none"
                    >
                        <option value="">Barcha kategoriyalar</option>
                        <option value="tent">🏕️ Palatkalar</option>
                        <option value="sleeping_bag">🛏️ Uyqu qoplari</option>
                        <option value="backpack">🎒 Ryukzaklar</option>
                        <option value="hiking_gear">🥾 Hiking jihozlar</option>
                        <option value="cooking">🍳 Oshxona jihozlari</option>
                    </select>
                </div>

                {/* Jihozlar grid */}
                {loading ? (
                    <div className="text-center py-20">
                        <div className="inline-block w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-neutral-600 mt-4">Yuklanmoqda...</p>
                    </div>
                ) : equipment.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl shadow-soft">
                        <div className="text-6xl mb-4">📦</div>
                        <h3 className="text-xl font-bold text-neutral-900 mb-2">
                            Jihozlar topilmadi
                        </h3>
                        <p className="text-neutral-600">
                            Hozircha jihozlar mavjud emas. Keyinroq qayta urinib ko'ring.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {equipment.map((item, index) => (
                            <motion.div
                                key={item._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <EquipmentCard item={item} />
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EquipmentList;