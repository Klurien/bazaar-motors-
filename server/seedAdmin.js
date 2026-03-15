import bcrypt from 'bcryptjs';
import db, { initDB } from './db/db.js';

const seed = async () => {
    try {
        // Ensure tables exist first
        await initDB();

        if (!db) {
            console.error('Error: TIDB_HOST is not set in .env file. Please configure TiDB connection first.');
            process.exit(1);
        }

        const username = 'admin';
        const password = 'password';
        const role = 'admin';

        console.log(`Checking for existing admin user: ${username}...`);
        const [users] = await db.query('SELECT * FROM users WHERE username = ?', [username]);

        if (users.length > 0) {
            console.log('Admin user already exists.');
        } else {
            console.log('Creating admin user...');
            const hashedPassword = await bcrypt.hash(password, 10);
            await db.execute(
                'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
                [username, hashedPassword, role]
            );
            console.log('✅ Admin user created successfully!');
            console.log('-------------------------');
            console.log(`Username: ${username}`);
            console.log(`Password: ${password}`);
            console.log('-------------------------');
        }
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding admin:', error);
        process.exit(1);
    }
};

seed();
