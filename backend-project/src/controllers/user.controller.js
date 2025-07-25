const User = require('../models/sql/User');
const bcrypt = require('bcryptjs');

// GET ALL USERS
exports.getAllUsers = async (req, res) => {
  try {
    console.log('=== GET ALL USERS ===');
    console.log('Query params:', req.query);
    
    const users = await User.getAll();
    
    // Loại bỏ password khỏi response
    const usersWithoutPassword = users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
    
    res.json({
      success: true,
      data: usersWithoutPassword,
      total: usersWithoutPassword.length,
      message: 'Users retrieved successfully'
    });
  } catch (error) {
    console.error('❌ Error getting users:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
};

// GET USER BY ID
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`=== GET USER BY ID: ${id} ===`);
    
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Loại bỏ password
    const { password, ...userWithoutPassword } = user;
    
    res.json({
      success: true,
      data: userWithoutPassword,
      message: 'User retrieved successfully'
    });
  } catch (error) {
    console.error('❌ Error getting user by ID:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
};

// CREATE USER
exports.createUser = async (req, res) => {
  try {
    console.log('=== CREATE USER ===');
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);

    const { username, email, name, password, phone, roles } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username, email và password là bắt buộc'
      });
    }

    // Check if user exists
    const existingUser = await User.findByUsername(username);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Username đã tồn tại'
      });
    }

    const existingEmail = await User.findByEmail(email);
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: 'Email đã tồn tại'
      });
    }

    // Create user data
    const userData = {
      username: username.trim(),
      email: email.trim(),
      name: name?.trim() || '',
      password: password, // User.create sẽ hash password
      phone: phone?.trim() || null,
      roles: roles || 'user',
      status: 1,
      image: req.file ? req.file.filename : null,
      created_by: req.user?.id || 1
    };

    console.log('Creating user with data:', { ...userData, password: '[HIDDEN]' });

    const newUser = await User.create(userData);

    // Remove password from response
    const { password: _, ...userResponse } = newUser;

    res.status(201).json({
      success: true,
      data: userResponse,
      message: 'User created successfully'
    });

  } catch (error) {
    console.error('❌ Create user error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
};

// UPDATE USER
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`=== UPDATE USER ID: ${id} ===`);
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);
    
    // Kiểm tra user có tồn tại không
    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const updateData = {
      name: req.body.name?.trim() || existingUser.name,
      email: req.body.email?.trim() || existingUser.email,
      phone: req.body.phone?.trim() || existingUser.phone,
      roles: req.body.roles || existingUser.roles,
      status: req.body.status ? parseInt(req.body.status) : existingUser.status,
      image: req.file ? req.file.filename : existingUser.image,
      updated_by: req.user?.id || 1
    };
    
    // Hash password nếu có
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(req.body.password, salt);
    }
    
    const updatedUser = await User.update(id, updateData);
    
    // Remove password from response
    const { password, ...userResponse } = updatedUser;
    
    res.json({
      success: true,
      data: userResponse,
      message: 'User updated successfully'
    });
  } catch (error) {
    console.error('❌ Update user error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
};

// DELETE USER
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`=== HARD DELETE USER ID: ${id} ===`);
    
    // Kiểm tra user có tồn tại không
    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    console.log('User found, proceeding with hard delete:', existingUser.username);
    
    // XÓA HOÀN TOÀN KHỎI DATABASE
    const isDeleted = await User.delete(id);
    
    if (!isDeleted) {
      return res.status(400).json({
        success: false,
        message: 'Failed to delete user'
      });
    }
    
    console.log('✅ User deleted successfully from database');
    
    res.json({
      success: true,
      message: `User ${existingUser.username} deleted permanently`
    });
  } catch (error) {
    console.error('❌ Delete user error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
};



