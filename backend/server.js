const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Routes
const authRoutes = require('./routes/authRoutes');
const seriesRoutes = require('./routes/seriesRoutes');
const chapterRoutes = require('./routes/chapterRoutes');
const productRoutes = require('./routes/productRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5000',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (like mobile apps, curl, or Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true); // Allow all in dev/test evaluation
    },
    credentials: true,
  })
);

// Body parsers
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Static uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    brand: 'QUIET BATTLES™',
    tagline: 'WEAR YOUR BATTLES.',
    collection: 'SERIES 01 – THE GENTLE ARMOR™',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/admin', authRoutes);
app.use('/api/series', seriesRoutes);
app.use('/api/chapters', chapterRoutes);
app.use('/api/products', productRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/orders', orderRoutes);

// Error Middlewares
app.use(notFound);
app.use(errorHandler);

// Start Server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`===============================================`);
    console.log(`QUIET BATTLES™ REST API Server running on port ${PORT}`);
    console.log(`Tagline: WEAR YOUR BATTLES.`);
    console.log(`Health Check: http://localhost:${PORT}/api/health`);
    console.log(`Static Uploads: http://localhost:${PORT}/uploads`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`===============================================`);
  });
}

module.exports = app;

