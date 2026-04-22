const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json()); // Allows us to read data sent from the app

// 1. Connect to the MySQL Database using your .env file
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Test the connection
db.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL Database!!! 🎉');
    connection.release();
  }
});

// --- API ROUTES (The links your app will talk to) ---

// Get all medicines for the Dashboard
app.get('/api/medicines', (req, res) => {
  db.query('SELECT * FROM medicines ORDER BY created_at DESC', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Add a new medicine from the Add Screen
app.post('/api/medicines', (req, res) => {
  const { name, dosage, time } = req.body;
  const query = 'INSERT INTO medicines (name, dosage, time, stock) VALUES (?, ?, ?, 10)';
  
  db.query(query, [name, dosage, time], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: "Medicine saved successfully!" });
  });
});

// 3. Mark medicine as taken (Reduce stock by 1)
app.put('/api/medicines/:id/take', (req, res) => {
  const medicineId = req.params.id;
  const query = 'UPDATE medicines SET stock = stock - 1 WHERE id = ? AND stock > 0';
  
  db.query(query, [medicineId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.affectedRows === 0) return res.status(400).json({ message: "Out of stock or not found!" });
    res.json({ message: "Medicine taken successfully!" });
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});