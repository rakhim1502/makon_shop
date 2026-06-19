// services/auth.service.js
import api from './api';

export const authService = {
    sendOTP: async (phone) => {
        const response = await api.post('/auth/send-otp', { phone });
        return response.data;
    },

    verifyOTP: async (phone, otp) => {
        const response = await api.post('/auth/verify-otp', { phone, otp });
        if (response.data.data.accessToken) {
            localStorage.setItem('accessToken', response.data.data.accessToken);
        }
        return response.data;
    },

    logout: async () => {
        await api.post('/auth/logout');
        localStorage.removeItem('accessToken');
    },

    getCurrentUser: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    },
};