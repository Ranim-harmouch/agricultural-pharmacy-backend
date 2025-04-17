
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
// import db from './config/db.js'; 
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js'; 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // If needed
app.use(express.json()); // To parse JSON bodies
app.use(cookieParser());

app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send(' Backend is running!');
});

app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});

