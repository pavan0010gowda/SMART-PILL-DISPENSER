require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const twilio = require('twilio'); // ADD THIS
// Initialize the Twilio robot using your secret keys
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
require('dotenv').config();
const cron = require('node-cron');
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
// ==========================================
// 🚨 THE 5-MINUTE ESCALATION SYSTEM 🚨
// ==========================================

// This runs exactly once every minute ('* * * * *')
cron.schedule('* * * * *', () => {
    // 1. Get the current time
    const now = new Date();
    
    // 2. Look 5 minutes into the past
    const fiveMinutesAgo = new Date(now.getTime() - (5 * 60 * 1000));

    // 3. Format it to match your database (e.g., "09:30 AM")
    let hours = fiveMinutesAgo.getHours();
    let minutes = fiveMinutesAgo.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    
    // Add leading zero to minutes if needed (e.g., 9 -> 09)
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    
    // Add leading zero to hours to match app format perfectly
    const formattedHours = hours < 10 ? '0' + hours : hours;

    const targetTime = `${formattedHours}:${formattedMinutes} ${ampm}`;

    // 4. Ask the database if any medicines were scheduled for this exact time
    const query = "SELECT * FROM medicines WHERE time = ?";
    
    db.query(query, [targetTime], (err, results) => {
        if (err) {
            console.error("Cron Database Error:", err);
            return;
        }

        if (results.length > 0) {
            results.forEach(med => {
                console.log(`\n🚨 MISSED MEDICATION: ${med.name}! Triggering SMS...`);
                
                // --- DEBUG TRACKER ---
                console.log(`Checking Twilio Keys... SID exists: ${!!process.env.TWILIO_ACCOUNT_SID}`);

                // 1. Initialize Twilio
                const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

                // 2. Fire the Emergency Text Message!
                twilioClient.messages.create({
                    body: `URGENT MEDICAL ALERT: A medication was missed! Medicine: ${med.name} (${med.dosage}). Scheduled for: ${med.time}. Please check on them immediately!`,
                    from: process.env.TWILIO_PHONE_NUMBER,
                    to: process.env.EMERGENCY_CONTACT_NUMBER
                })
                .then(message => {
                    console.log(`✅ SMS Delivered Successfully! Message ID: ${message.sid}\n`);
                })
                .catch(error => {
                    console.error(`❌ SMS Failed to send! Error:`, error.message);
                });
            });
        }
    });
});
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});