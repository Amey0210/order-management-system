import express from 'express';
import cors from 'cors';
import { createOrder, getOrderStatus } from './controllers/orderController.js';
import { getMenu, seedMenu } from './controllers/menuController.js';
import { validateOrder } from './middleware/Validate.js';

const app = express();

app.use(cors({ 
  // This allows Vercel URL AND localhost for testing
  origin: [process.env.CLIENT_URL, "https://order-management-system-navy-six.vercel.app", "http://localhost:5173"].filter(Boolean),
  methods: ["GET", "POST"] 
}));

app.use(express.json());

app.get('/api/menu/seed', seedMenu); 
app.get('/api/menu', getMenu);
app.post('/api/orders', validateOrder, createOrder);
app.get('/api/orders/:id', getOrderStatus);

app.get('/', (req, res) => {
  res.send('FlashFeast API is running live!');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong on the server!' });
});

export default app;