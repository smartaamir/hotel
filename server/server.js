// import express from 'express';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import connectDB from './config/db.js';

// // Route Imports
// import authRoutes from './routes/authRoutes.js';
// import roomRoutes from './routes/roomRoutes.js';
// import bookingRoutes from './routes/bookingRoutes.js';
// import serviceRoutes from './routes/serviceRoutes.js';

// // Configuration
// dotenv.config();
// connectDB();

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json({ limit: '50mb' }));
// app.use(express.urlencoded({ limit: '50mb', extended: true }));

// // API Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/rooms', roomRoutes);
// app.use('/api/bookings', bookingRoutes);
// app.use('/api/services', serviceRoutes);

// // Root Endpoint
// app.get('/', (req, res) => {
//   res.json({ message: 'Welcome to AuraStay Luxury Resorts API' });
// });

// // Error handling middleware
// app.use((err, req, res, next) => {
//   const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
//   res.status(statusCode).json({
//     message: err.message,
//     stack: process.env.NODE_ENV === 'production' ? null : err.stack,
//   });
// });

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`[Server] AuraStay API Server Running on Port ${PORT}`);
// });
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import roomRoutes from './routes/roomRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';

dotenv.config();
connectDB();

const app = express();

// FIX 1: CORS ko open karo Vercel ke liye
app.use(cors({
  origin: "*",
  methods: ["GET","POST","PUT","DELETE"],
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/services', serviceRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to AuraStay Luxury Resorts API - Live' });
});

app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// FIX 2: Vercel ke liye export zaroori hai
export default app;

// Local par chalane ke liye hi listen karo
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`[Server] AuraStay API Server Running on Port ${PORT}`);
  });
}