require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const morgan = require('morgan');
const path = require('path');

// Routes
const apiRoutes = require('./routes/api');

// Security middleware
const { securityHeaders } = require('./middleware/security');

// Initialize app
const app = express();
const PORT = process.env.PORT || 3001;

// MIDDLEWARE SETUP
// Security headers
app.use(helmet());
app.use(securityHeaders);

// Rate limiting (prevent spam)
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || '15') * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX || '5'),
  message: {
    success: false,
    error: 'Too many requests. Please try again later.'
  }
});
app.use('/api/contact', limiter);

// CORS configuration - allows frontend to talk to backend
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3001',
  methods: ['POST'],
  credentials: true
};
app.use(cors(corsOptions));

// Request logging (shows requests in terminal)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parsing & XSS protection
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(xss());

// API ROUTES
app.use('/api', apiRoutes);

// ERROR HANDLING
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// START SERVER
app.listen(PORT, () => {
  console.log(`✅ Portfolio backend running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
  console.log(`📧 Test contact form at: http://localhost:${PORT}/api/contact`);
  console.log(`💡 Keep this terminal window open while testing!`);
});