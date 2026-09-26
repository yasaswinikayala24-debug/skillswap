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

const PORT = process.env.PORT || 5000;

// Connect to MongoDB then start Express server
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
