require('dotenv').config();
const crypto = require('crypto');

function generatePaymentToken(params) {
  params.Password = process.env.TBANK_PASSWORD;
  let tokenString = Object.keys(params)
    .sort()
    .map((key) => `${params[key]}`)
    .join('');

  return crypto.createHash('sha256').update(tokenString).digest('hex');
}

module.exports = generatePaymentToken;
