const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');

// Obter todas as transações
router.get('/', async (req, res) => {
  try {
    const { category, ticker } = req.query;
    let filter = {};
    
    if (category) filter.category = category;
    if (ticker) filter.ticker = ticker.toUpperCase();
    
    const transactions = await Transaction.find(filter).sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obter uma transação específica
router.get('/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: 'Transação não encontrada' });
    }
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Criar nova transação
router.post('/', async (req, res) => {
  const transaction = new Transaction(req.body);
  
  try {
    const newTransaction = await transaction.save();
    res.status(201).json(newTransaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Atualizar transação
router.put('/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: 'Transação não encontrada' });
    }
    
    Object.assign(transaction, req.body);
    const updatedTransaction = await transaction.save();
    res.json(updatedTransaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Deletar transação
router.delete('/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: 'Transação não encontrada' });
    }
    
    await transaction.deleteOne();
    res.json({ message: 'Transação deletada com sucesso' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
