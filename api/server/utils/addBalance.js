const { Transaction } = require('~/models/Transaction');
const User = require('~/models/User');

async function addBalance(email, amount, paymentId) {
  // Check for environment variable conditions
  try {
    if (!process.env.CHECK_BALANCE || process.env.CHECK_BALANCE !== 'true') {
      throw new Error('CHECK_BALANCE environment variable is not configured properly.');
    }

    // Find the user by email
    const user = await User.findOne({ email }).lean();
    if (!user) {
      console.error('No user with that email was found, while updating balance!', email);
    }

    // Create a transaction and update balance
    const transaction = await Transaction.create({
      user: user._id,
      tokenType: 'credits',
      context: `Adding balance ${
        +amount / 100
      } for user ${email} after payment confirmation. PaymentId: ${paymentId}`,
      rawAmount: +amount / 100,
    });

    return transaction.balance;
  } catch (error) {
    console.error('Error while adding balance', error);
  }
}

module.exports = { addBalance };
