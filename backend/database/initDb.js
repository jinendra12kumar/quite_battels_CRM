require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function initDatabase() {
  const dbName = process.env.DB_NAME || 'QUIET_BATTLESDB';
  console.log(`Initializing QUIET BATTLES™ MySQL Database "${dbName}"...`);
  
  const { DB_HOST, DB_USER, DB_PASSWORD, DB_PORT } = process.env;

  try {
    // 1. Initial connection without database selected to ensure DB exists
    const connection = await mysql.createConnection({
      host: DB_HOST || 'localhost',
      user: DB_USER || 'root',
      password: DB_PASSWORD || '',
      port: Number(DB_PORT) || 3306,
      multipleStatements: true,
    });

    console.log(`Ensuring database \`${dbName}\` exists...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    await connection.query(`USE \`${dbName}\`;`);

    const schemaPath = path.join(__dirname, 'schema.sql');
    let schemaSql = fs.readFileSync(schemaPath, 'utf8');
    // Strip any hardcoded CREATE/USE statements so it strictly uses configured dbName
    schemaSql = schemaSql.replace(/CREATE DATABASE IF NOT EXISTS `[^`]+`[^;]*;/gi, '');
    schemaSql = schemaSql.replace(/USE `[^`]+`;/gi, '');

    console.log('Executing table creation schema...');
    await connection.query(schemaSql);
    console.log(`Database "${dbName}" and tables created successfully!`);

    await connection.end();
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  initDatabase();
}

module.exports = initDatabase;

