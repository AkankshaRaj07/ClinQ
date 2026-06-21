require('dotenv').config();
const http = require('http');
const app = require('./app');
const connectDB = require('./config/db');
const socketManager = require('./sockets/socketManager');

const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
const io = socketManager.init(server);

io.on('connection', (socket) => {
  console.log(`New client connected: ${socket.id}`);
  
  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Start Server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
