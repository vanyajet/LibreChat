const { Transaction } = require('../../models/Transaction');
const PaymentService = require('../services/paymentService');
const { addBalance } = require('../utils/addBalance');

const initializePayment = async (req, res) => {
  try {
    const amount = req.body.amount * 100;

    const receipt = {
      Email: req.user.email,
      Taxation: 'usn_income',
      Items: [
        {
          Name: 'Пополнение баланса',
          Price: amount,
          Quantity: 1.0,
          Amount: amount,
          PaymentMethod: 'full_prepayment',
          PaymentObject: 'service',
          Tax: 'none',
          MeasurementUnit: 'pc',
        },
      ],
    };

    const transactionCount = await Transaction.countDocuments();

    const transaction = await Transaction.create({
      user: req.user._id,
      tokenType: 'topUp',
      description: `Пополнение баланса пользователем ${req.user.email}`,
      orderId: transactionCount + 1,
      receipt,
      amount: amount,
      status: 'initialized',
      requestToken: null,
    });

    const paymentResponse = await PaymentService.initPayment(
      amount,
      transaction.orderId,
      transaction.description,
      receipt,
      { Email: req.user.email },
    );

    console.log(paymentResponse);

    if (paymentResponse.Success) {
      transaction.status = 'pending';
      transaction.paymentId = paymentResponse.PaymentId;
      transaction.paymentUrl = paymentResponse.PaymentURL;
      transaction.requestToken = paymentResponse.Token;
      await transaction.save();

      res.status(200).json({
        message: 'Payment initialized successfully',
        paymentUrl: paymentResponse.PaymentURL,
      });

      // Старт проверки состояния платежа
      checkPaymentStatus(transaction._id, req.user.email);
    } else {
      res.status(400).json({ error: paymentResponse.Message });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const checkPaymentStatus = async (transactionId, email, attempt = 1) => {
  try {
    const transaction = await Transaction.findById(transactionId);
    const paymentStatus = await PaymentService.getPaymentStatus(transaction.paymentId);
    console.log('Checking payment status, attempt:', attempt, paymentStatus);

    switch (paymentStatus.Status) {
      case 'CONFIRMED':
        await addBalance(email, transaction.amount, transaction.paymentId);
        transaction.status = 'confirmed';
        await transaction.save();
        return;
      case 'DEADLINE_EXPIRED':
        transaction.status = 'expired';
        await transaction.save();
        return;
      case 'CANCELED':
        transaction.status = 'canceled';
        await transaction.save();
        return;
      case 'REJECTED':
        transaction.status = 'rejected';
        await transaction.save();
        return;
      default:
        setTimeout(() => {
          checkPaymentStatus(transactionId, email, attempt + 1);
        }, attempt > 50 ? attempt * 5000 : 7000);
    }
  } catch (error) {
    console.error('Failed to check payment status:', error);
  }
};

module.exports = { initializePayment };
