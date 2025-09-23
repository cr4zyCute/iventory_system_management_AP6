const db = require('../../database');
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    console.log('Attempting login for:', email);
    
    const { rows } = await db.query(
      'SELECT id, email, password_hash, role, first_name, last_name, is_active FROM users WHERE email = $1 AND is_active = true LIMIT 1',
      [email]
    );

    console.log('Database query result:', rows.length > 0 ? 'User found' : 'User not found');

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = rows[0];
    console.log('User data:', { id: user.id, email: user.email, role: user.role });

    // Plain text password comparison only
    const isValid = password === user.password_hash;
    console.log('Password validation:', isValid ? 'Success' : 'Failed');

    if (!isValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Update last login timestamp
    await db.query(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
      [user.id]
    );

    // Return user data with role information
    const responseData = {
      message: 'Login successful',
      user: { 
        id: user.id, 
        email: user.email,
        role: user.role,
        firstName: user.first_name,
        lastName: user.last_name
      },
    };
    
    console.log('🚀 Backend sending response:', JSON.stringify(responseData, null, 2));
    return res.json(responseData);
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ 
      message: 'Server error during login',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};
