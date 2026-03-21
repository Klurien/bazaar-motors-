import express from 'express';
import { getDashboardStats, getSalesChart, getTopCategories, incrementVisitors } from '../controllers/statsController.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/dashboard', authMiddleware, adminMiddleware, getDashboardStats);
router.get('/sales-chart', authMiddleware, adminMiddleware, getSalesChart);
router.get('/top-categories', authMiddleware, adminMiddleware, getTopCategories);
router.post('/visitor', incrementVisitors); // This can be public

export default router;
