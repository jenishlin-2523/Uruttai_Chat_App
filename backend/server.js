const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// CRITICAL: Health check endpoint - Railway checks this
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Alternative health checks
app.get('/healthz', (req, res) => {
  res.status(200).send('OK');
});

app.get('/ping', (req, res) => {
  res.status(200).send('pong');
});

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'Chat API Server',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/health',
      api: '/api'
    }
  });
});

// Test API endpoint
app.get('/api/test', (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: 'API is working!',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.path 
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message 
  });
});

// Port configuration
const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0'; // MUST be 0.0.0.0 for Railway

// Start server
const server = app.listen(PORT, HOST, () => {
  console.log('========================================');
  console.log(`✅ Server is running`);
  console.log(`📍 Host: ${HOST}`);
  console.log(`🚀 Port: ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('========================================');
  console.log('Ready to accept connections');
});

// Keep alive - prevents Railway from thinking server crashed
server.keepAliveTimeout = 120000; // 2 minutes
server.headersTimeout = 120000; // 2 minutes

// Graceful shutdown
const shutdown = () => {
  console.log('Shutdown signal received');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
  
  // Force close after 10s
  setTimeout(() => {
    console.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

// Handle uncaught errors
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  shutdown();
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  shutdown();
});

console.log('Server initialization complete');