const { Category, Product } = require('../models');
const fs = require('fs');
const path = require('path');

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    console.log('Getting all categories');
    
    // Get all categories
    const categories = await Category.findAll();
    
    res.status(200).json({
      status: true,
      categories,
      message: 'Lấy danh sách danh mục thành công'
    });
  } catch (error) {
    console.error('Error getting categories:', error);
    res.status(500).json({
      status: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// Get category by ID
exports.getCategoryById = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(`Getting category with ID: ${id}`);
    
    // Get category
    const category = await Category.findById(id);
    
    if (!category) {
      return res.status(404).json({
        status: false,
        message: 'Không tìm thấy danh mục'
      });
    }
    
    res.status(200).json({
      status: true,
      category,
      message: 'Lấy thông tin danh mục thành công'
    });
  } catch (error) {
    console.error('Error getting category:', error);
    res.status(500).json({
      status: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// Lấy sản phẩm theo danh mục
exports.getProductsByCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const products = await Product.findByCategoryId(categoryId);
    
    res.status(200).json({
      status: true,
      products,
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

// Tạo danh mục mới
exports.createCategory = async (req, res) => {
  try {
    console.log('Creating category with data:', req.body);
    
    const categoryData = {
      name: req.body.name,
      slug: req.body.slug,
      parent_id: req.body.parent_id || null,
      description: req.body.description,
      status: req.body.status || 1,
      created_by: req.body.created_by || 1
    };
    
    if (req.file) {
      categoryData.image = req.file.filename;
    } else if (req.body.image) {
      categoryData.image = req.body.image;
    }
    
    // Use SQL model directly
    const category = await Category.create(categoryData);
    
    res.status(201).json({
      status: true,
      category,
      message: 'Tạo danh mục thành công'
    });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({
      status: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// Cập nhật danh mục
exports.updateCategory = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(`Updating category ${id} with data:`, req.body);
    
    // Prepare update data
    const categoryData = {};
    
    // Only update fields that are sent
    if (req.body.name) categoryData.name = req.body.name;
    if (req.body.slug) categoryData.slug = req.body.slug;
    if (req.body.parent_id !== undefined) categoryData.parent_id = req.body.parent_id;
    if (req.body.description !== undefined) categoryData.description = req.body.description;
    if (req.body.status !== undefined) categoryData.status = parseInt(req.body.status);
    
    // Add updated_by
    categoryData.updated_by = req.body.updated_by || 1;
    
    // Handle image
    if (req.file) {
      categoryData.image = req.file.filename;
    } else if (req.body.image && req.headers['content-type'].includes('application/json')) {
      // If JSON request with image field, use that value
      categoryData.image = req.body.image;
    }
    
    // Update category
    const category = await Category.update(id, categoryData);
    
    res.status(200).json({
      status: true,
      category,
      message: 'Cập nhật danh mục thành công'
    });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({
      status: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// DELETE CATEGORY
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`=== DELETE CATEGORY ID: ${id} ===`);
    
    // Kiểm tra category có tồn tại không
    const existingCategory = await Category.findById(id);
    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
      console.log('Category found:', existingCategory.name);
    
    // XÓA HOÀN TOÀN
    const isDeleted = await Category.delete(id);
    
    if (!isDeleted) {
      return res.status(400).json({
        success: false,
        message: 'Failed to delete category'
      });
    }
    
    console.log('✅ Category deleted successfully');
    
    // RESPONSE FORMAT CHUẨN
    res.json({
      success: true,
      message: `Category ${existingCategory.name} deleted successfully`,
      data: {
        id: id,
        deletedCategory: existingCategory
      }
    });
  } catch (error) {
    console.error('❌ Delete category error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
};

// Change category status
exports.changeCategoryStatus = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(`Changing status for category with ID: ${id}`);
    
    // Get current category
    const category = await Category.findById(id);
    
    if (!category) {
      return res.status(404).json({
        status: false,
        message: 'Không tìm thấy danh mục'
      });
    }
    
    // Toggle status (1 -> 2, 2 -> 1)
    const newStatus = category.status === 1 ? 2 : 1;
    await Category.updateStatus(id, newStatus, req.user?.id || 1);
    
    res.status(200).json({
      status: true,
      message: 'Cập nhật trạng thái thành công'
    });
  } catch (error) {
    console.error('Error changing category status:', error);
    res.status(500).json({
      status: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};
