// frontend/src/store/slices/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../../services/auth.service';

export const sendOTP = createAsyncThunk('auth/sendOTP', async (phone, { rejectWithValue }) => {
    try {
        const response = await authService.sendOTP(phone);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Xatolik yuz berdi');
    }
});

export const verifyOTP = createAsyncThunk('auth/verifyOTP', async ({ phone, otp }, { rejectWithValue }) => {
    try {
        const response = await authService.verifyOTP(phone, otp);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Xatolik yuz berdi');
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        accessToken: localStorage.getItem('accessToken') || null,
        isAuthenticated: !!localStorage.getItem('accessToken'),
        loading: false,
        error: null,
        otpSent: false,
    },
    reducers: {
        logout: (state) => {
            state.user = null;
            state.accessToken = null;
            state.isAuthenticated = false;
            localStorage.removeItem('accessToken');
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Send OTP
            .addCase(sendOTP.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(sendOTP.fulfilled, (state) => { state.loading = false; state.otpSent = true; })
            .addCase(sendOTP.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
            // Verify OTP
            .addCase(verifyOTP.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(verifyOTP.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.accessToken = action.payload.tokens.accessToken;
                state.isAuthenticated = true;
                localStorage.setItem('accessToken', action.payload.tokens.accessToken);
            })
            .addCase(verifyOTP.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
    },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;