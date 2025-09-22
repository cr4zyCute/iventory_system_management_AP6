const db = require('../db');

// NOTE: For production, store hashed passwords (e.g., bcrypt). This example uses plain text for simplicity.
exports.login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const { rows } = await db.query(
      'SELECT id, username, password_hash FROM users WHERE username = $1 LIMIT 1',
      [username]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const user = rows[0];

    // If you stored bcrypt hashes, use bcrypt.compare(password, user.password_hash)
    const isValid = password === user.password_hash; // TEMP: plain text compare

    if (!isValid) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Optionally sign a JWT here and return it
    return res.json({
      message: 'Login successful',
      user: { id: user.id, username: user.username },
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Server error during login' });
  }
};
