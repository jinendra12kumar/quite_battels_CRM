const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'wear_your_battles_secret_jwt_token_2026_luxury_key';

/**
 * Protect routes: Requires valid JWT admin token
 */
async function protectAdmin(req, res, next) {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized. Authorization token required.',
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // Verify admin user exists in DB
    const [rows] = await pool.execute(
      'SELECT id, name, email, role, created_at FROM admin_users WHERE id = ?',
      [decoded.id]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized. User account not found.',
      });
    }

    req.user = rows[0];
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized. Token invalid or expired.',
      error: error.message,
    });
  }
}

/**
 * Optional authentication: Checks token if provided, passes through if not
 */
async function optionalAuth(req, res, next) {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const [rows] = await pool.execute(
      'SELECT id, name, email, role FROM admin_users WHERE id = ?',
      [decoded.id]
    );
    req.user = rows.length > 0 ? rows[0] : null;
  } catch {
    req.user = null;
  }
  next();
}

module.exports = {
  protectAdmin,
  optionalAuth,
};

