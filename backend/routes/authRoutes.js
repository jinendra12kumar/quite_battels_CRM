const express = require('express');
const router = express.Router();
const { login, getProfile } = require('../controllers/authController');
const { protectAdmin } = require('../middleware/authMiddleware');

router.post('/login', login);
router.get('/profile', protectAdmin, getProfile);

module.exports = router;

