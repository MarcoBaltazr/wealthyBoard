const mongoose = require('mongoose');

const currentPriceSchema = new mongoose.Schema({
  ticker: {
    type: String,
    required: true,
    uppercase: true,
    unique: true
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

module.exports = mongoose.model('CurrentPrice', currentPriceSchema);
