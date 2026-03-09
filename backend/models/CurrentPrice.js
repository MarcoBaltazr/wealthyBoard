const mongoose = require('mongoose');

const currentPriceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ticker: {
    type: String,
    required: true,
    uppercase: true
  },
  currentPrice: {
    type: Number,
    required: true,
    min: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Índice composto: cada usuário pode ter seu próprio preço para cada ticker
currentPriceSchema.index({ userId: 1, ticker: 1 }, { unique: true });

module.exports = mongoose.model('CurrentPrice', currentPriceSchema);
