const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const CurrentPrice = require('../models/CurrentPrice');

// Função auxiliar para calcular posição de um ativo
const calculateAssetPosition = (transactions, currentPrice) => {
  let totalQuantity = 0;
  let totalInvested = 0;
  let realizedProfitLoss = 0; // Lucro/prejuízo de trades fechados
  let totalBought = 0; // Total gasto em compras
  let totalSold = 0; // Total recebido em vendas
  
  // Ordenar transações por data
  const sortedTransactions = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));
  
  sortedTransactions.forEach(tx => {
    if (tx.type === 'COMPRA') {
      totalQuantity += tx.quantity;
      totalInvested += tx.totalValue;
      totalBought += tx.totalValue;
    } else {
      // VENDA
      const averagePriceAtSale = totalQuantity > 0 ? totalInvested / totalQuantity : 0;
      const costOfSoldShares = averagePriceAtSale * tx.quantity;
      const saleValue = tx.totalValue;
      
      // Calcular lucro/prejuízo realizado desta venda
      realizedProfitLoss += (saleValue - costOfSoldShares);
      
      totalQuantity -= tx.quantity;
      totalInvested -= costOfSoldShares;
      totalSold += tx.totalValue;
    }
  });
  
  const averagePrice = totalQuantity > 0 ? totalInvested / totalQuantity : 0;
  const currentValue = totalQuantity * currentPrice;
  const unrealizedProfitLoss = currentValue - totalInvested; // Lucro não realizado (posição aberta)
  const totalProfitLoss = realizedProfitLoss + unrealizedProfitLoss; // Lucro total
  
  const totalProfitLossPercentage = totalBought > 0 
    ? (totalProfitLoss / totalBought) * 100 
    : 0;
  
  return {
    totalQuantity,
    averagePrice,
    totalInvested,
    currentPrice,
    currentValue,
    profitLoss: totalProfitLoss, // Lucro total (realizado + não realizado)
    profitLossPercentage: totalProfitLossPercentage,
    realizedProfitLoss, // Lucro de trades fechados
    unrealizedProfitLoss, // Lucro da posição aberta
    totalBought, // Total investido em compras
    totalSold // Total recebido em vendas
  };
};

