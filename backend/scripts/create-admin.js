import mongoose from 'mongoose';
import User from '../src/models/User.model.js';
import dotenv from 'dotenv';

dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB ga ulandi');

        // Eski admin'ni o'chirish (agar mavjud bo'lsa)
        const existingAdmin = await User.findOne({ email: 'admin@makon.shop' });
        if (existingAdmin) {
            await User.findByIdAndDelete(existingAdmin._id);
            console.log('🗑️  Eski admin o\'chirildi');
        }

        // ✅ PAROLNI HASH QILMAYMIZ!
        // Chunki User.model.js da pre('save') middleware avtomatik hash qiladi
        const password = 'Admin159sdf!';
        console.log('🔐 Parol tayyor (middleware avtomatik hash qiladi)');

        // Admin yaratish
        const admin = await User.create({
            email: 'admin@makon.shop',
            password: password,  // ← Oddiy text, hash qilinmagan!
            firstName: 'Bosh',
            lastName: 'Administrator',
            role: 'admin',
            isActive: true,
        });

        console.log('\n✅ Admin muvaffaqiyatli yaratildi:');
        console.log('   📧 Email: admin@makon.shop');
        console.log('   🔑 Parol: Admin159sdf!');
        console.log('   👤 Role:', admin.role);
        console.log('   🆔 ID:', admin._id);
        console.log('\n🔐 Endi http://localhost:5173/admin/login sahifasiga kiring!\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Xatolik:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
};

createAdmin();