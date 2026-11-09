const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrders,
  getDashboardStats,
} = require('../controllers/orderController');
const { protectAdmin, optionalAuth } = require('../middleware/authMiddleware');

router.post('/', createOrder);
router.get('/', optionalAuth, getOrders);
router.get('/stats', getDashboardStats);

module.exports = router;

