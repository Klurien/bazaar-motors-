import db from '../db/db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper: get all images for a product
const getProductImages = async (productId) => {
    const [images] = await db.query('SELECT * FROM product_images WHERE product_id = ? ORDER BY sort_order ASC', [productId]);
    return images;
};

// Helper: attach images[] to a product row
const attachImages = async (product) => {
    if (!product) return null;
    product.images = await getProductImages(product.id);
    if (!product.image_url && product.images.length > 0) {
        product.image_url = product.images[0].url;
    }
    return product;
};

export const getProducts = async (req, res) => {
    try {
        const [products] = await db.query('SELECT * FROM products ORDER BY created_at DESC');
        const withImages = await Promise.all(products.map(attachImages));
        res.json(withImages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching products' });
    }
};

export const getProduct = async (req, res) => {
    try {
        const [products] = await db.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
        const product = products[0];
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(await attachImages(product));
    } catch (error) {
        res.status(500).json({ message: 'Error fetching product' });
    }
};

export const createProduct = async (req, res) => {
    const { name, description, price, category, stock } = req.body;
    if (!name || !price) return res.status(400).json({ message: 'Name and price are required' });

    const image_url = req.files?.length > 0
        ? `/uploads/${req.files[0].filename}`
        : (req.file ? `/uploads/${req.file.filename}` : null);

    try {
        const [result] = await db.execute(
            'INSERT INTO products (name, description, price, category, stock, image_url) VALUES (?, ?, ?, ?, ?, ?)',
            [name, description, parseFloat(price), category, parseInt(stock) || 0, image_url]
        );
        const productId = result.insertId;

        const files = req.files || (req.file ? [req.file] : []);
        for (let i = 0; i < files.length; i++) {
            await db.execute(
                'INSERT INTO product_images (product_id, url, sort_order) VALUES (?, ?, ?)',
                [productId, `/uploads/${files[i].filename}`, i]
            );
        }

        const [products] = await db.query('SELECT * FROM products WHERE id = ?', [productId]);
        res.status(201).json(await attachImages(products[0]));
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating product' });
    }
};

export const updateProduct = async (req, res) => {
    const { name, description, price, category, stock } = req.body;
    try {
        const [products] = await db.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
        const product = products[0];
        if (!product) return res.status(404).json({ message: 'Product not found' });

        let image_url = product.image_url;
        const newFiles = req.files || (req.file ? [req.file] : []);

        if (newFiles.length > 0) {
            const [stats] = await db.query('SELECT COUNT(*) as c FROM product_images WHERE product_id = ?', [req.params.id]);
            const existingCount = stats[0].c;
            for (let i = 0; i < newFiles.length; i++) {
                await db.execute(
                    'INSERT INTO product_images (product_id, url, sort_order) VALUES (?, ?, ?)',
                    [req.params.id, `/uploads/${newFiles[i].filename}`, existingCount + i]
                );
            }
            if (!image_url) image_url = `/uploads/${newFiles[0].filename}`;
        }

        if (req.body.deleted_image_ids) {
            let ids;
            try { ids = JSON.parse(req.body.deleted_image_ids); } catch { ids = []; }
            for (const imgId of ids) {
                const [images] = await db.query('SELECT * FROM product_images WHERE id = ?', [imgId]);
                const img = images[0];
                if (img) {
                    const filePath = path.join(__dirname, '../uploads', path.basename(img.url));
                    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
                    await db.execute('DELETE FROM product_images WHERE id = ?', [imgId]);
                }
            }
            const remaining = await getProductImages(req.params.id);
            image_url = remaining.length > 0 ? remaining[0].url : null;
        }

        if (req.body.image_order) {
            let order;
            try { order = JSON.parse(req.body.image_order); } catch { order = []; }
            for (let i = 0; i < order.length; i++) {
                await db.execute(
                    'UPDATE product_images SET sort_order = ? WHERE id = ? AND product_id = ?',
                    [i, order[i], req.params.id]
                );
            }
            const [first] = await db.query('SELECT * FROM product_images WHERE product_id = ? ORDER BY sort_order ASC LIMIT 1', [req.params.id]);
            if (first[0]) image_url = first[0].url;
        }

        await db.execute(
            'UPDATE products SET name = ?, description = ?, price = ?, category = ?, stock = ?, image_url = ? WHERE id = ?',
            [name, description, parseFloat(price), category, parseInt(stock) || 0, image_url, req.params.id]
        );

        const [updated] = await db.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
        res.json(await attachImages(updated[0]));
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating product' });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const images = await getProductImages(req.params.id);
        images.forEach(img => {
            const filePath = path.join(__dirname, '../uploads', path.basename(img.url));
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        });

        const [result] = await db.execute('DELETE FROM products WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Product not found' });
        res.json({ message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product' });
    }
};

export const deleteProductImage = async (req, res) => {
    const { productId, imageId } = req.params;
    try {
        const [images] = await db.query('SELECT * FROM product_images WHERE id = ? AND product_id = ?', [imageId, productId]);
        const img = images[0];
        if (!img) return res.status(404).json({ message: 'Image not found' });

        const filePath = path.join(__dirname, '../uploads', path.basename(img.url));
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        await db.execute('DELETE FROM product_images WHERE id = ?', [imageId]);

        const [products] = await db.query('SELECT * FROM products WHERE id = ?', [productId]);
        const product = products[0];
        if (product.image_url === img.url) {
            const [next] = await db.query('SELECT * FROM product_images WHERE product_id = ? ORDER BY sort_order ASC LIMIT 1', [productId]);
            await db.execute('UPDATE products SET image_url = ? WHERE id = ?', [next[0]?.url || null, productId]);
        }
        res.json({ message: 'Image deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting image' });
    }
};
