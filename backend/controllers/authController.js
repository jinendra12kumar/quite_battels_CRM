const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'wear_your_battles_secret_jwt_token_2026_luxury_key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * @route   POST /api/admin/login
 * @desc    Authenticate admin & return JWT
 */
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and passphrase.',
      });
    }

    const [users] = await pool.execute(
      'SELECT * FROM admin_users WHERE email = ?',
      [email.trim().toLowerCase()]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid administrative credentials.',
      });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid administrative credentials.',
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return res.json({
      success: true,
      message: 'Authentication successful.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @route   GET /api/admin/profile
 * @desc    Get currently logged in admin details
 */
async function getProfile(req, res, next) {
  try {
    return res.json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  login,
  getProfile,
};

