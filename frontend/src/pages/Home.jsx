// frontend/src/pages/Home.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
import { getImageUrl, formatCurrency } from '../utils/helpers';

const Home = () => {
    const [featuredEquipment, setFeaturedEquipment] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                const res = await api.get('/equipment?limit=6');
                setFeaturedEquipment(res.data.data.data || []);
            } catch (error) {
                console.error('Xatolik:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchFeatured();
    }, []);

    const features = [
        {
            icon: '🏕️',
            title: 'Sifatli jihozlar',
            description: 'Dunyo brendlarining original mahsulotlari',
        },
        {
            icon: '💰',
            title: 'Qulay narxlar',
            description: 'Bozordagi eng arzon narxlar kafolati',
        },
        {
            icon: '🚚',
            title: 'Tez yetkazish',
            description: 'Toshkent bo\'ylab 24 soat ichida',
        },
        {
            icon: '🛡️',
            title: 'Ishonchli xizmat',
            description: '100% pul qaytarish kafolati',
        },
    ];

    return (
        <div className="min-h-screen bg-neutral-50">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1920')] bg-cover bg-center"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center max-w-3xl mx-auto"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: 'spring' }}
                            className="inline-block mb-6 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20"
                        >
                            <span className="text-sm font-semibold">🏔️ O'zbekiston bo'ylab yetkazib berish</span>
                        </motion.div>

                        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                            Sayohat va aktiv dam olish uchun
                            <span className="block text-accent-400 mt-2">Professional jihozlar ijarasi</span>
                        </h1>

                        <p className="text-lg md:text-xl text-neutral-200 mb-8 max-w-2xl mx-auto">
                            Tog' sayohati, camping, hiking va boshqa aktiv dam olish uchun eng sifatli jihozlarni qulay narxlarda ijaraga oling
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/equipment"
                                className="px-8 py-4 bg-accent-600 hover:bg-accent-700 text-white rounded-xl font-bold text-lg transition-all shadow-xl hover:shadow-2xl hover:scale-105"
                            >
                                Jihozlarni ko'rish →
                            </Link>
                            <Link
                                to="/about"
                                className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-xl font-bold text-lg transition-all border border-white/30"
                            >
                                Biz haqimizda
                            </Link>
                        </div>
                    </motion.div>
                </div>

                {/* Stats */}
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { value: '500+', label: 'Jihozlar' },
                            { value: '1000+', label: 'Mijozlar' },
                            { value: '50+', label: 'Brendlar' },
                            { value: '4.9', label: 'Reyting' },
                        ].map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 + index * 0.1 }}
                                className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20"
                            >
                                <p className="text-3xl font-bold text-accent-400">{stat.value}</p>
                                <p className="text-sm text-neutral-200">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
                            Nega aynan Makon.Shop?
                        </h2>
                        <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                            Biz bilan sayohatingiz qulay, xavfsiz va qiziqarli bo'ladi
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-2xl p-6 shadow-soft hover:shadow-medium transition-all hover:-translate-y-1"
                            >
                                <div className="text-5xl mb-4">{feature.icon}</div>
                                <h3 className="text-xl font-bold text-neutral-900 mb-2">{feature.title}</h3>
                                <p className="text-neutral-600">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Equipment */}
            <section className="py-16 md:py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex flex-col md:flex-row md:items-end md:justify-between mb-12"
                    >
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
                                Ommabop jihozlar
                            </h2>
                            <p className="text-lg text-neutral-600">
                                Mijozlarimiz eng ko'p tanlaydigan mahsulotlar
                            </p>
                        </div>
                        <Link
                            to="/equipment"
                            className="mt-4 md:mt-0 inline-flex items-center gap-2 text-primary-700 font-semibold hover:text-primary-800 transition-colors"
                        >
                            Barchasini ko'rish
                            <span>→</span>
                        </Link>
                    </motion.div>

                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {featuredEquipment.map((item, index) => (
                                <motion.div
                                    key={item._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <Link to={`/equipment/${item._id}`} className="block">
                                        <div className="bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-medium transition-all border border-neutral-100">
                                            <div className="relative h-56 overflow-hidden bg-neutral-200">
                                                <img
                                                    src={getImageUrl(item.images?.[0]?.url)}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                                                    onError={(e) => {
                                                        e.target.src = '/placeholder.jpg';
                                                    }}
                                                />
                                                <div className="absolute top-3 right-3 px-3 py-1 bg-primary-600 text-white rounded-full text-xs font-bold">
                                                    Mavjud
                                                </div>
                                            </div>
                                            <div className="p-5">
                                                <h3 className="text-lg font-bold text-neutral-900 mb-2 line-clamp-1">
                                                    {item.name}
                                                </h3>
                                                <p className="text-sm text-neutral-500 line-clamp-2 mb-4">
                                                    {item.description}
                                                </p>
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-xs text-neutral-400">Kunlik narx</p>
                                                        <p className="text-lg font-bold text-primary-700">
                                                            {new Intl.NumberFormat('uz-UZ').format(item.pricing.dailyRate)} so'm
                                                        </p>
                                                    </div>
                                                    <span className="px-4 py-2 bg-neutral-900 text-white rounded-xl text-sm font-semibold hover:bg-primary-700 transition-colors">
                                                        Tanlash
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 md:py-24 bg-gradient-to-br from-primary-800 to-primary-900 text-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">
                            Sayohatingizni bugun boshlang!
                        </h2>
                        <p className="text-lg text-neutral-200 mb-8 max-w-2xl mx-auto">
                            Ro'yxatdan o'ting va birinchi buyurtmangizga 10% chegirma oling
                        </p>
                        <Link
                            to="/login"
                            className="inline-block px-8 py-4 bg-accent-600 hover:bg-accent-700 text-white rounded-xl font-bold text-lg transition-all shadow-xl hover:shadow-2xl hover:scale-105"
                        >
                            Hoziroq boshlash →
                        </Link>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default Home;