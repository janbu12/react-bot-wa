const Database = require("better-sqlite3");

// Buat atau buka database
const db = new Database("./database.sqlite", { verbose: console.log });

// Buat tabel jika belum ada
db.exec(`
  CREATE TABLE IF NOT EXISTS commands (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    prefix TEXT NOT NULL,
    command TEXT NOT NULL,
    response TEXT NOT NULL,
    description TEXT
  )
`);

db.exec(`
    CREATE TABLE IF NOT EXISTS logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sender TEXT,
        name TEXT,
        message TEXT,
        response TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`)

module.exports = db;
