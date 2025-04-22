
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
// import db from './config/db.js'; 
import productRoutes from './routes/productRoutes.js';
import addressRoutes from './routes/ordershippingaddressRoutes.js';
import shipmentRoutes from './routes/shipmentsRoutes.js';
import orderDetailsRoutes from './routes/orderDetailsRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // If needed
app.use(express.json()); // To parse JSON bodies

app.use('/api/products', productRoutes);
app.use('/api/order-shipping-addresses', addressRoutes);
app.use('/api/shipments', shipmentRoutes);
app.use('/api/order-details', orderDetailsRoutes);

app.get('/', (req, res) => {
  res.send(' Backend is running!');
});

app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});

