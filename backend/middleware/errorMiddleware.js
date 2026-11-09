// 404 Route Not Found
function notFound(req, res, next) {
  const error = new Error(`Resource Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
}

// Centralized Error Handler
function errorHandler(err, req, res, next) {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  console.error('[API Error]:', err.message);

  res.status(statusCode).json({
    success: false,
    message: err.message || 'An unexpected internal error occurred.',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
}

module.exports = {
  notFound,
  errorHandler,
};

