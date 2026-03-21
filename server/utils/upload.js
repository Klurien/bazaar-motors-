import { put, del } from '@vercel/blob';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const uploadFile = async (file) => {
    const originalName = file.originalname || 'upload.bin';
    if (process.env.BLOB_READ_WRITE_TOKEN) {
        const { url } = await put(Date.now() + '-' + originalName, file.buffer, { access: 'public' });
        return url;
    } else {
        // Fallback for local development
        const filename = Date.now() + '-' + originalName.replace(/[^a-zA-Z0-9.-]/g, '_');
        const uploadPath = path.join(__dirname, '../../uploads', filename);

        // Ensure uploads directory exists
        const uploadDir = path.dirname(uploadPath);
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        fs.writeFileSync(uploadPath, file.buffer);
        return `/uploads/${filename}`;
    }
};

export const deleteFile = async (fileUrl) => {
    if (!fileUrl) return;

    if (fileUrl.includes('public.blob.vercel-storage.com')) {
        try {
            await del(fileUrl);
        } catch (error) {
            console.error("Failed to delete from Vercel Blob:", error);
        }
    } else if (fileUrl.startsWith('/uploads/')) {
        try {
            const filename = path.basename(fileUrl);
            const filepath = path.join(__dirname, '../../uploads', filename);
            if (fs.existsSync(filepath)) {
                fs.unlinkSync(filepath);
            }
        } catch (error) {
            console.error("Failed to delete local file:", error);
        }
    }
};
