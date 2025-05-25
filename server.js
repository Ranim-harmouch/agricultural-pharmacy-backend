
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
import Ai from './routes/aiRoute.js';
import contactRoutes from "./routes/contactRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// app.use(cors()); // If needed
app.use(cors({
  origin: [ 'http://localhost:3000' ,
  'https://boisterous-zuccutto-c1c010.netlify.app'], // React app’s address
  credentials: true,                  // allow cookies to be sent
  optionsSuccessStatus: 204
}));

app.use(express.json()); // To parse JSON bodies
app.use(cookieParser());
app.use(cors(corsOptions));

// Middleware to add Access-Control-Allow-Private-Network header for preflight requests
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', corsOptions.origin.includes(req.headers.origin) ? req.headers.origin : '');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Add this to opt-in for private network access
  res.header('Access-Control-Allow-Private-Network', 'true');
  
  res.sendStatus(204);
});

app.use('/api/products', productRoutes);

app.use('/api/orders', orderRoutes);

app.use('/api/order-shipping-addresses', addressRoutes);
app.use('/api/shipments', shipmentRoutes);
app.use('/api/order-details', orderDetailsRoutes);

app.use('/api', authRoutes);

app.use('/api/ai/ask', Ai);
app.use("/api/contact", contactRoutes);

app.get('/', (req, res) => {
  res.send(' Backend is running!');
});

app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});

