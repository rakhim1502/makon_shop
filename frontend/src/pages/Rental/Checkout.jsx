import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../services/api';
import { getImageUrl, formatCurrency, calculateDays, formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

const RentalCheckout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { equipment, startDate, endDate } = location.state || {};

    const [loading, setLoading] = useState(false);
    const [notes, setNotes] = useState('');
    const [customer, setCustomer] = useState({
        name: '',
        phone: '',
        address: '',
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (!equipment || !startDate || !endDate) {
            navigate('/equipment');
        }
    }, [equipment, startDate, endDate, navigate]);

    const days = calculateDays(startDate, endDate);
    const subtotal = equipment?.pricing?.dailyRate * days || 0;
    const deposit = equipment?.pricing?.deposit || 0;
    const total = subtotal + deposit;

    const formatPhone = (value) => {
        const digits = value.replace(/\D/g, '');
        let formatted = '';
        if (digits.startsWith('998')) {
            formatted = '+998';
            if (digits.length > 3) formatted += ' ' + digits.slice(3, 5);
            if (digits.length > 5) formatted += ' ' + digits.slice(5, 8);
            if (digits.length > 8) formatted += ' ' + digits.slice(8, 10);
            if (digits.length > 10) formatted += ' ' + digits.slice(10, 12);
        } else {
            formatted = '+998';
            if (digits.length > 0) formatted += ' ' + digits.slice(0, 2);
            if (digits.length > 2) formatted += ' ' + digits.slice(2, 5);
            if (digits.length > 5) formatted += ' ' + digits.slice(5, 7);
            if (digits.length > 7) formatted += ' ' + digits.slice(7, 9);
        }
        return formatted;
    };

    const validate = () => {
        const newErrors = {};
        if (!customer.name.trim()) {
            newErrors.name = 'Ismingizni kiriting';
        } else if (customer.name.trim().length < 2) {
            newErrors.name = 'Ism kamida 2 ta harfdan iborat bo\'lishi kerak';
        }

        const phoneDigits = customer.phone.replace(/\D/g, '');
        if (!phoneDigits) {
            newErrors.phone = 'Telefon raqamini kiriting';
        } else if (phoneDigits.length !== 12) {
            newErrors.phone = 'Telefon raqami noto\'g\'ri formatda';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleCreateRental = async () => {
        if (!validate()) return;

        // ✅ Bir xil sana bo'lsa ham bo'ladi (1 kun)
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (end < start) {
            toast.error('Tugash sanasi boshlanish sanasidan oldin bo\'lishi mumkin emas');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                equipment: equipment._id,
                quantity: 1,
                startDate,
                endDate,
                notes,
                customerName: customer.name.trim(),
                customerPhone: customer.phone.replace(/\s/g, ''),
                customerAddress: customer.address.trim(),
            };

            await api.post('/rentals', payload);
            toast.success('Buyurtmangiz qabul qilindi! ✅');
            navigate('/order-success', {
                state: {
                    orderNumber: Date.now().toString().slice(-8),
                    customer: customer.name,
                    equipment: equipment.name,
                    total,
                    startDate,
                    endDate,
                },
            });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Buyurtma berishda xatolik');
        } finally {
            setLoading(false);
        }
    };

    if (!equipment) return null;

    return (
        <div className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl font-bold text-neutral-900 mb-2"
                >
                    Buyurtmani rasmiylashtirish
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-neutral-600 mb-8"
                >
                    Ma'lumotlaringizni to'ldiring va buyurtmani tasdiqlang
                </motion.p>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Jihoz ma'lumotlari */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white rounded-2xl p-6 shadow-soft border border-neutral-100"
                        >
                            <h2 className="text-xl font-bold text-neutral-900 mb-4">
                                🎒 Tanlangan jihoz
                            </h2>
                            <div className="flex gap-4">
                                <img
                                    src={getImageUrl(equipment.images?.[0]?.url)}
                                    alt={equipment.name}
                                    className="w-24 h-24 rounded-xl object-cover"
                                    onError={(e) => {
                                        e.target.src = '/placeholder.jpg';
                                    }}
                                />
                                <div className="flex-1">
                                    <h3 className="font-bold text-lg text-neutral-900">
                                        {equipment.name}
                                    </h3>
                                    <p className="text-sm text-neutral-500 mb-2">
                                        {equipment.category}
                                    </p>
                                    <p className="text-primary-700 font-bold">
                                        {formatCurrency(equipment.pricing.dailyRate)} / kun
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Ijara muddati */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-2xl p-6 shadow-soft border border-neutral-100"
                        >
                            <h2 className="text-xl font-bold text-neutral-900 mb-4">
                                Ijara muddati
                            </h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-neutral-50 rounded-xl">
                                    <p className="text-xs text-neutral-500 uppercase font-semibold">
                                        Boshlanishi
                                    </p>
                                    <p className="font-bold text-neutral-900 mt-1">
                                        {formatDate(startDate)}
                                    </p>
                                </div>
                                <div className="p-4 bg-neutral-50 rounded-xl">
                                    <p className="text-xs text-neutral-500 uppercase font-semibold">
                                        Tugashi
                                    </p>
                                    <p className="font-bold text-neutral-900 mt-1">
                                        {formatDate(endDate)}
                                    </p>
                                </div>
                            </div>
                            <p className="mt-4 text-sm text-neutral-600">
                                Jami:{' '}
                                <span className="font-bold text-primary-700">
                                    {days} kun
                                </span>
                            </p>
                        </motion.div>

                        {/* Mijoz ma'lumotlari */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-2xl p-6 shadow-soft border border-neutral-100"
                        >
                            <h2 className="text-xl font-bold text-neutral-900 mb-2">
                                Sizning ma'lumotlaringiz
                            </h2>
                            <p className="text-sm text-neutral-500 mb-5">
                                Buyurtmani qabul qilish uchun aloqa ma'lumotlaringizni qoldiring
                            </p>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                                        Ismingiz <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={customer.name}
                                        onChange={(e) =>
                                            setCustomer({ ...customer, name: e.target.value })
                                        }
                                        placeholder="Masalan: Ali Valiyev"
                                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 outline-none transition-all ${errors.name
                                            ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
                                            : 'border-neutral-300 focus:border-primary-600 focus:ring-primary-200'
                                            }`}
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-xs text-red-600">{errors.name}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                                        Telefon raqamingiz{' '}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        value={customer.phone}
                                        onChange={(e) =>
                                            setCustomer({
                                                ...customer,
                                                phone: formatPhone(e.target.value),
                                            })
                                        }
                                        placeholder="+998 90 123 45 67"
                                        maxLength={17}
                                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 outline-none transition-all ${errors.phone
                                            ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
                                            : 'border-neutral-300 focus:border-primary-600 focus:ring-primary-200'
                                            }`}
                                    />
                                    {errors.phone && (
                                        <p className="mt-1 text-xs text-red-600">
                                            {errors.phone}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                                        Yetkazib berish manzili{' '}
                                        <span className="text-neutral-400 text-xs">
                                            (ixtiyoriy)
                                        </span>
                                    </label>
                                    <input
                                        type="text"
                                        value={customer.address}
                                        onChange={(e) =>
                                            setCustomer({
                                                ...customer,
                                                address: e.target.value,
                                            })
                                        }
                                        placeholder="Toshkent sh., Chilonzor tumani..."
                                        className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:border-primary-600 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </motion.div>

                        {/* Qo'shimcha izoh */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-2xl p-6 shadow-soft border border-neutral-100"
                        >
                            <h2 className="text-xl font-bold text-neutral-900 mb-4">
                                💬 Qo'shimcha izoh{' '}
                                <span className="text-neutral-400 text-sm font-normal">
                                    (Ixtiyoriy)
                                </span>
                            </h2>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Masalan: Palatka 4 kishilik bo'lishi kerak, yashil rangda..."
                                className="w-full p-4 border border-neutral-200 rounded-xl focus:border-primary-600 focus:ring-2 focus:ring-primary-200 outline-none resize-none h-28"
                            />
                        </motion.div>
                    </div>

                    {/* O'ng tomon - Summa */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-1"
                    >
                        <div className="bg-white rounded-2xl p-6 shadow-medium border border-neutral-100 sticky top-24">
                            <h2 className="text-xl font-bold text-neutral-900 mb-6">
                                💰 To'lov tafsilotlari
                            </h2>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-neutral-600">
                                    <span>
                                        {formatCurrency(equipment.pricing.dailyRate)} ×{' '}
                                        {days} kun
                                    </span>
                                    <span>{formatCurrency(subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-neutral-600">
                                    <span>Kafolat depoziti</span>
                                    <span>{formatCurrency(deposit)}</span>
                                </div>
                                <div className="border-t border-neutral-100 pt-4 flex justify-between items-center">
                                    <span className="text-lg font-bold text-neutral-900">
                                        Jami summa
                                    </span>
                                    <span className="text-2xl font-bold text-primary-700">
                                        {formatCurrency(total)}
                                    </span>
                                </div>
                            </div>

                            <div className="bg-accent-50 border border-accent-200 rounded-xl p-4 mb-6">
                                <p className="text-xs text-accent-800 font-semibold mb-1">
                                    💡 Muhim eslatma
                                </p>
                                <p className="text-sm text-accent-700">
                                    To'lov jihozni olayotganingizda ofisda naqd yoki karta orqali
                                    amalga oshiriladi.
                                </p>
                            </div>

                            <motion.button
                                onClick={handleCreateRental}
                                disabled={loading}
                                className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-lg ${loading
                                    ? 'bg-neutral-400 cursor-not-allowed'
                                    : 'bg-primary-700 hover:bg-primary-800 hover:shadow-xl'
                                    }`}
                                whileHover={!loading ? { scale: 1.02 } : {}}
                                whileTap={!loading ? { scale: 0.98 } : {}}
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg
                                            className="animate-spin h-5 w-5"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                                fill="none"
                                            />
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                            />
                                        </svg>
                                        Yuborilmoqda...
                                    </span>
                                ) : (
                                    '✓ Buyurtmani tasdiqlash'
                                )}
                            </motion.button>

                            <p className="text-xs text-neutral-500 text-center mt-4">
                                Buyurtma berish orqali siz{' '}
                                <span className="underline">shartlar</span>ga rozilik
                                bildirasiz
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default RentalCheckout;