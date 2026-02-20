const jwt = require('jsonwebtoken');
const logger = require('../lib/logger');

const JWT_SECRET = process.env.JWT_SECRET || 'store-dev-secret-change-in-production';

function getTokenFromRequest(req) {
  const auth = req.headers.authorization;
  if (auth && typeof auth === 'string' && auth.startsWith('Bearer ')) {
    return auth.slice(7);
  }
  return null;
}

function signToken(payload, options) {
  return jwt.sign(payload, JWT_SECRET, options || { expiresIn: '7d' });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (e) {
    return null;
  }
}

function requireAuth(req, res, next) {
  const token = getTokenFromRequest(req);
  if (!token) {
    logger.warn('requireAuth: no token');
    return res.status(401).json({ error: 'Authentication required' });
  }
  const decoded = verifyToken(token);
  if (!decoded || !decoded.userId) {
    logger.warn('requireAuth: invalid or expired token');
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
  req.userId = decoded.userId;
  next();
}

module.exports = {
  JWT_SECRET,
  getTokenFromRequest,
  signToken,
  verifyToken,
  requireAuth,
};
