const express = require('express');
const { requireJwtAuth } = require('../middleware');
const { initializePayment } = require('../controllers/PaymentController');

const router = express.Router();
router.use(requireJwtAuth);

router.post('/topUp', initializePayment);

module.exports = router;