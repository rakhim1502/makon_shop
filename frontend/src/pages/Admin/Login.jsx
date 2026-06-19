import  { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../services/api';
import toast from 'react-hot-toast';

const AdminLogin = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.email || !formData.password) {
            toast.error('Email va parol kiriting');
            return;
        }

        setLoading(true);
        try {
            const res = await api.post('/admin/auth/login', formData);
            localStorage.setItem('accessToken', res.data.data.tokens.accessToken);
            localStorage.setItem('user', JSON.stringify(res.data.data.user));
            toast.success('Xush kelibsiz, Admin!');
            navigate('/admin');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Kirishda xatolik');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-primary-900 to-neutral-900 flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8"
            >
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-primary-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <span className="text-3xl">🔐</span>
                    </div>
                    <h1 className="text-2xl font-bold text-neutral-900">Admin Panel</h1>
                    <p className="text-neutral-600 mt-2">Makon.Shop boshqaruv tizimi</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-neutral-700 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="admin@makon.shop"
                            className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:border-primary-600 focus:ring-2 focus:ring-primary-200 outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-neutral-700 mb-2">
                            Parol
                        </label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            placeholder="••••••••"
                            className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:border-primary-600 focus:ring-2 focus:ring-primary-200 outline-none"
                            required
                        />
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
                        {loading ? 'Kirilmoqda...' : 'Kirish'}
                    </motion.button>
                </form>

                <p className="text-center text-xs text-neutral-500 mt-6">
                    🔒 Bu sahifa faqat administratorlar uchun
                </p>
            </motion.div>
        </div>
    );
};

export default AdminLogin;