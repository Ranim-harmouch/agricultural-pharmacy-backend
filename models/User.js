
import db from '../config/db.js';
import bcrypt from 'bcrypt';

// Find user by email
const findByEmail = (email, callback) => {
  db.query('SELECT * FROM users WHERE email = ?', [email], callback);
};

// Find user by ID
const findById = (id, callback) => {
  db.query('SELECT id, name, email, role FROM users WHERE id = ?', [id], callback);
};

// Get all users
const findAll = (callback) => {
  db.query('SELECT id, name, email, role FROM users', callback);
};

// Create a new user
const create = async (user, callback) => {
  const hashedPassword = await bcrypt.hash(user.password, 10);
  db.query(
    'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
    [user.name, user.email, hashedPassword, user.role],
    callback
  );
};

// Update a user
const update = async (id, userData, callback) => {
  let query = 'UPDATE users SET ';
  const fields = [];
  const values = [];

  if (userData.name) {
    fields.push('name = ?');
    values.push(userData.name);
  }
  if (userData.email) {
    fields.push('email = ?');
    values.push(userData.email);
  }
  if (userData.password) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    fields.push('password = ?');
    values.push(hashedPassword);
  }
  if (userData.role) {
    fields.push('role = ?');
    values.push(userData.role);
  }

  if (fields.length === 0) return callback(null, { affectedRows: 0 });

  query += fields.join(', ') + ' WHERE id = ?';
  values.push(id);

  db.query(query, values, callback);
};

// Delete a user
const remove = (id, callback) => {
  db.query('DELETE FROM users WHERE id = ?', [id], callback);
};

export {
  findByEmail,
  findById,
  findAll,
  create,
  update,
  remove,
};
