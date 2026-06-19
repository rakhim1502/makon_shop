// frontend/src/contexts/AuthContext.jsx
import { createContext, useContext, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const dispatch = useDispatch();
    const { user, isAuthenticated, accessToken } = useSelector((state) => state.auth);

    // Token mavjud bo'lsa, foydalanuvchi ma'lumotlarini yuklash
    useEffect(() => {
        if (accessToken && !user) {
            fetchCurrentUser();
        }
    }, [accessToken]);

    const fetchCurrentUser = async () => {
        try {
            const response = await api.get('/auth/me');
            // Redux'ga saqlash uchun action kerak bo'ladi
            console.log('User loaded:', response.data.data);
        } catch (error) {
            console.error('Foydalanuvchini yuklashda xatolik:', error);
            // Agar token noto'g'ri bo'lsa, logout qilish
            if (error.response?.status === 401) {
                dispatch(logout());
            }
        }
    };

    const handleLogout = async () => {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            console.error('Logout xatosi:', error);
        } finally {
            dispatch(logout());
        }
    };

    const value = {
        user,
        isAuthenticated,
        accessToken,
        logout: handleLogout,
        refreshUser: fetchCurrentUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook - AuthContext'dan foydalanish uchun
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth hook AuthProvider ichida ishlatilishi kerak');
    }
    return context;
};

export default AuthContext;