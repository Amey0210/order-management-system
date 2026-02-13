import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import app from './app.js';
import connectDB from './config/db.js';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Initialize Socket.io with production-ready CORS
const io = new Server(server, {
  cors: {
    origin: [
      process.env.CLIENT_URL, 
      "https://order-management-system-navy-six.vercel.app", 
      "http://localhost:5173"
    ].filter(Boolean), // Filters out undefined if CLIENT_URL isn't set
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Making 'io' accessible to controllers via req.app.get('socketio')
app.set('socketio', io);

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  
  socket.on('joinOrder', (orderId) => {
    // Ensure orderId is treated as a string for room consistency
    const roomId = String(orderId);
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Connect to Database then start listening
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error("Failed to connect to DB", err);
  process.exit(1);
});