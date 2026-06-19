import logger from '../utils/logger.js';

class SmsService {
  async sendSMS(phone, message) {
    logger.info('[DEV SMS] ' + phone + ': ' + message);
    return true;
  }
}

export default new SmsService();
