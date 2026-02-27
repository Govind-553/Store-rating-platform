const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.use(authMiddleware);

// Normal user submits/updates rating
router.post('/', roleMiddleware(['user']), ratingController.submitRating);

// Store owner gets their dashboard
router.get('/owner-dashboard', roleMiddleware(['owner']), ratingController.getOwnerDashboard);

module.exports = router;
