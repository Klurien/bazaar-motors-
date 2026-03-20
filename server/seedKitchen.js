import './loadEnv.js';
import { initDB } from './db/db.js';
import db from './db/db.js';

const products = [
    {
        name: 'Damascus Steel Chef Knife',
        description: 'Hand-forged 8-inch Japanese chef knife with 67-layer Damascus steel blade and a stabilized wood handle. Razor-sharp precision for the modern culinary artist.',
        price: 12500,
        category: 'Cookware',
        stock: 15,
        image_url: '/uploads/chef-knife.png'
    },
    {
        name: 'Heritage Cast Iron Skillet',
        description: 'Pre-seasoned 12-inch cast iron skillet with brass-accent handle. Built to last generations — sear, bake, fry, and braise with unmatched heat retention.',
        price: 4800,
        category: 'Cookware',
        stock: 25,
        image_url: '/uploads/cast-iron-skillet.png'
    },
    {
        name: 'Artisan Walnut Cutting Board',
        description: 'Premium end-grain walnut cutting board, 18x14 inches. Self-healing surface that keeps your knives sharper longer. Food-safe mineral oil finish.',
        price: 6200,
        category: 'Gadgets',
        stock: 20,
        image_url: '/uploads/cutting-board.png'
    },
    {
        name: 'Hammered Copper Saucepan',
        description: 'Hand-hammered 2.5-quart copper saucepan with stainless steel lining and brass handle. The ultimate in heat conductivity for sauces and reductions.',
        price: 15900,
        category: 'Cookware',
        stock: 10,
        image_url: '/uploads/copper-pan.png'
    },
    {
        name: 'Artisan Spice Collection',
        description: 'Set of 7 premium glass jars in a handcrafted bamboo rack. Includes saffron, smoked paprika, turmeric, and rare single-origin spices from around the world.',
        price: 3200,
        category: 'Dining',
        stock: 30,
        image_url: '/uploads/spice-set.png'
    },
    {
        name: 'Professional Mixing Bowl Set',
        description: 'Set of 3 premium stainless steel mixing bowls (3qt, 5qt, 8qt). Mirror-polished interior with silicone non-slip base. Stackable for easy storage.',
        price: 5500,
        category: 'Cookware',
        stock: 18,
        image_url: '/uploads/mixing-bowls.png'
    }
];

const promotions = [
    {
        title: 'The Copper Collection',
        subtitle: 'Up to 30% off hand-hammered copper cookware. Artisan quality, limited stock.',
        image_url: '/uploads/promo-banner.png',
        link: '/products?category=Cookware',
        active: 1,
        sort_order: 0
    }
];

async function seed() {
    console.log('🌱 Seeding database with premium catalog...');
    await initDB();

    // Clear existing data
    await db.execute('DELETE FROM product_images');
    await db.execute('DELETE FROM products');
    await db.execute('DELETE FROM promotions');
    console.log('🗑️  Cleared existing products and promotions.');

    // Seed products
    for (const p of products) {
        const [result] = await db.execute(
            'INSERT INTO products (name, description, price, category, stock, image_url) VALUES (?, ?, ?, ?, ?, ?)',
            [p.name, p.description, p.price, p.category, p.stock, p.image_url]
        );
        const productId = result.insertId;
        // Also insert into product_images table
        await db.execute(
            'INSERT INTO product_images (product_id, url, sort_order) VALUES (?, ?, ?)',
            [productId, p.image_url, 0]
        );
        console.log(`  ✅ Added: ${p.name} (KES ${p.price.toLocaleString()})`);
    }

    // Seed promotions
    for (const promo of promotions) {
        await db.execute(
            'INSERT INTO promotions (title, subtitle, image_url, link, active, sort_order) VALUES (?, ?, ?, ?, ?, ?)',
            [promo.title, promo.subtitle, promo.image_url, promo.link, promo.active, promo.sort_order]
        );
        console.log(`  ✅ Added promotion: ${promo.title}`);
    }

    console.log('\n🎉 Seed complete! 6 products + 1 promotion loaded.');
    process.exit(0);
}

seed().catch(err => {
    console.error('Seed failed:', err);
    process.exit(1);
});
