import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../services/api';
import { getImageUrl } from '../../utils/helpers';
import ImageUpload from '../../components/admin/ImageUpload';
import toast from 'react-hot-toast';

const EditEquipment = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: 'tent',
        brand: '',
        pricing: {
            dailyRate: '',
            deposit: '',
        },
        stock: {
            total: 1,
        },
        specifications: {
            weight: '',
            capacity: '',
            material: '',
        },
        status: 'available',
        images: [],
    });

    useEffect(() => {
        fetchEquipment();
    }, [id]);

    const fetchEquipment = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/equipment/${id}`);
            const data = res.data.data;

            setFormData({
                name: data.name || '',
                description: data.description || '',
                category: data.category || 'tent',
                brand: data.brand || '',
                pricing: {
                    dailyRate: data.pricing?.dailyRate || '',
                    deposit: data.pricing?.deposit || '',
                },
                stock: {
                    total: data.stock?.total || 1,
                },
                specifications: {
                    weight: data.specifications?.weight || '',
                    capacity: data.specifications?.capacity || '',
                    material: data.specifications?.material || '',
                },
                status: data.status || 'available',
                images: data.images || [],
            });
        } catch (error) {
            toast.error('Jihozni yuklashda xatolik');
            navigate('/admin/equipment');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.description || !formData.pricing.dailyRate || !formData.pricing.deposit) {
            toast.error('Barcha majburiy maydonlarni to\'ldiring');
            return;
        }

        if (formData.images.length === 0) {
            toast.error('Kamida bitta rasm yuklang');
            return;
        }

        setSaving(true);
        try {
            const payload = {
                name: formData.name,
                description: formData.description,
                category: formData.category,
                brand: formData.brand,
                pricing: {
                    dailyRate: Number(formData.pricing.dailyRate),
                    deposit: Number(formData.pricing.deposit),
                    currency: 'UZS',
                },
                stock: {
                    total: Number(formData.stock.total),
                    available: Number(formData.stock.total),  
                },
                specifications: formData.specifications,
                status: formData.status,
                images: formData.images,
            };

            await api.put(`/equipment/${id}`, payload);
            toast.success('Jihoz muvaffaqiyatli yangilandi! ✅');
            navigate('/admin/equipment');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Xatolik yuz berdi');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
                <div className="w-10 h-10 md:w-12 md:h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-50 py-4 md:py-8 px-3 md:px-4">
            <div className="max-w-4xl mx-auto">
                <div className="mb-4 md:mb-8">
                    <h1 className="text-xl md:text-3xl font-bold text-neutral-900">Jihozni tahrirlash</h1>
                    <p className="text-sm md:text-base text-neutral-600 mt-1">Jihoz ma'lumotlarini yangilang</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-xl md:rounded-2xl p-4 md:p-8 shadow-soft">
                    <div className="space-y-4 md:space-y-6">
                        {/* Asosiy ma'lumotlar */}
                        <div>
                            <h2 className="text-base md:text-xl font-bold text-neutral-900 mb-3 md:mb-4"> Asosiy ma'lumotlar</h2>

                            <div className="space-y-3 md:space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-neutral-700 mb-1.5 md:mb-2">
                                        Jihoz nomi *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Masalan: Tog' palatkasi 4 kishilik"
                                        className="w-full px-3 md:px-4 py-2 md:py-3 border border-neutral-300 rounded-lg md:rounded-xl focus:border-primary-600 focus:ring-2 focus:ring-primary-200 outline-none text-sm md:text-base"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-neutral-700 mb-1.5 md:mb-2">
                                        Tavsif *
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Jihoz haqida batafsil ma'lumot..."
                                        rows="4"
                                        className="w-full px-3 md:px-4 py-2 md:py-3 border border-neutral-300 rounded-lg md:rounded-xl focus:border-primary-600 focus:ring-2 focus:ring-primary-200 outline-none resize-none text-sm md:text-base"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-neutral-700 mb-1.5 md:mb-2">
                                            Kategoriya *
                                        </label>
                                        <select
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full px-3 md:px-4 py-2 md:py-3 border border-neutral-300 rounded-lg md:rounded-xl focus:border-primary-600 focus:ring-2 focus:ring-primary-200 outline-none text-sm md:text-base"
                                        >
                                            <option value="tent">🏕️ Palatka</option>
                                            <option value="sleeping_bag">🛏️ Uyqu qopi</option>
                                            <option value="backpack">🎒 Ryukzak</option>
                                            <option value="hiking_gear">🥾 Hiking jihozlar</option>
                                            <option value="cooking">🍳 Oshxona</option>
                                            <option value="clothing">👕 Kiyim</option>
                                            <option value="other">📦 Boshqa</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-neutral-700 mb-1.5 md:mb-2">
                                            Brend
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.brand}
                                            onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                                            placeholder="Masalan: The North Face"
                                            className="w-full px-3 md:px-4 py-2 md:py-3 border border-neutral-300 rounded-lg md:rounded-xl focus:border-primary-600 focus:ring-2 focus:ring-primary-200 outline-none text-sm md:text-base"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-neutral-700 mb-1.5 md:mb-2">
                                        Status
                                    </label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        className="w-full px-3 md:px-4 py-2 md:py-3 border border-neutral-300 rounded-lg md:rounded-xl focus:border-primary-600 focus:ring-2 focus:ring-primary-200 outline-none text-sm md:text-base"
                                    >
                                        <option value="available">✅ Mavjud</option>
                                        <option value="rented">🔄 Ijarada</option>
                                        <option value="maintenance"> Ta'mirlashda</option>
                                        <option value="retired">❌ Chiqarib tashlangan</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Rasmlar - ImageUpload komponenti */}
                        <div>
                            <h2 className="text-base md:text-xl font-bold text-neutral-900 mb-3 md:mb-4">🖼️ Rasmlar</h2>
                            <ImageUpload
                                images={formData.images}
                                onChange={(images) => setFormData({ ...formData, images })}
                            />
                        </div>

                        {/* Narx va depozit */}
                        <div>
                            <h2 className="text-base md:text-xl font-bold text-neutral-900 mb-3 md:mb-4"> Narx va depozit</h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-neutral-700 mb-1.5 md:mb-2">
                                        Kunlik narx (so'm) *
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.pricing.dailyRate}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            pricing: { ...formData.pricing, dailyRate: e.target.value }
                                        })}
                                        placeholder="80000"
                                        min="0"
                                        className="w-full px-3 md:px-4 py-2 md:py-3 border border-neutral-300 rounded-lg md:rounded-xl focus:border-primary-600 focus:ring-2 focus:ring-primary-200 outline-none text-sm md:text-base"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-neutral-700 mb-1.5 md:mb-2">
                                        Depozit (so'm) *
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.pricing.deposit}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            pricing: { ...formData.pricing, deposit: e.target.value }
                                        })}
                                        placeholder="300000"
                                        min="0"
                                        className="w-full px-3 md:px-4 py-2 md:py-3 border border-neutral-300 rounded-lg md:rounded-xl focus:border-primary-600 focus:ring-2 focus:ring-primary-200 outline-none text-sm md:text-base"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Zahira */}
                        <div>
                            <h2 className="text-base md:text-xl font-bold text-neutral-900 mb-3 md:mb-4"> Zahira</h2>

                            <div>
                                <label className="block text-sm font-semibold text-neutral-700 mb-1.5 md:mb-2">
                                    Jami soni *
                                </label>
                                <input
                                    type="number"
                                    value={formData.stock.total}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        stock: { ...formData.stock, total: e.target.value }
                                    })}
                                    placeholder="5"
                                    min="1"
                                    className="w-full px-3 md:px-4 py-2 md:py-3 border border-neutral-300 rounded-lg md:rounded-xl focus:border-primary-600 focus:ring-2 focus:ring-primary-200 outline-none text-sm md:text-base"
                                    required
                                />
                            </div>
                        </div>

                        {/* Spetsifikatsiyalar */}
                        <div>
                            <h2 className="text-base md:text-xl font-bold text-neutral-900 mb-3 md:mb-4">🔧 Xususiyatlar</h2>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-neutral-700 mb-1.5 md:mb-2">
                                        Og'irligi
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.specifications.weight}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            specifications: { ...formData.specifications, weight: e.target.value }
                                        })}
                                        placeholder="3.5 kg"
                                        className="w-full px-3 md:px-4 py-2 md:py-3 border border-neutral-300 rounded-lg md:rounded-xl focus:border-primary-600 focus:ring-2 focus:ring-primary-200 outline-none text-sm md:text-base"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-neutral-700 mb-1.5 md:mb-2">
                                        Sig'im
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.specifications.capacity}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            specifications: { ...formData.specifications, capacity: e.target.value }
                                        })}
                                        placeholder="4 kishi"
                                        className="w-full px-3 md:px-4 py-2 md:py-3 border border-neutral-300 rounded-lg md:rounded-xl focus:border-primary-600 focus:ring-2 focus:ring-primary-200 outline-none text-sm md:text-base"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-neutral-700 mb-1.5 md:mb-2">
                                        Material
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.specifications.material}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            specifications: { ...formData.specifications, material: e.target.value }
                                        })}
                                        placeholder="Polyester"
                                        className="w-full px-3 md:px-4 py-2 md:py-3 border border-neutral-300 rounded-lg md:rounded-xl focus:border-primary-600 focus:ring-2 focus:ring-primary-200 outline-none text-sm md:text-base"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Tugmalar */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-4 md:pt-6 border-t border-neutral-200">
                            <motion.button
                                type="submit"
                                disabled={saving}
                                className={`flex-1 py-3 md:py-4 rounded-lg md:rounded-xl font-bold text-white transition-all text-sm md:text-base ${saving
                                    ? 'bg-neutral-400 cursor-not-allowed'
                                    : 'bg-primary-700 hover:bg-primary-800 shadow-lg'
                                    }`}
                                whileHover={!saving ? { scale: 1.02 } : {}}
                                whileTap={!saving ? { scale: 0.98 } : {}}
                            >
                                {saving ? 'Saqlanmoqda...' : '✓ O\'zgarishlarni saqlash'}
                            </motion.button>

                            <button
                                type="button"
                                onClick={() => navigate('/admin/equipment')}
                                className="px-6 md:px-8 py-3 md:py-4 bg-neutral-100 text-neutral-700 rounded-lg md:rounded-xl font-bold hover:bg-neutral-200 transition-all text-sm md:text-base"
                            >
                                Bekor qilish
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditEquipment;