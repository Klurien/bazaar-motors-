import './loadEnv.js';
import { initDB } from './db/db.js';
import db from './db/db.js';

const products = [
    {
        name: '2018 Toyota Harrier Progressive',
        description: 'Pristine condition, Pearl White, 2.0L Petrol, 4WD. Features panoramic roof, JBL sound system, and verified 4.5 auction grade. Direct import from Japan.',
        price: 4500000,
        category: 'SUV',
        stock: 1,
        image_url: 'https://images.unsplash.com/photo-1621359983222-7517c4690ef1?q=80&w=2070&auto=format&fit=crop'
    },
    {
        name: '2017 Lexus NX300h Premium',
        description: '2.5L Hybrid, Obsidian Black, AWD. Exceptional fuel economy with luxury interior. Leather seats, adaptive cruise control, and pre-collision system.',
        price: 5200000,
        category: 'SUV',
        stock: 1,
        image_url: 'https://images.unsplash.com/photo-1549317661-bd3293003975?q=80&w=2070&auto=format&fit=crop'
    },
    {
        name: '2018 Toyota Prado TX-L 2.8L',
        description: 'Diesel Turbo, 7-Seater, Graphite Grey. Sunroof, Diff-lock, and heavy-duty suspension. Perfect for both city drives and rugged adventures across Kenya.',
        price: 8500000,
        category: 'SUV',
        stock: 2,
        image_url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=2070&auto=format&fit=crop'
    },
    {
        name: '2018 Mazda CX-5 L-Package',
        description: '2.2L Diesel SkyActiv, Deep Crystal Blue. BOSE sound system, heads-up display, and lane-keep assist. Stylish, fuel-efficient, and premium handling.',
        price: 3200000,
        category: 'Compact SUV',
        stock: 3,
        image_url: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=2070&auto=format&fit=crop'
    },
    {
        name: '2016 Toyota Vitz Hybrid F',
        description: '1.5L Hybrid, Silver Metallic. Economical city car with verified low mileage. Smart key, push-to-start, and auto-braking safety features.',
        price: 1100000,
        category: 'Hatchback',
        stock: 5,
        image_url: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=2070&auto=format&fit=crop'
    },
    {
        name: '2017 Subaru Forester XT',
        description: '2.0L Turbo, Dark Blue Pearl. EyeSight safety tech, power liftgate, and symmetrical AWD. Sporty performance meets daily practicality.',
        price: 2800000,
        category: 'SUV',
        stock: 1,
        image_url: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=2070&auto=format&fit=crop'
    }
];

const promotions = [
    {
        title: 'New Arrivals: Direct Imports',
        subtitle: 'Explore our latest selection of hand-picked Japanese vehicles, just arrived at our Ruiru yard.',
        image_url: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?q=80&w=1936&auto=format&fit=crop',
        link: '/products',
        active: 1,
        sort_order: 0
    }
];

async function seed() {
    console.log('🌱 Seeding database with Bazaar Motors inventory...');
    await initDB();

    // Clear existing data
    await db.execute('DELETE FROM product_images');
    await db.execute('DELETE FROM products');
    await db.execute('DELETE FROM promotions');
    console.log('🗑️  Cleared existing inventory.');

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
        console.log(`  ✅ Added: ${p.name} (KSh ${p.price.toLocaleString()})`);
    }

    // Seed promotions
    for (const promo of promotions) {
        await db.execute(
            'INSERT INTO promotions (title, subtitle, image_url, link, active, sort_order) VALUES (?, ?, ?, ?, ?, ?)',
            [promo.title, promo.subtitle, promo.image_url, promo.link, promo.active, promo.sort_order]
        );
        console.log(`  ✅ Added promotion: ${promo.title}`);
    }

    console.log(`\n🎉 Seed complete! ${products.length} vehicles + ${promotions.length} promotion loaded.`);
    process.exit(0);
}

seed().catch(err => {
    console.error('Seed failed:', err);
    process.exit(1);
});

