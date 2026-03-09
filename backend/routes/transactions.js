const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const auth = require('../middleware/auth');

// Todas as rotas requerem autenticação
router.use(auth);

// Obter todas as transações do usuário
router.get('/', async (req, res) => {
  try {
    const { category, ticker } = req.query;
    let filter = { userId: req.userId };
    
    if (category) filter.category = category;
    if (ticker) filter.ticker = ticker.toUpperCase();
    
    const transactions = await Transaction.find(filter).sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    console.error('Erro ao buscar transações:', error);
    res.status(500).json({ message: 'Erro ao buscar transações.' });
  }
});

// Obter uma transação específica
router.get('/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findOne({ 
      _id: req.params.id,
      userId: req.userId 
    });
    if (!transaction) {
      return res.status(404).json({ message: 'Transação não encontrada' });
    }
    res.json(transaction);
  } catch (error) {
    console.error('Erro ao buscar transação:', error);
    res.status(500).json({ message: 'Erro ao buscar transação.' });
  }
});

// Criar nova transação
router.post('/', async (req, res) => {
  const transaction = new Transaction({
    ...req.body,
    userId: req.userId
  });
  
  try {
    const newTransaction = await transaction.save();
    res.status(201).json(newTransaction);
  } catch (error) {
    console.error('Erro ao criar transação:', error);
    res.status(400).json({ message: 'Erro ao criar transação. Verifique os dados.' });
  }
});

// Atualizar transação
router.put('/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findOne({ 
      _id: req.params.id,
      userId: req.userId 
    });
    if (!transaction) {
      return res.status(404).json({ message: 'Transação não encontrada' });
    }
    
    // Não permite alterar userId
    const { userId, ...updateData } = req.body;
    Object.assign(transaction, updateData);
    const updatedTransaction = await transaction.save();
    res.json(updatedTransaction);
  } catch (error) {
    console.error('Erro ao atualizar transação:', error);
    res.status(400).json({ message: 'Erro ao atualizar transação. Verifique os dados.' });
  }
});

// Deletar transação
router.delete('/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findOne({ 
      _id: req.params.id,
      userId: req.userId 
    });
    if (!transaction) {
      return res.status(404).json({ message: 'Transação não encontrada' });
    }
    
    await transaction.deleteOne();
    res.json({ message: 'Transação deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar transação:', error);
    res.status(500).json({ message: 'Erro ao deletar transação.' });
  }
});

module.exports = router;
