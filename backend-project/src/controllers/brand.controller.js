const Brand = require('../models/sql/Brand');
const fs = require('fs');
const path = require('path');

// GET ALL BRANDS
exports.getAllBrands = async (req, res) => {
  try {
    console.log('=== GET ALL BRANDS ===');
    const brands = await Brand.getAll();
    
    res.json({
      success: true,
      data: brands,
      total: brands.length,
      message: 'Brands retrieved successfully'
    });
  } catch (error) {
    console.error('❌ Error getting brands:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET BRAND BY ID
exports.getBrandById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`=== GET BRAND BY ID: ${id} ===`);
    
    const brand = await Brand.findById(id);
    
    if (!brand) {
      return res.status(404).json({
        success: false,
        message: 'Brand not found'
      });
    }
    
    res.json({
      success: true,
      data: brand,
      message: 'Brand retrieved successfully'
    });
  } catch (error) {
    console.error('❌ Error getting brand:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// CREATE BRAND
exports.createBrand = async (req, res) => {
  try {
    console.log('=== CREATE BRAND ===');
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);
    
    const { name, slug, description, status } = req.body;
    
    // Validation
    if (!name || !slug) {
      return res.status(400).json({
        success: false,
        message: 'Name và slug là bắt buộc'
      });
    }
    
    const brandData = {
      name: name.trim(),
      slug: slug.trim(),
      description: description?.trim() || '',
      status: parseInt(status) || 1,
      image: req.file ? req.file.filename : null,
      created_by: req.user?.id || 1
    };
    
    const newBrand = await Brand.create(brandData);
    
    res.status(201).json({
      success: true,
      data: newBrand,
      message: 'Brand created successfully'
    });
  } catch (error) {
    console.error('❌ Create brand error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// UPDATE BRAND
exports.updateBrand = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`=== UPDATE BRAND ID: ${id} ===`);
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);
    
    const { name, slug, description, status } = req.body;
    
    // Kiểm tra brand có tồn tại
    const existingBrand = await Brand.findById(id);
    if (!existingBrand) {
      return res.status(404).json({
        success: false,
        message: 'Brand not found'
      });
    }
    
    const brandData = {
      name: name?.trim() || existingBrand.name,
      slug: slug?.trim() || existingBrand.slug,
      description: description?.trim() || existingBrand.description,
      status: status ? parseInt(status) : existingBrand.status,
      image: req.file ? req.file.filename : existingBrand.image,
      updated_by: req.user?.id || 1
    };
    
    const updatedBrand = await Brand.update(id, brandData);
    
    res.json({
      success: true,
      data: updatedBrand,
      message: 'Brand updated successfully'
    });
  } catch (error) {
    console.error('❌ Update brand error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// DELETE BRAND
exports.deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`=== DELETE BRAND ID: ${id} ===`);
    
    const existingBrand = await Brand.findById(id);
    if (!existingBrand) {
      return res.status(404).json({
        success: false,
        message: 'Brand not found'
      });
    }
    
    const isDeleted = await Brand.delete(id);
    
    if (!isDeleted) {
      return res.status(400).json({
        success: false,
        message: 'Failed to delete brand'
      });
    }
    
    res.json({
      success: true,
      message: `Brand ${existingBrand.name} deleted successfully`,
      data: {
        id: id,
        deletedBrand: existingBrand
      }
    });
  } catch (error) {
    console.error('❌ Delete brand error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
