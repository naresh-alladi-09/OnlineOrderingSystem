import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB, isDbConnected } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import restaurantRoutes from './routes/restaurantRoutes.js';
import dishRoutes from './routes/dishRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import seedRoutes from './routes/seedRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Health Check & Root
app.get('/', (req, res) => {
  res.json({
    app: 'Feastify - Online Food Ordering Platform API',
    status: 'Operational',
    version: '1.0.0',
    dbConnected: isDbConnected(),
    endpoints: {
      auth: '/api/auth',
      restaurants: '/api/restaurants',
      dishes: '/api/dishes',
      orders: '/api/orders',
      admin: '/api/admin',
      health: '/api/health',
    },
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: isDbConnected() ? 'MongoDB Connected' : 'In-Memory Fallback Active',
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/dishes', dishRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/seed', seedRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Initialize Server & DB
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Feastify Backend Server running at http://localhost:${PORT}`);
  });
};

startServer();

