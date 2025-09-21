import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import connectDB from './config/db.js';
import itemRoutes from './routes/itemRoutes.js';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import safetyRoutes from './safety/routes/safetyRoutes.js';

// Connect to database
connectDB();

const app = express();

// Create uploads directory if it doesn't exist
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

app.use(cors());
app.use(express.json());

// --- API Routes ---
app.use('/api/items', itemRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/safety', safetyRoutes);

// --- Static Folder ---
// This correctly serves the 'uploads' folder from the project root.
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// --- Health Check ---
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    mongo: 'connected',
    port: process.env.PORT || 5001,
    ai: {
      geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    },
  });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
