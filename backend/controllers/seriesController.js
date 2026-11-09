const pool = require('../config/db');

/**
 * @route   GET /api/series
 * @desc    Get all series (published for public, all for authenticated admin)
 */
async function getSeries(req, res, next) {
  try {
    const isAdmin = Boolean(req.user);
    const sql = isAdmin
      ? 'SELECT * FROM series ORDER BY sort_order ASC, id ASC'
      : 'SELECT * FROM series WHERE status = "published" ORDER BY sort_order ASC, id ASC';

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
 * @route   GET /api/series/:slug
 * @desc    Get series by slug along with its chapters
 */
async function getSeriesBySlug(req, res, next) {
  try {
    const { slug } = req.params;
    const [seriesRows] = await pool.execute(
      'SELECT * FROM series WHERE slug = ?',
      [slug]
    );

    if (seriesRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Series not found.',
      });
    }

    const series = seriesRows[0];

    // Fetch related chapters
    const [chapters] = await pool.execute(
      'SELECT * FROM chapters WHERE series_id = ? AND status = "published" ORDER BY sort_order ASC, chapter_number ASC',
      [series.id]
    );

    series.chapters = chapters;

    return res.json({
      success: true,
      data: series,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @route   POST /api/series
 * @desc    Create a new series (Admin only)
 */
async function createSeries(req, res, next) {
  try {
    const { title, slug, tagline, description, cover_image, status, sort_order } = req.body;

    if (!title || !slug || !cover_image) {
      return res.status(400).json({
        success: false,
        message: 'Title, slug, and cover image are required fields.',
      });
    }

    const [result] = await pool.execute(
      `INSERT INTO series (title, slug, tagline, description, cover_image, status, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        slug.trim().toLowerCase(),
        tagline || null,
        description || null,
        cover_image,
        status || 'published',
        Number(sort_order) || 0,
      ]
    );

    const [created] = await pool.execute('SELECT * FROM series WHERE id = ?', [result.insertId]);

    return res.status(201).json({
      success: true,
      message: 'Series created successfully.',
      data: created[0],
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        success: false,
        message: 'A series with this slug already exists.',
      });
    }
    next(error);
  }
}

/**
 * @route   PUT /api/series/:id
 * @desc    Update series (Admin only)
 */
async function updateSeries(req, res, next) {
  try {
    const { id } = req.params;
    const { title, slug, tagline, description, cover_image, status, sort_order } = req.body;

    const [check] = await pool.execute('SELECT id FROM series WHERE id = ?', [id]);
    if (check.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Series not found.',
      });
    }

    await pool.execute(
      `UPDATE series 
       SET title = COALESCE(?, title),
           slug = COALESCE(?, slug),
           tagline = COALESCE(?, tagline),
           description = COALESCE(?, description),
           cover_image = COALESCE(?, cover_image),
           status = COALESCE(?, status),
           sort_order = COALESCE(?, sort_order)
       WHERE id = ?`,
      [title, slug, tagline, description, cover_image, status, sort_order, id]
    );

    const [updated] = await pool.execute('SELECT * FROM series WHERE id = ?', [id]);

    return res.json({
      success: true,
      message: 'Series updated successfully.',
      data: updated[0],
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        success: false,
        message: 'Slug already taken by another series.',
      });
    }
    next(error);
  }
}

/**
 * @route   DELETE /api/series/:id
 * @desc    Delete series (Admin only)
 */
async function deleteSeries(req, res, next) {
  try {
    const { id } = req.params;
    const [result] = await pool.execute('DELETE FROM series WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Series not found.',
      });
    }

    return res.json({
      success: true,
      message: 'Series and associated chapters removed successfully.',
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getSeries,
  getSeriesBySlug,
  createSeries,
  updateSeries,
  deleteSeries,
};

