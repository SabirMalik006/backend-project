const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ status: 'fail', message: 'Invalid token' });
  }

  const token = authHeader.split(' ')[1];
  console.log('Token:', token); // ✅
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded:', decoded); // ✅
    req.user = decoded;
    next();
  } catch (error) {
    console.log('JWT Error:', error.message); // 🔍 add this
    return res.status(401).json({ status: 'fail', message: 'Invalid token' });
  }
  
};

module.exports = authMiddleware;
