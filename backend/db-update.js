const pool = require("./src/config/db");

async function runMigration() {
  try {
    console.log("Adding xp, streak, and ai_summary fields to students table...");
    await pool.query("ALTER TABLE students ADD COLUMN IF NOT EXISTS xp INT DEFAULT 0;");
    await pool.query("ALTER TABLE students ADD COLUMN IF NOT EXISTS streak INT DEFAULT 0;");
    await pool.query("ALTER TABLE students ADD COLUMN IF NOT EXISTS github_username VARCHAR(255);");
    await pool.query("ALTER TABLE students ADD COLUMN IF NOT EXISTS current_quest TEXT;");
    await pool.query("ALTER TABLE students ADD COLUMN IF NOT EXISTS quest_date DATE;");
    await pool.query("ALTER TABLE students ADD COLUMN IF NOT EXISTS quest_completed BOOLEAN DEFAULT false;");
    console.log("Migration complete!");
    process.exit(0);
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  }
}

runMigration();
