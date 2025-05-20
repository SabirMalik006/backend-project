// middleware/roleMiddleware.js

const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
      const userRole = req.user.role;
  
      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({ message: 'Access denied. You are not authorized.' });
      }
      console.log('User Role:', userRole)
      next();
    };
  };
  
  module.exports = authorizeRoles;
  