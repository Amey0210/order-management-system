import {Order} from '../models/Order.js';

const simulateStatusUpdates = (orderId, io) => {
  if (!io) {
    console.error("Socket.io instance not found in controller!");
    return;
  }

  const statuses = ['Preparing', 'Out for Delivery', 'Delivered'];
  const roomId = String(orderId).trim();

  statuses.forEach((status, index) => {
    // We set intervals of 10s, 20s, and 30s
    setTimeout(async () => {
      try {
        console.log(`[Simulation] Updating Order ${roomId} to: ${status}`);
        
        const updatedOrder = await Order.findByIdAndUpdate(
          orderId, 
          { status }, 
          { new: true }
        );

        if (updatedOrder) {
          // Emit to the specific order room
          io.to(roomId).emit('statusUpdate', updatedOrder);
          console.log(`[Simulation] Success: Order ${roomId} is now ${status}`);
        } else {
          console.warn(`[Simulation] Order ${roomId} not found in DB.`);
        }
      } catch (err) {
        console.error("[Simulation] Error during update:", err);
      }
    }, (index + 1) * 10000); 
  });
};

export const createOrder = async (req, res) => {
  try {
    // Get socketio instance from app settings
    const io = req.app.get('socketio');
    
    const newOrder = new Order(req.body);
    await newOrder.save();
    
    console.log(`Order Created: ${newOrder._id}`);

    // Trigger the 30-second simulation
    simulateStatusUpdates(newOrder._id, io);
    
    res.status(201).json(newOrder);
  } catch (error) {
    console.error("Create Order Error:", error.message);
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