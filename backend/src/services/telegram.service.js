import TelegramBot from 'node-telegram-bot-api';
import logger from '../utils/logger.js';

class TelegramService {
    constructor() {
        this.bot = null;
        this.chatId = '2067393923'; // Telegram chat ID

        if ('8999094708:AAFQBygrezaYe4SB8L8pwgqPn0TRzISsZBE' && this.chatId) {
            this.bot = new TelegramBot('8999094708:AAFQBygrezaYe4SB8L8pwgqPn0TRzISsZBE', { polling: false });
            logger.info('✅ Telegram bot ishga tushdi');
        } else {
            logger.warn('⚠️ Telegram bot sozlanmagan');
        }
    }

    async sendMessage(message) {
        if (!this.bot || !this.chatId) {
            logger.warn('Telegram bot sozlanmagan, xabar yuborilmadi');
            return false;
        }

        try {
            await this.bot.sendMessage(this.chatId, message, {
                parse_mode: 'HTML',
                disable_web_page_preview: true,
            });
            logger.info('✅ Telegram xabar yuborildi');
            return true;
        } catch (error) {
            logger.error('❌ Telegram xabar yuborishda xatolik:', error.message);
            return false;
        }
    }

    async sendNewRentalNotification(rental) {
        const customerName = rental.customer?.name || rental.user?.firstName || 'Noma\'lum';
        const customerPhone = rental.customer?.phone || rental.user?.phone || 'Noma\'lum';

        const itemsList = rental.items.map(item =>
            `• ${item.equipment?.name || 'Jihoz'} - ${item.quantity} dona × ${item.dailyRate?.toLocaleString()} so'm`
        ).join('\n');

        const message = `
📦 <b>Yangi buyurtma!</b>

🔢 <b>Buyurtma raqami:</b> #${rental._id.toString().slice(-6).toUpperCase()}
👤 <b>Mijoz:</b> ${customerName}
📞 <b>Telefon:</b> ${customerPhone}
📍 <b>Manzil:</b> ${rental.customer?.address || 'Ko\'rsatilmagan'}

📅 <b>Ijara muddati:</b>
   Boshlanish: ${new Date(rental.startDate).toLocaleDateString('uz-UZ')}
   Tugash: ${new Date(rental.endDate).toLocaleDateString('uz-UZ')}
   Jami: ${rental.duration} kun

🎒 <b>Jihozlar:</b>
${itemsList}

💰 <b>To'lov:</b>
   Subtotal: ${rental.pricing?.subtotal?.toLocaleString()} so'm
   Depozit: ${rental.pricing?.deposit?.toLocaleString()} so'm
   <b>Jami: ${rental.pricing?.total?.toLocaleString()} so'm</b>

📝 <b>Izoh:</b> ${rental.notes || 'Yo\'q'}

⏰ ${new Date().toLocaleString('uz-UZ')}
    `.trim();

        return await this.sendMessage(message);
    }

    async sendOrderStatusUpdate(rental, newStatus) {
        const statusLabels = {
            approved: '✅ Tasdiqlandi',
            active: '🔄 Faol',
            completed: '✔️ Tugadi',
            cancelled: '❌ Bekor qilindi',
            rejected: '❌ Rad etildi',
        };

        const message = `
📋 <b>Buyurtma holati o'zgardi</b>

🔢 Buyurtma: #${rental._id.toString().slice(-6).toUpperCase()}
👤 Mijoz: ${rental.customer?.name || 'Noma\'lum'}
📞 Telefon: ${rental.customer?.phone || 'Noma\'lum'}

 Yangi holat: ${statusLabels[newStatus] || newStatus}

💰 Summa: ${rental.pricing?.total?.toLocaleString()} so'm

⏰ ${new Date().toLocaleString('uz-UZ')}
    `.trim();

        return await this.sendMessage(message);
    }
}

export default new TelegramService();