import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';
import bcrypt from 'bcryptjs';

dotenv.config();

const config = {
  host: process.env.TIDB_HOST,
  port: process.env.TIDB_PORT || 4000,
  user: process.env.TIDB_USER,
  password: process.env.TIDB_PASSWORD,
  database: process.env.TIDB_DATABASE,
  ssl: process.env.TIDB_SSL_CA ? {
    ca: fs.readFileSync(process.env.TIDB_SSL_CA)
  } : {
    minVersion: 'TLSv1.2',
    rejectUnauthorized: true
  }
};

let pool;

if (process.env.TIDB_HOST) {
  try {
    pool = mysql.createPool(config);
    console.log('🚀 TiDB Connection Pool Created.');
  } catch (err) {
    console.error('❌ Failed to create TiDB pool:', err.message);
  }
} else {
  console.warn('⚠️ TIDB_HOST environment variable not found. Database connections will fail.');
}

const dbWrapper = {
  async query(sql, params = []) {
    if (!pool) throw new Error('Database not configured. Set TIDB_HOST in Vercel environment.');
    return await pool.query(sql, params);
  },

  async execute(sql, params = []) {
    if (!pool) throw new Error('Database not configured. Set TIDB_HOST in Vercel environment.');
    return await pool.execute(sql, params);
  },

  async getConnection() {
    if (!pool) throw new Error('Database not configured. Set TIDB_HOST in Vercel environment.');
    return await pool.getConnection();
  },

  release() {
    // MySQL handles release on the connection object itself.
  }
};

export const initDB = async () => {
  if (!pool) return;
  console.log('Initializing Database Tables...');

  const tables = [
    `CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            role VARCHAR(50) DEFAULT 'user',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,
    `CREATE TABLE IF NOT EXISTS products (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            description TEXT,
            price DECIMAL(10,2) NOT NULL,
            category VARCHAR(100),
            stock INT DEFAULT 0,
            image_url VARCHAR(512),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,
    `CREATE TABLE IF NOT EXISTS product_images (
            id INT AUTO_INCREMENT PRIMARY KEY,
            product_id INT NOT NULL,
            url VARCHAR(512) NOT NULL,
            sort_order INT DEFAULT 0,
            FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
        )`,
    `CREATE TABLE IF NOT EXISTS promotions (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255),
            subtitle VARCHAR(255),
            image_url VARCHAR(512),
            link VARCHAR(512),
            active TINYINT(1) DEFAULT 1,
            sort_order INT DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,
    `CREATE TABLE IF NOT EXISTS orders (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT,
            total_amount DECIMAL(10,2) NOT NULL,
            status VARCHAR(50) DEFAULT 'Processing',
            shipping_address TEXT,
            payment_intent_id VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
        )`,
    `CREATE TABLE IF NOT EXISTS order_items (
            id INT AUTO_INCREMENT PRIMARY KEY,
            order_id INT NOT NULL,
            product_id INT NOT NULL,
            quantity INT NOT NULL DEFAULT 1,
            price_at_purchase DECIMAL(10,2) NOT NULL,
            FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
            FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
        )`
  ];

  const conn = await pool.getConnection();
  try {
    for (let sql of tables) {
      await conn.query(sql);
    }

    // Ensure Hailey admin user exists
    try {
      const hashedPassword = await bcrypt.hash('Hailey9(45)', 10);
      const [existing] = await conn.query('SELECT * FROM users WHERE username = ?', ['Hailey']);
      if (existing.length > 0) {
        await conn.query('UPDATE users SET password = ?, role = ? WHERE username = ?', [hashedPassword, 'admin', 'Hailey']);
      } else {
        await conn.execute('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', ['Hailey', hashedPassword, 'admin']);
      }
      console.log('✅ Hailey admin user ensured.');
    } catch (adminErr) {
      console.error('Error ensuring Hailey admin:', adminErr.message);
    }

    console.log('✅ TiDB Tables Initialized.');
  } finally {
    conn.release();
  }
};

export default dbWrapper;
