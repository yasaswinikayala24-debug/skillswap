const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Load env variables
dotenv.config();

const app = express();

// Enable CORS and JSON parsing
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection middleware for Vercel serverless functions
app.use(async (req, res, next) => {
  try {
    await connectDB();
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

// Centralized Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

// Standalone server execution for local development
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`========================================`);
      console.log(`🚀 SkillSwap Server running on port ${PORT}`);
      console.log(`🌍 Base API URL: http://localhost:${PORT}/api`);
      console.log(`========================================`);
    });
  }).catch((err) => {
    console.error('Failed to start server due to database connection error:', err);
  });
}

// Export Express app for Vercel Serverless Functions
module.exports = app;
