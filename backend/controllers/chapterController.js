const pool = require('../config/db');

/**
 * @route   GET /api/chapters
 * @desc    Get chapters (published for public, all for authenticated admin)
 */
async function getChapters(req, res, next) {
  try {
    const isAdmin = Boolean(req.user);
    const sql = isAdmin
      ? `SELECT c.*, s.title as series_title 
         FROM chapters c 
         LEFT JOIN series s ON c.series_id = s.id 
         ORDER BY c.sort_order ASC, c.chapter_number ASC`
      : `SELECT c.*, s.title as series_title 
         FROM chapters c 
         LEFT JOIN series s ON c.series_id = s.id 
         WHERE c.status = 'published' 
         ORDER BY c.sort_order ASC, c.chapter_number ASC`;

    const [rows] = await pool.query(sql);

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
 * @route   GET /api/chapters/:slug
 * @desc    Get single chapter by slug with related product
 */
async function getChapterBySlug(req, res, next) {
  try {
    const { slug } = req.params;

    const [rows] = await pool.execute(
      `SELECT c.*, s.title as series_title, s.slug as series_slug 
       FROM chapters c 
       LEFT JOIN series s ON c.series_id = s.id 
       WHERE c.slug = ?`,
      [slug]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Chapter not found.',
      });
    }

    const chapter = rows[0];

    // Find related product attached to this chapter
    const [products] = await pool.execute(
      `SELECT p.*, 
        (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as cover_image
       FROM products p 
       WHERE p.chapter_id = ? AND p.status = 'published'
       LIMIT 1`,
      [chapter.id]
    );

    if (products.length > 0) {
      const prod = products[0];
      // Attach images
      const [images] = await pool.execute(
        'SELECT * FROM product_images WHERE product_id = ? ORDER BY is_primary DESC, sort_order ASC',
        [prod.id]
      );
      prod.images = images;
      chapter.related_product = prod;
    } else {
      chapter.related_product = null;
    }

    return res.json({
      success: true,
      data: chapter,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @route   GET /api/series/:seriesId/chapters
 * @desc    Get all chapters for a given series
 */
async function getChaptersBySeries(req, res, next) {
  try {
    const { seriesId } = req.params;

    const [rows] = await pool.execute(
      `SELECT * FROM chapters 
       WHERE series_id = ? AND status = 'published' 
       ORDER BY sort_order ASC, chapter_number ASC`,
      [seriesId]
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
 * @route   POST /api/chapters
 * @desc    Create new chapter (Admin only)
 */
async function createChapter(req, res, next) {
  try {
    const {
      series_id,
      chapter_number,
      title,
      slug,
      subtitle,
      description,
      content,
      cover_image,
      secondary_image,
      design_philosophy,
      sort_order,
      status,
    } = req.body;

    if (!series_id || !title || !slug || !cover_image) {
      return res.status(400).json({
        success: false,
        message: 'Series ID, title, slug, and cover image are required.',
      });
    }

    const [result] = await pool.execute(
      `INSERT INTO chapters 
       (series_id, chapter_number, title, slug, subtitle, description, content, cover_image, secondary_image, design_philosophy, sort_order, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        Number(series_id),
        Number(chapter_number) || 1,
        title,
        slug.trim().toLowerCase(),
        subtitle || null,
        description || null,
        content || null,
        cover_image,
        secondary_image || null,
        design_philosophy || null,
        Number(sort_order) || 1,
        status || 'published',
      ]
    );

    const [created] = await pool.execute('SELECT * FROM chapters WHERE id = ?', [result.insertId]);

    return res.status(201).json({
      success: true,
      message: 'Chapter created successfully.',
      data: created[0],
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        success: false,
        message: 'A chapter with this slug already exists.',
      });
    }
    next(error);
  }
}

/**
 * @route   PUT /api/chapters/:id
 * @desc    Update chapter (Admin only)
 */
async function updateChapter(req, res, next) {
  try {
    const { id } = req.params;
    const {
      series_id,
      chapter_number,
      title,
      slug,
      subtitle,
      description,
      content,
      cover_image,
      secondary_image,
      design_philosophy,
      sort_order,
      status,
    } = req.body;

    const [check] = await pool.execute('SELECT id FROM chapters WHERE id = ?', [id]);
    if (check.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Chapter not found.',
      });
    }

    await pool.execute(
      `UPDATE chapters 
       SET series_id = COALESCE(?, series_id),
           chapter_number = COALESCE(?, chapter_number),
           title = COALESCE(?, title),
           slug = COALESCE(?, slug),
           subtitle = COALESCE(?, subtitle),
           description = COALESCE(?, description),
           content = COALESCE(?, content),
           cover_image = COALESCE(?, cover_image),
           secondary_image = COALESCE(?, secondary_image),
           design_philosophy = COALESCE(?, design_philosophy),
           sort_order = COALESCE(?, sort_order),
           status = COALESCE(?, status)
       WHERE id = ?`,
      [
        series_id,
        chapter_number,
        title,
        slug,
        subtitle,
        description,
        content,
        cover_image,
        secondary_image,
        design_philosophy,
        sort_order,
        status,
        id,
      ]
    );

    const [updated] = await pool.execute('SELECT * FROM chapters WHERE id = ?', [id]);

    return res.json({
      success: true,
      message: 'Chapter updated successfully.',
      data: updated[0],
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        success: false,
        message: 'Slug already taken by another chapter.',
      });
    }
    next(error);
  }
}

/**
 * @route   DELETE /api/chapters/:id
 * @desc    Delete chapter (Admin only)
 */
async function deleteChapter(req, res, next) {
  try {
    const { id } = req.params;
    const [result] = await pool.execute('DELETE FROM chapters WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Chapter not found.',
      });
    }

    return res.json({
      success: true,
      message: 'Chapter removed successfully.',
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getChapters,
  getChapterBySlug,
  getChaptersBySeries,
  createChapter,
  updateChapter,
  deleteChapter,
};

