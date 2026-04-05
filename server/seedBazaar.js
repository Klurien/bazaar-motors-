import './loadEnv.js';
import { initDB } from './db/db.js';
import db from './db/db.js';

const products = [
    // ═══ SUVs ═══════════════════════════════════════════════════════════════
    {
        name: 'Toyota Harrier Premium',
        make: 'Toyota',
        year: 2019,
        condition: 'Foreign Used',
        transmission: 'Automatic',
        engine_capacity: '2000cc Turbo',
        fuel_type: 'Petrol',
        mileage: 38000,
        auction_grade: '4.5/B',
        features: 'Panoramic Moonroof, JBL Premium Sound, Power Tailgate, Heads-Up Display, Lane Tracing Assist',
        description: 'Pearl White Premium package with full panoramic roof and JBL 9-speaker system. Turbo 2.0L delivers 231hp with excellent fuel economy. Verified auction grade 4.5/B — no accident history. Direct import from USS Tokyo.',
        price: 4750000,
        category: 'SUV',
        stock: 1,
        images: [
            'https://images.unsplash.com/photo-1621993202323-eb4e608f9e8a?auto=format&fit=crop&q=80&w=1200',
            'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&q=80&w=1200',
            'https://images.unsplash.com/photo-1616422285623-13ff0162193c?auto=format&fit=crop&q=80&w=1200'
        ]
    },
    {
        name: 'Lexus NX 300h F-Sport',
        make: 'Lexus',
        year: 2018,
        condition: 'Foreign Used',
        transmission: 'Automatic (CVT)',
        engine_capacity: '2500cc Hybrid',
        fuel_type: 'Hybrid',
        mileage: 52000,
        auction_grade: '4.5/A',
        features: 'F-Sport Package, Mark Levinson Audio, Adaptive Cruise, Pre-Collision Braking, Heated/Cooled Seats',
        description: 'Obsidian Black F-Sport with exclusive mesh grille, sport-tuned suspension, and aluminum pedals. Hybrid powertrain delivers 194hp combined while achieving 5.0L/100km. Mark Levinson 14-speaker surround system.',
        price: 5400000,
        category: 'SUV',
        stock: 1,
        images: [
            'https://images.unsplash.com/photo-1619405399517-d7fce0f13302?auto=format&fit=crop&q=80&w=1200',
            'https://images.unsplash.com/photo-1606611013016-969c19ba27a2?auto=format&fit=crop&q=80&w=1200',
            'https://images.unsplash.com/photo-1549317661-bd32c8ce0b6c?auto=format&fit=crop&q=80&w=1200'
        ]
    },
    {
        name: 'Toyota Land Cruiser Prado TX-L',
        make: 'Toyota',
        year: 2019,
        condition: 'Foreign Used',
        transmission: 'Automatic',
        engine_capacity: '2800cc Diesel Turbo',
        fuel_type: 'Diesel',
        mileage: 45000,
        auction_grade: '4.0/B',
        features: '7 Seater, Sunroof, Crawl Control, Multi-Terrain Select, 360° Camera, Kinetic Dynamic Suspension',
        description: 'Graphite Grey 2.8L Diesel Turbo with 177hp and 450Nm torque. Full-time 4WD with Torsen limited-slip centre diff. Toyota Safety Sense suite included. The ultimate adventure vehicle for Kenyan terrain.',
        price: 8900000,
        category: 'SUV',
        stock: 1,
        images: [
            'https://images.unsplash.com/photo-1594731804320-e1b0e9b1e5c0?auto=format&fit=crop&q=80&w=1200',
            'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&q=80&w=1200',
            'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1200'
        ]
    },
    {
        name: 'Mazda CX-5 25S L-Package',
        make: 'Mazda',
        year: 2019,
        condition: 'Foreign Used',
        transmission: 'Automatic (6-Speed)',
        engine_capacity: '2500cc',
        fuel_type: 'Petrol',
        mileage: 41000,
        auction_grade: '4.5/A',
        features: 'Nappa Leather, Bose Audio, 360° Camera, Wireless CarPlay, Heated Steering Wheel, Power Liftgate',
        description: 'Soul Red Crystal with Nappa leather L-Package. SKYACTIV-G 2.5L producing 190hp with i-ACTIV AWD. Kodo design with signature wing grille. One of the best-driving compact SUVs available.',
        price: 3800000,
        category: 'SUV',
        stock: 2,
        images: [
            'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&q=80&w=1200',
            'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&q=80&w=1200',
            'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&q=80&w=1200'
        ]
    },
    {
        name: 'Toyota RAV4 Adventure',
        make: 'Toyota',
        year: 2020,
        condition: 'Foreign Used',
        transmission: 'Automatic (8-Speed Direct Shift)',
        engine_capacity: '2000cc',
        fuel_type: 'Petrol',
        mileage: 28000,
        auction_grade: '4.5/S',
        features: 'Adventure Exclusive Styling, Dynamic Torque Vectoring AWD, Digital Rearview Mirror, Wireless Charging',
        description: 'Lunar Rock Adventure grade — the most rugged RAV4 ever made. Unique two-tone roof, increased ground clearance, and Dynamic Torque Vectoring AWD with rear driveline disconnect. Only 28,000km.',
        price: 4200000,
        category: 'SUV',
        stock: 1,
        images: [
            'https://images.unsplash.com/photo-1568844293986-8d0400f58128?auto=format&fit=crop&q=80&w=1200',
            'https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&q=80&w=1200',
            'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=1200'
        ]
    },

    // ═══ Sedans ═════════════════════════════════════════════════════════════
    {
        name: 'Toyota Crown RS Advance',
        make: 'Toyota',
        year: 2019,
        condition: 'Foreign Used',
        transmission: 'Automatic (10-Speed)',
        engine_capacity: '2000cc Turbo',
        fuel_type: 'Petrol',
        mileage: 35000,
        auction_grade: '4.5/A',
        features: 'RS Advance Package, Adaptive Variable Suspension, Toyota Connected Services, 360° Camera, Alcantara Sport Seats',
        description: 'Precieux Gris RS Advance — the sportiest Crown ever built. 2.0L twin-scroll turbo delivering 245hp through a 10-speed automatic. Connected navigation with DCM telematics. The executive sedan redefined.',
        price: 4100000,
        category: 'Sedan',
        stock: 1,
        images: [
            'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&q=80&w=1200',
            'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&q=80&w=1200',
            'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=1200'
        ]
    },
    {
        name: 'Subaru Impreza Sport',
        make: 'Subaru',
        year: 2019,
        condition: 'Foreign Used',
        transmission: 'Automatic (CVT)',
        engine_capacity: '2000cc',
        fuel_type: 'Petrol',
        mileage: 44000,
        auction_grade: '4.0/B',
        features: 'EyeSight Driver Assist, SI-Drive, Symmetrical AWD, Apple CarPlay, Heated Seats',
        description: 'Crystal Black Silica with EyeSight safety suite. Subaru\'s legendary Symmetrical AWD with Boxer engine delivers unmatched stability. Perfect for Nairobi\'s unpredictable roads and weekend getaways.',
        price: 2400000,
        category: 'Sedan',
        stock: 2,
        images: [
            'https://images.unsplash.com/photo-1626668011687-8a114cf5a34c?auto=format&fit=crop&q=80&w=1200',
            'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1200',
            'https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&q=80&w=1200'
        ]
    },

    // ═══ Luxury ═════════════════════════════════════════════════════════════
    {
        name: 'Mercedes-Benz C200 AMG Line',
        make: 'Mercedes-Benz',
        year: 2018,
        condition: 'Foreign Used',
        transmission: 'Automatic (9G-TRONIC)',
        engine_capacity: '2000cc Turbo',
        fuel_type: 'Petrol',
        mileage: 39000,
        auction_grade: '4.5/A',
        features: 'AMG Line, Burmester Sound, Widescreen Cockpit, Ambient Lighting (64 colours), COMAND Navigation',
        description: 'Polar White AMG Line with 9G-TRONIC transmission. 2.0L turbo producing 184hp. The interior features 64-colour ambient lighting, Burmester surround sound, and the iconic COMAND infotainment system.',
        price: 4800000,
        category: 'Luxury',
        stock: 1,
        images: [
            'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=1200',
            'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&q=80&w=1200',
            'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&q=80&w=1200'
        ]
    },
    {
        name: 'BMW 320i M-Sport',
        make: 'BMW',
        year: 2019,
        condition: 'Foreign Used',
        transmission: 'Automatic (8-Speed Steptronic)',
        engine_capacity: '2000cc Turbo',
        fuel_type: 'Petrol',
        mileage: 36000,
        auction_grade: '4.5/A',
        features: 'M-Sport Package, Live Cockpit Professional, Harman Kardon, M-Sport Brakes, Comfort Access',
        description: 'Mineral Grey M-Sport with aggressive front apron, 18" M-Sport wheels, and sport suspension. TwinPower Turbo 2.0L delivers 184hp. Live Cockpit Professional with gesture control. Pure driving pleasure.',
        price: 4500000,
        category: 'Luxury',
        stock: 1,
        images: [
            'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=1200',
            'https://images.unsplash.com/photo-1520050206274-a1ae44613e6d?auto=format&fit=crop&q=80&w=1200',
            'https://images.unsplash.com/photo-1543796076-c57b2bafd6b1?auto=format&fit=crop&q=80&w=1200'
        ]
    },
    {
        name: 'Lexus IS 300h F-Sport',
        make: 'Lexus',
        year: 2018,
        condition: 'Foreign Used',
        transmission: 'Automatic (E-CVT)',
        engine_capacity: '2500cc Hybrid',
        fuel_type: 'Hybrid',
        mileage: 48000,
        auction_grade: '4.0/A',
        features: 'F-Sport Exclusive, LFA-Inspired Gauges, Adaptive Suspension, Mark Levinson Audio, Sunroof',
        description: 'Ultrasonic Blue F-Sport with LFA-inspired movable instrument cluster and adaptive variable suspension. 2.5L hybrid delivers 223hp combined with class-leading efficiency. The driver\'s Lexus.',
        price: 3900000,
        category: 'Luxury',
        stock: 1,
        images: [
            'https://images.unsplash.com/photo-1583267746897-2cf415887172?auto=format&fit=crop&q=80&w=1200',
            'https://images.unsplash.com/photo-1549317661-bd32c8ce0b6c?auto=format&fit=crop&q=80&w=1200',
            'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=1200'
        ]
    },

    // ═══ Performance ════════════════════════════════════════════════════════
    {
        name: 'Nissan GT-R Premium Edition',
        make: 'Nissan',
        year: 2017,
        condition: 'Foreign Used',
        transmission: 'Automatic (6-Speed Dual Clutch)',
        engine_capacity: '3800cc Twin-Turbo V6',
        fuel_type: 'Petrol',
        mileage: 31000,
        auction_grade: '4.5/S',
        features: 'Bose Active Noise Cancellation, Launch Control, Bilstein DampTronic, Carbon Fibre Rear Spoiler, Titanium Exhaust',
        description: 'Ultimate Silver R35 with the legendary VR38DETT twin-turbo V6 producing 565hp. 0-100km/h in 2.7 seconds. ATTESA ET-S Pro AWD system with rear-mounted transaxle. Godzilla lives.',
        price: 12500000,
        category: 'Performance',
        stock: 1,
        images: [
            'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&q=80&w=1200',
            'https://images.unsplash.com/photo-1570071677470-c04398c90600?auto=format&fit=crop&q=80&w=1200',
            'https://images.unsplash.com/photo-1611016186353-652a23e0aa5e?auto=format&fit=crop&q=80&w=1200'
        ]
    },

    // ═══ Pickup ═════════════════════════════════════════════════════════════
    {
        name: 'Toyota Hilux Invincible X',
        make: 'Toyota',
        year: 2020,
        condition: 'Foreign Used',
        transmission: 'Automatic (6-Speed)',
        engine_capacity: '2800cc Diesel Turbo',
        fuel_type: 'Diesel',
        mileage: 32000,
        auction_grade: '4.5/A',
        features: 'Invincible X Pack, LED Headlamps, Auto LSD, Roll Bar, Bedliner, Differential Lock, Downhill Assist',
        description: 'Attitude Black Invincible X — the flagship Hilux. 2.8L D-4D turbo diesel producing 204hp and 500Nm. Legendary Toyota reliability meets premium comfort with leather seats, JBL audio, and full LED lighting.',
        price: 6200000,
        category: 'Pickup',
        stock: 1,
        images: [
            'https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&q=80&w=1200',
            'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&q=80&w=1200',
            'https://images.unsplash.com/photo-1612544448445-b8232cff3b6c?auto=format&fit=crop&q=80&w=1200'
        ]
    },

    // ═══ Hatchback ══════════════════════════════════════════════════════════
    {
        name: 'Volkswagen Golf GTI',
        make: 'Volkswagen',
        year: 2019,
        condition: 'Foreign Used',
        transmission: 'Automatic (7-Speed DSG)',
        engine_capacity: '2000cc Turbo',
        fuel_type: 'Petrol',
        mileage: 37000,
        auction_grade: '4.5/A',
        features: 'GTI Performance Pack, Virtual Cockpit, Dynaudio Excite, DCC Adaptive Chassis, Clark Tartan Seats',
        description: 'Pure White GTI Performance Pack with 245hp EA888 turbo engine through 7-speed DSG. The iconic red-stripe grille, Clark tartan sport seats, and electronically-controlled front differential. Hot hatch perfection.',
        price: 3500000,
        category: 'Hatchback',
        stock: 1,
        images: [
            'https://images.unsplash.com/photo-1619682817481-e994891cd1f5?auto=format&fit=crop&q=80&w=1200',
            'https://images.unsplash.com/photo-1471479917193-f00955256257?auto=format&fit=crop&q=80&w=1200',
            'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&q=80&w=1200'
        ]
    },
    {
        name: 'Honda Civic Type R',
        make: 'Honda',
        year: 2018,
        condition: 'Foreign Used',
        transmission: 'Manual (6-Speed)',
        engine_capacity: '2000cc VTEC Turbo',
        fuel_type: 'Petrol',
        mileage: 43000,
        auction_grade: '4.0/B',
        features: 'Brembo Brakes, Adaptive Dampers, Honda LogR Data Logger, Triple Exhaust, Rev-Match Control',
        description: 'Championship White FK8 with the legendary K20C1 VTEC Turbo pushing 320hp through the front wheels. Brembo 4-piston calipers, adaptive dampers in +R mode, and the iconic triple-tip exhaust. Track-day ready.',
        price: 4600000,
        category: 'Hatchback',
        stock: 1,
        images: [
            'https://images.unsplash.com/photo-1679239872245-9afcc9591fa7?auto=format&fit=crop&q=80&w=1200',
            'https://images.unsplash.com/photo-1606152421802-db97b9c7b11b?auto=format&fit=crop&q=80&w=1200',
            'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=1200'
        ]
    }
];

