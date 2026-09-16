const fs = require('fs');
const path = require('path');
const { pool } = require('../src/config/db');

async function initDb() {
  console.log('🔄 Initializing HRMS PostgreSQL Database...');
  
  try {
    const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    const seedSql = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8');

    console.log('📜 Executing schema.sql...');
    await pool.query(schemaSql);
    console.log('✅ Schema tables created successfully.');

    console.log('🌱 Executing seed.sql...');
    await pool.query(seedSql);
    console.log('✅ Seed data inserted successfully.');

    console.log('🎉 Database initialization complete!');
  } catch (err) {
    console.error('❌ Error initializing database:', err.message);
  } finally {
    await pool.end();
  }
}

initDb();
