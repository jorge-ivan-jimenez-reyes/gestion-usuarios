const jwt = require('jsonwebtoken');
const logger = require('../config/logger');

function authMiddleware(req, res, next) {
  logger.info('Authentication attempt');
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    logger.warn('Authentication failed: No token provided');
    return res.status(401).json({ error: 'No token provided' });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2) {
    logger.warn('Authentication failed: Token error (incorrect format)');
    return res.status(401).json({ error: 'Token error' });
  }

  const [scheme, token] = parts;
  if (!/^Bearer$/i.test(scheme)) {
    logger.warn('Authentication failed: Token malformatted');
    return res.status(401).json({ error: 'Token malformatted' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      logger.warn('Authentication failed: Invalid token', { error: err.message });
      return res.status(401).json({ error: 'Token invalid' });
    }

    logger.info('Authentication successful', { userId: decoded.userId });
    req.user = { id: decoded.userId };
    return next();
  });
}

module.exports = authMiddleware;
