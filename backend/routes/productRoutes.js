const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protectAdmin, optionalAuth } = require('../middleware/authMiddleware');

router.get('/', optionalAuth, getProducts);
router.get('/:slug', getProductBySlug);
router.post('/', protectAdmin, createProduct);
router.put('/:id', protectAdmin, updateProduct);
router.delete('/:id', protectAdmin, deleteProduct);

module.exports = router;

