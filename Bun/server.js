import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
dotenv.config();

const app = express();
const IP = process.env.REACT_APP_API_URL;
const JWT_SECRET = process.env.JWT_SECRET;

// CORS Configuration
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    `${IP}:3000`,
    `${IP}:3001`,
  ].filter(Boolean),
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// IMPORTANT: Log all incoming requests for debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});

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
    console.log('Database connection SUCCESS');
    connection.release();
    return true;
  } catch (err) {
    console.error('Database connection FAILED:', err.message);
    return false;
  }
}

// Health check endpoint
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

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Not authenticated.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    req.userEmail = decoded.email;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
};

// ============ POST ROUTES ============

// GET /api/posts - Get all posts (public)
app.get('/api/posts', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT p.*, a.name as author_name 
      FROM posts p 
      LEFT JOIN accounts a ON p.account_id = a.id 
      ORDER BY p.created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching posts:', err);
    res.status(500).json({ error: 'Database error.' });
  }
});

// GET /api/my-posts - Get authenticated user's posts
app.get('/api/my-posts', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT * FROM posts WHERE account_id = ? ORDER BY created_at DESC`,
      [req.userId]
    );
    res.json(rows);
  } catch (err) {
    console.error('Error fetching my posts:', err);
    res.status(500).json({ error: 'Database error.' });
  }
});

// POST /api/posts - Create a new post
app.post('/api/posts', authenticateToken, async (req, res) => {
  const { artist_name, venue, rating, content } = req.body;

  // Basic server-side validation
  if (!artist_name || !rating) {
    return res.status(400).json({ error: 'Artist name and rating are required.' });
  }

  try {
    const [result] = await pool.execute(
      `INSERT INTO posts (artist_name, venue, rating, content, account_id) VALUES (?, ?, ?, ?, ?)`,
      [artist_name, venue, rating, content || null, req.userId]
    );
    res.status(201).json({ success: true, postId: result.insertId });
  } catch (err) {
    console.error('Error creating post:', err);
    res.status(500).json({ error: 'Database error.' });
  }
});

// PUT /api/posts/:id - Update a post
app.put('/api/posts/:id', authenticateToken, async (req, res) => {
  const postId = req.params.id;
  const { artist_name, venue, rating, content } = req.body;

  console.log('PUT /api/posts/:id - Updating post:', { postId, artist_name, venue, rating, content });

  // Validation
  if (!artist_name || !rating) {
    return res.status(400).json({ error: 'Artist name and rating are required.' });
  }

  try {
    // Verify the post belongs to the user
    const [post] = await pool.execute(
      `SELECT account_id FROM posts WHERE id = ?`,
      [postId]
    );

    if (post.length === 0) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    if (post[0].account_id !== req.userId) {
      return res.status(403).json({ error: 'Not authorized to update this post.' });
    }

    // Update the post
    await pool.execute(
      `UPDATE posts 
       SET artist_name = ?, venue = ?, rating = ?, content = ? 
       WHERE id = ?`,
      [artist_name, venue || null, rating, content || null, postId]
    );

    // Get the updated post
    const [updatedPost] = await pool.execute(
      `SELECT id, artist_name, venue, rating, content, account_id, created_at 
       FROM posts WHERE id = ?`,
      [postId]
    );

    console.log('Post updated successfully:', updatedPost[0]);
    
    res.json({ 
      success: true, 
      message: 'Post updated successfully.',
      post: updatedPost[0]
    });
  } catch (err) {
    console.error('Error updating post:', err);
    res.status(500).json({ error: 'Database error: ' + err.message });
  }
});

// DELETE /api/posts/:id - Delete a post
app.delete('/api/posts/:id', authenticateToken, async (req, res) => {
  const postId = req.params.id;

  try {
    // First verify the post belongs to the user
    const [post] = await pool.execute(
      `SELECT account_id FROM posts WHERE id = ?`,
      [postId]
    );

    if (post.length === 0) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    if (post[0].account_id !== req.userId) {
      return res.status(403).json({ error: 'Not authorized to delete this post.' });
    }

    // Delete the post
    await pool.execute(
      `DELETE FROM posts WHERE id = ?`,
      [postId]
    );

    res.json({ success: true, message: 'Post deleted successfully.' });
  } catch (err) {
    console.error('Error deleting post:', err);
    res.status(500).json({ error: 'Database error.' });
  }
});

// ============ AUTH ROUTES ============

// POST /api/register
app.post('/api/register', async (req, res) => {
  const { email, name, password } = req.body;

  // Basic server-side validation
  if (!email || !name || !password) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    // Check for existing email
    const [existing] = await pool.execute(
      `SELECT id FROM accounts WHERE email = ?`,
      [email]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: 'Email already in use.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.execute(
      `INSERT INTO accounts (email, name, password) VALUES (?, ?, ?)`,
      [email, name, hashedPassword]
    );

    const token = jwt.sign({ id: result.insertId, email }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ success: true, accountId: result.insertId, token });
  } catch (err) {
    console.error('Registration error:', err);
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

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, user: safeUser, token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Database error.' });
  }
});

// GET /api/me - Verify token and get user info
app.get('/api/me', authenticateToken, (req, res) => {
  res.json({ valid: true, user: { id: req.userId, email: req.userEmail } });
});


app.get('/api/account', authenticateToken, async (req, res) => {
        const [result] = await pool.execute(
            'SELECT id, email, name FROM accounts WHERE id = ?',
            [req.userId]
        );
        res.json({ success: true, account: result[0] });
});

// update name and email
app.put('/api/account', authenticateToken, async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required.' });
  }

  try {
    // Check if email is already in use by another account
    const [existing] = await pool.execute(
      `SELECT id FROM accounts WHERE email = ? AND id != ?`,
      [email, req.userId]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: 'Email already in use by another account.' });
    }

    await pool.execute(
        'UPDATE accounts SET name = ?, email = ? WHERE id = ?',
        [name, email, req.userId]
    );
    res.json({ success: true, message: 'Account updated successfully.' });
    } catch (err) {
        console.error('Error updating account:', err);
        res.status(500).json({ error: 'Database error.' });
    }
});


// change password
app.put('/api/account/password', authenticateToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Both passwords are required.' });
  }
  try {
    const [result] = await pool.execute(
      `SELECT password FROM accounts WHERE id = ?`,
      [req.userId]
    );

    const passwordMatch = await bcrypt.compare(currentPassword, result[0].password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Current password is incorrect.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.execute(
      `UPDATE accounts SET password = ? WHERE id = ?`,
      [hashedPassword, req.userId]
    );

    res.json({ success: true, message: 'Password changed successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error.' });
  }
});

// Delete account
app.delete('/api/account', authenticateToken, async (req, res) => {
  try {
    await pool.execute(
      `DELETE FROM posts WHERE account_id = ?`,
      [req.userId]
    );

    await pool.execute(
      `DELETE FROM accounts WHERE id = ?`,
      [req.userId]
    );

    res.json({ success: true, message: 'Account deleted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error.' });
  }
});


// 404 handler for undefined routes
app.use((req, res) => {
  console.log('404 - Route not found:', req.method, req.path);
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({ error: 'Internal server error' });
});



// ============ START SERVER ============

const PORT = 3001;

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log('Server running on port ' + PORT);
  console.log('Local: http://localhost:' + PORT);
  console.log('Network: ' + IP + ':' + PORT);
  console.log('CORS enabled for:', corsOptions.origin);
});