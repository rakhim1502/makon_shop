import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../services/api';
import { getImageUrl, formatCurrency, formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

const EquipmentDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [equipment, setEquipment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        fetchEquipment();
    }, [id]);

    const fetchEquipment = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/equipment/${id}`);
            setEquipment(res.data.data);
        } catch (error) {
            toast.error('Jihozni yuklashda xatolik');
        } finally {
            setLoading(false);
        }
    };

    const handleRentClick = () => {
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
            state: { equipment, startDate, endDate }
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!equipment) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-neutral-600">Jihoz topilmadi</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-50 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Rasm */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white rounded-2xl overflow-hidden shadow-soft"
                    >
                        <img
                            src={getImageUrl(equipment.images?.[0]?.url)}
                            alt={equipment.name}
                            className="w-full h-96 object-cover"
                            onError={(e) => {
                                e.target.src = '/placeholder.jpg';
                            }}
                        />
                        {/* Qo'shimcha rasmlar */}
                        {equipment.images?.length > 1 && (
                            <div className="flex gap-2 p-4 overflow-x-auto">
                                {equipment.images.map((img, index) => (
                                    <img
                                        key={index}
                                        src={getImageUrl(img.url)}
                                        alt={`${equipment.name} ${index + 1}`}
                                        className="w-20 h-20 object-cover rounded-lg cursor-pointer hover:opacity-75"
                                        onError={(e) => {
                                            e.target.src = '/placeholder.jpg';
                                        }}
                                    />
                                ))}
                            </div>
                        )}
                    </motion.div>

                    {/* Ma'lumotlar */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        <div>
                            <h1 className="text-3xl font-bold text-neutral-900 mb-2">{equipment.name}</h1>
                            <p className="text-neutral-600">{equipment.description}</p>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-soft">
                            <h2 className="text-xl font-bold mb-4">💰 Narx</h2>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-neutral-600">Kunlik narx:</span>
                                    <span className="font-bold text-primary-700">{formatCurrency(equipment.pricing?.dailyRate)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-neutral-600">Depozit:</span>
                                    <span className="font-bold">{formatCurrency(equipment.pricing?.deposit)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-soft">
                            <h2 className="text-xl font-bold mb-4">📅 Ijara sanasi</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-neutral-700 mb-2">Boshlanish</label>
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
                                    <label className="block text-sm font-semibold text-neutral-700 mb-2">Tugash</label>
                                    <input
                                        type="date"
                                        value={endDate}
                                        min={startDate}  // ✅ Bir xil sanani tanlashga ruxsat beradi
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:border-primary-600 outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleRentClick}
                            className="w-full py-4 bg-primary-700 text-white rounded-xl font-bold hover:bg-primary-800 transition-all shadow-lg"
                        >
                            Buyurtma berish
                        </button>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default EquipmentDetails;