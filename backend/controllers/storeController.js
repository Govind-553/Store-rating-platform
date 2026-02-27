const db = require('../config/db');

exports.addStore = async (req, res) => {
  try {
    const { name, email, address, owner_id } = req.body;

    if (!name || !email || !address) {
      return res.status(400).json({ error: 'Name, email, and address are required' });
    }

    if (name.length > 255 || email.length > 255 || address.length > 400) {
      return res.status(400).json({ error: 'Field length exceeded' });
    }

    if (owner_id) {
      const ownerCheck = await db.query('SELECT role FROM users WHERE id = ?', [owner_id]);
      if (ownerCheck.length === 0) {
        return res.status(400).json({ error: 'Owner user not found' });
      }
      if (ownerCheck[0].role !== 'owner') {
        return res.status(400).json({ error: 'Assigned user must be an owner' });
      }
    }

    const result = await db.query(
      'INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)',
      [name, email, address, owner_id || null]
    );

    res.status(201).json({ 
      store: { id: result.insertId, name, email, address, owner_id: owner_id || null, overall_rating: 0 }, 
      message: 'Store added successfully' 
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getStores = async (req, res) => {
  try {
    const { sortBy = 'name', order = 'asc', name, address } = req.query;
    const userId = req.user.id;
    const userRole = req.user.role; // Extract role from request

    const validSortFields = ['name', 'address', 'overall_rating'];
    const validOrderDirections = ['asc', 'desc'];

    const sortField = validSortFields.includes(sortBy.toLowerCase()) ? sortBy.toLowerCase() : 'name';
    const sortOrder = validOrderDirections.includes(order.toLowerCase()) ? order.toUpperCase() : 'ASC';

    let queryStr = `
      SELECT 
        s.id, 
        s.name, 
        s.email, 
        s.address, 
        CAST(COALESCE((SELECT AVG(rating) FROM ratings WHERE store_id = s.id), 0) AS DECIMAL(10,1)) as overall_rating, 
        s.owner_id 
    `;

    // Normal users get their submitted rating too
    if (userRole === 'user') {
      queryStr += `, r.rating as user_rating `;
    }

    queryStr += ` FROM stores s `;

    if (userRole === 'user') {
      queryStr += ` LEFT JOIN ratings r ON s.id = r.store_id AND r.user_id = ? `;
    }

    queryStr += ` WHERE 1=1 `;
    let values = userRole === 'user' ? [userId] : [];

    if (name) {
      queryStr += ` AND s.name LIKE ? `;
      values.push(`%${name}%`);
    }

    if (address) {
      queryStr += ` AND s.address LIKE ? `;
      values.push(`%${address}%`);
    }

    queryStr += ` ORDER BY ${sortField === 'overall_rating' ? 'overall_rating' : `s.${sortField}`} ${sortOrder} `;

    const storesResult = await db.query(queryStr, values);
    res.json(storesResult);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
