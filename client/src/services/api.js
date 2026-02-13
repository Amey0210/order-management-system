import axios from 'axios';

// Get the URL and remove any trailing slash to prevent double slashes //
const rawBaseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const cleanBaseURL = rawBaseURL.replace(/\/$/, "");

const api = axios.create({
  // This ensures the final path is always BASE_URL/api
  baseURL: `${cleanBaseURL}/api`,
});

// API Calls - These will now correctly hit /api/menu and /api/orders
export const fetchMenu = () => api.get('/menu');
export const placeOrder = (orderData) => api.post('/orders', orderData);
export const getOrderStatus = (id) => api.get(`/orders/${id}`); 

export default api;