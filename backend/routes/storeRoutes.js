const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.use(authMiddleware);

// Admin only can add stores
router.post('/', roleMiddleware(['admin']), storeController.addStore);

// Admin and Normal Users can view stores (owner can too optionally but not specified)
router.get('/', roleMiddleware(['admin', 'user']), storeController.getStores);

module.exports = router;
