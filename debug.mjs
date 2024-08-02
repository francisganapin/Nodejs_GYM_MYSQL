import express from 'express';
import mysql from 'mysql2/promise';

const app = express();
const port = 3000;

// Create MySQL connection pool
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "mydb"
});

// Serve static files (like HTML) from the 'public' directory
app.use(express.static('public'));

// API route to get data from MySQL
app.get('/data', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM customers');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).send('Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