const promotions = [
    {
        title: 'New Arrivals: Fresh from Japan 🇯🇵',
        subtitle: 'Hand-picked vehicles with verified auction grades, direct from USS Tokyo & HAA Kobe. Now available at our Ruiru showroom.',
        image_url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2070&auto=format&fit=crop',
        link: '/products',
        active: 1,
        sort_order: 0
    },
    {
        title: 'Trade-In Your Old Vehicle',
        subtitle: 'Get the best market value for your current car. We accept trade-ins on all purchases — drive away same day.',
        image_url: 'https://images.unsplash.com/photo-1568844293986-8d0400f58128?q=80&w=2070&auto=format&fit=crop',
        link: '/products',
        active: 1,
        sort_order: 1
    }
];

async function seed() {
    console.log('🌱 Seeding Bazaar Motors with premium inventory...\n');
    await initDB();

    // Clear existing data
    await db.execute('DELETE FROM product_images');
    await db.execute('DELETE FROM products');
    await db.execute('DELETE FROM promotions');
    await db.execute('DELETE FROM categories');

    // Seed categories
    const categories = ['SUV', 'Sedan', 'Hatchback', 'Pickup', 'Luxury', 'Performance'];
    for (const name of categories) {
        await db.execute('INSERT INTO categories (name) VALUES (?)', [name]);
    }
    console.log(`📂 Seeded ${categories.length} categories`);

    // Seed products
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
        console.log(`  🚗 ${p.name} (${p.year} ${p.make}) — KES ${(p.price / 1000000).toFixed(1)}M`);
    }

    // Seed promotions
    for (const promo of promotions) {
        await db.execute(
            'INSERT INTO promotions (title, subtitle, image_url, link, active, sort_order) VALUES (?, ?, ?, ?, ?, ?)',
            [promo.title, promo.subtitle, promo.image_url, promo.link, promo.active, promo.sort_order]
        );
    }

    console.log(`\n✅ Seeded ${products.length} vehicles and ${promotions.length} promotions`);
    console.log('🏁 Done! Bazaar Motors is stocked and ready.\n');
    process.exit(0);
}

seed().catch(err => {
    console.error('Seed failed:', err);
    process.exit(1);
});
