const fs = require('fs');
const path = require('path');
const pool = require('./src/config/db');

async function runSQLFile() {
  try {
    const sqlPath = path.join(__dirname, 'add-notifications-table.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('Running add-notifications-table.sql migration...');
    await pool.query(sql);
    console.log('Migration completed successfully! Notifications table is ready.');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

runSQLFile();
