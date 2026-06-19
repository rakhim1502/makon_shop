import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        message: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        toast.success('Xabaringiz yuborildi! Tez orada javob beramiz ✅');
        setFormData({ name: '', phone: '', email: '', message: '' });
    };

    const contactInfo = [
        { icon: '📞', title: 'Telefon', value: '+998 90 123 45 67', link: 'tel:+998901234567' },
        { icon: '📧', title: 'Email', value: 'info@makon.shop', link: 'mailto:info@makon.shop' },
        { icon: '📍', title: 'Manzil', value: 'Toshkent, Chilonzor tumani', link: '#' },
        { icon: '🕐', title: 'Ish vaqti', value: 'Du-Sha: 9:00 - 20:00', link: '#' },
    ];

    return (
        <div className="min-h-screen bg-neutral-50 pt-24">
            {/* Hero */}
            <section className="bg-gradient-to-br from-accent-700 via-accent-600 to-accent-800 text-white py-16 px-4">
                <div className="max-w-5xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-semibold mb-6">
                            📞 Biz bilan bog'laning
                        </span>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            Aloqa
                        </h1>
                        <p className="text-xl text-white/90 max-w-3xl mx-auto">
                            Savollaringiz bormi? Biz har doim yordam berishga tayyormiz!
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Contact Info */}
            <section className="py-16 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        {contactInfo.map((info, index) => (
                            <motion.a
                                key={info.title}
                                href={info.link}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-2xl p-6 shadow-soft hover:shadow-medium transition-all hover:-translate-y-1 block"
                            >
                                <div className="text-4xl mb-3">{info.icon}</div>
                                <h3 className="text-sm font-semibold text-neutral-500 uppercase mb-1">{info.title}</h3>
                                <p className="text-neutral-900 font-bold">{info.value}</p>
                            </motion.a>
                        ))}
                    </div>

                    {/* Form va Xarita */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-white rounded-2xl p-8 shadow-soft"
                        >
                            <h2 className="text-2xl font-bold text-neutral-900 mb-6">
                                Xabar yuboring
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                                        Ismingiz
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:border-primary-600 focus:ring-2 focus:ring-primary-200 outline-none"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-neutral-700 mb-2">
                                            Telefon
                                        </label>
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:border-primary-600 focus:ring-2 focus:ring-primary-200 outline-none"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-neutral-700 mb-2">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:border-primary-600 focus:ring-2 focus:ring-primary-200 outline-none"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                                        Xabar
                                    </label>
                                    <textarea
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        rows="5"
                                        className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:border-primary-600 focus:ring-2 focus:ring-primary-200 outline-none resize-none"
                                        required
                                    ></textarea>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full py-4 bg-primary-700 text-white rounded-xl font-bold hover:bg-primary-800 transition-all shadow-lg"
                                >
                                    Xabarni yuborish →
                                </button>
                            </form>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl p-8 flex flex-col justify-center items-center text-center"
                        >
                            <div className="text-8xl mb-6">📍</div>
                            <h3 className="text-2xl font-bold text-neutral-900 mb-4">
                                Bizning ofis
                            </h3>
                            <p className="text-neutral-700 mb-2">
                                Toshkent shahri, Chilonzor tumani
                            </p>
                            <p className="text-neutral-700 mb-6">
                                Bunyodkor ko'chasi, 12-uy
                            </p>
                            <div className="bg-white rounded-xl p-4 shadow-soft w-full">
                                <p className="text-sm text-neutral-600 mb-2">🕐 Ish vaqti:</p>
                                <p className="font-bold text-neutral-900">Dushanba - Shanba</p>
                                <p className="text-primary-700 font-bold">9:00 - 20:00</p>
                                <p className="text-sm text-neutral-500 mt-2">Yakshanba: Dam olish kuni</p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-16 px-4 bg-white">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <span className="text-sm font-semibold text-primary-700 uppercase">Tez-tez so'raladigan savollar</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mt-2">
                            FAQ
                        </h2>
                    </div>

                    <div className="space-y-4">
                        {[
                            { q: 'Jihozni qanday qilib olish mumkin?', a: 'Buyurtma berganingizdan so\'ng operatorimiz siz bilan bog\'lanadi va jihozni olish vaqtini kelishadi. Ofisimizdan olib ketishingiz yoki yetkazib berish xizmatidan foydalanishingiz mumkin.' },
                            { q: 'Depozit qancha va qachon qaytariladi?', a: 'Depozit miqdori jihoz turiga qarab belgilanadi. Jihozni qaytarib berganingizdan so\'ng to\'liq qaytariladi (agar shikast yetmagan bo\'lsa).' },
                            { q: 'Jihoz shikastlansa nima bo\'ladi?', a: 'Kichik shikastlar uchun depozitdan ushlab qolinadi. Katta shikastlar uchun qo\'shimcha to\'lov talab qilinishi mumkin.' },
                            { q: 'Buyurtmani bekor qilsam bo\'ladimi?', a: 'Ha, buyurtmani boshlanish sanasidan 24 soat oldin bepul bekor qilishingiz mumkin.' },
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-neutral-50 rounded-2xl p-6"
                            >
                                <h3 className="font-bold text-neutral-900 mb-2">{item.q}</h3>
                                <p className="text-neutral-600">{item.a}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;