// Obter resumo de um ativo específico
router.get('/asset/:ticker', async (req, res) => {
  try {
    const ticker = req.params.ticker.toUpperCase();
    const transactions = await Transaction.find({ ticker }).sort({ date: 1 });
    
    if (transactions.length === 0) {
      return res.status(404).json({ message: 'Nenhuma transação encontrada para este ativo' });
    }
    
    const priceData = await CurrentPrice.findOne({ ticker });
    const currentPrice = priceData ? priceData.currentPrice : 0;
    
    const position = calculateAssetPosition(transactions, currentPrice);
    
    res.json({
      ticker,
      category: transactions[0].category,
      ...position,
      transactions
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obter resumo por categoria
router.get('/category/:category', async (req, res) => {
  try {
    const category = req.params.category.toUpperCase();
    const transactions = await Transaction.find({ category }).sort({ date: 1 });
    
    if (transactions.length === 0) {
      return res.json({ 
        category,
        assets: [],
        totalInvested: 0,
        currentValue: 0,
        profitLoss: 0,
        profitLossPercentage: 0
      });
    }
    
    // Agrupar transações por ticker
    const assetMap = {};
    transactions.forEach(tx => {
      if (!assetMap[tx.ticker]) {
        assetMap[tx.ticker] = [];
      }
      assetMap[tx.ticker].push(tx);
    });
    
    // Calcular posição de cada ativo
    const assets = [];
    let categoryTotalInvested = 0;
    let categoryCurrentValue = 0;
    let categoryRealizedProfitLoss = 0;
    let categoryUnrealizedProfitLoss = 0;
    let categoryTotalBought = 0;
    let categoryTotalSold = 0;
    
    for (const [ticker, txs] of Object.entries(assetMap)) {
      const priceData = await CurrentPrice.findOne({ ticker });
      const currentPrice = priceData ? priceData.currentPrice : 0;
      const position = calculateAssetPosition(txs, currentPrice);
      
      // Mostrar ativo se tiver quantidade atual OU se teve lucro/prejuízo realizado
      if (position.totalQuantity > 0 || position.realizedProfitLoss !== 0) {
        assets.push({
          ticker,
          ...position
        });
        categoryTotalInvested += position.totalInvested;
        categoryCurrentValue += position.currentValue;
        categoryRealizedProfitLoss += position.realizedProfitLoss;
        categoryUnrealizedProfitLoss += position.unrealizedProfitLoss;
        categoryTotalBought += position.totalBought;
        categoryTotalSold += position.totalSold;
      }
    }
    
    const categoryProfitLoss = categoryRealizedProfitLoss + categoryUnrealizedProfitLoss;
    const categoryProfitLossPercentage = categoryTotalBought > 0 
      ? (categoryProfitLoss / categoryTotalBought) * 100 
      : 0;
    
    res.json({
      category,
      assets,
      totalInvested: categoryTotalInvested,
      currentValue: categoryCurrentValue,
      profitLoss: categoryProfitLoss,
      profitLossPercentage: categoryProfitLossPercentage,
      realizedProfitLoss: categoryRealizedProfitLoss,
      unrealizedProfitLoss: categoryUnrealizedProfitLoss,
      totalBought: categoryTotalBought,
      totalSold: categoryTotalSold
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obter resumo total da carteira
router.get('/total', async (req, res) => {
  try {
    const categories = ['ACAO', 'FII', 'BDR', 'CRIPTO'];
    const portfolioSummary = {
      categories: [],
      totalInvested: 0,
      currentValue: 0,
      profitLoss: 0,
      profitLossPercentage: 0,
      realizedProfitLoss: 0,
      unrealizedProfitLoss: 0,
      totalBought: 0,
      totalSold: 0
    };
    
    for (const category of categories) {
      const transactions = await Transaction.find({ category }).sort({ date: 1 });
      
      if (transactions.length === 0) continue;
      
      // Agrupar transações por ticker
      const assetMap = {};
      transactions.forEach(tx => {
        if (!assetMap[tx.ticker]) {
          assetMap[tx.ticker] = [];
        }
        assetMap[tx.ticker].push(tx);
      });
      
      let categoryTotalInvested = 0;
      let categoryCurrentValue = 0;
      let categoryRealizedProfitLoss = 0;
      let categoryUnrealizedProfitLoss = 0;
      let categoryTotalBought = 0;
      let categoryTotalSold = 0;
      
      for (const [ticker, txs] of Object.entries(assetMap)) {
        const priceData = await CurrentPrice.findOne({ ticker });
        const currentPrice = priceData ? priceData.currentPrice : 0;
        const position = calculateAssetPosition(txs, currentPrice);
        
        // Incluir ativo se tiver quantidade atual OU se teve lucro/prejuízo realizado
        if (position.totalQuantity > 0 || position.realizedProfitLoss !== 0) {
          categoryTotalInvested += position.totalInvested;
          categoryCurrentValue += position.currentValue;
          categoryRealizedProfitLoss += position.realizedProfitLoss;
          categoryUnrealizedProfitLoss += position.unrealizedProfitLoss;
          categoryTotalBought += position.totalBought;
          categoryTotalSold += position.totalSold;
        }
      }
      
      const categoryProfitLoss = categoryRealizedProfitLoss + categoryUnrealizedProfitLoss;
      const categoryProfitLossPercentage = categoryTotalBought > 0 
        ? (categoryProfitLoss / categoryTotalBought) * 100 
        : 0;
      
      portfolioSummary.categories.push({
        category,
        totalInvested: categoryTotalInvested,
        currentValue: categoryCurrentValue,
        profitLoss: categoryProfitLoss,
        profitLossPercentage: categoryProfitLossPercentage,
        realizedProfitLoss: categoryRealizedProfitLoss,
        unrealizedProfitLoss: categoryUnrealizedProfitLoss,
        totalBought: categoryTotalBought,
        totalSold: categoryTotalSold
      });
      
      portfolioSummary.totalInvested += categoryTotalInvested;
      portfolioSummary.currentValue += categoryCurrentValue;
      portfolioSummary.realizedProfitLoss += categoryRealizedProfitLoss;
      portfolioSummary.unrealizedProfitLoss += categoryUnrealizedProfitLoss;
      portfolioSummary.totalBought += categoryTotalBought;
      portfolioSummary.totalSold += categoryTotalSold;
    }
    
    portfolioSummary.profitLoss = portfolioSummary.realizedProfitLoss + portfolioSummary.unrealizedProfitLoss;
    portfolioSummary.profitLossPercentage = portfolioSummary.totalBought > 0
      ? (portfolioSummary.profitLoss / portfolioSummary.totalBought) * 100
      : 0;
    
    res.json(portfolioSummary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
