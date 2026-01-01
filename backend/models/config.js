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
    main_price INTEGER NOT NULL,
    image_url TEXT DEFAULT 'default-service.jpg'
  )`);

  db.run(`PRAGMA foreign_keys = ON`); // включается защита
  // service_id - внешний ключ ссылается на id в таблице services
  //
  // ON DELETE CASCADE - каскадное удаление
  // 1. DELETE FROM services WHERE id = 3;
  // 2. SQLite автоматически: DELETE FROM prices WHERE service_id = 3;

  db.run(`CREATE TABLE IF NOT EXISTS prices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    service_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    price INTEGER NOT NULL,
    image_url TEXT,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    phone TEXT,
    telegram TEXT,
    whatsapp TEXT,
    address TEXT,
    map_url TEXT
  )`);

  //хэш bcrypt + role user/admin
  db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL, 
  role TEXT DEFAULT 'admin'
  );`);

  db.run(`CREATE TABLE IF NOT EXISTS zayavki (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  client TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  service_id INTEGER,
  commentary TEXT,
  status BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (service_id) REFERENCES services(id)
  )`);
});

module.exports = db;
