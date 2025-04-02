const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../utils/authMiddleware');

const router = express.Router();

router.post('/register', userController.register);
router.post('/login', userController.login);
router.put('/profile', authMiddleware, userController.updateProfile);

module.exports = router;
