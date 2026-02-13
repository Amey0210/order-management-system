import { Order } from '../models/Order.js';

const simulateStatusUpdates = (orderId, io) => {
  if (!io) return;
  const statuses = ['Preparing', 'Out for Delivery', 'Delivered'];
  
  statuses.forEach((status, index) => {
    setTimeout(async () => {
      try {
        const updatedOrder = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
        if (updatedOrder) {io.to
          io.to(String(orderId).trim()).emit('statusUpdate', updatedOrder);
          console.log(`Order ${orderId} status: ${status}`);
        }
      } catch (err) {
        console.error("Simulation Error:", err);
      }
    }, (index + 1) * 10000); 
  });
};

export const createOrder = async (req, res) => {
  try {
    const io = req.app.get('socketio');
    const newOrder = new Order(req.body);
    await newOrder.save();
    simulateStatusUpdates(newOrder._id, io);
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const getOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};