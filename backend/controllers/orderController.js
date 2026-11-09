const pool = require('../config/db');

/**
 * @route   POST /api/orders
 * @desc    Create a new customer order and calculate revenue
 */
async function createOrder(req, res, next) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const {
      name,
      email,
      phone,
      address,
      city,
      postalCode,
      items,
      totalAmount,
    } = req.body;

    if (!name || !email || !address || !items || items.length === 0) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: 'Name, email, shipping address, and order items are required.',
      });
    }

    const orderCode = 'QB-' + Math.floor(100000 + Math.random() * 900000);
    const calculatedTotal = Number(totalAmount) || items.reduce((sum, it) => sum + (Number(it.price) * (Number(it.quantity) || 1)), 0);

    const [orderRes] = await connection.execute(
      `INSERT INTO orders 
       (order_code, customer_name, customer_email, customer_phone, shipping_address, city, postal_code, total_amount, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'confirmed')`,
      [
        orderCode,
        name,
        email.trim().toLowerCase(),
        phone || null,
        address,
        city || '',
        postalCode || '',
        calculatedTotal,
      ]
    );

    const orderId = orderRes.insertId;

    // Insert items & optionally decrement size inventory
    for (const item of items) {
      const qty = Number(item.quantity) || 1;
      const unitPrice = Number(item.price) || 1999;
      
      await connection.execute(
        `INSERT INTO order_items 
         (order_id, product_id, product_name, size, quantity, unit_price)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          orderId,
          item.id || null,
          item.name || 'THE GENTLE ARMOR PIECE',
          item.selectedSize || 'M',
          qty,
          unitPrice,
        ]
      );

      // Decrement inventory if product_id and size are present
      if (item.id && item.selectedSize) {
        await connection.execute(
          `UPDATE product_sizes 
           SET stock = GREATEST(0, stock - ?) 
           WHERE product_id = ? AND size = ?`,
          [qty, item.id, item.selectedSize]
        );
      }
    }

    await connection.commit();

    return res.status(201).json({
      success: true,
      message: 'Order created and registered successfully.',
      order: {
        id: orderId,
        order_code: orderCode,
        total_amount: calculatedTotal,
        status: 'confirmed',
      },
    });
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
}

/**
 * @route   GET /api/orders
 * @desc    Get all orders with item summary
 */
async function getOrders(req, res, next) {
  try {
    const [orders] = await pool.query(
      `SELECT * FROM orders ORDER BY created_at DESC LIMIT 50`
    );

    for (const ord of orders) {
      const [items] = await pool.execute(
        `SELECT * FROM order_items WHERE order_id = ?`,
        [ord.id]
      );
      ord.items = items;
    }

    return res.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @route   GET /api/orders/stats
 * @desc    Get aggregated dashboard stats including Total Revenue
 */
async function getDashboardStats(req, res, next) {
  try {
    // 1. Total Revenue from orders
    const [revRows] = await pool.query(
      `SELECT COALESCE(SUM(total_amount), 0) AS total_revenue, COUNT(*) AS total_orders FROM orders`
    );
    const totalRevenue = Number(revRows[0]?.total_revenue) || 0;
    const totalOrders = Number(revRows[0]?.total_orders) || 0;

    // 2. Count series
    const [seriesRows] = await pool.query(`SELECT COUNT(*) AS count FROM series`);
    const totalSeries = Number(seriesRows[0]?.count) || 0;

    // 3. Count chapters
    const [chapterRows] = await pool.query(`SELECT COUNT(*) AS count FROM chapters`);
    const totalChapters = Number(chapterRows[0]?.count) || 0;

    // 4. Count products
    const [prodRows] = await pool.query(`SELECT COUNT(*) AS count FROM products`);
    const totalProducts = Number(prodRows[0]?.count) || 0;

    // 5. Recent 5 orders
    const [recentOrders] = await pool.query(
      `SELECT * FROM orders ORDER BY created_at DESC LIMIT 5`
    );

    return res.json({
      success: true,
      data: {
        totalRevenue,
        totalOrders,
        totalSeries,
        totalChapters,
        totalProducts,
        recentOrders,
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createOrder,
  getOrders,
  getDashboardStats,
};

