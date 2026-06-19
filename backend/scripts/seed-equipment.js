import mongoose from 'mongoose';
import Equipment from '../src/models/Equipment.model.js';
import dotenv from 'dotenv';

dotenv.config();

// Slug generatsiya qilish funksiyasi
const slugify = (text) => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
};

const seedData = [
    {
        name: 'Tog\' palatkasi 4 kishilik',
        slug: slugify('Tog\' palatkasi 4 kishilik'),
        description: 'Sifatli tog\' palatkasi, 4 kishi uchun mo\'ljallangan. Suv o\'tkazmaydi, shamolga chidamli. Ikki qavatli, ventilyatsiya tizimi bilan.',
        category: 'tent',
        brand: 'The North Face',
        images: [
            {
                url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80',
                isPrimary: true
            }
        ],
        pricing: {
            dailyRate: 80000,
            weeklyRate: 500000,
            deposit: 300000,
            currency: 'UZS'
        },
        stock: { total: 5, available: 5 },
        status: 'available',
        condition: 'excellent',
        specifications: {
            capacity: '4 kishi',
            weight: '3.5 kg',
            dimensions: '210 x 240 x 130 cm',
            material: 'Polyester ripstop',
            color: 'Yashil/sariq'
        }
    },
    {
        name: 'Kichik palatka 2 kishilik',
        slug: slugify('Kichik palatka 2 kishilik'),
        description: 'Yengil va ixcham palatka, 2 kishi uchun. Tez o\'rnatiladi, yomg\'irdan himoya qiladi.',
        category: 'tent',
        brand: 'Quechua',
        images: [
            {
                url: 'https://images.unsplash.com/photo-1478131118523-7b8e287f2393?w=800&q=80',
                isPrimary: true
            }
        ],
        pricing: {
            dailyRate: 50000,
            weeklyRate: 300000,
            deposit: 200000,
            currency: 'UZS'
        },
        stock: { total: 8, available: 8 },
        status: 'available',
        condition: 'good',
        specifications: {
            capacity: '2 kishi',
            weight: '2.1 kg',
            dimensions: '210 x 120 x 95 cm',
            material: 'Polyester',
            color: 'Ko\'k'
        }
    },
    {
        name: 'Uyqu qopi -15°C',
        slug: slugify('Uyqu qopi -15°C'),
        description: 'Qishki uyqu qopi, -15°C gacha haroratga mo\'ljallangan. Yumshoq va qulay, ichki qismi flanel.',
        category: 'sleeping_bag',
        brand: 'Coleman',
        images: [
            {
                url: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=800&q=80',
                isPrimary: true
            }
        ],
        pricing: {
            dailyRate: 35000,
            weeklyRate: 200000,
            deposit: 150000,
            currency: 'UZS'
        },
        stock: { total: 10, available: 10 },
        status: 'available',
        condition: 'excellent',
        specifications: {
            temperature: '-15°C',
            weight: '1.8 kg',
            material: 'Down/sintetika',
            color: 'Qizil'
        }
    },
    {
        name: 'Uyqu qopi -5°C',
        slug: slugify('Uyqu qopi -5°C'),
        description: 'Yozgi va kuzgi uyqu qopi, -5°C gacha. Yengil va ixcham.',
        category: 'sleeping_bag',
        brand: 'Outwell',
        images: [
            {
                url: 'https://images.unsplash.com/photo-1499678329070-44a27ad7c07c?w=800&q=80',
                isPrimary: true
            }
        ],
        pricing: {
            dailyRate: 25000,
            weeklyRate: 150000,
            deposit: 100000,
            currency: 'UZS'
        },
        stock: { total: 12, available: 12 },
        status: 'available',
        condition: 'good',
        specifications: {
            temperature: '-5°C',
            weight: '1.2 kg',
            material: 'Sintetika',
            color: 'Ko\'k'
        }
    },
    {
        name: 'Ryukzak 65L trekking',
        slug: slugify('Ryukzak 65L trekking'),
        description: 'Katta hajmli professional ryukzak, uzoq sayohatlar uchun. Orqa qismi ventilyatsiyali, ko\'p cho\'ntaklar.',
        category: 'backpack',
        brand: 'Osprey',
        images: [
            {
                url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
                isPrimary: true
            }
        ],
        pricing: {
            dailyRate: 40000,
            weeklyRate: 250000,
            deposit: 200000,
            currency: 'UZS'
        },
        stock: { total: 6, available: 6 },
        status: 'available',
        condition: 'excellent',
        specifications: {
            capacity: '65 litr',
            weight: '2.1 kg',
            material: 'Nylon ripstop',
            color: 'Kulrang'
        }
    },
    {
        name: 'Ryukzak 40L',
        slug: slugify('Ryukzak 40L'),
        description: 'O\'rta hajmli ryukzak, kunlik sayohatlar uchun. Qulay va yengil.',
        category: 'backpack',
        brand: 'Deuter',
        images: [
            {
                url: 'https://images.unsplash.com/photo-1622560480601-d5c0f5c0e6a2?w=800&q=80',
                isPrimary: true
            }
        ],
        pricing: {
            dailyRate: 30000,
            weeklyRate: 180000,
            deposit: 150000,
            currency: 'UZS'
        },
        stock: { total: 8, available: 8 },
        status: 'available',
        condition: 'good',
        specifications: {
            capacity: '40 litr',
            weight: '1.5 kg',
            material: 'Polyester',
            color: 'Qora'
        }
    },
    {
        name: 'Gaz plitasi + balon',
        slug: slugify('Gaz plitasi + balon'),
        description: 'Kompakt gaz plitasi, tez qaynaydi. 230g balon bilan birga keladi. 2 ta gorelka.',
        category: 'cooking',
        brand: 'Jetboil',
        images: [
            {
                url: 'https://images.unsplash.com/photo-1571680345508-12c3b63c4f35?w=800&q=80',
                isPrimary: true
            }
        ],
        pricing: {
            dailyRate: 25000,
            weeklyRate: 150000,
            deposit: 100000,
            currency: 'UZS'
        },
        stock: { total: 10, available: 10 },
        status: 'available',
        condition: 'excellent',
        specifications: {
            weight: '0.6 kg',
            material: 'Aluminum',
            burners: '2 ta',
            power: '3000W'
        }
    },
    {
        name: 'Idishlar to\'plami',
        slug: slugify('Idishlar to\'plami'),
        description: 'Turistik idishlar to\'plami: qozon, skovorodka, qoshiq, vilka. 4 kishi uchun.',
        category: 'cooking',
        brand: 'Camp Cookware',
        images: [
            {
                url: 'https://images.unsplash.com/photo-1533038590840-1cde6e668a91?w=800&q=80',
                isPrimary: true
            }
        ],
        pricing: {
            dailyRate: 20000,
            weeklyRate: 120000,
            deposit: 80000,
            currency: 'UZS'
        },
        stock: { total: 6, available: 6 },
        status: 'available',
        condition: 'good',
        specifications: {
            weight: '1.2 kg',
            material: 'Aluminum',
            pieces: '8 ta',
            for: '4 kishi'
        }
    },
    {
        name: 'Trekking tayoqlari (juft)',
        slug: slugify('Trekking tayoqlari (juft)'),
        description: 'Yengil alyuminiy trekking tayoqlari, balandligi sozlanadi. Qulay tutqichlar.',
        category: 'hiking_gear',
        brand: 'Black Diamond',
        images: [
            {
                url: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80',
                isPrimary: true
            }
        ],
        pricing: {
            dailyRate: 20000,
            weeklyRate: 120000,
            deposit: 80000,
            currency: 'UZS'
        },
        stock: { total: 12, available: 12 },
        status: 'available',
        condition: 'excellent',
        specifications: {
            weight: '0.5 kg (juft)',
            material: 'Aluminum',
            length: '110-135 cm',
            type: 'Teleskopik'
        }
    },
    {
        name: 'Fonar boshga taqiladigan',
        slug: slugify('Fonar boshga taqiladigan'),
        description: 'LED fonar, boshga taqiladi. 300 lumen, suv o\'tkazmaydi. Batareya bilan.',
        category: 'hiking_gear',
        brand: 'Petzl',
        images: [
            {
                url: 'https://images.unsplash.com/photo-1516766976402-7d0c4d4ac0dd?w=800&q=80',
                isPrimary: true
            }
        ],
        pricing: {
            dailyRate: 15000,
            weeklyRate: 90000,
            deposit: 60000,
            currency: 'UZS'
        },
        stock: { total: 15, available: 15 },
        status: 'available',
        condition: 'good',
        specifications: {
            brightness: '300 lumen',
            weight: '0.1 kg',
            battery: 'AAA x 3',
            waterproof: 'IPX4'
        }
    },
    {
        name: 'Karimat (penka)',
        slug: slugify('Karimat (penka)'),
        description: 'Issiqlik izolyatsiya qiluvchi gilamcha. Qalinligi 10mm, suv o\'tkazmaydi.',
        category: 'hiking_gear',
        brand: 'Greenell',
        images: [
            {
                url: 'https://images.unsplash.com/photo-1523987355523-c7b52549f363?w=800&q=80',
                isPrimary: true
            }
        ],
        pricing: {
            dailyRate: 10000,
            weeklyRate: 60000,
            deposit: 40000,
            currency: 'UZS'
        },
        stock: { total: 20, available: 20 },
        status: 'available',
        condition: 'good',
        specifications: {
            thickness: '10mm',
            size: '180 x 60 cm',
            weight: '0.4 kg',
            material: 'EVA foam'
        }
    },
    {
        name: 'Termos 1L',
        slug: slugify('Termos 1L'),
        description: 'Issiqlikni 12 soatgacha saqlaydi. Zanglamaydigan po\'latdan.',
        category: 'cooking',
        brand: 'Thermos',
        images: [
            {
                url: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2f2e6?w=800&q=80',
                isPrimary: true
            }
        ],
        pricing: {
            dailyRate: 12000,
            weeklyRate: 70000,
            deposit: 50000,
            currency: 'UZS'
        },
        stock: { total: 10, available: 10 },
        status: 'available',
        condition: 'excellent',
        specifications: {
            capacity: '1 litr',
            weight: '0.5 kg',
            material: 'Stainless steel',
            heatRetention: '12 soat'
        }
    }
];

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB ga ulandi');

        // Eski ma'lumotlarni o'chirish
        await Equipment.deleteMany({});
        console.log('🗑️  Eski jihozlar o\'chirildi');

        // Eski index'larni tozalash (muammo bo'lsa)
        await Equipment.collection.dropIndex('slug_1').catch(() => {
            console.log('ℹ️  Eski slug index topilmadi (muammo emas)');
        });

        // Yangi ma'lumotlarni qo'shish
        const equipment = await Equipment.insertMany(seedData);
        console.log(`\n✅ ${equipment.length} ta jihoz muvaffaqiyatli qo'shildi!\n`);

        console.log('📦 Qo\'shilgan jihozlar:');
        equipment.forEach((item, index) => {
            console.log(`   ${index + 1}. ${item.name} - ${item.pricing.dailyRate.toLocaleString()} so'm/ kun`);
        });

        console.log('\n🎉 Endi http://localhost:5173/equipment sahifasini oching!\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Xatolik:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
};

seed();