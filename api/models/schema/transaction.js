const mongoose = require('mongoose');

const transactionSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
      required: true,
    },
    conversationId: {
      type: String,
      ref: 'Conversation',
      index: true,
    },
    tokenType: {
      type: String,
      enum: ['prompt', 'completion', 'credits', 'topUp'],
      required: true,
    },
    model: {
      type: String,
    },
    context: {
      type: String,
    },
    valueKey: {
      type: String,
    },
    rate: Number,
    rawAmount: Number,
    tokenValue: Number || null,
    inputTokens: { type: Number },
    writeTokens: { type: Number },
    readTokens: { type: Number },
    description: {
      type: String,
    },
    orderId: {
      type: String,
    },
    receipt: {
      type: Object,
    },
    amount: Number,
    status: {
      type: String,

      enum: ['pending', 'initialized', 'confirmed', 'canceled', 'rejected', 'expired'],
      default: 'initialized',
    },
    paymentUrl: {
      type: String,
    },
    paymentId: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = transactionSchema;
