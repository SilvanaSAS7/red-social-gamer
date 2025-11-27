const jwt = require('jsonwebtoken');
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

module.exports = function (req, res, next) {
  const h = req.headers.authorization;
  if (!h) return res.status(401).json({ error: 'missing_token' });
  const token = h.split(' ')[1];
  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'invalid_token' });
  }
};