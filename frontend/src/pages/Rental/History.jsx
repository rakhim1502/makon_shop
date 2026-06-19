// frontend/src/pages/Rental/History.jsx
import  { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { formatCurrency, formatDate, calculateDays } from '../../utils/helpers';
import toast from 'react-hot-toast';

const RentalHistory = () => {
    const [rentals, setRentals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchRentals();
    }, []);

    const fetchRentals = async () => {
        try {
            const res = await api.get('/rentals/my');
            setRentals(res.data.data);
        } catch (error) {
            console.error('Error fetching rentals:', error);
            toast.error('Buyurtmalarni yuklashda xatolik');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (id) => {
        if (!window.confirm('Buyurtmani bekor qilishni xohlaysizmi?')) return;
        try {
            await api.patch(`/rentals/${id}/cancel`);
            toast.success('Buyurtma bekor qilindi');
            fetchRentals();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Xatolik');
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            approved: 'bg-blue-100 text-blue-800 border-blue-200',
            active: 'bg-primary-100 text-primary-800 border-primary-200',
            completed: 'bg-green-100 text-green-800 border-green-200',
            cancelled: 'bg-red-100 text-red-800 border-red-200',
        };
        const labels = {
            pending: 'Kutilmoqda',
            approved: 'Tasdiqlangan',
            active: 'Faol',
            completed: 'Tugatilgan',
            cancelled: 'Bekor qilingan',
        };
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[status]}`}>
                {labels[status]}
            </span>
        );
    };

    const filteredRentals = filter === 'all' ? rentals : rentals.filter(r => r.status === filter);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl font-bold text-neutral-900">Mening buyurtmalarim</h1>
                    <p className="text-neutral-600 mt-2">Barcha ijara buyurtmalaringiz tarixi</p>
                </motion.div>

                {/* Filter tabs */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {['all', 'pending', 'active', 'completed', 'cancelled'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${filter === status
                                    ? 'bg-primary-700 text-white shadow-lg'
                                    : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
                                }`}
                        >
                            {status === 'all' ? 'Barchasi' :
                                status === 'pending' ? 'Kutilmoqda' :
                                    status === 'active' ? 'Faol' :
                                        status === 'completed' ? 'Tugatilgan' : 'Bekor qilingan'}
                        </button>
                    ))}
                </div>

                {/* Rentals list */}
                {filteredRentals.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center border border-neutral-100">
                        <div className="text-6xl mb-4">📦</div>
                        <h3 className="text-xl font-bold text-neutral-900 mb-2">Buyurtmalar topilmadi</h3>
                        <p className="text-neutral-600 mb-6">Siz hali buyurtma bermagansiz</p>
                        <Link
                            to="/equipment"
                            className="inline-block px-6 py-3 bg-primary-700 text-white rounded-xl font-semibold hover:bg-primary-800 transition-all"
                        >
                            Jihozlarni ko'rish
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredRentals.map((rental, index) => (
                            <motion.div
                                key={rental._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-white rounded-2xl p-6 shadow-soft border border-neutral-100 hover:shadow-medium transition-shadow"
                            >
                                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-bold text-neutral-900">
                                                Buyurtma #{rental._id.slice(-6).toUpperCase()}
                                            </h3>
                                            {getStatusBadge(rental.status)}
                                        </div>
                                        <p className="text-sm text-neutral-500">
                                            {formatDate(rental.createdAt)}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-primary-700">
                                            {formatCurrency(rental.pricing.total)}
                                        </p>
                                        <p className="text-xs text-neutral-500">
                                            {rental.duration} kun × {rental.items.length} jihoz
                                        </p>
                                    </div>
                                </div>

                                {/* Equipment list */}
                                <div className="space-y-2 mb-4">
                                    {rental.items.map((item) => (
                                        <div key={item._id} className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl">
                                            <img
                                                src={item.equipment?.images?.[0]?.url || '/placeholder.jpg'}
                                                alt={item.equipment?.name}
                                                className="w-14 h-14 rounded-lg object-cover"
                                            />
                                            <div className="flex-1">
                                                <p className="font-semibold text-neutral-900">{item.equipment?.name}</p>
                                                <p className="text-sm text-neutral-500">
                                                    {item.quantity} × {formatCurrency(item.dailyRate)} / kun
                                                </p>
                                            </div>
                                            <p className="font-bold text-neutral-900">{formatCurrency(item.subtotal)}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Dates */}
                                <div className="grid grid-cols-2 gap-4 p-4 bg-neutral-50 rounded-xl mb-4">
                                    <div>
                                        <p className="text-xs text-neutral-500 uppercase font-semibold">Boshlanishi</p>
                                        <p className="font-bold text-neutral-900">{formatDate(rental.startDate)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-neutral-500 uppercase font-semibold">Tugashi</p>
                                        <p className="font-bold text-neutral-900">{formatDate(rental.endDate)}</p>
                                    </div>
                                </div>

                                {/* Actions */}
                                {(rental.status === 'pending' || rental.status === 'approved') && (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleCancel(rental._id)}
                                            className="px-4 py-2 bg-red-50 text-red-700 rounded-xl text-sm font-semibold hover:bg-red-100 transition-colors"
                                        >
                                            Bekor qilish
                                        </button>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RentalHistory;