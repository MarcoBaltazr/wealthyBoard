import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Transações
export const getTransactions = (filters = {}) => {
  return axios.get(`${API_URL}/transactions`, { params: filters });
};

export const getTransaction = (id) => {
  return axios.get(`${API_URL}/transactions/${id}`);
};

export const createTransaction = (data) => {
  return axios.post(`${API_URL}/transactions`, data);
};

export const updateTransaction = (id, data) => {
  return axios.put(`${API_URL}/transactions/${id}`, data);
};

export const deleteTransaction = (id) => {
  return axios.delete(`${API_URL}/transactions/${id}`);
};

// Preços
export const getPrices = () => {
  return axios.get(`${API_URL}/prices`);
};

export const getPrice = (ticker) => {
  return axios.get(`${API_URL}/prices/${ticker}`);
};

export const updatePrice = (ticker, currentPrice) => {
  return axios.post(`${API_URL}/prices/${ticker}`, { currentPrice });
};

export const deletePrice = (ticker) => {
  return axios.delete(`${API_URL}/prices/${ticker}`);
};

// Portfolio
export const getAssetSummary = (ticker) => {
  return axios.get(`${API_URL}/portfolio/asset/${ticker}`);
};

export const getCategorySummary = (category) => {
  return axios.get(`${API_URL}/portfolio/category/${category}`);
};

export const getTotalPortfolio = () => {
  return axios.get(`${API_URL}/portfolio/total`);
};
