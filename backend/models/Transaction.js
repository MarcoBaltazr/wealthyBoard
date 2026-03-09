const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['COMPRA', 'VENDA']
  },
  ticker: {
    type: String,
    required: true,
    uppercase: true
  },
  category: {
    type: String,
    required: true,
    enum: ['ACAO', 'FII', 'BDR', 'CRIPTO']
  },
  date: {
    type: Date,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  unitPrice: {
    type: Number,
    required: true,
    min: 0
  },
  fee: {
    type: Number,
    default: 0,
    min: 0
  },
  totalValue: {
    type: Number
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Calcula o valor total antes de salvar
transactionSchema.pre('save', function(next) {
  if (this.type === 'COMPRA') {
    this.totalValue = (this.quantity * this.unitPrice) + this.fee;
  } else {
    this.totalValue = (this.quantity * this.unitPrice) - this.fee;
  }
  next();
});

module.exports = mongoose.model('Transaction', transactionSchema);
