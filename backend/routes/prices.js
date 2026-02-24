const express = require('express');
const router = express.Router();
const CurrentPrice = require('../models/CurrentPrice');

// Obter todos os preços
router.get('/', async (req, res) => {
  try {
    const prices = await CurrentPrice.find();
    res.json(prices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obter preço de um ativo específico
router.get('/:ticker', async (req, res) => {
  try {
    const price = await CurrentPrice.findOne({ ticker: req.params.ticker.toUpperCase() });
    if (!price) {
      return res.status(404).json({ message: 'Preço não encontrado' });
    }
    res.json(price);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Atualizar/criar preço de um ativo
router.post('/:ticker', async (req, res) => {
  try {
    const ticker = req.params.ticker.toUpperCase();
    const { currentPrice } = req.body;
    
    if (!currentPrice || currentPrice < 0) {
      return res.status(400).json({ message: 'Preço inválido' });
    }
    
    let price = await CurrentPrice.findOne({ ticker });
    
    if (price) {
      price.currentPrice = currentPrice;
      price.lastUpdated = Date.now();
      await price.save();
    } else {
      price = new CurrentPrice({ ticker, currentPrice });
      await price.save();
    }
    
    res.json(price);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Deletar preço
router.delete('/:ticker', async (req, res) => {
  try {
    const price = await CurrentPrice.findOne({ ticker: req.params.ticker.toUpperCase() });
    if (!price) {
      return res.status(404).json({ message: 'Preço não encontrado' });
    }
    
    await price.deleteOne();
    res.json({ message: 'Preço deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
