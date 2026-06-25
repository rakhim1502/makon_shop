import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../services/api';
import { getImageUrl, formatCurrency } from '../../utils/helpers';
import toast from 'react-hot-toast';

const AdminEquipment = () => {
    const navigate = useNavigate();
    const [equipment, setEquipment] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEquipment();
    }, []);

    const fetchEquipment = async () => {
        try {
            setLoading(true);
            const res = await api.get('/equipment?limit=100');
            setEquipment(res.data.data.data || []);
        } catch (error) {
            toast.error('Jihozlarni yuklashda xatolik');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`"${name}" jihozini o'chirmoqchimisiz?`)) {
            return;
        }

        try {
            console.log('🗑️ O\'chirish so\'rovi:', id);
            await api.delete(`/equipment/${id}`);
            toast.success('Jihoz o\'chirildi ✅');
            fetchEquipment();
        } catch (error) {
            console.error('❌ Xatolik:', error);
            toast.error(error.response?.data?.message || 'O\'chirishda xatolik');
        }
    };

    return (
        <div className="min-h-screen bg-neutral-50 py-4 md:py-8 px-3 md:px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header - Responsive */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 md:mb-8">
                    <div>
                        <h1 className="text-xl md:text-3xl font-bold text-neutral-900">Jihozlarni boshqarish</h1>
                        <p className="text-sm md:text-base text-neutral-600 mt-1">Barcha jihozlar ro'yxati</p>
                    </div>
                    <button
                        onClick={() => navigate('/admin/equipment/add')}
                        className="w-full sm:w-auto px-4 md:px-6 py-2.5 md:py-3 bg-primary-700 text-white rounded-xl font-semibold hover:bg-primary-800 transition-all shadow-lg text-sm md:text-base"
                    >
                        + Yangi jihoz
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-12 md:py-20">
                        <div className="w-10 h-10 md:w-12 md:h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl md:rounded-2xl shadow-soft overflow-hidden">
                        {/* Desktop Table */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-neutral-50 border-b border-neutral-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 uppercase">Jihoz</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 uppercase">Kategoriya</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 uppercase">Narx/kun</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 uppercase">Mavjud</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 uppercase">Status</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 uppercase">Amallar</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-200">
                                    {equipment.map((item) => (
                                        <tr key={item._id} className="hover:bg-neutral-50">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={getImageUrl(item.images?.[0]?.url)}
                                                        alt={item.name}
                                                        className="w-12 h-12 rounded-lg object-cover"
                                                        onError={(e) => {
                                                            e.target.src = '/placeholder.jpg';
                                                        }}
                                                    />
                                                    <div>
                                                        <p className="font-semibold text-neutral-900">{item.name}</p>
                                                        <p className="text-sm text-neutral-500">{item.brand}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary-100 text-primary-800">
                                                    {item.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-neutral-900">
                                                {formatCurrency(item.pricing.dailyRate)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${item.stock.available > 0
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {item.stock.available} / {item.stock.total}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${item.status === 'available'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => navigate(`/admin/equipment/edit/${item._id}`)}
                                                        className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
                                                    >
                                                        ✏️ Tahrirlash
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(item._id, item.name)}
                                                        className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors"
                                                    >
                                                        🗑️ O'chirish
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Cards */}
                        <div className="md:hidden divide-y divide-neutral-200">
                            {equipment.map((item) => (
                                <div key={item._id} className="p-4 hover:bg-neutral-50">
                                    <div className="flex gap-3 mb-3">
                                        <img
                                            src={getImageUrl(item.images?.[0]?.url)}
                                            alt={item.name}
                                            className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                                            onError={(e) => {
                                                e.target.src = '/placeholder.jpg';
                                            }}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-neutral-900 text-sm truncate">{item.name}</h3>
                                            <p className="text-xs text-neutral-500">{item.brand}</p>
                                            <p className="text-sm font-bold text-primary-700 mt-1">{formatCurrency(item.pricing.dailyRate)}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-primary-100 text-primary-800">
                                            {item.category}
                                        </span>
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${item.stock.available > 0
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                            }`}>
                                            {item.stock.available}/{item.stock.total}
                                        </span>
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${item.status === 'available'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {item.status}
                                        </span>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => navigate(`/admin/equipment/edit/${item._id}`)}
                                            className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
                                        >
                                            ✏️ Tahrirlash
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item._id, item.name)}
                                            className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors"
                                        >
                                            🗑️ O'chirish
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {equipment.length === 0 && (
                            <div className="text-center py-8 md:py-12 text-neutral-500 text-sm md:text-base">
                                Jihozlar topilmadi
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminEquipment;