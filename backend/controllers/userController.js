const db = require('../config/db');
const bcrypt = require('bcrypt');
const { validateSignup } = require('../utils/validation');

exports.addUser = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;

    const validationErrors = validateSignup(name, email, password, address);
    if (validationErrors.length > 0) {
      return res.status(400).json({ errors: validationErrors });
    }

    if (!['admin', 'user', 'owner'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const userExist = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (userExist.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await db.query(
      'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, address, role]
    );

    res.status(201).json({ 
      user: { id: result.insertId, name, email, address, role }, 
      message: 'User created successfully' 
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getUsers = async (req, res) => {
  try {
    const { sortBy = 'id', order = 'asc', name, email, address, role } = req.query;

    const validSortFields = ['name', 'email', 'address', 'role', 'id'];
    const validOrderDirections = ['asc', 'desc'];

    const sortField = validSortFields.includes(sortBy.toLowerCase()) ? sortBy.toLowerCase() : 'id';
    const sortOrder = validOrderDirections.includes(order.toLowerCase()) ? order.toUpperCase() : 'ASC';

    let queryStr = 'SELECT id, name, email, address, role FROM users WHERE 1=1';
    let values = [];

    if (name) {
      queryStr += ` AND name LIKE ?`;
      values.push(`%${name}%`);
    }
    if (email) {
      queryStr += ` AND email LIKE ?`;
      values.push(`%${email}%`);
    }
    if (address) {
      queryStr += ` AND address LIKE ?`;
      values.push(`%${address}%`);
    }
    if (role) {
      queryStr += ` AND role = ?`;
      values.push(role);
    }

    queryStr += ` ORDER BY ${sortField} ${sortOrder}`;

    const usersResult = await db.query(queryStr, values);
    res.json(usersResult); // mysql returns array of rows directly
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getUserDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const userResult = await db.query('SELECT id, name, email, address, role FROM users WHERE id = ?', [id]);
    
    if (userResult.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    let userDetails = userResult[0];

    if (userDetails.role === 'owner') {
      const storeResult = await db.query('SELECT name as store_name, overall_rating FROM stores WHERE owner_id = ?', [id]);
      if (storeResult.length > 0) {
        userDetails.store = storeResult[0];
      }
    }

    res.json(userDetails);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const usersCount = await db.query('SELECT COUNT(*) as count FROM users');
    const storesCount = await db.query('SELECT COUNT(*) as count FROM stores');
    const ratingsCount = await db.query('SELECT COUNT(*) as count FROM ratings');

    res.json({
      totalUsers: usersCount[0].count,
      totalStores: storesCount[0].count,
      totalRatings: ratingsCount[0].count,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
