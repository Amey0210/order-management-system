import axios from 'axios';

// 1. Get the URL from environment variables
const envURL = import.meta.env.VITE_API_URL;

const isProduction = window.location.hostname !== 'localhost';
const fallbackURL = isProduction 
  ? 'https://order-management-system-zjhg.onrender.com' 
  : 'http://localhost:5000';

const rawBaseURL = envURL || fallbackURL;

// 3. Clean any trailing slashes
const cleanBaseURL = rawBaseURL.replace(/\/$/, "");

const api = axios.create({
  baseURL: `${cleanBaseURL}/api`,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 

// API Calls
export const fetchMenu = () => api.get('/menu');
export const placeOrder = (orderData) => api.post('/orders', orderData);
export const getOrderStatus = (id) => api.get(`/orders/${id}`); 

export default api;