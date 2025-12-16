require("dotenv").config();
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const dbPath = path.resolve(__dirname, "db", process.env.DB_PATH);

console.log("путь до базы: ", dbPath);
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    main_price INTEGER NOT NULL
  )`);

  db.run(`PRAGMA foreign_keys = ON`);

  db.run(`CREATE TABLE IF NOT EXISTS prices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    service_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    price INTEGER NOT NULL,
    image_url TEXT,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
  )`);
});

module.exports = db;
