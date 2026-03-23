import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import dotenv from 'dotenv';
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

// POST /api/posts
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

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});