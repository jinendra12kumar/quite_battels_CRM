const express = require('express');
const router = express.Router();
const {
  getChapters,
  getChapterBySlug,
  getChaptersBySeries,
  createChapter,
  updateChapter,
  deleteChapter,
} = require('../controllers/chapterController');
const { protectAdmin, optionalAuth } = require('../middleware/authMiddleware');

router.get('/', optionalAuth, getChapters);
router.get('/:slug', getChapterBySlug);
router.get('/series/:seriesId', getChaptersBySeries);
router.post('/', protectAdmin, createChapter);
router.put('/:id', protectAdmin, updateChapter);
router.delete('/:id', protectAdmin, deleteChapter);

module.exports = router;

