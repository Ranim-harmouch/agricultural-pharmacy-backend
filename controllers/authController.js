
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../config/db.js';

// Helper to create JWT
const generateToken = (user) => {
  return jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
};

// Register
const register = (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });
    if (results.length > 0) return res.status(409).json({ message: 'Email already in use' });

    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role],
      (err) => {
        if (err) return res.status(500).json({ message: 'Registration failed', error: err });
        return res.status(201).json({ message: 'User registered successfully' });
      }
    );
  });
};

// Login
const login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: 'Email and password are required' });

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });
    if (results.length === 0) return res.status(401).json({ message: 'Invalid credentials' });

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken(user);
    res.cookie('token', token, {
      httpOnly: true,
      //secure: true,
      //sameSite: "None",
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      message: 'Login successful'
    });
  });
};



// Logout
const logout = (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logged out successfully' });
};

// Get all users
const getAllUsers = (req, res) => {
  db.query('SELECT id, name, email, role FROM users', (err, results) => {
    if (err) return res.status(500).json({ message: 'Failed to retrieve users', error: err });
    res.status(200).json({ data: results, message: 'Users retrieved successfully' });
  });
};

// Get user by ID
const getUserById = (req, res) => {
  const userId = req.params.id;
  db.query('SELECT id, name, email, role FROM users WHERE id = ?', [userId], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error retrieving user', error: err });
    if (results.length === 0) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ data: results[0], message: 'User retrieved successfully' });
  });
};

// Update user
const updateUser = async (req, res) => {
  const userId = req.params.id;
  const { name, email, password, role } = req.body;

  const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

  let query = 'UPDATE users SET ';
  const fields = [];
  const values = [];

  if (name) {
    fields.push('name = ?');
    values.push(name);
  }
  if (email) {
    fields.push('email = ?');
    values.push(email);
  }
  if (hashedPassword) {
    fields.push('password = ?');
    values.push(hashedPassword);
  }
  if (role) {
    fields.push('role = ?');
    values.push(role);
  }

  if (fields.length === 0) {
    return res.status(400).json({ message: 'No fields provided for update' });
  }

  query += fields.join(', ') + ' WHERE id = ?';
  values.push(userId);

  db.query(query, values, (err, result) => {
    if (err) return res.status(500).json({ message: 'Update failed', error: err });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ message: 'User updated successfully' });
  });
};

// Delete user
const deleteUser = (req, res) => {
  const userId = req.params.id;
  db.query('DELETE FROM users WHERE id = ?', [userId], (err, result) => {
    if (err) return res.status(500).json({ message: 'Failed to delete user', error: err });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ message: 'User deleted successfully' });
  });
};

export {
  register,
  login,
  logout,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
