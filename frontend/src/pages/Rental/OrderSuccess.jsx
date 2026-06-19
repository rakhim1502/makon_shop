// import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { formatCurrency, formatDate } from '../../utils/helpers';
// import { getImageUrl } from '../../utils/helpers';

const OrderSuccess = () => {
    const location = useLocation();
    const { orderNumber, customer, equipment, total, startDate, endDate } =
        location.state || {};

    // Agar ma'lumotlar bo'lmasa, bosh sahifaga
    if (!orderNumber) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Link
                    to="/"
                    className="px-6 py-3 bg-primary-700 text-white rounded-xl font-semibold"
                >
                    Bosh sahifaga qaytish
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-neutral-50 to-accent-50 py-12 px-4">
            <div className="max-w-2xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                    className="bg-white rounded-3xl shadow-medium p-8 md:p-12 text-center"
                >
                    {/* Muvaffaqiyat ikonkasi */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring' }}
                        className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.4 }}
                            className="text-5xl"
                        >
                            ✅
                        </motion.div>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-3xl font-bold text-neutral-900 mb-3"
                    >
                        Buyurtma qabul qilindi!
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-neutral-600 mb-8"
                    >
                        Hurmatli <span className="font-semibold">{customer}</span>,
                        buyurtmangiz muvaffaqiyatli qabul qilindi. Tez orada operatorimiz
                        siz bilan bog'lanadi.
                    </motion.p>

                    {/* Buyurtma ma'lumotlari */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-neutral-50 rounded-2xl p-6 mb-6 text-left"
                    >
                        <div className="space-y-3">
                            <div className="flex justify-between items-center pb-3 border-b border-neutral-200">
                                <span className="text-sm text-neutral-500">
                                    Buyurtma raqami
                                </span>
                                <span className="font-bold text-primary-700 text-lg">
                                    #{orderNumber}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-sm text-neutral-500">Jihoz</span>
                                <span className="font-semibold text-neutral-900 text-right max-w-[60%]">
                                    {equipment}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-sm text-neutral-500">
                                    Boshlanishi
                                </span>
                                <span className="font-semibold text-neutral-900">
                                    {formatDate(startDate)}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-sm text-neutral-500">
                                    Tugashi
                                </span>
                                <span className="font-semibold text-neutral-900">
                                    {formatDate(endDate)}
                                </span>
                            </div>

                            <div className="flex justify-between items-center pt-3 border-t border-neutral-200">
                                <span className="text-sm font-semibold text-neutral-700">
                                    Jami summa
                                </span>
                                <span className="text-xl font-bold text-primary-700">
                                    {formatCurrency(total)}
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Eslatma */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="bg-accent-50 border border-accent-200 rounded-xl p-4 mb-8 text-left"
                    >
                        <p className="text-sm text-accent-800">
                            <span className="font-semibold">📞 Kuting!</span> Bizning
                            operatorimiz 30 daqiqa ichida siz bilan bog'lanib, jihozni
                            olish vaqti va manzilini kelishadi.
                        </p>
                    </motion.div>

                    {/* Tugmalar */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="flex flex-col sm:flex-row gap-3"
                    >
                        <Link
                            to="/equipment"
                            className="flex-1 px-6 py-3 bg-primary-700 text-white rounded-xl font-semibold hover:bg-primary-800 transition-all text-center"
                        >
                            Boshqa jihozlar
                        </Link>
                        <Link
                            to="/"
                            className="flex-1 px-6 py-3 bg-neutral-100 text-neutral-700 rounded-xl font-semibold hover:bg-neutral-200 transition-all text-center"
                        >
                            Bosh sahifa
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default OrderSuccess;