
const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Authorization header missing' });
  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token missing' });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'replace_with_a_strong_secret');
    req.user = payload; // contains userId and email
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
