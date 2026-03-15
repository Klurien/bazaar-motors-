import express from 'express';
import * as promotionsController from '../controllers/promotionsController.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';
import multer from 'multer';

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});
const upload = multer({ storage });

const router = express.Router();

router.get('/', promotionsController.getPromotions);
router.post('/', authMiddleware, adminMiddleware, upload.single('image'), promotionsController.createPromotion);
router.patch('/:id', authMiddleware, adminMiddleware, upload.single('image'), promotionsController.updatePromotion);
router.delete('/:id', authMiddleware, adminMiddleware, promotionsController.deletePromotion);

export default router;
