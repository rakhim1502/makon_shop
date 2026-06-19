// backend/src/utils/validators.js

import { body, param, query } from 'express-validator';

/**
 * AUTH VALIDATORS
 * Telefon raqam va OTP uchun validatsiyalar
 */
export const authValidators = {
    sendOTP: [
        body('phone')
            .trim()
            .notEmpty()
            .withMessage('Telefon raqam kiritilishi shart')
            .matches(/^\+998\d{9}$/)
            .withMessage('Telefon raqam formati noto\'g\'ri. +998XXXXXXXXX formatida kiriting'),
    ],

    verifyOTP: [
        body('phone')
            .trim()
            .matches(/^\+998\d{9}$/)
            .withMessage('Telefon raqam formati noto\'g\'ri'),
        body('otp')
            .trim()
            .notEmpty()
            .withMessage('OTP kiritilishi shart')
            .isLength({ min: 6, max: 6 })
            .withMessage('OTP 6 xonali bo\'lishi kerak')
            .isNumeric()
            .withMessage('OTP faqat raqamlardan iborat bo\'lishi kerak'),
    ],
};

/**
 * EQUIPMENT VALIDATORS
 * Jihoz yaratish va yangilash uchun validatsiyalar
 */
export const equipmentValidators = {
    createEquipment: [
        body('name')
            .trim()
            .notEmpty()
            .withMessage('Jihoz nomi kiritilishi shart')
            .isLength({ min: 3, max: 100 })
            .withMessage('Nomi 3 dan 100 gacha belgidan iborat bo\'lishi kerak'),

        body('description')
            .trim()
            .notEmpty()
            .withMessage('Tavsif kiritilishi shart')
            .isLength({ min: 10, max: 1000 })
            .withMessage('Tavsif 10 dan 1000 gacha belgidan iborat bo\'lishi kerak'),

        body('category')
            .trim()
            .notEmpty()
            .withMessage('Kategoriya tanlanishi shart')
            .isIn(['tent', 'sleeping_bag', 'backpack', 'hiking_gear', 'cooking', 'clothing', 'other'])
            .withMessage('Noto\'g\'ri kategoriya'),

        body('pricing.dailyRate')
            .notEmpty()
            .withMessage('Kunlik narx kiritilishi shart')
            .isFloat({ min: 0 })
            .withMessage('Kunlik narx 0 dan katta bo\'lishi kerak'),

        body('pricing.deposit')
            .notEmpty()
            .withMessage('Depozit kiritilishi shart')
            .isFloat({ min: 0 })
            .withMessage('Depozit 0 dan katta bo\'lishi kerak'),

        body('stock.total')
            .notEmpty()
            .withMessage('Zahira soni kiritilishi shart')
            .isInt({ min: 1 })
            .withMessage('Zahira soni kamida 1 bo\'lishi kerak'),

        body('images')
            .optional()
            .isArray()
            .withMessage('Rasmlar massiv bo\'lishi kerak'),
    ],

    updateEquipment: [
        body('name')
            .optional()
            .isLength({ min: 3, max: 100 })
            .withMessage('Nomi 3 dan 100 gacha belgidan iborat bo\'lishi kerak'),

        body('pricing.dailyRate')
            .optional()
            .isFloat({ min: 0 })
            .withMessage('Kunlik narx 0 dan katta bo\'lishi kerak'),

        body('stock.total')
            .optional()
            .isInt({ min: 1 })
            .withMessage('Zahira soni kamida 1 bo\'lishi kerak'),
    ],

    checkAvailability: [
        param('equipmentId')
            .isMongoId()
            .withMessage('Jihoz ID noto\'g\'ri'),

        query('startDate')
            .notEmpty()
            .withMessage('Boshlanish sanasi kiritilishi shart')
            .isISO8601()
            .withMessage('Boshlanish sanasi noto\'g\'ri formatda (YYYY-MM-DD)'),

        query('endDate')
            .notEmpty()
            .withMessage('Tugash sanasi kiritilishi shart')
            .isISO8601()
            .withMessage('Tugash sanasi noto\'g\'ri formatda (YYYY-MM-DD)')
            .custom((value, { req }) => {
                if (new Date(value) <= new Date(req.query.startDate)) {
                    throw new Error('Tugash sanasi boshlanish sanasidan keyin bo\'lishi kerak');
                }
                return true;
            }),

        query('quantity')
            .optional()
            .isInt({ min: 1 })
            .withMessage('Miqdor kamida 1 bo\'lishi kerak'),
    ],
};

/**
 * RENTAL VALIDATORS
 * Buyurtma yaratish uchun validatsiyalar
 */
export const rentalValidators = {
    createRental: [
        body('equipment')
            .notEmpty()
            .withMessage('Jihoz tanlanishi shart')
            .isMongoId()
            .withMessage('Jihoz ID noto\'g\'ri'),

        body('startDate')
            .notEmpty()
            .withMessage('Boshlanish sanasi kiritilishi shart')
            .isISO8601()
            .withMessage('Boshlanish sanasi noto\'g\'ri'),

        body('endDate')
            .notEmpty()
            .withMessage('Tugash sanasi kiritilishi shart')
            .isISO8601()
            .withMessage('Tugash sanasi noto\'g\'ri'),

        body('quantity')
            .optional()
            .isInt({ min: 1 })
            .withMessage('Miqdor kamida 1 bo\'lishi kerak'),

        // Guest ma'lumotlari (login qilinmagan bo'lsa majburiy)
        body('customerName')
            .if(body('equipment').exists())
            .optional()
            .trim()
            .isLength({ min: 2, max: 100 })
            .withMessage('Ism 2 dan 100 gacha belgi bo\'lishi kerak'),

        body('customerPhone')
            .if(body('equipment').exists())
            .optional()
            .matches(/^\+998\d{9}$/)
            .withMessage('Telefon raqami noto\'g\'ri (+998XXXXXXXXX)'),

        body('customerAddress')
            .optional()
            .trim()
            .isLength({ max: 300 })
            .withMessage('Manzil 300 belgidan oshmasligi kerak'),
    ],
};

/**
 * USER VALIDATORS
 * Profil yangilash uchun validatsiyalar
 */
export const userValidators = {
    updateProfile: [
        body('firstName')
            .optional()
            .trim()
            .isLength({ min: 2, max: 50 })
            .withMessage('Ism 2 dan 50 gacha belgidan iborat bo\'lishi kerak'),

        body('lastName')
            .optional()
            .trim()
            .isLength({ min: 2, max: 50 })
            .withMessage('Familiya 2 dan 50 gacha belgidan iborat bo\'lishi kerak'),

        body('email')
            .optional()
            .trim()
            .isEmail()
            .withMessage('Email noto\'g\'ri formatda'),
    ],
};