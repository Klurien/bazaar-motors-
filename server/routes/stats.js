import express from 'express';
import { getDashboardStats, getSalesChart, getTopCategories, incrementVisitors } from '../controllers/statsController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/dashboard', verifyToken, isAdmin, getDashboardStats);
router.get('/sales-chart', verifyToken, isAdmin, getSalesChart);
router.get('/top-categories', verifyToken, isAdmin, getTopCategories);
router.post('/visitor', incrementVisitors); // This can be public

export default router;
