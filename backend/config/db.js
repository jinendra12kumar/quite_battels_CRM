const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'wear_your_battles',
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 15,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000,
});

// Test connection on module load
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log(`[MySQL] Connected successfully to database "${process.env.DB_NAME || 'wear_your_battles'}"`);
    connection.release();
  } catch (err) {
    console.error('[MySQL Connection Error]:', err.message);
  }
})();

module.exports = pool;

