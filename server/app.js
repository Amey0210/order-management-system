import express from 'express';
import cors from 'cors';
import { createOrder, getOrderStatus } from './controllers/orderController.js';
import { getMenu, seedMenu } from './controllers/menuController.js';
import { validateOrder } from './middleware/Validate.js';

const app = express();

// Middleware - Standardizing CORS for deployment
app.use(cors({ 
  origin: process.env.CLIENT_URL || "https://order-management-system-navy-six.vercel.app",
  methods: ["GET", "POST"] 
}));
app.use(express.json());

/**
 * Menu Routes
 */
app.get('/api/menu/seed', seedMenu); 
app.get('/api/menu', getMenu);

/**
 * Order Routes
 */
app.post('/api/orders', validateOrder, createOrder);
app.get('/api/orders/:id', getOrderStatus);
app.get('/', (req, res) => {
  res.send('FlashFeast API is running live!');
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong on the server!',
    error: process.env.NODE_ENV === 'development' ? err.message : {} 
  });
});

export default app;