import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import * as productController from '../controllers/productController.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: (req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e6);
        cb(null, unique + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files allowed'), false);
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 10 * 1024 * 1024 } });

// Public routes
router.get('/', productController.getProducts);
router.get('/:id', productController.getProduct);

// Admin routes - accept up to 10 images at once
router.post('/', authMiddleware, adminMiddleware, upload.array('images', 10), productController.createProduct);
router.put('/:id', authMiddleware, adminMiddleware, upload.array('images', 10), productController.updateProduct);
router.delete('/reset', authMiddleware, adminMiddleware, productController.resetCatalog);
router.delete('/:id', authMiddleware, adminMiddleware, productController.deleteProduct);
router.delete('/:productId/images/:imageId', authMiddleware, adminMiddleware, productController.deleteProductImage);

export default router;
