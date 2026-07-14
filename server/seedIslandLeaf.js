import './loadEnv.js';
import { initDB } from './db/db.js';
import db from './db/db.js';

const products = [
    // ═══ Indica ═══════════════════════════════════════════════════════════════
    {
        name: 'Blue Dream',
        make: 'Indica',
        year: 22,
        condition: 'Premium AAA',
        transmission: 'Relaxing',
        engine_capacity: '0.3',
        fuel_type: 'Myrcene',
        mileage: 3.5,
        auction_grade: 'AAA',
        features: 'Organic, Hand-Trimmed, Lab Tested, Smooth Finish, Pine Aroma',
        description: 'A legendary west coast classic now grown in the Jamaican highlands. Blue Dream offers full-body relaxation with a sweet berry aroma. Lab-tested at 22% THC with myrcene-dominant terpene profile. Hand-trimmed and cured for 6 weeks.',
        price: 3500,
        category: 'Indica',
        stock: 15,
        images: [
            'https://images.unsplash.com/photo-1603900055207-07f571524012?auto=format&fit=crop&q=80&w=1200',
            'https://images.unsplash.com/photo-1609987339210-2f212961cee6?auto=format&fit=crop&q=80&w=1200',
            'https://images.unsplash.com/photo-1610382164007-4dca4f87c7f4?auto=format&fit=crop&q=80&w=1200'
        ]
    },
    {
        name: 'Granddaddy Purple',
        make: 'Indica',
        year: 24,
        condition: 'Premium AAA',
        transmission: 'Sleepy',
        engine_capacity: '0.2',
        fuel_type: 'Caryophyllene',
        mileage: 7,
        auction_grade: 'AAA',
        features: 'Premium AAA, Cured 8 Weeks, Lab Tested, Grape Aroma, Full Body Relaxation',
        description: 'GDP brings the legendary purple hues and grape-forward aroma that made it a global icon. Grown in the fertile soils of St. Ann Parish, this indica-dominant strain delivers 24% THC with a caryophyllene-driven terpene profile. Ideal for evening use.',
        price: 4500,
        category: 'Indica',
        stock: 10,
        images: [
            'https://images.unsplash.com/photo-1603900055207-07f571524012?auto=format&fit=crop&q=80&w=1200',
            'https://images.unsplash.com/photo-1609987339210-2f212961cee6?auto=format&fit=crop&q=80&w=1200',
            'https://images.unsplash.com/photo-1610382164007-4dca4f87c7f4?auto=format&fit=crop&q=80&w=1200'
        ]
    },
    {
        name: 'Northern Lights',
        make: 'Indica',
        year: 20,
        condition: 'Premium AA',
        transmission: 'Relaxing',
        engine_capacity: '0.1',
        fuel_type: 'Pinene',
        mileage: 14,
        auction_grade: 'AA',
        features: 'Organic, Hand-Trimmed, Lab Tested, Earthy Pine, Resilient Plant',
        description: 'The quintessential indica that put Amsterdam on the map, now thriving in Jamaica\'s tropical climate. Northern Lights offers a blissful body stone with earthy pine notes. 20% THC with a pinene-forward profile. A staple for any collection.',
        price: 6500,
        category: 'Indica',
        stock: 8,
        images: [
            'https://images.unsplash.com/photo-1603900055207-07f571524012?auto=format&fit=crop&q=80&w=1200',
            'https://images.unsplash.com/photo-1609987339210-2f212961cee6?auto=format&fit=crop&q=80&w=1200',
            'https://images.unsplash.com/photo-1610382164007-4dca4f87c7f4?auto=format&fit=crop&q=80&w=1200'
        ]
    },
    {
        name: 'Purple Kush',
        make: 'Indica',
        year: 23,
        condition: 'Premium AA',
        transmission: 'Sleepy',
        engine_capacity: '0.2',
        fuel_type: 'Myrcene',
        mileage: 3.5,
        auction_grade: 'AA',
        features: 'Hand-Trimmed, Lab Tested, Grape Notes, Heavy Body High, Sun-Grown',
        description: 'Pure indica genetics from the Hindu Kush mountain range, now sun-grown in Jamaica. Purple Kush delivers a heavy, sedating body high with sweet grape and earthy flavours. 23% THC. Perfect for deep relaxation.',
        price: 3000,
        category: 'Indica',
        stock: 20,
        images: [
            'https://images.unsplash.com/photo-1603900055207-07f571524012?auto=format&fit=crop&q=80&w=1200',
            'https://images.unsplash.com/photo-1609987339210-2f212961cee6?auto=format&fit=crop&q=80&w=1200',
            'https://images.unsplash.com/photo-1610382164007-4dca4f87c7f4?auto=format&fit=crop&q=80&w=1200'
        ]
    },
    {
        name: 'Bubba Kush',
        make: 'Indica',
        year: 25,
        condition: 'Premium AAA',
        transmission: 'Sleepy',
        engine_capacity: '0.1',
        fuel_type: 'Limonene',
        mileage: 7,
        auction_grade: 'AAA',
        features: 'Premium AAA, Top Shelf, Organic, Lab Tested, Coffee & Chocolate Notes',
        description: 'Bubba Kush is a heavy-hitting indica with a distinct coffee and chocolate aroma. Grown organically in the Blue Mountains of Jamaica. 25% THC with a limonene-dominant terpene profile. Top-shelf quality for the discerning connoisseur.',
        price: 5000,
        category: 'Indica',
        stock: 12,
        images: [
            'https://images.unsplash.com/photo-1603900055207-07f571524012?auto=format&fit=crop&q=80&w=1200',
            'https://images.unsplash.com/photo-1609987339210-2f212961cee6?auto=format&fit=crop&q=80&w=1200',
            'https://images.unsplash.com/photo-1610382164007-4dca4f87c7f4?auto=format&fit=crop&q=80&w=1200'
        ]
    },

    // ═══ Sativa ═════════════════════════════════════════════════════════════
    {
        name: 'Sour Diesel',
        make: 'Sativa',
        year: 24,
        condition: 'Premium AA',
        transmission: 'Energetic',
        engine_capacity: '0.1',
        fuel_type: 'Limonene',
        mileage: 3.5,
        auction_grade: 'AA',
        features: 'Lab Tested, Hand-Trimmed, Diesel Aroma, Energetic High, Sun-Grown',
        description: 'The iconic Sour Diesel delivers an energizing, cerebral high with its characteristic diesel fuel aroma. Grown in the Jamaican sunshine, this sativa tests at 24% THC with a limonene-dominant profile. Perfect for daytime creativity.',
        price: 3200,
        category: 'Sativa',
        stock: 18,
        images: [
            'https://images.unsplash.com/photo-1603900055207-07f571524012?auto=format&fit=crop&q=80&w=1200',
            'https://images.unsplash.com/photo-1609987339210-2f212961cee6?auto=format&fit=crop&q=80&w=1200',
            'https://images.unsplash.com/photo-1610382164007-4dca4f87c7f4?auto=format&fit=crop&q=80&w=1200'
        ]
    },
    {
        name: 'Green Crack',
        make: 'Sativa',
        year: 21,
        condition: 'Premium AA',
        transmission: 'Energetic',
        engine_capacity: '0.1',
        fuel_type: 'Pinene',
        mileage: 7,
        auction_grade: 'AA',
        features: 'Hand-Trimmed, Lab Tested, Citrus Notes, Focus-Enhancing, Sun-Grown',
        description: 'Green Crack is a sharp-minded sativa known for its energizing effects and citrusy flavour. 21% THC with a pinene-forward terpene profile. Grown organically in Portland Parish. A favorite for daytime motivation and focus.',
        price: 4000,
        category: 'Sativa',
        stock: 14,
        images: [
            'https://images.unsplash.com/photo-1603900055207-07f571524012?auto=format&fit=crop&q=80&w=1200',
            'https://images.unsplash.com/photo-1609987339210-2f212961cee6?auto=format&fit=crop&q=80&w=1200',
            'https://images.unsplash.com/photo-1610382164007-4dca4f87c7f4?auto=format&fit=crop&q=80&w=1200'
        ]
    },
    {
        name: 'Jack Herer',
        make: 'Sativa',
        year: 23,
        condition: 'Premium AAA',
        transmission: 'Creative',
        engine_capacity: '0.2',
        fuel_type: 'Terpinolene',
        mileage: 3.5,
        auction_grade: 'AAA',
        features: 'Premium AAA, Organic, Lab Tested, Spicy Pine, Award-Winning Genetics',
        description: 'Named after the legendary cannabis activist, Jack Herer is a sativa-dominant strain with a complex spicy pine aroma. 23% THC with a rare terpinolene-dominant profile. Grown in the hills of St. Elizabeth. A truly uplifting experience.',
        price: 3800,
        category: 'Sativa',
        stock: 9,
        images: [
            'https://images.unsplash.com/photo-1603900055207-07f571524012?auto=format&fit=crop&q=80&w=1200',
            'https://images.unsplash.com/photo-1609987339210-2f212961cee6?auto=format&fit=crop&q=80&w=1200',
            'https://images.unsplash.com/photo-1610382164007-4dca4f87c7f4?auto=format&fit=crop&q=80&w=1200'
        ]
    },

    // ═══ Hybrid ═════════════════════════════════════════════════════════════
    {
        name: 'Wedding Cake',
        make: 'Hybrid',
        year: 26,
        condition: 'Premium AAA',
        transmission: 'Euphoric',
        engine_capacity: '0.2',
        fuel_type: 'Caryophyllene',
        mileage: 3.5,
        auction_grade: 'AAA',
        features: 'Premium AAA, Top Shelf, Hand-Trimmed, Lab Tested, Sweet Vanilla Aroma',
        description: 'Wedding Cake is a potent hybrid that delivers a euphoric, uplifting high balanced with full-body relaxation. 26% THC with caryophyllene-driven terpenes. Sweet vanilla and peppery notes. Top-shelf flower from our Kingston cure house.',
        price: 4200,
        category: 'Hybrid',
        stock: 11,
        images: [
            'https://images.unsplash.com/photo-1603900055207-07f571524012?auto=format&fit=crop&q=80&w=1200',
            'https://images.unsplash.com/photo-1609987339210-2f212961cee6?auto=format&fit=crop&q=80&w=1200',
            'https://images.unsplash.com/photo-1610382164007-4dca4f87c7f4?auto=format&fit=crop&q=80&w=1200'
        ]
    },
    {
        name: 'Gelato',
        make: 'Hybrid',
        year: 24,
        condition: 'Premium AAA',
        transmission: 'Euphoric',
        engine_capacity: '0.1',
        fuel_type: 'Limonene',
        mileage: 7,
        auction_grade: 'AAA',
        features: 'Premium AAA, Organic, Lab Tested, Citrus Cream, Balanced High',
        description: 'Gelato offers the perfect balance of relaxation and euphoria with its creamy citrus flavour profile. 24% THC from our sun-grown Jamaican crop. Limonene and caryophyllene blend for a smooth, flavourful experience.',
        price: 4800,
        category: 'Hybrid',
        stock: 7,
        images: [
            'https://images.unsplash.com/photo-1603900055207-07f571524012?auto=format&fit=crop&q=80&w=1200',
            'https://images.unsplash.com/photo-1609987339210-2f212961cee6?auto=format&fit=crop&q=80&w=1200',
            'https://images.unsplash.com/photo-1610382164007-4dca4f87c7f4?auto=format&fit=crop&q=80&w=1200'
        ]
    },
    {
        name: 'Zkittlez',
        make: 'Hybrid',
        year: 23,
        condition: 'Premium AA',
        transmission: 'Uplifting',
        engine_capacity: '0.0',
        fuel_type: 'Limonene',
        mileage: 3.5,
        auction_grade: 'AA',
        features: 'Hand-Trimmed, Lab Tested, Tropical Fruit, Upbeat High, Sun-Grown',
        description: 'Zkittlez brings the rainbow with its tropical fruit medley and uplifting hybrid effects. 23% THC with a complex blend of limonene, myrcene, and pinene. Grown in Jamaica\'s Rio Grande Valley. A flavour explosion in every puff.',
        price: 3600,
        category: 'Hybrid',
        stock: 16,
        images: [
            'https://images.unsplash.com/photo-1603900055207-07f571524012?auto=format&fit=crop&q=80&w=1200',
            'https://images.unsplash.com/photo-1609987339210-2f212961cee6?auto=format&fit=crop&q=80&w=1200',
            'https://images.unsplash.com/photo-1610382164007-4dca4f87c7f4?auto=format&fit=crop&q=80&w=1200'
        ]
    },
    {
        name: 'Pineapple Express',
        make: 'Hybrid',
        year: 21,
        condition: 'Premium AA',
        transmission: 'Uplifting',
        engine_capacity: '0.1',
        fuel_type: 'Pinene',
        mileage: 7,
        auction_grade: 'AA',
        features: 'Organic, Lab Tested, Tropical Pineapple, Energetic Focus, Smooth Smoke',
        description: 'Pineapple Express lives up to its name with sweet tropical pineapple flavours and a focused, energetic high. 21% THC with pinene-dominant terpenes. Grown using organic methods in the Jamaican countryside.',
        price: 4000,
        category: 'Hybrid',
        stock: 13,
        images: [
            'https://images.unsplash.com/photo-1603900055207-07f571524012?auto=format&fit=crop&q=80&w=1200',
            'https://images.unsplash.com/photo-1609987339210-2f212961cee6?auto=format&fit=crop&q=80&w=1200',
            'https://images.unsplash.com/photo-1610382164007-4dca4f87c7f4?auto=format&fit=crop&q=80&w=1200'
        ]
    },

    // ═══ Edibles ═════════════════════════════════════════════════════════════
    {
        name: 'Island Gummies - Mango',
        make: 'Edibles',
        year: 10,
        condition: 'Premium AA',
        transmission: 'Relaxing',
        engine_capacity: '0.0',
        fuel_type: 'N/A',
        mileage: 10,
        auction_grade: 'AA',
        features: '10mg THC Each, Vegan, Gluten-Free, Jamaica Mango, Lab Tested',
        description: 'Our signature mango-flavoured THC gummies, made with real Jamaican mangoes. Each gummy contains 10mg of THC from our sun-grown flower. Vegan, gluten-free, and third-party lab tested for purity and potency. 10 pieces per pack.',
        price: 2500,
        category: 'Edibles',
        stock: 50,
        images: [
            'https://images.unsplash.com/photo-1603900055207-07f571524012?auto=format&fit=crop&q=80&w=1200',
            'https://images.unsplash.com/photo-1609987339210-2f212961cee6?auto=format&fit=crop&q=80&w=1200'
        ]
    },
    {
        name: 'Island Gummies - Pineapple',
        make: 'Edibles',
        year: 10,
        condition: 'Premium AA',
        transmission: 'Uplifting',
        engine_capacity: '0.0',
        fuel_type: 'N/A',
        mileage: 20,
        auction_grade: 'AA',
        features: '10mg THC Each, Vegan, Gluten-Free, Island Pineapple, Lab Tested',
        description: 'Tropical pineapple gummies infused with IslandLeaf\'s premium hybrid extract. Each piece delivers 10mg of THC for a consistent, enjoyable experience. Made with natural fruit juices. 20 pieces per pack.',
        price: 4000,
        category: 'Edibles',
        stock: 35,
        images: [
            'https://images.unsplash.com/photo-1603900055207-07f571524012?auto=format&fit=crop&q=80&w=1200',
            'https://images.unsplash.com/photo-1609987339210-2f212961cee6?auto=format&fit=crop&q=80&w=1200'
        ]
    },
    {
        name: 'Jamaican Hash Balls',
        make: 'Edibles',
        year: 35,
        condition: 'Premium AAA',
        transmission: 'Sleepy',
        engine_capacity: '0.0',
        fuel_type: 'Myrcene',
        mileage: 5,
        auction_grade: 'AAA',
        features: 'Old-School Recipe, Hand-Rolled, 35mg THC, Traditional Jamaican, Lab Tested',
        description: 'Hand-rolled Jamaican hash balls made using a traditional recipe passed down through generations. Each ball contains 35mg of THC from premium kief. Made with local spices and honey. A true taste of Jamaica\'s cannabis heritage.',
        price: 3000,
        category: 'Edibles',
        stock: 25,
        images: [
            'https://images.unsplash.com/photo-1603900055207-07f571524012?auto=format&fit=crop&q=80&w=1200',
            'https://images.unsplash.com/photo-1609987339210-2f212961cee6?auto=format&fit=crop&q=80&w=1200'
        ]
    },

    // ═══ CBD ════════════════════════════════════════════════════════════════
    {
        name: 'Charlotte\'s Angel',
        make: 'CBD',
        year: 1,
        condition: 'Premium AA',
        transmission: 'Relaxing',
        engine_capacity: '15',
        fuel_type: 'Myrcene',
        mileage: 3.5,
        auction_grade: 'AA',
        features: 'High CBD, Low THC, Organic, Lab Tested, Non-Psychoactive, Sun-Grown',
        description: 'Charlotte\'s Angel is our flagship CBD-rich strain with 15% CBD and less than 1% THC. Offers the therapeutic benefits of cannabis without the high. Grown organically in Jamaica. Ideal for daytime wellness and relaxation.',
        price: 3500,
        category: 'CBD',
        stock: 20,
        images: [
            'https://images.unsplash.com/photo-1603900055207-07f571524012?auto=format&fit=crop&q=80&w=1200',
            'https://images.unsplash.com/photo-1609987339210-2f212961cee6?auto=format&fit=crop&q=80&w=1200',
            'https://images.unsplash.com/photo-1610382164007-4dca4f87c7f4?auto=format&fit=crop&q=80&w=1200'
        ]
    },
    {
        name: 'CBD Critical Mass',
        make: 'CBD',
        year: 1,
        condition: 'Premium AA',
        transmission: 'Relaxing',
        engine_capacity: '12',
        fuel_type: 'Pinene',
        mileage: 7,
        auction_grade: 'AA',
        features: 'High CBD, Organic, Lab Tested, Non-Psychoactive, Calming, Sun-Grown',
        description: 'CBD Critical Mass offers 12% CBD with a soothing, non-psychoactive experience. Earthy pine aroma with a smooth, mellow finish. Grown without pesticides in the hills of Portland. Perfect for daily microdosing.',
        price: 4500,
        category: 'CBD',
        stock: 15,
        images: [
            'https://images.unsplash.com/photo-1603900055207-07f571524012?auto=format&fit=crop&q=80&w=1200',
            'https://images.unsplash.com/photo-1609987339210-2f212961cee6?auto=format&fit=crop&q=80&w=1200',
            'https://images.unsplash.com/photo-1610382164007-4dca4f87c7f4?auto=format&fit=crop&q=80&w=1200'
        ]
    },

    // ═══ Concentrates ════════════════════════════════════════════════════════
    {
        name: 'Live Resin - Blue Dream',
        make: 'Concentrates',
        year: 70,
        condition: 'Premium AAA',
        transmission: 'Relaxing',
        engine_capacity: '0.5',
        fuel_type: 'Myrcene',
        mileage: 1,
        auction_grade: 'AAA',
        features: 'Live Resin, Full Spectrum, Lab Tested, Solventless, High Terpene',
        description: 'Our Blue Dream live resin captures the full terpene profile of the fresh plant through solventless extraction. 70% THC with a rich myrcene profile. Full spectrum for the most authentic flavour experience. 1g jar.',
        price: 5500,
        category: 'Concentrates',
        stock: 10,
        images: [
            'https://images.unsplash.com/photo-1603900055207-07f571524012?auto=format&fit=crop&q=80&w=1200',
            'https://images.unsplash.com/photo-1609987339210-2f212961cee6?auto=format&fit=crop&q=80&w=1200'
        ]
    },
    {
        name: 'RSO - Full Extract',
        make: 'Concentrates',
        year: 65,
        condition: 'Premium AA',
        transmission: 'Sleepy',
        engine_capacity: '1.0',
        fuel_type: 'Caryophyllene',
        mileage: 5,
        auction_grade: 'AA',
        features: 'Full Extract, Rick Simpson Oil, Lab Tested, Medicinal Grade, Glass Syringe',
        description: 'Rick Simpson Oil made from our finest Jamaican indica flower. 65% THC full-spectrum extract in a glass syringe for easy dosing. Known for its potent medicinal properties. 5g syringe. Use responsibly.',
        price: 8000,
        category: 'Concentrates',
        stock: 8,
        images: [
            'https://images.unsplash.com/photo-1603900055207-07f571524012?auto=format&fit=crop&q=80&w=1200',
            'https://images.unsplash.com/photo-1609987339210-2f212961cee6?auto=format&fit=crop&q=80&w=1200'
        ]
    }
];

const promotions = [
    {
        title: 'Fresh From the Highlands',
        subtitle: 'Our latest harvest is here. Premium sun-grown strains from the Jamaican Blue Mountains. Lab-tested and ready for you.',
        image_url: 'https://images.unsplash.com/photo-1603900055207-07f571524012?q=80&w=2070&auto=format&fit=crop',
        link: '/products',
        active: 1,
        sort_order: 0
    },
    {
        title: 'New Member Special',
        subtitle: 'First time ordering? Get 10% off your first purchase. Use code ISLAND10 at checkout. Welcome to the IslandLeaf family.',
        image_url: 'https://images.unsplash.com/photo-1610382164007-4dca4f87c7f4?q=80&w=2070&auto=format&fit=crop',
        link: '/products',
        active: 1,
        sort_order: 1
    }
];

async function seed() {
    console.log('🌱 Seeding IslandLeaf with premium Jamaican strains...\n');
    await initDB();

    await db.execute('DELETE FROM product_images');
    await db.execute('DELETE FROM products');
    await db.execute('DELETE FROM promotions');
    await db.execute('DELETE FROM categories');

    const categories = ['Indica', 'Sativa', 'Hybrid', 'Edibles', 'CBD', 'Concentrates'];
    for (const name of categories) {
        await db.execute('INSERT INTO categories (name) VALUES (?)', [name]);
    }
    console.log(`📂 Seeded ${categories.length} categories`);

    for (const p of products) {
        const mainImage = p.images[0];
        const [result] = await db.execute(
            'INSERT INTO products (name, make, year, `condition`, transmission, engine_capacity, fuel_type, mileage, description, price, category, stock, image_url, auction_grade, features) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [p.name, p.make, p.year, p.condition, p.transmission, p.engine_capacity, p.fuel_type, p.mileage, p.description, p.price, p.category, p.stock, mainImage, p.auction_grade, p.features]
        );
        const productId = result.insertId;

        for (let i = 0; i < p.images.length; i++) {
            await db.execute(
                'INSERT INTO product_images (product_id, url, sort_order) VALUES (?, ?, ?)',
                [productId, p.images[i], i]
            );
        }
        console.log(`  🌿 ${p.name} (${p.make}) — JMD ${(p.price).toLocaleString()}`);
    }

    for (const promo of promotions) {
        await db.execute(
            'INSERT INTO promotions (title, subtitle, image_url, link, active, sort_order) VALUES (?, ?, ?, ?, ?, ?)',
            [promo.title, promo.subtitle, promo.image_url, promo.link, promo.active, promo.sort_order]
        );
    }

    console.log(`\n✅ Seeded ${products.length} strains and ${promotions.length} promotions`);
    console.log('🏁 Done! IslandLeaf is stocked and ready.\n');
    process.exit(0);
}

seed().catch(err => {
    console.error('Seed failed:', err);
    process.exit(1);
});
