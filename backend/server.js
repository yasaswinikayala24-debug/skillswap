const express = require('express');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const skillRoutes = require('./routes/skillRoutes');
const matchRoutes = require('./routes/matchRoutes');
const exchangeRequestRoutes = require('./routes/exchangeRequestRoutes');
const conversationRoutes = require('./routes/conversationRoutes');
const messageRoutes = require('./routes/messageRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const seedInitialSkills = require('./utils/seedSkills');
const { initSocket } = require('./utils/socket');

// Load env variables
dotenv.config();

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
initSocket(server);

// Enable CORS and JSON parsing
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let isSeeded = false;

// Database connection middleware for Vercel serverless functions & local execution
app.use(async (req, res, next) => {
  try {
    await connectDB();
    if (!isSeeded) {
      await seedInitialSkills();
      isSeeded = true;
    }
    next();
  } catch (err) {
    console.error('Database Connection Middleware Error:', err.message);
    res.status(500).json({
      success: false,
      message: 'Database connection failed. Please check MONGODB_URI environment variable.'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'SkillSwap API Server is healthy and running'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/exchange-requests', exchangeRequestRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/notifications', notificationRoutes);

// Centralized Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

// Standalone server execution for local development
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  connectDB().then(async () => {
    await seedInitialSkills();
    server.listen(PORT, () => {
      console.log(`========================================`);
      console.log(`🚀 SkillSwap Server running on port ${PORT}`);
      console.log(`🌍 Base API URL: http://localhost:${PORT}/api`);
      console.log(`⚡ Real-time Socket.IO initialized`);
      console.log(`========================================`);
    });
  }).catch((err) => {
    console.error('Failed to start server due to database connection error:', err);
  });
}

// Export Express app for Vercel Serverless Functions
module.exports = app;
