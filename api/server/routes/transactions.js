const express = require('express');
const { requireJwtAuth } = require('../middleware');
const { getUserTransactions } = require('../controllers/TransactionController');

const router = express.Router();
router.use(requireJwtAuth);

router.get('/', getUserTransactions);

module.exports = router;