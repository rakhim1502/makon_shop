// import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const About = () => {
    const team = [
        { name: 'Aziz R.', role: 'Asoschi & CEO', emoji: '👨‍💼' },
        { name: 'Dilnoza K.', role: 'Operatsion menejer', emoji: '👩💼' },
        { name: 'Bobur T.', role: 'Logistika', emoji: '🚚' },
        { name: 'Nilufar S.', role: 'Mijozlar xizmati', emoji: '💬' },
    ];

    const values = [
        { icon: '', title: 'Tabiatni hurmat qilish', desc: 'Ekologik toza jihozlar va barqaror turizm' },
        { icon: '', title: 'Ishonch', desc: 'Mijozlarimiz bilan uzoq muddatli hamkorlik' },
        { icon: '⭐', title: 'Sifat', desc: 'Faqat dunyo brendlarining original mahsulotlari' },
        { icon: '💡', title: 'Innovatsiya', desc: 'Zamonaviy texnologiyalar va qulay xizmat' },
    ];

    const stats = [
        { value: '5+', label: 'Yillik tajriba' },
        { value: '1000+', label: 'Mamnun mijozlar' },
        { value: '500+', label: 'Jihozlar' },
        { value: '50+', label: 'Hamkor brendlar' },
    ];

    return (
        <div className="min-h-screen bg-neutral-50 pt-24">
            {/* Hero */}
            <section className="bg-gradient-to-br from-primary-800 via-primary-700 to-primary-900 text-white py-20 px-4">
                <div className="max-w-5xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-semibold mb-6">
                            ℹ️ Biz haqimizda
                        </span>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            Makon.Shop - Sayohat do'stingiz
                        </h1>
                        <p className="text-xl text-white/90 max-w-3xl mx-auto">
                            2020-yildan beri O'zbekiston bo'ylab sayohatchilarga sifatli jihozlar ijarasi xizmatini ko'rsatib kelmoqdamiz
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Statistika */}
            <section className="py-16 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-2xl p-6 text-center shadow-soft"
                            >
                                <p className="text-4xl font-bold text-primary-700 mb-2">{stat.value}</p>
                                <p className="text-neutral-600">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Hikoyamiz */}
            <section className="py-16 px-4 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <span className="text-sm font-semibold text-primary-700 uppercase">Bizning hikoya</span>
                            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mt-2 mb-6">
                                Tabiatni sevuvchilar uchun yaratilgan
                            </h2>
                            <p className="text-neutral-600 mb-4 leading-relaxed">
                                Makon.Shop g'oyasi 2020-yilda tug'ilgan. Asoschilarimiz tog' sayohati paytida qimmat jihozlarni sotib olish o'rniga, ularni ijaraga olish imkoniyati borligini tushunishdi.
                            </p>
                            <p className="text-neutral-600 mb-4 leading-relaxed">
                                Bugungi kunda biz 500+ dan ortiq professional jihozlar bilan O'zbekistonning barcha hududlariga xizmat ko'rsatmoqdamiz.
                            </p>
                            <p className="text-neutral-600 leading-relaxed">
                                Bizning maqsadimiz - har bir sayohatchiga sifatli jihozlarni qulay narxlarda taqdim etish va tabiat bilan yaqinlashish imkonini yaratish.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="grid grid-cols-2 gap-4"
                        >
                            <div className="space-y-4">
                                <div className="bg-primary-100 rounded-2xl p-6 h-48 flex items-center justify-center">
                                    <span className="text-6xl">🏔️</span>
                                </div>
                                <div className="bg-accent-100 rounded-2xl p-6 h-32 flex items-center justify-center">
                                    <span className="text-5xl">🏕️</span>
                                </div>
                            </div>
                            <div className="space-y-4 pt-8">
                                <div className="bg-green-100 rounded-2xl p-6 h-32 flex items-center justify-center">
                                    <span className="text-5xl">🎒</span>
                                </div>
                                <div className="bg-blue-100 rounded-2xl p-6 h-48 flex items-center justify-center">
                                    <span className="text-6xl">🥾</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Qadriyatlar */}
            <section className="py-16 px-4 bg-neutral-50">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <span className="text-sm font-semibold text-primary-700 uppercase">Qadriyatlarimiz</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mt-2">
                            Nima bizni boshqalardan ajratadi?
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((value, index) => (
                            <motion.div
                                key={value.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-2xl p-6 shadow-soft hover:shadow-medium transition-all hover:-translate-y-1"
                            >
                                <div className="text-5xl mb-4">{value.icon}</div>
                                <h3 className="text-xl font-bold text-neutral-900 mb-2">{value.title}</h3>
                                <p className="text-neutral-600">{value.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Jamoa */}
            <section className="py-16 px-4 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <span className="text-sm font-semibold text-primary-700 uppercase">Bizning jamoa</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mt-2">
                            Professionallar jamoasi
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {team.map((member, index) => (
                            <motion.div
                                key={member.name}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-2xl p-6 text-center"
                            >
                                <div className="w-20 h-20 bg-white rounded-full mx-auto mb-4 flex items-center justify-center text-4xl shadow-soft">
                                    {member.emoji}
                                </div>
                                <h3 className="font-bold text-neutral-900">{member.name}</h3>
                                <p className="text-sm text-neutral-600">{member.role}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 px-4 bg-gradient-to-br from-primary-700 to-primary-900 text-white">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">
                            Sayohatingizni bugun boshlang!
                        </h2>
                        <p className="text-lg text-white/90 mb-8">
                            Jihozlarimizni ko'ring va orzuingizdagi sayohatni rejalashtiring
                        </p>
                        <Link
                            to="/equipment"
                            className="inline-block px-8 py-4 bg-white text-primary-700 rounded-xl font-bold text-lg hover:bg-neutral-100 transition-all shadow-xl"
                        >
                            Jihozlarni ko'rish →
                        </Link>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default About;