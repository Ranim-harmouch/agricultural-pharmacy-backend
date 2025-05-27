
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
// import db from './config/db.js'; 
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';  
import addressRoutes from './routes/ordershippingaddressRoutes.js';
import shipmentRoutes from './routes/shipmentsRoutes.js';
import orderDetailsRoutes from './routes/orderDetailsRoutes.js';
import contactRoutes from "./routes/contactRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// app.use(cors()); // If needed

app.use(cors({
  origin: [ 'http://localhost:3000' ,
  'https://boisterous-zuccutto-c1c010.netlify.app'], // React app’s address
  credentials: true
}));


app.use(express.json()); // To parse JSON bodies
app.use(cookieParser());


app.use('/api/products', productRoutes);

app.use('/api/orders', orderRoutes);

app.use('/api/order-shipping-addresses', addressRoutes);
app.use('/api/shipments', shipmentRoutes);
app.use('/api/order-details', orderDetailsRoutes);

app.use('/api', authRoutes);

app.use("/api/contact", contactRoutes);

app.get('/', (req, res) => {
  res.send(' Backend is running!');
});

app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});

