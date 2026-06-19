import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import api from '../../services/api';
import { formatCurrency } from '../../utils/helpers';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalRentals: 0,
        pendingRentals: 0,
        activeRentals: 0,
        completedRentals: 0,
        totalRevenue: 0,
        totalEquipment: 0,
        availableEquipment: 0,
        totalUsers: 0,
    });
    const [recentRentals, setRecentRentals] = useState([]);
    const [revenueData, setRevenueData] = useState([]);
    const [categoryData, setCategoryData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            // Barcha ma'lumotlarni parallel so'rash
            const [rentalsRes, equipmentRes, usersRes] = await Promise.all([
                api.get('/rentals/admin/all?limit=100'),
                api.get('/equipment?limit=100'),
                api.get('/users'),
            ]);

            const rentals = rentalsRes.data.data.data || [];
            const equipment = equipmentRes.data.data.data || [];
            const users = usersRes.data.data || [];

            // Statistika hisoblash
            const totalRevenue = rentals
                .filter(r => r.status === 'completed' || r.status === 'active')
                .reduce((sum, r) => sum + r.pricing.total, 0);

            const pendingRentals = rentals.filter(r => r.status === 'pending').length;
            const activeRentals = rentals.filter(r => r.status === 'active').length;
            const completedRentals = rentals.filter(r => r.status === 'completed').length;
            const availableEquipment = equipment.filter(e => e.status === 'available' && e.stock.available > 0).length;

            setStats({
                totalRentals: rentals.length,
                pendingRentals,
                activeRentals,
                completedRentals,
                totalRevenue,
                totalEquipment: equipment.length,
                availableEquipment,
                totalUsers: users.length || 0,
            });

            // So'nggi 5 buyurtma
            setRecentRentals(rentals.slice(0, 5));

            // Daromad grafigi (oxirgi 7 kun)
            const last7Days = Array.from({ length: 7 }, (_, i) => {
                const date = new Date();
                date.setDate(date.getDate() - (6 - i));
                return date.toISOString().split('T')[0];
            });

            const revenueByDay = last7Days.map(date => {
                const dayRevenue = rentals
                    .filter(r => r.createdAt.startsWith(date) && r.status !== 'cancelled')
                    .reduce((sum, r) => sum + r.pricing.total, 0);

                return {
                    date: new Date(date).toLocaleDateString('uz-UZ', { day: '2-digit', month: '2-digit' }),
                    revenue: dayRevenue,
                };
            });
            setRevenueData(revenueByDay);

            // Kategoriya bo'yicha jihozlar
            const categoryCount = {};
            equipment.forEach(eq => {
                categoryCount[eq.category] = (categoryCount[eq.category] || 0) + 1;
            });

            const categoryNames = {
                tent: 'Palatkalar',
                sleeping_bag: 'Uyqu qoplari',
                backpack: 'Ryukzaklar',
                hiking_gear: 'Hiking',
                cooking: 'Oshxona',
                clothing: 'Kiyim',
                other: 'Boshqa',
            };

            const categoryChartData = Object.entries(categoryCount).map(([name, count]) => ({
                name: categoryNames[name] || name,
                value: count,
            }));
            setCategoryData(categoryChartData);

        } catch (error) {
            console.error('Dashboard ma\'lumotlarini yuklashda xatolik:', error);
            toast.error('Ma\'lumotlarni yuklashda xatolik');
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            pending: 'bg-yellow-100 text-yellow-800',
            approved: 'bg-blue-100 text-blue-800',
            active: 'bg-primary-100 text-primary-800',
            completed: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800',
        };
        const labels = {
            pending: 'Kutilmoqda',
            approved: 'Tasdiqlangan',
            active: 'Faol',
            completed: 'Tugatilgan',
            cancelled: 'Bekor qilingan',
        };
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status] || styles.pending}`}>
                {labels[status] || status}
            </span>
        );
    };

    const COLORS = ['#16a34a', '#f59e0b', '#3b82f6', '#ef4444', '#8b5cf6', '#ec4899', '#6b7280'];

    if (loading) {
        return (
            <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-neutral-600">Yuklanmoqda...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-50 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-neutral-900">Admin Dashboard</h1>
                    <p className="text-neutral-600 mt-1">Makon.Shop boshqaruv paneli</p>
                </div>

                {/* Statistika kartalari */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl md:rounded-2xl p-4 md:p-6 border border-blue-200"
                    >
                        <div className="flex items-center justify-between mb-3 md:mb-4">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-500 rounded-lg md:rounded-xl flex items-center justify-center text-white text-xl md:text-2xl">
                                📦
                            </div>
                            <span className="text-blue-600 text-xs md:text-sm font-semibold">Jami</span>
                        </div>
                        <p className="text-2xl md:text-3xl font-bold text-blue-900">{stats.totalRentals}</p>
                        <p className="text-xs md:text-sm text-blue-700 mt-1">Buyurtmalar</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-6 border border-yellow-200"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center text-white text-2xl">
                                ⏳
                            </div>
                            <span className="text-yellow-600 text-sm font-semibold">Kutilmoqda</span>
                        </div>
                        <p className="text-3xl font-bold text-yellow-900">{stats.pendingRentals}</p>
                        <p className="text-sm text-yellow-700 mt-1">Tasdiq kutayotgan</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center text-white text-2xl">
                                ✅
                            </div>
                            <span className="text-green-600 text-sm font-semibold">Faol</span>
                        </div>
                        <p className="text-3xl font-bold text-green-900">{stats.activeRentals}</p>
                        <p className="text-sm text-green-700 mt-1">Joriy ijara</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center text-white text-2xl">
                                💰
                            </div>
                            <span className="text-purple-600 text-sm font-semibold">Daromad</span>
                        </div>
                        <p className="text-2xl font-bold text-purple-900">{formatCurrency(stats.totalRevenue)}</p>
                        <p className="text-sm text-purple-700 mt-1">Jami tushum</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl p-6 border border-pink-200"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-pink-500 rounded-xl flex items-center justify-center text-white text-2xl">
                                🎒
                            </div>
                            <span className="text-pink-600 text-sm font-semibold">Jihozlar</span>
                        </div>
                        <p className="text-3xl font-bold text-pink-900">{stats.totalEquipment}</p>
                        <p className="text-sm text-pink-700 mt-1">Jami, {stats.availableEquipment} ta mavjud</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center text-white text-2xl">
                                👥
                            </div>
                            <span className="text-orange-600 text-sm font-semibold">Foydalanuvchilar</span>
                        </div>
                        <p className="text-3xl font-bold text-orange-900">{stats.totalUsers}</p>
                        <p className="text-sm text-orange-700 mt-1">Ro'yxatdan o'tgan</p>
                    </motion.div>
                </div>

                {/* Grafiklar */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
                    {/* Daromad grafigi */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-soft border border-neutral-100"
                    >
                        <h2 className="text-lg md:text-xl font-bold text-neutral-900 mb-4">📈 Oxirgi 7 kunlik daromad</h2>
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                                <YAxis stroke="#6b7280" fontSize={12} />
                                <Tooltip
                                    formatter={(value) => formatCurrency(value)}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#16a34a"
                                    strokeWidth={2}
                                    dot={{ fill: '#16a34a', r: 4 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </motion.div>

                    {/* Kategoriya grafigi */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-soft border border-neutral-100"
                    >
                        <h2 className="text-lg md:text-xl font-bold text-neutral-900 mb-4">📊 Kategoriyalar</h2>
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, value }) => `${name}: ${value}`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </motion.div>
                </div>

                {/* Tezkor harakatlar */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <Link
                        to="/admin/equipment/add"
                        className="bg-white rounded-2xl p-6 shadow-soft border border-neutral-100 hover:shadow-medium transition-all hover:-translate-y-1 flex items-center gap-4"
                    >
                        <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-2xl">
                            ➕
                        </div>
                        <div>
                            <h3 className="font-bold text-neutral-900">Yangi jihoz qo'shish</h3>
                            <p className="text-sm text-neutral-500">Katalogga yangi mahsulot</p>
                        </div>
                    </Link>

                    <Link
                        to="/admin/orders"
                        className="bg-white rounded-2xl p-6 shadow-soft border border-neutral-100 hover:shadow-medium transition-all hover:-translate-y-1 flex items-center gap-4"
                    >
                        <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center text-2xl">
                            📋
                        </div>
                        <div>
                            <h3 className="font-bold text-neutral-900">Barcha buyurtmalar</h3>
                            <p className="text-sm text-neutral-500">Buyurtmalarni boshqarish</p>
                        </div>
                    </Link>

                    <Link
                        to="/admin/equipment"
                        className="bg-white rounded-2xl p-6 shadow-soft border border-neutral-100 hover:shadow-medium transition-all hover:-translate-y-1 flex items-center gap-4"
                    >
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl">
                            🎒
                        </div>
                        <div>
                            <h3 className="font-bold text-neutral-900">Jihozlarni ko'rish</h3>
                            <p className="text-sm text-neutral-500">Barcha jihozlarni boshqarish</p>
                        </div>
                    </Link>
                </div>

                {/* So'nggi buyurtmalar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl p-6 shadow-soft border border-neutral-100"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-neutral-900">📦 So'nggi buyurtmalar</h2>
                        <Link to="/admin/orders" className="text-sm font-semibold text-primary-700 hover:text-primary-800">
                            Barchasini ko'rish →
                        </Link>
                    </div>

                    {recentRentals.length === 0 ? (
                        <div className="text-center py-12 text-neutral-500">
                            <div className="text-6xl mb-4">📦</div>
                            <p>Hali buyurtmalar yo'q</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {recentRentals.map((rental) => (
                                <div
                                    key={rental._id}
                                    className="flex flex-wrap items-center justify-between gap-4 p-4 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors"
                                >
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <p className="font-bold text-neutral-900 truncate">
                                                #{rental._id.slice(-6).toUpperCase()}
                                            </p>
                                            {getStatusBadge(rental.status)}
                                        </div>
                                        <p className="text-sm text-neutral-500">
                                            {rental.customer?.name || rental.user?.firstName || 'Noma\'lum'} •
                                            {new Date(rental.createdAt).toLocaleDateString('uz-UZ')}
                                        </p>
                                    </div>

                                    <div className="text-right">
                                        <p className="font-bold text-primary-700">{formatCurrency(rental.pricing.total)}</p>
                                        <p className="text-xs text-neutral-500">{rental.duration} kun</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default AdminDashboard;