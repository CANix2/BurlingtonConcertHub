import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// DB connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
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

  const hashedPassword = await bcrypt.hash(password, 10);


  // check for existing email
  const [existing] = await pool.execute(
  `SELECT id FROM accounts WHERE email = ?`,
  [email]
    );

    if (existing.length > 0) {
    return res.status(400).json({ error: 'Email already in use.' });
  }

  try {
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







const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});