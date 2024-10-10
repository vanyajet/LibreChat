const { Transaction } = require('../../models/Transaction');

const TransactionController = {
  async getUserTransactions(req, res) {
    console.log('here');
    try {
      const transactions = await Transaction.find({
        user: req.user._id,
        tokenType: 'topUp',
      }).lean();
      res.status(200).send(transactions);
    } catch (error) {
      res.status(500).send({ message: 'Error fetching transactions' });
    }
  },
};

module.exports = TransactionController;
