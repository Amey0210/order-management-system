import axios from 'axios';

const api = axios.create({
  // This points to your Node.js backend
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// API Calls
export const fetchMenu = () => api.get('/menu');
export const placeOrder = (orderData) => api.post('/orders', orderData);

// RENAME THIS ONE from getOrderDetails to getOrderStatus
export const getOrderStatus = (id) => api.get(`/orders/${id}`); 

export default api;