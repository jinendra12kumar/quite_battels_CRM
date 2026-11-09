const path = require('path');
const fs = require('fs');
const pool = require('../config/db');
const { cloudinary, isConfigured } = require('../config/cloudinary');

/**
 * @route   POST /api/upload
 * @desc    Upload an image file (Cloudinary if configured, local disk fallback if not)
 */
async function uploadImage(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided for upload.',
      });
    }

    let fileUrl = '';
    let publicId = null;

    if (isConfigured) {
      // Production Cloudinary Upload
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'wear-your-battles',
          use_filename: true,
          unique_filename: true,
        });
        fileUrl = result.secure_url;
        publicId = result.public_id;

        // Clean local temp file after upload to Cloudinary
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
      } catch (cloudErr) {
        console.warn('Cloudinary upload failed, falling back to local storage URL:', cloudErr.message);
        const protocol = req.protocol;
        const host = req.get('host');
        fileUrl = `${protocol}://${host}/uploads/${req.file.filename}`;
      }
    } else {
      // Local Disk Storage URL
      const protocol = req.protocol;
      const host = req.get('host');
      fileUrl = `${protocol}://${host}/uploads/${req.file.filename}`;
    }

    // Record in media_library table
    try {
      await pool.execute(
        `INSERT INTO media_library (original_name, filename, file_url, mimetype, size_bytes)
         VALUES (?, ?, ?, ?, ?)`,
        [
          req.file.originalname,
          req.file.filename,
          fileUrl,
          req.file.mimetype,
          req.file.size,
        ]
      );
    } catch (dbErr) {
      console.warn('Could not record into media_library table:', dbErr.message);
    }

    return res.status(201).json({
      success: true,
      message: 'Image uploaded successfully.',
      url: fileUrl,
      filename: req.file.filename,
      original_name: req.file.originalname,
      size: req.file.size,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @route   GET /api/upload
 * @desc    Get all assets in media library
 */
async function getMedia(req, res, next) {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM media_library ORDER BY id DESC'
    );

    return res.json({
      success: true,
      count: rows.length,
      data: rows,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @route   DELETE /api/upload/:id
 * @desc    Delete media asset (Admin only)
 */
async function deleteMedia(req, res, next) {
  try {
    const { id } = req.params;

    const [rows] = await pool.execute(
      'SELECT * FROM media_library WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Media asset not found.',
      });
    }

    const item = rows[0];

    // If local file exists, remove it
    if (item.filename) {
      const localPath = path.resolve(__dirname, '../uploads', item.filename);
      if (fs.existsSync(localPath)) {
        fs.unlinkSync(localPath);
      }
    }

    await pool.execute('DELETE FROM media_library WHERE id = ?', [id]);

    return res.json({
      success: true,
      message: 'Media asset removed successfully.',
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  uploadImage,
  getMedia,
  deleteMedia,
};

