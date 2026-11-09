const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { protectAdmin } = require('../middleware/authMiddleware');
const {
  uploadImage,
  getMedia,
  deleteMedia,
} = require('../controllers/uploadController');

router.post('/', upload.single('image'), uploadImage);
router.get('/', getMedia);
router.delete('/:id', protectAdmin, deleteMedia);

module.exports = router;

