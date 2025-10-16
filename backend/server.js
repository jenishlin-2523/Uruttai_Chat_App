const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const socketHandler = require('./socket/socketHandler');

dotenv.config();

const app = express();
const server = http.createServer(app);

// Allow CORS for both local dev and deployed frontend
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://uruttai-chat-app-production.up.railway.app';
const LOCAL_URL = 'http://localhost:3000';

app.use(cors({
  origin: [FRONTEND_URL, LOCAL_URL],
  credentials: true,
}));

// Middleware
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/messages', require('./routes/messages'));

// Socket.io handler
const io = socketIo(server, {
  cors: {
    origin: [FRONTEND_URL, LOCAL_URL],
    methods: ['GET', 'POST'],
    credentials: true
  }
});
socketHandler(io);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
