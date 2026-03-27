import './loadEnv.js';
import { initDB } from './db/db.js';
import db from './db/db.js';

const products = [
    {
        name: 'Toyota Harrier Progressive',
        make: 'Toyota',
        year: 2018,
        condition: 'Foreign Used',
        transmission: 'Automatic',
        engine_capacity: '2000cc',
        fuel_type: 'Petrol',
        mileage: 48000,
        auction_grade: '4.5/B',
        features: 'Panoramic Roof, JBL Premium Sound, Black Leather Interior, Power Tailgate, Lane Departure Alert',
        description: 'Pristine condition, Pearl White SUV with 4WD. Features panoramic roof, JBL sound system, and verified 4.5 auction grade. Direct import from Japan.',
        price: 4500000,
        category: 'SUV',
        stock: 1,
        image_url: 'https://images.unsplash.com/photo-1567818735868-e71b99932e29?auto=format&fit=crop&q=80&w=1200',
        images: [
            'https://images.unsplash.com/photo-1567818735868-e71b99932e29?auto=format&fit=crop&q=80&w=1200',
            'https://images.unsplash.com/photo-1620986518174-88439df67d8f?auto=format&fit=crop&q=80&w=1200',
            'https://images.unsplash.com/photo-1620986516315-1847f98fb695?auto=format&fit=crop&q=80&w=1200'
        ]
    },
    {
        name: 'Lexus NX300h Premium',
        make: 'Lexus',
        year: 2017,
        condition: 'Foreign Used',
        transmission: 'Automatic',
        engine_capacity: '2500cc',
        fuel_type: 'Hybrid',
        mileage: 62000,
        auction_grade: '4.5/A',
        features: 'Hybrid technology, Leather Memory Seats, Adaptive Cruise Control, Pre-collision System, Mark Levinson Audio',
        description: '2.5L Hybrid, Obsidian Black, AWD. Exceptional fuel economy with luxury interior. Leather seats, adaptive cruise control, and pre-collision system.',
        price: 5200000,
        category: 'SUV',
        stock: 1,
        image_url: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3ba?auto=format&fit=crop&q=80&w=1200',
        images: [
            'https://images.unsplash.com/photo-1621007947382-bb3c3994e3ba?auto=format&fit=crop&q=80&w=1200',
            'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=1200'
        ]
    },
    {
        name: 'Toyota Prado TX-L 2.8L',
        make: 'Toyota',
        year: 2018,
        condition: 'Foreign Used',
        transmission: 'Automatic',
        engine_capacity: '2800cc',
        fuel_type: 'Diesel',
        mileage: 35000,
        auction_grade: '4.0/B',
        features: '7 Seater, Sunroof, Diff-lock, Heavy Duty Suspension, 360 Camera',
        description: 'Diesel Turbo, 7-Seater, Graphite Grey. Sunroof, Diff-lock, and heavy-duty suspension. Perfect for both city drives and rugged adventures across Kenya.',
        price: 8500000,
        category: 'SUV',
        stock: 2,
        image_url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1200',
        images: [
            'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1200',
            'https://images.unsplash.com/photo-1594731831343-26155986873c?auto=format&fit=crop&q=80&w=1200'
        ]
    },
    {
        name: 'Mercedes-Benz E250 AMG',
        make: 'Mercedes-Benz',
        year: 2017,
        condition: 'Foreign Used',
        transmission: 'Automatic',
        engine_capacity: '2000cc',
        fuel_type: 'Petrol',
        mileage: 42000,
        auction_grade: '5.0/S',
        features: 'AMG Line, Polar White Interior, Widescreen Cockpit, Ambient Lighting, Parking Pilot',
        description: 'AMG Line, Polar White. Premium interior with ambient lighting, wide-screen cockpit, and active park assist. The pinnacle of automotive elegance.',
        price: 4800000,
        category: 'Luxury',
        stock: 1,
        image_url: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=1200',
        images: [
            'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=1200',
            'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1200'
        ]
    }
];

const promotions = [
    {
        title: 'New Arrivals: Direct Imports',
        subtitle: 'Explore our latest selection of hand-picked Japanese vehicles, just arrived at our Ruiru yard.',
        image_url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2070&auto=format&fit=crop',
        link: '/products',
        active: 1,
        sort_order: 0
    }
];

async function seed() {
    console.log('🌱 Seeding database with Bazaar Motors inventory...');
    await initDB();

    await db.execute('DELETE FROM product_images');
    await db.execute('DELETE FROM products');
    await db.execute('DELETE FROM promotions');
    await db.execute('DELETE FROM categories');

    const defaults = ['SUV', 'Sedan', 'Hatchback', 'Pickup', 'Luxury', 'Performance'];
    for (let name of defaults) {
        await db.execute('INSERT INTO categories (name) VALUES (?)', [name]);
    }

    for (const p of products) {
        const [result] = await db.execute(
            'INSERT INTO products (name, make, year, condition, transmission, engine_capacity, fuel_type, mileage, description, price, category, stock, image_url, auction_grade, features) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [p.name, p.make, p.year, p.condition, p.transmission, p.engine_capacity, p.fuel_type, p.mileage, p.description, p.price, p.category, p.stock, p.image_url, p.auction_grade, p.features]
        );
        const productId = result.insertId;

        if (p.images && p.images.length > 0) {
            for (let i = 0; i < p.images.length; i++) {
                await db.execute(
                    'INSERT INTO product_images (product_id, url, sort_order) VALUES (?, ?, ?)',
                    [productId, p.images[i], i]
                );
            }
        } else {
            await db.execute(
                'INSERT INTO product_images (product_id, url, sort_order) VALUES (?, ?, ?)',
                [productId, p.image_url, 0]
            );
        }
        console.log(`  ✅ Added: ${p.name}`);
    }

    for (const promo of promotions) {
        await db.execute(
            'INSERT INTO promotions (title, subtitle, image_url, link, active, sort_order) VALUES (?, ?, ?, ?, ?, ?)',
            [promo.title, promo.subtitle, promo.image_url, promo.link, promo.active, promo.sort_order]
        );
    }

    process.exit(0);
}

seed().catch(err => {
    console.error('Seed failed:', err);
    process.exit(1);
});
