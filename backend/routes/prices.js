const express = require('express');
const router = express.Router();
const CurrentPrice = require('../models/CurrentPrice');
const auth = require('../middleware/auth');

// Todas as rotas requerem autenticação
router.use(auth);

// Obter todos os preços do usuário
router.get('/', async (req, res) => {
  try {
    const prices = await CurrentPrice.find({ userId: req.userId });
    res.json(prices);
  } catch (error) {
    console.error('Erro ao buscar preços:', error);
    res.status(500).json({ message: 'Erro ao buscar preços.' });
  }
});

// Obter preço de um ativo específico
router.get('/:ticker', async (req, res) => {
  try {
    const price = await CurrentPrice.findOne({ 
      ticker: req.params.ticker.toUpperCase(),
      userId: req.userId 
    });
    if (!price) {
      return res.status(404).json({ message: 'Preço não encontrado' });
    }
    res.json(price);
  } catch (error) {
    console.error('Erro ao buscar preço:', error);
    res.status(500).json({ message: 'Erro ao buscar preço.' });
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
    
    let price = await CurrentPrice.findOne({ ticker, userId: req.userId });
    
    if (price) {
      price.currentPrice = currentPrice;
      price.lastUpdated = Date.now();
      await price.save();
    } else {
      price = new CurrentPrice({ 
        ticker, 
        currentPrice,
        userId: req.userId 
      });
      await price.save();
    }
    
    res.json(price);
  } catch (error) {
    console.error('Erro ao criar/atualizar preço:', error);
    res.status(400).json({ message: 'Erro ao salvar preço. Verifique os dados.' });
  }
});

// Deletar preço
router.delete('/:ticker', async (req, res) => {
  try {
    const price = await CurrentPrice.findOne({ 
      ticker: req.params.ticker.toUpperCase(),
      userId: req.userId 
    });
    if (!price) {
      return res.status(404).json({ message: 'Preço não encontrado' });
    }
    
    await price.deleteOne();
    res.json({ message: 'Preço deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar preço:', error);
    res.status(500).json({ message: 'Erro ao deletar preço.' });
  }
});

module.exports = router;
