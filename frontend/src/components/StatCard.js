import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import './StatCard.css';

const StatCard = ({ title, value, percentage, trend, isLoading = false }) => {
  const isPositive = trend === 'up' || percentage >= 0;
  
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  const formatPercentage = (value) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };
  
  if (isLoading) {
    return (
      <div className="stat-card loading">
        <div className="skeleton-text"></div>
        <div className="skeleton-value"></div>
      </div>
    );
  }
  
  return (
    <div className="stat-card">
      <div className="stat-header">
        <span className="stat-title">{title}</span>
      </div>
      
      <div className="stat-value">
        {typeof value === 'number' ? formatCurrency(value) : value}
      </div>
      
      {percentage !== undefined && (
        <div className={`stat-change ${isPositive ? 'positive' : 'negative'}`}>
          {isPositive ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
          <span>{formatPercentage(percentage)}</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
