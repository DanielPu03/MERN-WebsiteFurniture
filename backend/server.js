const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const categoryRoutes = require('./routes/categories');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
const wishlistRoutes = require('./routes/wishlist');
const adminRoutes = require('./routes/admin');
const collectionRoutes = require('./routes/collections');
const addressRoutes = require('./routes/addresses');
const vnpayRoutes = require('./routes/vnpay');

const app = express();
const PORT = process.env.PORT || 5000;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs (increased for development)
  message: 'Too many requests from this IP, please try again later.'
});

// Middleware
// app.use(helmet()); // Temporarily disabled for testing
app.use(limiter);
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static('public'));

// API Test page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_CONNECTIONSTRING || 'mongodb://localhost:27017/havyStore')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/payment/vnpay', vnpayRoutes);

// Root route - API documentation
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to havyStore API',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      categories: '/api/categories',
      products: '/api/products',
      cart: '/api/cart',
      orders: '/api/orders',
      wishlist: '/api/wishlist',
      admin: '/api/admin',
      collections: '/api/collections'
    },
    features: {
      authentication: 'JWT-based authentication with refresh tokens',
      authorization: 'Role-based access control (admin/user)',
      validation: 'Input validation with detailed error messages',
      relationships: 'Many-to-many relationships between collections and products',
      security: 'Rate limiting, CORS, Helmet security headers'
    },
    documentation: 'Available endpoints for havyStore e-commerce platform',
    status: 'API is running successfully'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found' 
  });
});

app.listen(PORT, () => {
  console.log(`havyStore API server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});
