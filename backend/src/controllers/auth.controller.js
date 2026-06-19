import authService from '../services/auth.service.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

export const sendOTP = asyncHandler(async (req, res) => {
    const { phone } = req.body;
    const result = await authService.sendOTP(phone);
    res.status(200).json(new ApiResponse(200, result, 'OTP yuborildi'));
});

export const verifyOTP = asyncHandler(async (req, res) => {
    const { phone, otp } = req.body;
    const result = await authService.verifyOTP(phone, otp);

    res.cookie('refreshToken', result.tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json(new ApiResponse(200, result, 'Muvaffaqiyatli'));
});

export const refreshToken = asyncHandler(async (req, res) => {
    const { refreshToken } = req.cookies;
    if (!refreshToken) throw new Error('Refresh token topilmadi');

    const tokens = await authService.refreshToken(refreshToken);

    res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json(new ApiResponse(200, { accessToken: tokens.accessToken }, 'Token yangilandi'));
});

export const logout = asyncHandler(async (req, res) => {
    await authService.logout(req.user._id);
    res.clearCookie('refreshToken');
    res.status(200).json(new ApiResponse(200, null, 'Chiqdingiz'));
});

export const getCurrentUser = asyncHandler(async (req, res) => {
    res.status(200).json(new ApiResponse(200, req.user, 'Foydalanuvchi'));
});
