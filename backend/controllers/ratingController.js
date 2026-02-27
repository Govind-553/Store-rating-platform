const db = require('../config/db');

exports.submitRating = async (req, res) => {
  try {
    const { storeId, rating } = req.body;
    const userId = req.user.id;

    if (!storeId || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Valid storeId and rating (1-5) are required' });
    }

    const storeCheck = await db.query('SELECT * FROM stores WHERE id = ?', [storeId]);
    if (storeCheck.length === 0) {
      return res.status(404).json({ error: 'Store not found' });
    }

    // Insert or update rating (MySQL Syntax)
    await db.query(
      `INSERT INTO ratings (user_id, store_id, rating) 
       VALUES (?, ?, ?) 
       ON DUPLICATE KEY UPDATE rating = VALUES(rating), updated_at = CURRENT_TIMESTAMP`,
      [userId, storeId, rating]
    );

    res.json({ message: 'Rating submitted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getOwnerDashboard = async (req, res) => {
  try {
    const ownerId = req.user.id;

    const storeResult = await db.query('SELECT * FROM stores WHERE owner_id = ?', [ownerId]);
    if (storeResult.length === 0) {
      return res.status(404).json({ error: 'No store associated with this owner' });
    }

    const store = storeResult[0];

    const { sortBy = 'u.name', order = 'asc' } = req.query;
    
    // Safety check for sorting
    const validSortFields = ['u.name', 'u.email', 'r.rating', 'r.updated_at'];
    const sortField = validSortFields.includes(sortBy.toLowerCase()) ? sortBy.toLowerCase() : 'u.name';
    const sortOrder = order.toLowerCase() === 'desc' ? 'DESC' : 'ASC';

    const ratingsResult = await db.query(
      `SELECT u.name, u.email, r.rating, r.updated_at 
       FROM ratings r 
       JOIN users u ON r.user_id = u.id 
       WHERE r.store_id = ?
       ORDER BY ${sortField} ${sortOrder}`,
      [store.id]
    );

    res.json({
      storeName: store.name,
      averageRating: store.overall_rating,
      ratings: ratingsResult // direct array for mysql
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
