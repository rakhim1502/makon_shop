import adminAuthService from '../services/adminAuth.service.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

export const adminLogin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const result = await adminAuthService.login(email, password);

    // Refresh token ni HttpOnly cookie ga saqlash
    res.cookie('adminRefreshToken', result.tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json(new ApiResponse(200, result, 'Admin muvaffaqiyatli kirdi'));
});

export const adminLogout = asyncHandler(async (req, res) => {
    await adminAuthService.logout(req.user._id);
    res.clearCookie('adminRefreshToken');
    res.status(200).json(new ApiResponse(200, null, 'Chiqdingiz'));
});

export const getAdminProfile = asyncHandler(async (req, res) => {
    res.status(200).json(new ApiResponse(200, req.user, 'Admin profili'));
});