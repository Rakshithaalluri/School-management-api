const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS schools (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL
  );`);

  const stmt = db.prepare('INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)');
  const samples = [
    ['ABC Public School', 'Main St, City', 17.385044, 78.486671],
    ['Green Valley School', 'Park Rd', 17.390000, 78.480000],
    ['St. Marys', 'Lake St', 17.380000, 78.495000]
  ];
  for (const s of samples) stmt.run(...s);
  stmt.finalize();
});

db.close(() => console.log('Seed complete.'));
