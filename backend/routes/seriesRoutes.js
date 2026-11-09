const express = require('express');
const router = express.Router();
const {
  getSeries,
  getSeriesBySlug,
  createSeries,
  updateSeries,
  deleteSeries,
} = require('../controllers/seriesController');
const { protectAdmin, optionalAuth } = require('../middleware/authMiddleware');

router.get('/', optionalAuth, getSeries);
router.get('/:slug', getSeriesBySlug);
router.post('/', protectAdmin, createSeries);
router.put('/:id', protectAdmin, updateSeries);
router.delete('/:id', protectAdmin, deleteSeries);

module.exports = router;

