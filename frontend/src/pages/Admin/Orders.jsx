import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import { getImageUrl, formatCurrency, formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const res = await api.get('/rentals/admin/all');
            setOrders(res.data.data.data || []);
        } catch (error) {
            console.error('Buyurtmalarni yuklashda xatolik:', error);
            toast.error('Buyurtmalarni yuklashda xatolik');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        try {
            await api.patch(`/rentals/admin/${id}/approve`);
            toast.success('Buyurtma tasdiqlandi ✅');
            fetchOrders();
        } catch (error) {
            console.error('Buyurtmani tasdiqlashda xatolik:', error);
            toast.error('Xatolik yuz berdi');
        }
    };

    const handleComplete = async (id) => {
        try {
            await api.patch(`/rentals/admin/${id}/complete`);
            toast.success('Buyurtma tugatildi ✅');
            fetchOrders();
        } catch (error) {
            console.error('Buyurtmani tugatishda xatolik:', error);
            toast.error('Xatolik yuz berdi');
        }
    };
    const handleExportExcel = () => {
        // Excel uchun ma'lumotlarni tayyorlash
        const excelData = filteredOrders.map(order => ({
            'Buyurtma ID': order._id.slice(-6).toUpperCase(),
            'Mijoz ismi': order.customer?.name || order.user?.firstName || 'Noma\'lum',
            'Telefon': order.customer?.phone || order.user?.phone || '',
            'Manzil': order.customer?.address || '',
            'Jihozlar': order.items.map(item => item.equipment?.name || 'Jihoz').join(', '),
            'Miqdor': order.items.reduce((sum, item) => sum + item.quantity, 0),
            'Boshlanish sanasi': new Date(order.startDate).toLocaleDateString('uz-UZ'),
            'Tugash sanasi': new Date(order.endDate).toLocaleDateString('uz-UZ'),
            'Kunlar soni': order.duration,
            'Subtotal (so\'m)': order.pricing?.subtotal || 0,
            'Depozit (so\'m)': order.pricing?.deposit || 0,
            'Jami summa (so\'m)': order.pricing?.total || 0,
            'Status': order.status === 'pending' ? 'Kutilmoqda' :
                order.status === 'approved' ? 'Tasdiqlangan' :
                    order.status === 'active' ? 'Faol' :
                        order.status === 'completed' ? 'Tugatilgan' :
                            order.status === 'cancelled' ? 'Bekor qilingan' : order.status,
            'Izoh': order.notes || '',
            'Yaratilgan sana': new Date(order.createdAt).toLocaleString('uz-UZ'),
        }));

        // Excel workbook yaratish
        const ws = XLSX.utils.json_to_sheet(excelData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Buyurtmalar');

        // Column widths
        ws['!cols'] = [
            { wch: 12 },  // Buyurtma ID
            { wch: 20 },  // Mijoz ismi
            { wch: 15 },  // Telefon
            { wch: 25 },  // Manzil
            { wch: 30 },  // Jihozlar
            { wch: 8 },   // Miqdor
            { wch: 15 },  // Boshlanish sanasi
            { wch: 15 },  // Tugash sanasi
            { wch: 10 },  // Kunlar soni
            { wch: 15 },  // Subtotal
            { wch: 15 },  // Depozit
            { wch: 15 },  // Jami summa
            { wch: 15 },  // Status
            { wch: 30 },  // Izoh
            { wch: 20 },  // Yaratilgan sana
        ];

        // Excel faylni saqlash
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

        const fileName = `buyurtmalar_${new Date().toISOString().split('T')[0]}.xlsx`;
        saveAs(data, fileName);

        toast.success(`Excel fayl yuklandi: ${fileName} ✅`);
    };


    const getStatusBadge = (status) => {
        const styles = {
            pending: 'bg-yellow-100 text-yellow-800',
            approved: 'bg-blue-100 text-blue-800',
            active: 'bg-primary-100 text-primary-800',
            completed: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800',
            rejected: 'bg-red-100 text-red-800',
        };
        const labels = {
            pending: 'Kutilmoqda',
            approved: 'Tasdiqlangan',
            active: 'Faol',
            completed: 'Tugatilgan',
            cancelled: 'Bekor qilingan',
            rejected: 'Rad etilgan',
        };
        return (
            <span className={`px-2 md:px-3 py-1 rounded-full text-xs font-semibold ${styles[status] || styles.pending}`}>
                {labels[status] || status}
            </span>
        );
    };

    const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status === filter);

    return (
        <div className="min-h-screen bg-neutral-50 py-4 md:py-8 px-3 md:px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header - Responsive */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 md:mb-8">
                    <div>
                        <h1 className="text-xl md:text-3xl font-bold text-neutral-900">Barcha buyurtmalar</h1>
                        <p className="text-sm md:text-base text-neutral-600 mt-1">Buyurtmalarni boshqarish va tasdiqlash</p>
                    </div>
                    <button
                        onClick={handleExportExcel}
                        disabled={filteredOrders.length === 0}
                        className={`w-full sm:w-auto px-4 md:px-6 py-2.5 md:py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 text-sm md:text-base ${filteredOrders.length === 0
                            ? 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
                            : 'bg-green-600 text-white hover:bg-green-700 shadow-lg'
                            }`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Excel yuklash
                    </button>
                </div>

                {/* Filter tabs - Horizontal scroll on mobile */}
                <div className="flex gap-2 mb-4 md:mb-6 overflow-x-auto pb-2 -mx-3 px-3 md:mx-0 md:px-0">
                    {['all', 'pending', 'approved', 'active', 'completed', 'cancelled'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-3 md:px-4 py-2 rounded-xl text-xs md:text-sm font-semibold whitespace-nowrap transition-all flex-shrink-0 ${filter === status
                                ? 'bg-primary-700 text-white shadow-lg'
                                : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
                                }`}
                        >
                            {status === 'all' ? 'Barchasi' :
                                status === 'pending' ? 'Kutilmoqda' :
                                    status === 'approved' ? 'Tasdiqlangan' :
                                        status === 'active' ? 'Faol' :
                                            status === 'completed' ? 'Tugatilgan' : 'Bekor qilingan'}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="text-center py-12 md:py-20">
                        <div className="w-10 h-10 md:w-12 md:h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    </div>
                ) : (
                    <div className="space-y-3 md:space-y-4">
                        {filteredOrders.map((order) => (
                            <motion.div
                                key={order._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-soft border border-neutral-100"
                            >
                                <div className="flex flex-wrap items-start justify-between gap-3 md:gap-4 mb-3 md:mb-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 md:gap-3 mb-2">
                                            <h3 className="text-sm md:text-lg font-bold text-neutral-900 truncate">
                                                Buyurtma #{order._id.slice(-6).toUpperCase()}
                                            </h3>
                                            {getStatusBadge(order.status)}
                                        </div>
                                        <p className="text-xs md:text-sm text-neutral-500 truncate">
                                            {order.customer?.name || order.user?.firstName || 'Noma\'lum'} •
                                            {order.customer?.phone || order.user?.phone || ''}
                                        </p>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <p className="text-lg md:text-2xl font-bold text-primary-700">
                                            {formatCurrency(order.pricing.total)}
                                        </p>
                                        <p className="text-xs text-neutral-500">
                                            {order.duration} kun • {order.items.length} jihoz
                                        </p>
                                    </div>
                                </div>

                                {/* Jihozlar */}
                                <div className="space-y-2 mb-3 md:mb-4">
                                    {order.items.map((item) => (
                                        <div key={item._id} className="flex items-center gap-2 md:gap-3 p-2 md:p-3 bg-neutral-50 rounded-lg md:rounded-xl">
                                            <img
                                                src={item.equipment?.images?.[0]?.url
                                                    ? getImageUrl(item.equipment.images[0].url)
                                                    : '/placeholder.jpg'
                                                }
                                                alt={item.equipment?.name || 'Jihoz'}
                                                className="w-10 h-10 md:w-14 md:h-14 rounded-lg object-cover flex-shrink-0 bg-neutral-200"
                                                onError={(e) => {
                                                    e.target.src = '/placeholder.jpg';
                                                }}
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-neutral-900 text-xs md:text-sm truncate">{item.equipment?.name || 'Jihoz'}</p>
                                                <p className="text-xs text-neutral-500">
                                                    {item.quantity} × {formatCurrency(item.dailyRate)} / kun
                                                </p>
                                            </div>
                                            <p className="font-bold text-neutral-900 text-xs md:text-sm flex-shrink-0">{formatCurrency(item.subtotal)}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Sanalar */}
                                <div className="grid grid-cols-2 gap-2 md:gap-4 p-2 md:p-4 bg-neutral-50 rounded-lg md:rounded-xl mb-3 md:mb-4">
                                    <div>
                                        <p className="text-xs text-neutral-500 uppercase font-semibold">Boshlanishi</p>
                                        <p className="font-bold text-neutral-900 text-xs md:text-sm">{formatDate(order.startDate)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-neutral-500 uppercase font-semibold">Tugashi</p>
                                        <p className="font-bold text-neutral-900 text-xs md:text-sm">{formatDate(order.endDate)}</p>
                                    </div>
                                </div>

                                {/* Harakatlar */}
                                <div className="flex flex-wrap gap-2">
                                    {order.status === 'pending' && (
                                        <button
                                            onClick={() => handleApprove(order._id)}
                                            className="flex-1 min-w-[120px] px-3 md:px-4 py-2 bg-primary-600 text-white rounded-lg md:rounded-xl text-xs md:text-sm font-semibold hover:bg-primary-700 transition-colors"
                                        >
                                            ✓ Tasdiqlash
                                        </button>
                                    )}
                                    {order.status === 'active' && (
                                        <button
                                            onClick={() => handleComplete(order._id)}
                                            className="flex-1 min-w-[120px] px-3 md:px-4 py-2 bg-green-600 text-white rounded-lg md:rounded-xl text-xs md:text-sm font-semibold hover:bg-green-700 transition-colors"
                                        >
                                            ✓ Tugatish
                                        </button>
                                    )}
                                    {order.notes && (
                                        <div className="w-full md:flex-1">
                                            <p className="text-xs text-neutral-500">Izoh: {order.notes}</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                        {filteredOrders.length === 0 && (
                            <div className="text-center py-8 md:py-12 bg-white rounded-xl md:rounded-2xl">
                                <p className="text-neutral-500 text-sm md:text-base">Buyurtmalar topilmadi</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminOrders;