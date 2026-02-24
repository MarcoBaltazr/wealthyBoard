import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import StatCard from '../components/StatCard';
import Card from '../components/Card';
import { getTotalPortfolio } from '../services/api';
import './Dashboard.css';

const COLORS = {
  ACAO: '#00d084',
  FII: '#4a9eff',
  BDR: '#ff9f43',
  CRIPTO: '#ee5a6f'
};

const Dashboard = () => {
  const [portfolio, setPortfolio] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPortfolio();
  }, []);

  const loadPortfolio = async () => {
    try {
      setIsLoading(true);
      const response = await getTotalPortfolio();
      setPortfolio(response.data);
    } catch (error) {
      console.error('Erro ao carregar portfólio:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const chartData = portfolio?.categories
    .filter(cat => cat.currentValue > 0)
    .map(cat => ({
      name: cat.category === 'ACAO' ? 'Ações/BDRs' : 
            cat.category === 'FII' ? 'FIIs' : 
            cat.category === 'CRIPTO' ? 'Criptomoedas' : cat.category,
      value: cat.currentValue,
      category: cat.category
    })) || [];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard
          title="Valor Total Investido"
          value={portfolio?.totalInvested || 0}
          isLoading={isLoading}
        />
        <StatCard
          title="Valor Atual"
          value={portfolio?.currentValue || 0}
          isLoading={isLoading}
        />
        <StatCard
          title="Lucro Realizado"
          value={portfolio?.realizedProfitLoss || 0}
          percentage={portfolio?.totalBought > 0 ? ((portfolio?.realizedProfitLoss || 0) / portfolio.totalBought) * 100 : 0}
          trend={(portfolio?.realizedProfitLoss || 0) >= 0 ? 'up' : 'down'}
          isLoading={isLoading}
        />
        <StatCard
          title="Lucro Não Realizado"
          value={portfolio?.unrealizedProfitLoss || 0}
          percentage={portfolio?.totalInvested > 0 ? ((portfolio?.unrealizedProfitLoss || 0) / portfolio.totalInvested) * 100 : 0}
          trend={(portfolio?.unrealizedProfitLoss || 0) >= 0 ? 'up' : 'down'}
          isLoading={isLoading}
        />
        <StatCard
          title="Lucro Total"
          value={portfolio?.profitLoss || 0}
          percentage={portfolio?.profitLossPercentage || 0}
          trend={portfolio?.profitLoss >= 0 ? 'up' : 'down'}
          isLoading={isLoading}
        />
        <StatCard
          title="Rentabilidade"
          value={portfolio ? `${portfolio.profitLossPercentage?.toFixed(2)}%` : '0%'}
          isLoading={isLoading}
        />
      </div>

      <div className="dashboard-content">
        <Card title="Distribuição por Categoria" className="chart-card">
          {isLoading ? (
            <div className="loading-state">Carregando dados...</div>
          ) : chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.category]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state">
              <p>Nenhum investimento cadastrado ainda.</p>
              <p>Comece adicionando suas primeiras transações!</p>
            </div>
          )}
        </Card>

        <Card title="Resumo por Categoria" className="summary-card">
          {isLoading ? (
            <div className="loading-state">Carregando dados...</div>
          ) : portfolio?.categories && portfolio.categories.length > 0 ? (
            <div className="category-list">
              {portfolio.categories.map((cat) => (
                <div key={cat.category} className="category-item">
                  <div className="category-info">
                    <div 
                      className="category-color" 
                      style={{ backgroundColor: COLORS[cat.category] }}
                    />
                    <div>
                      <div className="category-name">
                        {cat.category === 'ACAO' ? 'Ações/BDRs' : 
                         cat.category === 'FII' ? 'FIIs' : 
                         cat.category === 'CRIPTO' ? 'Criptomoedas' : cat.category}
                      </div>
                      <div className="category-value">{formatCurrency(cat.currentValue)}</div>
                    </div>
                  </div>
                  <div className={`category-change ${cat.profitLoss >= 0 ? 'positive' : 'negative'}`}>
                    {cat.profitLoss >= 0 ? '+' : ''}{cat.profitLossPercentage.toFixed(2)}%
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>Nenhum dado disponível</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
