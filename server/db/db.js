import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

// ─── Determine which database backend to use ─────────────────────────────────
// If TIDB_HOST is configured, use TiDB (mysql2). Otherwise, fall back to local SQLite.
const USE_TIDB = !!process.env.TIDB_HOST;

let dbWrapper;
let dbInitPromise;

if (USE_TIDB) {
  // ═══════════════════════════════════════════════════════════════════════════
  //  TiDB / MySQL Backend (Production / Vercel)
  // ═══════════════════════════════════════════════════════════════════════════
  const mysql = await import('mysql2/promise');
  const fs = await import('fs');

  let sslConfig = {
    minVersion: 'TLSv1.2',
    rejectUnauthorized: true
  };

  if (process.env.TIDB_SSL_CA) {
    try {
      if (process.env.TIDB_SSL_CA.startsWith('-----BEGIN CERTIFICATE-----')) {
        sslConfig.ca = process.env.TIDB_SSL_CA;
      } else {
        sslConfig.ca = fs.default.readFileSync(process.env.TIDB_SSL_CA);
      }
    } catch (err) {
      console.error('⚠️ Could not load TIDB_SSL_CA certificate:', err.message);
    }
  }

  const baseConfig = {
    host: process.env.TIDB_HOST,
    port: process.env.TIDB_PORT || 4000,
    user: process.env.TIDB_USER,
    password: process.env.TIDB_PASSWORD,
    ssl: sslConfig
  };

  const mysqlModule = mysql.default || mysql;
  // IMPORTANT: On TiDB Serverless, 'sys' is restricted. We MUST default to 'test' if no database is specified.
  const targetDb = (process.env.TIDB_DATABASE && process.env.TIDB_DATABASE !== 'sys')
    ? process.env.TIDB_DATABASE
    : 'test';

  const poolConfig = {
    ...baseConfig,
    database: targetDb,
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
    idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
  };

  // 2. Create the actual pool bound to the specific verified database
  const pool = mysqlModule.createPool(poolConfig);
  console.log(`🚀 TiDB Connection Pool Created for database: ${targetDb}`);

  dbWrapper = {
    _pool: pool,
    async query(sql, params = []) {
      return await pool.query(sql, params);
    },
    async execute(sql, params = []) {
      return await pool.execute(sql, params);
    },
    async getConnection() {
      return await pool.getConnection();
    }
  };
} else {
  // ═══════════════════════════════════════════════════════════════════════════
  //  SQLite Backend (Local Development)
  //  Wraps better-sqlite3 to mimic the mysql2/promise API so all controllers
  //  work unchanged with the same  const [rows] = await db.query(...)  pattern.
  // ═══════════════════════════════════════════════════════════════════════════
  const sqliteModuleName = 'better-sqlite3';
  const Database = (await import(sqliteModuleName)).default;
  const path = await import('path');
  const { fileURLToPath } = await import('url');

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.default.dirname(__filename);
  const dbPath = path.default.join(__dirname, 'ecommerce.db');

  const sqlite = new Database(dbPath);
  sqlite.pragma('journal_mode = WAL');
  sqlite.pragma('foreign_keys = ON');
  console.log(`🗄️  SQLite Database opened at ${dbPath}`);

  // Helper: convert SQLite results to match mysql2 format  [rows, fields]
  // For INSERT/UPDATE/DELETE, return  [{ affectedRows, insertId }, ...]
  // For SELECT, return  [rows, []]
  const wrapResult = (sql, result) => {
    const command = sql.trim().split(/\s/)[0].toUpperCase();
    if (command === 'SELECT' || command === 'SHOW') {
      // result is already an array of row objects from .all()
      return [result, []];
    }
    // For write operations, result is a RunResult { changes, lastInsertRowid }
    return [{ affectedRows: result.changes, insertId: Number(result.lastInsertRowid) }, []];
  };

  dbWrapper = {
    _sqlite: sqlite,
    async query(sql, params = []) {
      // Translate MySQL-specific syntax to SQLite equivalents
      const translatedSql = translateSql(sql);
      const command = translatedSql.trim().split(/\s/)[0].toUpperCase();
      if (command === 'SELECT' || command === 'SHOW') {
        const rows = sqlite.prepare(translatedSql).all(...params);
        return [rows, []];
      }
      const result = sqlite.prepare(translatedSql).run(...params);
      return [{ affectedRows: result.changes, insertId: Number(result.lastInsertRowid) }, []];
    },
    async execute(sql, params = []) {
      const translatedSql = translateSql(sql);
      const command = translatedSql.trim().split(/\s/)[0].toUpperCase();
      if (command === 'SELECT' || command === 'SHOW') {
        const rows = sqlite.prepare(translatedSql).all(...params);
        return [rows, []];
      }
      const result = sqlite.prepare(translatedSql).run(...params);
      return [{ affectedRows: result.changes, insertId: Number(result.lastInsertRowid) }, []];
    },
    async getConnection() {
      // Return an object that mimics mysql2 connection for initDB
      return {
        query: async (sql, params = []) => dbWrapper.query(sql, params),
        execute: async (sql, params = []) => dbWrapper.execute(sql, params),
        release: () => { /* no-op for SQLite */ }
      };
    }
  };
}

