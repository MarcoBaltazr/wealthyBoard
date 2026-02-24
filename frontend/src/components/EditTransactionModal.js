import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { updateTransaction } from '../services/api';
import './TransactionModal.css';

const EditTransactionModal = ({ isOpen, onClose, transaction, onSuccess }) => {
  const [formData, setFormData] = useState({
    type: '',
    ticker: '',
    date: '',
    quantity: '',
    unitPrice: '',
    fee: '',
    notes: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (transaction) {
      setFormData({
        type: transaction.type,
        ticker: transaction.ticker,
        date: new Date(transaction.date).toISOString().split('T')[0],
        quantity: transaction.quantity.toString(),
        unitPrice: transaction.unitPrice.toString(),
        fee: transaction.fee.toString(),
        notes: transaction.notes || ''
      });
    }
  }, [transaction]);

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
        quantity: parseFloat(formData.quantity),
        unitPrice: parseFloat(formData.unitPrice),
        fee: parseFloat(formData.fee) || 0
      };

      await updateTransaction(transaction._id, data);
      
      if (onSuccess) {
        await onSuccess();
      }
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao atualizar transação');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !transaction) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Editar Transação</h2>
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
              {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTransactionModal;
