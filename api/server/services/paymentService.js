require('dotenv').config();
const axios = require('axios');
const generatePaymentToken = require('../../utils/generatePaymentToken');

class PaymentService {
  static async initPayment(amount, orderId, description, receipt, data = '') {
    const params = {
      TerminalKey: process.env.TBANK_TERMINAL_KEY,
      Amount: amount,
      OrderId: orderId,
      Description: description,
    };

    const token = generatePaymentToken(params);
    const payload = {
      TerminalKey: process.env.TBANK_TERMINAL_KEY,
      Amount: amount,
      OrderId: orderId,
      Token: token,
      Description: description,
      Receipt: receipt,
      DATA: data,
    };

    console.log(payload);

    const response = await axios.post('https://securepay.tinkoff.ru/v2/Init', payload);
    return response.data;
  }

  static async getPaymentStatus(paymentId) {
    const params = {
      TerminalKey: process.env.TBANK_TERMINAL_KEY,
      PaymentId: paymentId,
    };

    const token = generatePaymentToken(params);

    const payload = {
      TerminalKey: process.env.TBANK_TERMINAL_KEY,
      PaymentId: paymentId,
      Token: token,
    };

    const response = await axios.post('https://securepay.tinkoff.ru/v2/GetState', payload);
    return response.data;
  }
}

module.exports = PaymentService;