// ─── SQL Translation (MySQL → SQLite) ────────────────────────────────────────
function translateSql(sql) {
  let s = sql;
  // AUTO_INCREMENT → AUTOINCREMENT (SQLite handles this with INTEGER PRIMARY KEY)
  s = s.replace(/INT\s+AUTO_INCREMENT\s+PRIMARY\s+KEY/gi, 'INTEGER PRIMARY KEY AUTOINCREMENT');
  // VARCHAR(n) → TEXT
  s = s.replace(/VARCHAR\s*\(\d+\)/gi, 'TEXT');
  // DECIMAL(n,m) → REAL
  s = s.replace(/DECIMAL\s*\(\d+\s*,\s*\d+\)/gi, 'REAL');
  // TINYINT(1) → INTEGER
  s = s.replace(/TINYINT\s*\(\d+\)/gi, 'INTEGER');
  // TIMESTAMP DEFAULT CURRENT_TIMESTAMP → TEXT DEFAULT CURRENT_TIMESTAMP
  s = s.replace(/TIMESTAMP\s+DEFAULT\s+CURRENT_TIMESTAMP/gi, 'TEXT DEFAULT CURRENT_TIMESTAMP');
  // GREATEST(a, b) → MAX(a, b) (SQLite uses MAX)
  s = s.replace(/GREATEST\s*\(/gi, 'MAX(');
  return s;
}

// ─── Table Initialization ────────────────────────────────────────────────────
export const initDB = async () => {
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
        )`,
    `CREATE TABLE IF NOT EXISTS site_stats (
            id INT AUTO_INCREMENT PRIMARY KEY,
            stat_name VARCHAR(100) UNIQUE NOT NULL,
            stat_value INT DEFAULT 0,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`
  ];

  if (USE_TIDB) {
    const conn = await dbWrapper.getConnection();
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

        // Ensure visitors counter exists
        const [statExists] = await conn.query('SELECT * FROM site_stats WHERE stat_name = ?', ['visitors']);
        if (statExists.length === 0) {
          await conn.execute('INSERT INTO site_stats (stat_name, stat_value) VALUES (?, ?)', ['visitors', 0]);
        }

        console.log('✅ Hailey admin and site stats initialized.');
      } catch (adminErr) {
        console.error('Error during initDB additions:', adminErr.message);
      }

      console.log('✅ TiDB Tables Initialized.');
    } finally {
      conn.release();
    }
  } else {
    // SQLite path — use the wrapper directly
    for (let sql of tables) {
      await dbWrapper.query(sql);
    }

    // Ensure Hailey admin user exists
    try {
      const hashedPassword = await bcrypt.hash('Hailey9(45)', 10);
      const [existing] = await dbWrapper.query('SELECT * FROM users WHERE username = ?', ['Hailey']);
      if (existing.length > 0) {
        await dbWrapper.query('UPDATE users SET password = ?, role = ? WHERE username = ?', [hashedPassword, 'admin', 'Hailey']);
      } else {
        await dbWrapper.execute('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', ['Hailey', hashedPassword, 'admin']);
      }
      console.log('✅ Hailey admin user ensured.');
    } catch (adminErr) {
      console.error('Error ensuring Hailey admin:', adminErr.message);
    }

    console.log('✅ SQLite Tables Initialized.');
  }
};

dbInitPromise = initDB().catch(console.error);

export default {
  query: async (...args) => {
    await dbInitPromise;
    return dbWrapper.query(...args);
  },
  execute: async (...args) => {
    await dbInitPromise;
    return dbWrapper.execute(...args);
  },
  getConnection: async () => {
    await dbInitPromise;
    return dbWrapper.getConnection();
  }
};
