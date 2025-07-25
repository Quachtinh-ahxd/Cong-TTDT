const jwt = require('jsonwebtoken');

exports.protect = async (req, res, next) => {
  try {
    console.log('=== AUTH MIDDLEWARE DEBUG ===');
    
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
      console.log('Token found in Authorization header');
    }
    
    if (!token) {
      console.log('❌ No token provided');
      return res.status(401).json({
        status: false,
        message: 'Không có token, truy cập bị từ chối'
      });
    }
    
    console.log('Token:', token.substring(0, 20) + '...');
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decoded successfully:', { id: decoded.id, roles: decoded.roles });
    
    // Get user from database
    const User = require('../models/sql/User');
    const user = await User.findById(decoded.id);
    
    if (!user) {
      console.log('❌ User not found in database');
      return res.status(401).json({
        status: false,
        message: 'Token không hợp lệ'
      });
    }
    
    console.log('✅ User found:', { id: user.id, username: user.username });
    
    req.user = user;
    next();
  } catch (error) {
    console.error('=== AUTH MIDDLEWARE ERROR ===');
    console.error('Error:', error.message);
    
    return res.status(401).json({
      status: false,
      message: 'Token không hợp lệ'
    });
  }
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.roles)) {
      return res.status(403).json({
        message: 'Bạn không có quyền thực hiện hành động này'
      });
    }
    next();
  };
};
