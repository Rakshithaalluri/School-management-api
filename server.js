require('dotenv').config();
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();

app.use(express.json());

const db = new sqlite3.Database('./database.db', (err) => {
  if (err) return console.error(err.message);
  console.log('✅ Connected to SQLite database');
});

// Create schools table if not exists
db.run(`
  CREATE TABLE IF NOT EXISTS schools (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL
  )
`);

app.post('/addSchool', (req, res) => {
  const { name, address, latitude, longitude } = req.body;

  // Validation
  if (!name || !address || isNaN(latitude) || isNaN(longitude)) {
    return res.status(400).json({ error: 'Invalid input data' });
  }

  const sql = 'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)';
  db.run(sql, [name, address, latitude, longitude], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'School added successfully', schoolId: this.lastID });
  });
});

app.get('/listSchools', (req, res) => {
  const { latitude, longitude } = req.query;

  if (isNaN(latitude) || isNaN(longitude)) {
    return res.status(400).json({ error: 'Invalid coordinates' });
  }

  const sql = 'SELECT * FROM schools';
  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    // Calculate distance for each school
    const sortedSchools = rows.map(school => {
      const distance = getDistanceFromLatLonInKm(
        parseFloat(latitude), parseFloat(longitude),
        school.latitude, school.longitude
      );
      return { ...school, distance };
    }).sort((a, b) => a.distance - b.distance);

    res.json(sortedSchools);
  });
});

// Distance calculation function
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function deg2rad(deg) {
  return deg * (Math.PI/180);
}

// Start server
app.listen(process.env.PORT, () => {
  console.log(`🚀 Server running on port ${process.env.PORT}`);
});
