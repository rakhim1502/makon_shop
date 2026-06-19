import User from '../models/User.model.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getProfile = asyncHandler(async (req, res) => {
    res.status(200).json(new ApiResponse(200, req.user, 'Profil'));
});

export const updateProfile = asyncHandler(async (req, res) => {
    const { firstName, lastName, email } = req.body;
    const user = await User.findByIdAndUpdate(
        req.user._id,
        { firstName, lastName, email },
        { new: true, runValidators: true }
    ).select('-refreshToken');

    if (!user) throw ApiError.notFound('Topilmadi');
    res.status(200).json(new ApiResponse(200, user, 'Yangilandi'));
});

export const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-refreshToken').sort({ createdAt: -1 });
    res.status(200).json(new ApiResponse(200, users, 'Foydalanuvchilar'));
});
