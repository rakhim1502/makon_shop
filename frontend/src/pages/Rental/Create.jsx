import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../services/api';
import { formatCurrency } from '../../utils/helpers';
import toast from 'react-hot-toast';

const RentalCreate = () => {
    const navigate = useNavigate();

    const [equipment, setEquipment] = useState([]);
    const [selectedEquipment, setSelectedEquipment] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [quantity, setQuantity] = useState(1);
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
            const res = await api.get('/equipment', { params: filters });
            setEquipment(res.data.data.data || []);
        } catch (error) {
            toast.error('Jihozlarni yuklashda xatolik');
        } finally {
            setLoading(false);
        }
    };

    const handleProceedToCheckout = () => {
        if (!selectedEquipment) {
            toast.error('Iltimos, jihozni tanlang');
            return;
        }
        if (!startDate || !endDate) {
            toast.error('Iltimos, sanalarni tanlang');
            return;
        }

        // ✅ Bir xil sana bo'lsa ham bo'ladi (1 kun)
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (end < start) {
            toast.error('Tugash sanasi boshlanish sanasidan oldin bo\'lishi mumkin emas');
            return;
        }

        navigate('/rental/checkout', {
            state: {
                equipment: selectedEquipment,
                startDate,
                endDate,
                quantity,
            },
        });
    };

    const calculateDays = () => {
        if (!startDate || !endDate) return 0;
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (start.toDateString() === end.toDateString()) {
            return 1;
        }

        const diffTime = Math.abs(end - start);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    };

    const calculateTotal = () => {
        if (!selectedEquipment) return 0;
        const days = calculateDays();
        return selectedEquipment.pricing.dailyRate * days * quantity;
    };

    return (
        <div className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl font-bold text-neutral-900 mb-8"
                >
                    Ijara uchun jihoz tanlash
                </motion.h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Jihozlar ro'yxati */}
                    <div className="lg:col-span-2">
                        <div className="mb-6 flex flex-wrap gap-4">
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
                                <option value="backpack"> Ryukzaklar</option>
                                <option value="hiking_gear">🥾 Hiking jihozlar</option>
                                <option value="cooking">🍳 Oshxona jihozlari</option>
                            </select>
                        </div>

                        {loading ? (
                            <div className="text-center py-20">
                                <div className="inline-block w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {equipment.map((item) => (
                                    <motion.div
                                        key={item._id}
                                        whileHover={{ scale: 1.02 }}
                                        className={`bg-white rounded-2xl p-4 shadow-soft border-2 cursor-pointer transition-all ${selectedEquipment?._id === item._id
                                                ? 'border-primary-600'
                                                : 'border-neutral-100 hover:border-neutral-200'
                                            }`}
                                        onClick={() => setSelectedEquipment(item)}
                                    >
                                        <img
                                            src={item.images?.[0]?.url}
                                            alt={item.name}
                                            className="w-full h-40 object-cover rounded-xl mb-3"
                                        />
                                        <h3 className="font-bold text-neutral-900 mb-1">{item.name}</h3>
                                        <p className="text-sm text-neutral-500 mb-2">{item.category}</p>
                                        <p className="text-primary-700 font-bold">
                                            {formatCurrency(item.pricing.dailyRate)} / kun
                                        </p>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* O'ng tomon - Sana va Summa */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl p-6 shadow-medium border border-neutral-100 sticky top-24">
                            <h2 className="text-xl font-bold text-neutral-900 mb-6">
                                📅 Ijara sanasi
                            </h2>

                            <div className="space-y-4 mb-6">
                                <div>
                                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                                        Boshlanish
                                    </label>
                                    <input
                                        type="date"
                                        value={startDate}
                                        min={new Date().toISOString().split('T')[0]}
                                        onChange={(e) => {
                                            const newStart = e.target.value;
                                            setStartDate(newStart);
                                            // Agar endDate startDate'dan oldin bo'lsa, endDate'ni yangilash
                                            if (endDate && endDate < newStart) {
                                                setEndDate(newStart);
                                            }
                                        }}
                                        className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:border-primary-600 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                                        Tugash
                                    </label>
                                    <input
                                        type="date"
                                        value={endDate}
                                        min={startDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:border-primary-600 outline-none"
                                    />
                                </div>
                            </div>

                            {selectedEquipment && (
                                <div className="bg-neutral-50 rounded-xl p-4 mb-6">
                                    <h3 className="font-bold text-neutral-900 mb-3">
                                        Tanlangan jihoz
                                    </h3>
                                    <p className="text-sm text-neutral-600 mb-2">
                                        {selectedEquipment.name}
                                    </p>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-neutral-600">Kunlik narx:</span>
                                            <span className="font-semibold">
                                                {formatCurrency(selectedEquipment.pricing.dailyRate)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-neutral-600">Depozit:</span>
                                            <span className="font-semibold">
                                                {formatCurrency(selectedEquipment.pricing.deposit)}
                                            </span>
                                        </div>
                                        {calculateDays() > 0 && (
                                            <>
                                                <div className="flex justify-between">
                                                    <span className="text-neutral-600">Kunlar:</span>
                                                    <span className="font-semibold">{calculateDays()} kun</span>
                                                </div>
                                                <div className="flex justify-between pt-2 border-t border-neutral-200">
                                                    <span className="font-bold">Jami:</span>
                                                    <span className="font-bold text-primary-700">
                                                        {formatCurrency(calculateTotal())}
                                                    </span>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}

                            <motion.button
                                onClick={handleProceedToCheckout}
                                disabled={!selectedEquipment || !startDate || !endDate}
                                className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-lg ${!selectedEquipment || !startDate || !endDate
                                        ? 'bg-neutral-400 cursor-not-allowed'
                                        : 'bg-primary-700 hover:bg-primary-800 hover:shadow-xl'
                                    }`}
                                whileHover={
                                    selectedEquipment && startDate && endDate ? { scale: 1.02 } : {}
                                }
                                whileTap={
                                    selectedEquipment && startDate && endDate ? { scale: 0.98 } : {}
                                }
                            >
                                Buyurtma berish
                            </motion.button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RentalCreate;