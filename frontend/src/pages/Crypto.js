import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, TrendingUp, TrendingDown, Eye } from 'lucide-react';
import Card from '../components/Card';
import StatCard from '../components/StatCard';
import TransactionModal from '../components/TransactionModal';
import { getCategorySummary } from '../services/api';
import './CategoryPage.css';

const Crypto = () => {
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const loadSummary = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getCategorySummary('CRIPTO');
      setSummary(response.data);
    } catch (error) {
      console.error('Erro ao carregar resumo:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

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
          <h1>Criptomoedas</h1>
        </div>
        <button className="btn-add" onClick={() => setIsModalOpen(true)}>
          <Plus size={20} />
          Nova Transação
        </button>
      </div>

      <div className="stats-grid">
        <StatCard
          title="Total Investido"
          value={summary?.totalInvested || 0}
          isLoading={isLoading}
        />
        <StatCard
          title="Valor Atual"
          value={summary?.currentValue || 0}
          isLoading={isLoading}
        />
        <StatCard
          title="Lucro Realizado"
          value={summary?.realizedProfitLoss || 0}
          percentage={summary?.totalBought > 0 ? ((summary?.realizedProfitLoss || 0) / summary.totalBought) * 100 : 0}
          trend={(summary?.realizedProfitLoss || 0) >= 0 ? 'up' : 'down'}
          isLoading={isLoading}
        />
        <StatCard
          title="Lucro Não Realizado"
          value={summary?.unrealizedProfitLoss || 0}
          percentage={summary?.totalInvested > 0 ? ((summary?.unrealizedProfitLoss || 0) / summary.totalInvested) * 100 : 0}
          trend={(summary?.unrealizedProfitLoss || 0) >= 0 ? 'up' : 'down'}
          isLoading={isLoading}
        />
        <StatCard
          title="Lucro Total"
          value={summary?.profitLoss || 0}
          percentage={summary?.profitLossPercentage || 0}
          trend={summary?.profitLoss >= 0 ? 'up' : 'down'}
          isLoading={isLoading}
        />
      </div>

      <Card title={`Ativos (${summary?.assets?.length || 0})`}>
        {isLoading ? (
          <div className="loading-state">Carregando dados...</div>
        ) : summary?.assets && summary.assets.length > 0 ? (
          <div className="assets-table">
            <div className="table-header">
              <div>Moeda</div>
              <div>Quantidade</div>
              <div>Preço Médio</div>
              <div>Preço Atual</div>
              <div>Valor Total</div>
              <div>Resultado</div>
              <div>Ações</div>
            </div>
            {summary.assets.map((asset) => (
              <div key={asset.ticker} className="table-row">
                <div className="asset-ticker">{asset.ticker}</div>
                <div>{asset.totalQuantity.toFixed(8)}</div>
                <div>{formatCurrency(asset.averagePrice)}</div>
                <div>{formatCurrency(asset.currentPrice)}</div>
                <div className="asset-value">{formatCurrency(asset.currentValue)}</div>
                <div className={`asset-result ${asset.profitLoss >= 0 ? 'positive' : 'negative'}`}>
                  <span>{formatCurrency(asset.profitLoss)}</span>
                  <span className="result-percentage">
                    {asset.profitLoss >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                    {asset.profitLossPercentage.toFixed(2)}%
                  </span>
                </div>
                <div>
                  <button 
                    className="btn-view"
                    onClick={() => navigate(`/ativo/${asset.ticker}`)}
                    title="Ver detalhes"
                  >
                    <Eye size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>Nenhuma criptomoeda cadastrada.</p>
            <button className="btn-add" onClick={() => setIsModalOpen(true)}>
              <Plus size={20} />
              Adicionar Primeira Transação
            </button>
          </div>
        )}
      </Card>

      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        category="CRIPTO"
        onSuccess={loadSummary}
      />
    </div>
  );
};

export default Crypto;
