const { Customer } = require('../models');

// Lấy tất cả khách hàng
exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.findAll();
    
    res.status(200).json({
      status: true,
      customers,
      message: 'Lấy dữ liệu thành công'
    });
  } catch (error) {
    console.error('Lỗi khi lấy khách hàng:', error);
    res.status(500).json({
      status: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// Lấy khách hàng theo ID
exports.getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    
    if (!customer) {
      return res.status(404).json({
        status: false,
        message: 'Không tìm thấy khách hàng'
      });
    }
    
    res.status(200).json({
      status: true,
      customer,
      message: 'Lấy dữ liệu thành công'
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// Tạo khách hàng mới
exports.createCustomer = async (req, res) => {
  try {
    const customerData = {
      name: req.body.name,
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      phone: req.body.phone,
      gender: req.body.gender || 1,
      roles: req.body.roles || 'customer',
      status: req.body.status || 2,
      created_by: req.user?.id || 1
    };
    
    const customer = await Customer.create(customerData);
    
    res.status(201).json({
      status: true,
      customer,
      message: 'Tạo khách hàng thành công'
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// Cập nhật khách hàng
exports.updateCustomer = async (req, res) => {
  try {
    const id = req.params.id;
    const customerData = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      gender: req.body.gender,
      roles: req.body.roles,
      status: req.body.status,
      updated_by: req.user?.id || 1
    };
    
    // Chỉ cập nhật mật khẩu nếu được cung cấp
    if (req.body.password) {
      customerData.password = req.body.password;
    }
    
    const customer = await Customer.update(id, customerData);
    
    res.status(200).json({
      status: true,
      customer,
      message: 'Cập nhật khách hàng thành công'
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// Xóa khách hàng
exports.deleteCustomer = async (req, res) => {
  try {
    const id = req.params.id;
    await Customer.delete(id, req.user?.id || 1);
    
    res.status(200).json({
      status: true,
      message: 'Xóa khách hàng thành công'
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// Thay đổi trạng thái
exports.changeCustomerStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const customer = await Customer.findById(id);
    
    if (!customer) {
      return res.status(404).json({
        status: false,
        message: 'Không tìm thấy khách hàng'
      });
    }
    
    // Đảo ngược trạng thái
    const newStatus = customer.status === 1 ? 2 : 1;
    await Customer.updateStatus(id, newStatus, req.user?.id || 1);
    
    res.status(200).json({
      status: true,
      message: 'Cập nhật trạng thái thành công'
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

