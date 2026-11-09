const pool = require('../config/db');

/**
 * @route   GET /api/products
 * @desc    Get all products (published for public, all for authenticated admin)
 */
async function getProducts(req, res, next) {
  try {
    const isAdmin = Boolean(req.user);
    const sql = isAdmin
      ? `SELECT p.*, c.title as chapter_title, c.slug as chapter_slug,
          (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as cover_image
         FROM products p
         LEFT JOIN chapters c ON p.chapter_id = c.id
         ORDER BY p.id DESC`
      : `SELECT p.*, c.title as chapter_title, c.slug as chapter_slug,
          (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as cover_image
         FROM products p
         LEFT JOIN chapters c ON p.chapter_id = c.id
         WHERE p.status = 'published'
         ORDER BY p.id DESC`;

    const [products] = await pool.query(sql);

    // Attach primary images & sizes for each product
    for (const prod of products) {
      const [images] = await pool.execute(
        'SELECT * FROM product_images WHERE product_id = ? ORDER BY is_primary DESC, sort_order ASC',
        [prod.id]
      );
      prod.images = images;

      const [sizes] = await pool.execute(
        'SELECT * FROM product_sizes WHERE product_id = ? ORDER BY id ASC',
        [prod.id]
      );
      prod.sizes = sizes;
    }

    return res.json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @route   GET /api/products/:slug
 * @desc    Get product by slug with images, sizes, and chapter details
 */
async function getProductBySlug(req, res, next) {
  try {
    const { slug } = req.params;

    const [rows] = await pool.execute(
      `SELECT p.*, c.title as chapter_title, c.slug as chapter_slug, c.chapter_number
       FROM products p
       LEFT JOIN chapters c ON p.chapter_id = c.id
       WHERE p.slug = ?`,
      [slug]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    const product = rows[0];

    // Fetch images
    const [images] = await pool.execute(
      'SELECT * FROM product_images WHERE product_id = ? ORDER BY is_primary DESC, sort_order ASC',
      [product.id]
    );
    product.images = images;

    // Fetch sizes
    const [sizes] = await pool.execute(
      'SELECT * FROM product_sizes WHERE product_id = ? ORDER BY id ASC',
      [product.id]
    );
    product.sizes = sizes;

    // Attach chapter meta
    if (product.chapter_id) {
      product.chapter = {
        id: product.chapter_id,
        title: product.chapter_title,
        slug: product.chapter_slug,
        chapter_number: product.chapter_number,
      };
    }

    return res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @route   POST /api/products
 * @desc    Create product with sizes & images (Admin only)
 */
async function createProduct(req, res, next) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const {
      chapter_id,
      name,
      slug,
      tagline,
      description,
      details,
      composition,
      care_instructions,
      price,
      stock,
      status,
      images,
      sizes,
    } = req.body;

    if (!name || !slug || !price) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: 'Name, slug, and price are required.',
      });
    }

    const [result] = await connection.execute(
      `INSERT INTO products 
       (chapter_id, name, slug, tagline, description, details, composition, care_instructions, price, stock, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        chapter_id || null,
        name,
        slug.trim().toLowerCase(),
        tagline || null,
        description || null,
        details || null,
        composition || '100% Combed Heavyweight Organic Cotton (320 GSM)',
        care_instructions || 'Hand wash cold or delicate cycle. Lay flat to dry.',
        Number(price) || 1999.0,
        Number(stock) || 50,
        status || 'published',
      ]
    );

    const productId = result.insertId;

    // Insert Images if provided
    if (Array.isArray(images) && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        if (img.image_url) {
          await connection.execute(
            `INSERT INTO product_images (product_id, image_url, caption, is_primary, sort_order)
             VALUES (?, ?, ?, ?, ?)`,
            [productId, img.image_url, img.caption || null, i === 0 ? 1 : 0, i + 1]
          );
        }
      }
    }

    // Insert Sizes if provided (default XS to XXL if none provided)
    const sizesToInsert = Array.isArray(sizes) && sizes.length > 0
      ? sizes
      : [
          { size: 'XS', stock: 8 },
          { size: 'S', stock: 14 },
          { size: 'M', stock: 22 },
          { size: 'L', stock: 16 },
          { size: 'XL', stock: 10 },
          { size: 'XXL', stock: 5 },
        ];

    for (const s of sizesToInsert) {
      await connection.execute(
        `INSERT INTO product_sizes (product_id, size, stock) VALUES (?, ?, ?)`,
        [productId, s.size, Number(s.stock) || 10]
      );
    }

    await connection.commit();

    const [created] = await pool.execute('SELECT * FROM products WHERE id = ?', [productId]);

    return res.status(201).json({
      success: true,
      message: 'Product created successfully.',
      data: created[0],
    });
  } catch (error) {
    await connection.rollback();
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        success: false,
        message: 'A product with this slug already exists.',
      });
    }
    next(error);
  } finally {
    connection.release();
  }
}

/**
 * @route   PUT /api/products/:id
 * @desc    Update product details, sizes & images (Admin only)
 */
async function updateProduct(req, res, next) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { id } = req.params;
    const {
      chapter_id,
      name,
      slug,
      tagline,
      description,
      details,
      composition,
      care_instructions,
      price,
      stock,
      status,
      images,
      sizes,
    } = req.body;

    const [check] = await connection.execute('SELECT id FROM products WHERE id = ?', [id]);
    if (check.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    await connection.execute(
      `UPDATE products 
       SET chapter_id = COALESCE(?, chapter_id),
           name = COALESCE(?, name),
           slug = COALESCE(?, slug),
           tagline = COALESCE(?, tagline),
           description = COALESCE(?, description),
           details = COALESCE(?, details),
           composition = COALESCE(?, composition),
           care_instructions = COALESCE(?, care_instructions),
           price = COALESCE(?, price),
           stock = COALESCE(?, stock),
           status = COALESCE(?, status)
       WHERE id = ?`,
      [
        chapter_id,
        name,
        slug,
        tagline,
        description,
        details,
        composition,
        care_instructions,
        price,
        stock,
        status,
        id,
      ]
    );

    // Update sizes if provided
    if (Array.isArray(sizes) && sizes.length > 0) {
      for (const s of sizes) {
        await connection.execute(
          `INSERT INTO product_sizes (product_id, size, stock) 
           VALUES (?, ?, ?)
           ON DUPLICATE KEY UPDATE stock = VALUES(stock)`,
          [id, s.size, Number(s.stock) || 0]
        );
      }
    }

    // Update images if provided
    if (Array.isArray(images) && images.length > 0) {
      await connection.execute('DELETE FROM product_images WHERE product_id = ?', [id]);
      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        if (img.image_url) {
          await connection.execute(
            `INSERT INTO product_images (product_id, image_url, caption, is_primary, sort_order)
             VALUES (?, ?, ?, ?, ?)`,
            [id, img.image_url, img.caption || null, i === 0 ? 1 : 0, i + 1]
          );
        }
      }
    }

    await connection.commit();

    const [updated] = await pool.execute('SELECT * FROM products WHERE id = ?', [id]);

    return res.json({
      success: true,
      message: 'Product updated successfully.',
      data: updated[0],
    });
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
}

/**
 * @route   DELETE /api/products/:id
 * @desc    Delete product (Admin only)
 */
async function deleteProduct(req, res, next) {
  try {
    const { id } = req.params;
    const [result] = await pool.execute('DELETE FROM products WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    return res.json({
      success: true,
      message: 'Product removed successfully.',
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
};

