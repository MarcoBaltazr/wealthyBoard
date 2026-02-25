import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2, Trash2, DollarSign } from 'lucide-react';
import Card from '../components/Card';
import StatCard from '../components/StatCard';
import EditTransactionModal from '../components/EditTransactionModal';
import { getAssetSummary, updatePrice, deleteTransaction } from '../services/api';
import './AssetDetails.css';

const AssetDetails = () => {
  const { ticker } = useParams();
  const navigate = useNavigate();
  const [asset, setAsset] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingPrice, setIsUpdatingPrice] = useState(false);
  const [newPrice, setNewPrice] = useState('');
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const loadAsset = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getAssetSummary(ticker);
      setAsset(response.data);
      setNewPrice(response.data.currentPrice.toString());
    } catch (error) {
      console.error('Erro ao carregar ativo:', error);
    } finally {
      setIsLoading(false);
    }
  }, [ticker]);

  useEffect(() => {
    loadAsset();
  }, [loadAsset]);

  const handleUpdatePrice = async (e) => {
    e.preventDefault();
    try {
      await updatePrice(ticker, parseFloat(newPrice));
      await loadAsset();
      setIsUpdatingPrice(false);
    } catch (error) {
      console.error('Erro ao atualizar preço:', error);
      alert('Erro ao atualizar preço');
    }
  };

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setIsEditModalOpen(true);
  };

  const handleEditSuccess = async () => {
    await loadAsset();
    setIsEditModalOpen(false);
    setEditingTransaction(null);
  };

  const handleDeleteTransaction = async (id) => {
    if (window.confirm('Tem certeza que deseja deletar esta transação?')) {
      try {
        await deleteTransaction(id);
        await loadAsset();
      } catch (error) {
        console.error('Erro ao deletar transação:', error);
        alert('Erro ao deletar transação');
      }
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  if (isLoading) {
    return (
      <div className="page">
        <div className="loading-state">Carregando dados do ativo...</div>
      </div>
    );
  }

  if (!asset) {
    return (
      <div className="page">
        <div className="empty-state">
          <p>Ativo não encontrado</p>
          <button className="btn-add" onClick={() => navigate(-1)}>
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <button className="btn-back" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1>{asset.ticker}</h1>
            <p className="asset-category">
              {asset.category === 'ACAO' ? 'Ação/BDR' : 
               asset.category === 'FII' ? 'Fundo Imobiliário' : 
               asset.category === 'CRIPTO' ? 'Criptomoeda' : asset.category}
            </p>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard
          title="Quantidade Total"
          value={asset.totalQuantity.toLocaleString('pt-BR', { 
            minimumFractionDigits: asset.category === 'CRIPTO' ? 8 : 0,
            maximumFractionDigits: asset.category === 'CRIPTO' ? 8 : 0
          })}
          isLoading={false}
        />
        <StatCard
          title="Preço Médio"
          value={asset.averagePrice}
          isLoading={false}
        />
        <StatCard
          title="Total Investido (Posição Aberta)"
          value={asset.totalInvested}
          isLoading={false}
        />
        <StatCard
          title="Valor Atual"
          value={asset.currentValue}
          isLoading={false}
        />
        <StatCard
          title="Lucro Realizado"
          value={asset.realizedProfitLoss || 0}
          percentage={asset.totalBought > 0 ? ((asset.realizedProfitLoss || 0) / asset.totalBought) * 100 : 0}
          trend={(asset.realizedProfitLoss || 0) >= 0 ? 'up' : 'down'}
          isLoading={false}
        />
        <StatCard
          title="Lucro Não Realizado"
          value={asset.unrealizedProfitLoss || 0}
          percentage={asset.totalInvested > 0 ? ((asset.unrealizedProfitLoss || 0) / asset.totalInvested) * 100 : 0}
          trend={(asset.unrealizedProfitLoss || 0) >= 0 ? 'up' : 'down'}
          isLoading={false}
        />
        <StatCard
          title="Lucro Total"
          value={asset.profitLoss}
          percentage={asset.profitLossPercentage}
          trend={asset.profitLoss >= 0 ? 'up' : 'down'}
          isLoading={false}
        />
        <StatCard
          title="Total Comprado"
          value={asset.totalBought || 0}
          isLoading={false}
        />
        <StatCard
          title="Total Vendido"
          value={asset.totalSold || 0}
          isLoading={false}
        />
      </div>

      <div className="details-content">
        <Card title="Preço Atual">
          {!isUpdatingPrice ? (
            <div className="price-display">
              <div className="current-price">
                {formatCurrency(asset.currentPrice)}
              </div>
              <button 
                className="btn-update-price"
                onClick={() => setIsUpdatingPrice(true)}
              >
                <DollarSign size={18} />
                Atualizar Preço
              </button>
            </div>
          ) : (
            <form onSubmit={handleUpdatePrice} className="price-form">
              <input
                type="number"
                step="0.01"
                min="0"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                placeholder="Novo preço"
                autoFocus
                required
              />
              <div className="price-actions">
                <button type="button" className="btn-secondary" onClick={() => setIsUpdatingPrice(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  Salvar
                </button>
              </div>
            </form>
          )}
        </Card>

        <Card title={`Histórico de Transações (${asset.transactions.length})`}>
          <div className="transactions-list">
            {asset.transactions.map((tx) => (
              <div key={tx._id} className="transaction-item">
                <div className="transaction-main">
                  <div className={`transaction-type ${tx.type === 'COMPRA' ? 'buy' : 'sell'}`}>
                    {tx.type}
                  </div>
                  <div className="transaction-info">
                    <div className="transaction-date">{formatDate(tx.date)}</div>
                    <div className="transaction-details">
                      {tx.quantity} × {formatCurrency(tx.unitPrice)}
                      {tx.fee > 0 && ` (Taxa: ${formatCurrency(tx.fee)})`}
                    </div>
                  </div>
                  <div className="transaction-total">
                    {formatCurrency(tx.totalValue)}
                  </div>
                </div>
                {tx.notes && (
                  <div className="transaction-notes">{tx.notes}</div>
                )}
                <div className="transaction-actions">
                  <button 
                    className="btn-icon btn-edit"
                    onClick={() => handleEditTransaction(tx)}
                    title="Editar"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    className="btn-icon btn-delete"
                    onClick={() => handleDeleteTransaction(tx._id)}
                    title="Deletar"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <EditTransactionModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingTransaction(null);
        }}
        transaction={editingTransaction}
        onSuccess={handleEditSuccess}
      />
    </div>
  );
};

export default AssetDetails;
