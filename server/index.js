import './loadEnv.js';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import promotionRoutes from './routes/promotions.js';
import { initDB } from './db/db.js';

// Init DB asynchronously, but store the promise
const dbInitPromise = initDB().catch(console.error);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// Guard incoming requests until DB finishes initializing
app.use(async (req, res, next) => {
    await dbInitPromise;
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: process.env.VERCEL ? true : 'http://localhost:5173', // Allow origin properly
    credentials: true
}));
app.use(morgan('dev'));
app.use(helmet({
    crossOriginResourcePolicy: false,
}));
app.use(compression());
app.use(cookieParser());

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/promotions', promotionRoutes);

app.get('/', (req, res) => {
    res.send('Ecommerce API is running...');
});

// Conditionally listen if not deployed on Vercel
if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
        console.log('JWT_SECRET loaded:', process.env.JWT_SECRET ? 'Yes' : 'No');
    });
}

// Export the Express app for Vercel serverless functions
export default app;
