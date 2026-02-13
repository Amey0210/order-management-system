import express from 'express';
import cors from 'cors';
import { createOrder, getOrderStatus } from './controllers/orderController.js';
import { getMenu, seedMenu } from './controllers/menuController.js';
import { validateOrder } from './middleware/Validate.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

/**
 * Menu Routes
 */
// Changed to GET so you can seed by visiting the URL in your browser
app.get('/api/menu/seed', seedMenu); 
app.get('/api/menu', getMenu);

/**
 * Order Routes
 */
// Removed the duplicate 'Basic route' to ensure validateOrder middleware runs
app.post('/api/orders', validateOrder, createOrder);
app.get('/api/orders/:id', getOrderStatus);

// Global Error Handler (A Senior Developer touch)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong on the server!' });
});

export default app;