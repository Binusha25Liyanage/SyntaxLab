const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('./asyncHandler');

const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;

  if (!token) {
    const err = new Error('Not authorized: missing token');
    err.statusCode = 401;
    throw err;
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.sub).select('-password -refreshToken');
    if (!user) {
      const err = new Error('User not found');
      err.statusCode = 401;
      throw err;
    }
    req.user = user;
    next();
  } catch (error) {
    const err = new Error('Invalid or expired token');
    err.statusCode = 401;
    throw err;
  }
});

const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    const err = new Error('Admin access required');
    err.statusCode = 403;
    return next(err);
  }
  return next();
};

module.exports = {
  protect,
  adminOnly,
};
