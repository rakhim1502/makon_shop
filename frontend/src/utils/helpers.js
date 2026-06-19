// Backend URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const BASE_URL = API_URL.replace('/api', '');

console.log('🌐 API URL:', API_URL);
console.log('🌐 BASE URL:', BASE_URL);

// Rasm URL'ini to'liq qilish
export const getImageUrl = (url) => {
    // Agar URL yo'q bo'lsa
    if (!url) {
        console.warn('⚠️ Rasm URL yo\'q');
        return '/placeholder.jpg';
    }

    // Agar allaqachon to'liq URL bo'lsa
    if (url.startsWith('http://') || url.startsWith('https://')) {
        console.log('✅ To\'liq URL:', url);
        return url;
    }

    // Agar /uploads/ bilan boshlansa
    if (url.startsWith('/uploads/')) {
        const fullUrl = `${BASE_URL}${url}`;
        console.log('✅ Uploads URL:', fullUrl);
        return fullUrl;
    }

    // Oddiy holat
    const fullUrl = `${BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
    console.log('✅ URL:', fullUrl);
    return fullUrl;
};

// Narxni formatlash
export const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '0 so\'m';
    return new Intl.NumberFormat('uz-UZ').format(amount) + " so'm";
};

// Kunlar sonini hisoblash
// Kunlar sonini hisoblash
export const calculateDays = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Agar bir xil sana bo'lsa, 1 kun
    if (start.toDateString() === end.toDateString()) {
        return 1;
    }

    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
};

// Sanani formatlash
export const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('uz-UZ', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};