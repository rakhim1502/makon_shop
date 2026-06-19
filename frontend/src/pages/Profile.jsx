// frontend/src/pages/Profile.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const Profile = () => {
    const { user, refreshUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.put('/users/profile', formData);
            toast.success('Profil muvaffaqiyatli yangilandi');
            refreshUser();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Xatolik yuz berdi');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl font-bold text-neutral-900">Mening profilim</h1>
                    <p className="text-neutral-600 mt-2">Shaxsiy ma'lumotlaringizni boshqaring</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl p-8 shadow-soft border border-neutral-100"
                >
                    {/* Avatar */}
                    <div className="flex items-center gap-4 mb-8 pb-8 border-b border-neutral-100">
                        <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                            {user?.firstName?.[0] || 'U'}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-neutral-900">
                                {user?.firstName || 'Foydalanuvchi'} {user?.lastName}
                            </h2>
                            <p className="text-neutral-500">{user?.phone}</p>
                            <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold ${user?.role === 'admin'
                                    ? 'bg-accent-100 text-accent-800'
                                    : 'bg-neutral-100 text-neutral-700'
                                }`}>
                                {user?.role === 'admin' ? 'Administrator' : 'Foydalanuvchi'}
                            </span>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                                    Ism
                                </label>
                                <input
                                    type="text"
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:border-primary-600 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                                    placeholder="Ismingiz"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                                    Familiya
                                </label>
                                <input
                                    type="text"
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:border-primary-600 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                                    placeholder="Familiyangiz"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-neutral-700 mb-2">
                                Email (ixtiyoriy)
                            </label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:border-primary-600 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                                placeholder="email@example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-neutral-700 mb-2">
                                Telefon raqam
                            </label>
                            <input
                                type="text"
                                value={user?.phone || ''}
                                disabled
                                className="w-full px-4 py-3 border border-neutral-200 rounded-xl bg-neutral-50 text-neutral-500 cursor-not-allowed"
                            />
                            <p className="text-xs text-neutral-500 mt-1">Telefon raqamni o'zgartirib bo'lmaydi</p>
                        </div>

                        <motion.button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-4 rounded-xl font-bold text-white transition-all ${loading
                                    ? 'bg-neutral-400 cursor-not-allowed'
                                    : 'bg-primary-700 hover:bg-primary-800 shadow-lg hover:shadow-xl'
                                }`}
                            whileHover={!loading ? { scale: 1.02 } : {}}
                            whileTap={!loading ? { scale: 0.98 } : {}}
                        >
                            {loading ? 'Saqlanmoqda...' : 'Saqlash'}
                        </motion.button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default Profile;