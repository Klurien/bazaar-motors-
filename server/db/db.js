import mysql from 'mysql2/promise';
import Database from 'better-sqlite3';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- TiDB Configuration ---
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
let isSQLite = false;
let sqliteDB;

if (process.env.TIDB_HOST) {
  try {
    pool = mysql.createPool(config);
    console.log('🚀 TiDB Connection Pool Created.');
  } catch (err) {
    console.error('❌ Failed to create TiDB pool:', err.message);
  }
}

// Fallback to SQLite if TiDB is not configured or fails
if (!pool) {
  console.warn('⚠️ TIDB_HOST not found. Falling back to local SQLite database.');
  isSQLite = true;
  sqliteDB = new Database(path.join(__dirname, 'ecommerce.db'));
}

// Smart Wrapper to make SQLite act like Promise-based MySQL
const dbWrapper = {
  async query(sql, params = []) {
    if (!isSQLite) return await pool.query(sql, params);

    // SQLite Fallback
    try {
      const rows = sqliteDB.prepare(sql).all(params);
      return [rows, null];
    } catch (err) {
      // Small translation for MySQL "id" vs SQLite "id" if needed, 
      // but standard SQL should be fine.
      throw err;
    }
  },

  async execute(sql, params = []) {
    if (!isSQLite) return await pool.execute(sql, params);

    // SQLite Fallback
    try {
      const info = sqliteDB.prepare(sql).run(params);
      return [{ insertId: info.lastInsertRowid, affectedRows: info.changes }, null];
    } catch (err) {
      throw err;
    }
  },

  async getConnection() {
    if (!isSQLite) return await pool.getConnection();
    return this; // Return self for SQLite since it's single-connection anyway
  },

  release() {
    // No-op for SQLite
  }
};

export const initDB = async () => {
  console.log('Initializing Database Tables...');

  const tables = [
    `CREATE TABLE IF NOT EXISTS users (
            id ${isSQLite ? 'INTEGER PRIMARY KEY AUTOINCREMENT' : 'INT AUTO_INCREMENT PRIMARY KEY'},
            username VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            role VARCHAR(50) DEFAULT 'user',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,
    `CREATE TABLE IF NOT EXISTS products (
            id ${isSQLite ? 'INTEGER PRIMARY KEY AUTOINCREMENT' : 'INT AUTO_INCREMENT PRIMARY KEY'},
            name VARCHAR(255) NOT NULL,
            description TEXT,
            price ${isSQLite ? 'REAL' : 'DECIMAL(10,2)'} NOT NULL,
            category VARCHAR(100),
            stock INT DEFAULT 0,
            image_url VARCHAR(512),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,
    `CREATE TABLE IF NOT EXISTS product_images (
            id ${isSQLite ? 'INTEGER PRIMARY KEY AUTOINCREMENT' : 'INT AUTO_INCREMENT PRIMARY KEY'},
            product_id INT NOT NULL,
            url VARCHAR(512) NOT NULL,
            sort_order INT DEFAULT 0,
            FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
        )`,
    `CREATE TABLE IF NOT EXISTS promotions (
            id ${isSQLite ? 'INTEGER PRIMARY KEY AUTOINCREMENT' : 'INT AUTO_INCREMENT PRIMARY KEY'},
            title VARCHAR(255),
            subtitle VARCHAR(255),
            image_url VARCHAR(512),
            link VARCHAR(512),
            active TINYINT(1) DEFAULT 1,
            sort_order INT DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`
  ];

  if (isSQLite) {
    tables.forEach(sql => sqliteDB.exec(sql));
    console.log('✅ SQLite Tables Initialized.');
  } else {
    const conn = await pool.getConnection();
    try {
      for (let sql of tables) {
        await conn.query(sql);
      }
      console.log('✅ TiDB Tables Initialized.');
    } finally {
      conn.release();
    }
  }
};

export default dbWrapper;
