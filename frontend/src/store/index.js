// frontend/src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import equipmentReducer from './slices/equipmentSlice';
import rentalReducer from './slices/rentalSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        equipment: equipmentReducer,
        rental: rentalReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Date object'lari bilan ishlash uchun
                ignoredActions: ['auth/verifyOTP/fulfilled'],
                ignoredPaths: ['auth.user'],
            },
        }),
    devTools: typeof globalThis !== 'undefined' && globalThis.process && globalThis.process.env && globalThis.process.env.NODE_ENV !== 'production',
});