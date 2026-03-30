import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
dotenv.config();

const app = express();

const IP = process.env.REACT_APP_API_URL;

// CORS Configuration
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    '${IP}:3000',
    '${IP}:3001',
  ].filter(Boolean), // removes any undefined values if IP is not set
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// DB connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

// Test Database connection
async function testDatabaseConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Database connection SUCCESS')
    connection.release();
    return true;
  } catch (err) {
    console.error('Database connection FAILED:', err.message);
    return false;
  }
}

// Health check endpoint
// Allows checking health of db connection from local machines
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    server: 'running',
    timestamp: new Date().toISOString()
  });
});

// Test database endpoint
app.get('/api/db-test', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 as test, NOW() as time');
    res.json({
      success: true,
      database: 'connected',
      result: rows[0]
    });
  } catch (err) {
    console.error('Database test ERROR:', err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});


// register /api/posts
app.post('/api/posts', async (req, res) => {
  const { artistName, venue, rating, content } = req.body;

  // Basic server-side validation
  if (!artistName || !rating) {
    return res.status(400).json({ error: 'Artist name and rating are required.' });
  }

  try {
    const [result] = await pool.execute(
      `INSERT INTO posts (artist_name, venue, rating, content) VALUES (?, ?, ?, ?)`,
      [artistName, venue, rating, content]
    );
    res.status(201).json({ success: true, postId: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error.' });
  }
});

// POST /api/register
app.post('/api/register', async (req, res) => {
  const { email, name, password } = req.body;



  // Basic server-side validation
  if (!email || !name || !password) {
    return res.status(400).json({ error: 'All fields are required.' });
  }



  // check for existing email (before hashing)
  try {
    const [existing] = await pool.execute(
    `SELECT id FROM accounts WHERE email = ?`,
    [email]
  );

   if (existing.length > 0) {
    return res.status(400).json({ error: 'Email already in use.' });
  }

  // only hash if email is free
  const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.execute(
        `INSERT INTO accounts (email, name, password) VALUES (?, ?, ?)`,
        [email, name, hashedPassword]
    );
    res.status(201).json({ success: true, accountId: result.insertId });
    } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error.' });
    }
});

// POST /api/login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;


  // Basic server-side validation
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const [result] = await pool.execute(
      `SELECT * FROM accounts WHERE email = ?`,
      [email]
    );

    if (result.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const user = result[0];

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const { password: _, ...safeUser } = user;
    res.json({ success: true, user: safeUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error.' });
  }
});

app.get('/api/posts', async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM posts");
  res.json(rows);
});







const PORT = 3001;

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log('Server running on port '+PORT);
  console.log('Local: http://localhost:'+PORT);
  console.log('Network: '+IP+':'+PORT)
  console.log('CORS enabled for:', corsOptions.origin);
});