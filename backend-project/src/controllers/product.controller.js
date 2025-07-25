const Product = require('../models/sql/Product');
const path = require('path');
const fs = require('fs');

exports.getAllProducts = async (req, res) => {
  try {
    console.log('🔍 GET /api/products');
    const products = await Product.getAll();
    
    // Xử lý image path cho từng product
    const processedProducts = products.map(product => {
      if (product.image) {
        // Kiểm tra file có tồn tại không
        const imagePath = path.join(__dirname, '../../public/images/product', product.image);
        const imageExists = fs.existsSync(imagePath);
        
        console.log(`Checking image: ${product.image}, exists: ${imageExists}`);
        
        if (!imageExists) {
          console.log(`❌ Image not found: ${product.image}, using placeholder`);
          product.image = 'placeholder.svg';
        }
      }
      return product;
    });
    
    res.json({
      success: true,
      data: processedProducts
    });
  } catch (error) {
    console.error('Error getting products:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('🔍 GET product by ID:', id);
    
    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // RETURN FORMAT NHẤT QUÁN
    res.json({
      success: true,
      data: product, // ← product object ở trong data
      message: 'Product retrieved successfully'
    });
    
  } catch (error) {
    console.error('❌ Error getting product:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const products = await Product.findByCategory(categoryId);
    
    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getProductsByBrand = async (req, res) => {
  try {
    const { brandId } = req.params;
    const products = await Product.findByBrand(brandId);
    
    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.searchProducts = async (req, res) => {
  try {
    const { q } = req.query;
    const products = await Product.search(q);
    
    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const product = await Product.findBySlug(slug);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.createProduct = async (req, res) => {
  try {
    console.log('=== CREATE PRODUCT ===');
    console.log('Body:', req.body);
    console.log('File:', req.file);
    
    const productData = {
      ...req.body,
      image: req.file ? req.file.filename : null,
      user_id: req.user?.id || 1,
      status: 'active'
    };
    
    const product = await Product.create(productData);
    
    res.status(201).json({
      success: true,
      data: product,
      message: 'Product created successfully'
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    
    if (req.file) {
      updateData.image = req.file.filename;
    }
    
    const product = await Product.update(id, updateData);
    
    res.json({
      success: true,
      data: product,
      message: 'Product updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    console.log('=== DELETE PRODUCT ===');
    const { id } = req.params;
    console.log('Product ID:', id);
    console.log('User ID:', req.user?.id);
    
    // Kiểm tra product có tồn tại không
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      console.log('❌ Product not found');
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    console.log('✅ Product found:', existingProduct.name);
    
    // Xóa ảnh nếu có
    if (existingProduct.image) {
      const imagePath = path.join(__dirname, '../../public/images/product', existingProduct.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
        console.log('✅ Image deleted:', existingProduct.image);
      }
    }
    
    // Xóa khỏi database
    const deleted = await Product.delete(id);
    
    if (!deleted) {
      console.log('❌ Failed to delete from database');
      return res.status(500).json({
        success: false,
        message: 'Failed to delete product'
      });
    }
    
    console.log('✅ Product deleted successfully');
    res.json({
      success: true,
      message: 'Product deleted successfully',
      deleted_id: parseInt(id)
    });
    
  } catch (error) {
    console.error('❌ Delete product error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
};

exports.approveProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProduct = await Product.approve(id);
    res.json({
      success: true,
      data: updatedProduct,
      message: 'Product approved successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.rejectProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.updateStatus(id, 'rejected');
    
    res.json({
      success: true,
      data: product,
      message: 'Product rejected successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
