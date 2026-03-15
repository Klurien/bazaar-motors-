import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(path.join(__dirname, 'db', 'ecommerce.db'));

const products = [
    {
        name: 'Professional Copper Sauté Pan',
        description: 'Heavy-duty 5-ply copper construction for precise temperature control. Features a stainless steel interior and a stay-cool handle. Perfect for searing, deglazing, and reducing sauces.',
        price: 189.99,
        category: 'Cookware',
        stock: 12,
        image_url: '/uploads/copper-pan.jpg'
    },
    {
        name: 'Master-Grade Chef Knife (8")',
        description: 'Hand-forged high-carbon Japanese steel with a traditional hammered finish. Exceptional sharpness and balance for all your kitchen prep work.',
        price: 145.00,
        category: 'Gadgets',
        stock: 25,
        image_url: '/uploads/chef-knife.jpg'
    },
    {
        name: 'Electric Precision Spice Grinder',
        description: 'Multi-grind settings for everything from coarse peppercorns to fine espresso. One-touch operation with a stainless steel blade and removable bowl.',
        price: 49.99,
        category: 'Gadgets',
        stock: 40,
        image_url: '/uploads/grinder.jpg'
    },
    {
        name: 'Artisan Ceramic Pasta Bowls (Set of 4)',
        description: 'Hand-glazed ceramic bowls with a minimalist silhouette. Durable enough for daily use, elegant enough for dinner parties. Dishwasher and microwave safe.',
        price: 72.00,
        category: 'Dining',
        stock: 15,
        image_url: '/uploads/pasta-bowls.jpg'
    },
    {
        name: 'Airtight Glass Storage Jar Set',
        description: 'Premium borosilicate glass with bamboo lids and silicone gaskets. Set of 3 sizes for pantry organization. Keeps dry goods fresh for longer.',
        price: 34.50,
        category: 'Storage',
        stock: 30,
        image_url: '/uploads/jars.jpg'
    },
    {
        name: 'Non-Stick Silicone Baking Mat',
        description: 'Professional-grade silicone mat that replaces parchment paper. Heat resistant up to 480°F. Ensures even browning and easy release of all baked goods.',
        price: 18.00,
        category: 'Baking',
        stock: 100,
        image_url: '/uploads/baking-mat.jpg'
    },
    {
        name: 'Modern Matte Flatware Set',
        description: '20-piece service for 4. Made of high-quality 18/10 stainless steel with a sleek black matte finish. Weighted perfectly for a premium feel.',
        price: 89.00,
        category: 'Dining',
        stock: 8,
        image_url: '/uploads/flatware.jpg'
    },
    {
        name: 'Cast Iron French Oven (5 Qt)',
        description: 'Vibrant enameled cast iron for superior heat retention and distribution. Tight-fitting lid locks in moisture. From stove to oven to table.',
        price: 159.00,
        category: 'Cookware',
        stock: 5,
        image_url: '/uploads/dutch-oven.jpg'
    }
];

// Clear existing products
db.prepare('DELETE FROM product_images').run();
db.prepare('DELETE FROM products').run();

const insertProduct = db.prepare(`
    INSERT INTO products (name, description, price, category, stock, image_url)
    VALUES (?, ?, ?, ?, ?, ?)
`);

for (const p of products) {
    insertProduct.run(p.name, p.description, p.price, p.category, p.stock, p.image_url);
}

console.log('Seeded 8 Kitchen Finds successfully!');
db.close();
