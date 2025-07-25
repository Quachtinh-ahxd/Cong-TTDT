const jwt = require('jsonwebtoken');
const { User, Customer } = require('../models');

// Đăng ký tài khoản người dùng
exports.register = async (req, res) => {
  try {
    const { name, email, username, password, address, gender, phone } = req.body;
    
    // Kiểm tra email đã tồn tại chưa
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: 'Email đã được sử dụng' });
    }
    
    // Kiểm tra username đã tồn tại chưa
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: 'Username đã được sử dụng' });
    }
    
    // Tạo user mới
    const user = await User.create({
      name,
      email,
      username,
      password,
      address,
      gender,
      phone,
      roles: 'user'
    });

    res.status(201).json({
      message: 'Đăng ký thành công',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        roles: user.roles
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// Đăng nhập
exports.login = async (req, res) => {
  try {
    console.log('=== LOGIN DEBUG ===');
    console.log('Request body:', req.body);
    console.log('==================');
    
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ 
        message: 'Username và password là bắt buộc' 
      });
    }
    
    console.log('Finding user with username:', username);
    
    // Tìm user theo username
    const User = require('../models/sql/User');
    const user = await User.findOne({ username });
    
    console.log('User found:', user ? 'YES' : 'NO');
    
    if (!user) {
      return res.status(401).json({ 
        message: 'Thông tin đăng nhập không chính xác' 
      });
    }
    
    console.log('Comparing password...');
    
    // Kiểm tra password
    const isMatch = await User.comparePassword(user, password);
    
    console.log('Password match:', isMatch);
    
    if (!isMatch) {
      return res.status(401).json({ 
        message: 'Thông tin đăng nhập không chính xác' 
      });
    }
    
    console.log('Creating JWT token...');
    console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
    
    // Tạo JWT token
    const token = jwt.sign(
      { id: user.id, roles: user.roles },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '30d' }
    );
    
    console.log('Token created successfully');
    
    res.status(200).json({
      message: 'Đăng nhập thành công',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        roles: user.roles
      }
    });
  } catch (error) {
    console.error('=== LOGIN ERROR ===');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('==================');
    
    res.status(500).json({ 
      message: 'Lỗi server', 
      error: error.message 
    });
  }
};

// Đăng nhập khách hàng
exports.customerLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Tìm customer theo username
    const customer = await Customer.findOne({ username });
    if (!customer) {
      return res.status(401).json({ message: 'Thông tin đăng nhập không chính xác' });
    }
    
    // Kiểm tra password
    const isMatch = await Customer.comparePassword(customer, password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Thông tin đăng nhập không chính xác' });
    }
    
    // Tạo JWT token
    const token = jwt.sign(
      { id: customer.id, roles: 'customer' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '30d' }
    );
    
    res.status(200).json({
      message: 'Đăng nhập thành công',
      token,
      customer: {
        id: customer.id,
        name: customer.name,
        email: customer.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// Đăng nhập admin
exports.adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Tìm user theo username và kiểm tra role admin
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Thông tin đăng nhập không chính xác' });
    }
    
    // Kiểm tra role admin
    if (user.roles !== 'admin') {
      return res.status(403).json({ message: 'Bạn không có quyền truy cập admin' });
    }
    
    // Kiểm tra password
    const isMatch = await User.comparePassword(user, password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Thông tin đăng nhập không chính xác' });
    }
    
    // Tạo JWT token
    const token = jwt.sign(
      { id: user.id, roles: user.roles },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '30d' }
    );
    
    console.log('Admin logged in with ID:', user.id); // Log để debug
    
    res.status(200).json({
      message: 'Đăng nhập admin thành công',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        roles: user.roles
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};
