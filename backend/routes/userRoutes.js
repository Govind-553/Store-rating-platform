const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.use(authMiddleware);
router.use(roleMiddleware(['admin']));

router.post('/', userController.addUser);
router.get('/', userController.getUsers);
router.get('/dashboard', userController.getDashboardStats);
router.get('/:id', userController.getUserDetails);

module.exports = router;
