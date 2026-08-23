const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();

// Security Middleware
app.use(helmet());

// CORS config
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175'
];
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || origin.startsWith('http://localhost:')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));

// JSON parsing
app.use(express.json());

// Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api/', apiLimiter);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  const mongoose = require('mongoose');
  const isMock = mongoose.connection.host === 'mock-in-memory-db';
  res.status(200).json({ 
    status: 'ok', 
    message: 'Backend is running',
    database: isMock ? 'Mock (JSON File)' : 'MongoDB'
  });
});

// Model Metrics Endpoint
app.get('/api/model-metrics', async (req, res, next) => {
  try {
    const axios = require('axios');
    const mlServiceUrl = process.env.ML_SERVICE_URL || 'http://localhost:8000';
    const response = await axios.get(`${mlServiceUrl}/metrics`);
    res.status(200).json({ success: true, metrics: response.data });
  } catch (error) {
    console.error('Error fetching ML metrics:', error.message);
    res.status(503).json({ success: false, message: 'ML service metrics are currently unavailable.' });
  }
});

// Dataset Data Endpoint
app.get('/api/dataset-data', async (req, res, next) => {
  try {
    const axios = require('axios');
    const mlServiceUrl = process.env.ML_SERVICE_URL || 'http://localhost:8000';
    const response = await axios.get(`${mlServiceUrl}/dataset-data`);
    res.status(200).json({ success: true, data: response.data });
  } catch (error) {
    console.error('Error fetching dataset data:', error.message);
    res.status(503).json({ success: false, message: 'ML service dataset data is currently unavailable.' });
  }
});

// Routes will be added here
app.use('/api/auth', require('./routes/auth'));
app.use('/api/predictions', require('./routes/predictions'));
app.use('/api/users', require('./routes/users'));

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  if (err.name === 'MongoServerSelectionError' || err.message.includes('ECONNREFUSED')) {
    return res.status(503).json({
      success: false,
      message: 'Database connection failed. Please ensure MongoDB is running or check your connection string.'
    });
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Server Error'
  });
});

module.exports = app;
