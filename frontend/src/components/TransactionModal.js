import React, { useState } from 'react';
import { X } from 'lucide-react';
import { createTransaction, updatePrice } from '../services/api';
import './TransactionModal.css';

const TransactionModal = ({ isOpen, onClose, category, onSuccess }) => {
  const [formData, setFormData] = useState({
    type: 'COMPRA',
    ticker: '',
    date: new Date().toISOString().split('T')[0],
    quantity: '',
    unitPrice: '',
    fee: '0',
    notes: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const data = {
        ...formData,
        category: category.toUpperCase(),
        ticker: formData.ticker.toUpperCase(),
        quantity: parseFloat(formData.quantity),
        unitPrice: parseFloat(formData.unitPrice),
        fee: parseFloat(formData.fee) || 0
      };

      await createTransaction(data);
      
      // Atualizar preço atual do ativo automaticamente com o preço unitário
      try {
        await updatePrice(data.ticker, data.unitPrice);
      } catch (priceError) {
        console.warn('Não foi possível atualizar o preço automaticamente:', priceError);
      }
      
      setFormData({
        type: 'COMPRA',
        ticker: '',
        date: new Date().toISOString().split('T')[0],
        quantity: '',
        unitPrice: '',
        fee: '0',
        notes: ''
      });
      
      if (onSuccess) {
        await onSuccess();
      }
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao criar transação');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Nova Transação</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Tipo</label>
              <select name="type" value={formData.type} onChange={handleChange} required>
                <option value="COMPRA">Compra</option>
                <option value="VENDA">Venda</option>
              </select>
            </div>

            <div className="form-group">
              <label>Ticker</label>
              <input
                type="text"
                name="ticker"
                value={formData.ticker}
                onChange={handleChange}
                placeholder="Ex: PETR4, BTC"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Data</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Quantidade</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                step="0.00000001"
                min="0"
                placeholder="0"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Preço Unitário (R$)</label>
              <input
                type="number"
                name="unitPrice"
                value={formData.unitPrice}
                onChange={handleChange}
                step="0.01"
                min="0"
                placeholder="0.00"
                required
              />
            </div>

            <div className="form-group">
              <label>Taxa (R$)</label>
              <input
                type="number"
                name="fee"
                value={formData.fee}
                onChange={handleChange}
                step="0.01"
                min="0"
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Observações (opcional)</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              placeholder="Adicione notas sobre esta transação..."
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : 'Salvar Transação'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;
