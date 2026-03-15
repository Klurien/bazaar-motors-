import bcrypt from 'bcryptjs';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(path.join(__dirname, 'db', 'ecommerce.db'));

const username = 'admin';
const password = 'password';
const role = 'admin';

const hashedPassword = bcrypt.hashSync(password, 10);
const existingUser = db.prepare('SELECT * FROM users WHERE username = ?').get(username);

if (existingUser) {
    db.prepare('UPDATE users SET password = ?, role = ? WHERE username = ?').run(hashedPassword, role, username);
    console.log('Admin user password reset successfully.');
} else {
    db.prepare('INSERT INTO users (username, password, role) VALUES (?, ?, ?)').run(username, hashedPassword, role);
    console.log('Admin user created successfully!');
}

db.close();
