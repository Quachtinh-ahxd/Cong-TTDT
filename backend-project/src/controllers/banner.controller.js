const { Banner } = require('../models');
const fs = require('fs');
const path = require('path');

// Lấy tất cả banner với debug
exports.getAllBanners = async (req, res) => {
  try {
    console.log('Getting all banners');
    const banners = await Banner.findAll();
    console.log('Raw banners:', banners);
    
    // Thêm đường dẫn đầy đủ cho ảnh
    const bannersWithFullImagePath = banners.map(banner => {
      if (banner.image) {
        console.log('Processing banner image:', banner.image);
        
        // Nếu image đã có đường dẫn /images/banner/, giữ nguyên
        if (banner.image.includes('/images/banner/')) {
          console.log('Image already has path, keeping as is');
          return {
            ...banner,
            image: banner.image
          };
        }
        
        // Nếu image đã bắt đầu bằng http:// hoặc https://
        if (banner.image.startsWith('http://') || banner.image.startsWith('https://')) {
          const filename = banner.image.split('/').pop();
          console.log('Extracted filename from URL:', filename);
          return {
            ...banner,
            image: `/images/banner/${filename}`
          };
        }
        
        // Nếu không, thêm đường dẫn tương đối
        console.log('Adding relative path to image');
        return {
          ...banner,
          image: `/images/banner/${banner.image}`
        };
      }
      
      console.log('Banner has no image');
      return {
        ...banner,
        image: null
      };
    });
    
    console.log('Processed banners:', bannersWithFullImagePath);
    
    res.status(200).json({
      status: true,
      banners: bannersWithFullImagePath,
      message: 'Lấy danh sách banner thành công'
    });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách banner:', error);
    res.status(500).json({
      status: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// Lấy banner theo ID
exports.getBannerById = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(`Getting banner with ID: ${id}`);
    
    const banner = await Banner.findById(id);
    
    if (!banner) {
      return res.status(404).json({
        status: false,
        message: 'Không tìm thấy banner'
      });
    }
    
    // Xử lý đường dẫn hình ảnh
    if (banner.image) {
      // Nếu image đã có đường dẫn /images/banner/, giữ nguyên
      if (!banner.image.includes('/images/banner/')) {
        // Nếu image đã bắt đầu bằng http:// hoặc https://
        if (banner.image.startsWith('http://') || banner.image.startsWith('https://')) {
          const filename = banner.image.split('/').pop();
          banner.image = `/images/banner/${filename}`;
        } else {
          // Nếu không, thêm đường dẫn tương đối
          banner.image = `/images/banner/${banner.image}`;
        }
      }
    }
    
    res.status(200).json({
      status: true,
      banner,
      message: 'Lấy thông tin banner thành công'
    });
  } catch (error) {
    console.error('Lỗi khi lấy banner:', error);
    res.status(500).json({
      status: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// Tạo banner mới
exports.createBanner = async (req, res) => {
  try {
    console.log('Creating banner with data:', req.body);
    
    const bannerData = {
      name: req.body.name,
      link: req.body.link || '#',
      position: req.body.position || 'homepage_top',
      description: req.body.description,
      status: req.body.status || 2,
      created_by: req.user?.id || 1
    };
    
    if (req.file) {
      // Lưu chỉ tên file, không lưu đường dẫn
      bannerData.image = req.file.filename;
    } else if (req.body.image) {
      // Nếu image là URL đầy đủ hoặc đã có đường dẫn, chỉ lấy tên file
      if (req.body.image.includes('/')) {
        bannerData.image = req.body.image.split('/').pop();
      } else {
        bannerData.image = req.body.image;
      }
    }
    
    const banner = await Banner.create(bannerData);
    
    res.status(201).json({
      status: true,
      banner,
      message: 'Tạo banner thành công'
    });
  } catch (error) {
    console.error('Lỗi khi tạo banner:', error);
    res.status(500).json({
      status: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// Cập nhật banner
exports.updateBanner = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(`Updating banner with ID: ${id}`);
    console.log('Update data:', req.body);
    
    const bannerData = {
      name: req.body.name,
      link: req.body.link,
      position: req.body.position,
      description: req.body.description,
      status: req.body.status
    };
    
    // Xử lý file image
    if (req.file) {
      // Lưu chỉ tên file, không lưu đường dẫn
      bannerData.image = req.file.filename;
    } else if (req.body.image && req.headers['content-type'].includes('application/json')) {
      // Nếu image là URL đầy đủ hoặc đã có đường dẫn, chỉ lấy tên file
      if (req.body.image.includes('/')) {
        bannerData.image = req.body.image.split('/').pop();
      } else {
        bannerData.image = req.body.image;
      }
    }
    
    // Thêm updated_by
    bannerData.updated_by = req.user?.id || 1;
    
    const banner = await Banner.update(id, bannerData);
    
    res.status(200).json({
      status: true,
      banner,
      message: 'Cập nhật banner thành công'
    });
  } catch (error) {
    console.error('Lỗi khi cập nhật banner:', error);
    res.status(500).json({
      status: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// Xóa banner
exports.deleteBanner = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(`Deleting banner with ID: ${id}`);
    console.log('Request params:', req.params);
    console.log('Request method:', req.method);
    console.log('Request path:', req.path);
    
    // Kiểm tra xem id có phải là số hợp lệ không
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        status: false,
        message: 'ID banner không hợp lệ'
      });
    }
    
    await Banner.delete(id, req.user?.id || 1);
    
    res.status(200).json({
      status: true,
      message: 'Xóa banner thành công'
    });
  } catch (error) {
    console.error('Lỗi khi xóa banner:', error);
    res.status(500).json({
      status: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// Thay đổi trạng thái
exports.changeBannerStatus = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(`Changing status for banner with ID: ${id}`);
    
    const banner = await Banner.findById(id);
    
    if (!banner) {
      return res.status(404).json({
        status: false,
        message: 'Không tìm thấy banner'
      });
    }
    
    // Đảo ngược trạng thái
    const newStatus = banner.status === 1 ? 2 : 1;
    await Banner.updateStatus(id, newStatus, req.user?.id || 1);
    
    res.status(200).json({
      status: true,
      message: 'Cập nhật trạng thái thành công'
    });
  } catch (error) {
    console.error('Lỗi khi thay đổi trạng thái:', error);
    res.status(500).json({
      status: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// Lấy banner theo vị trí
exports.getBannersByPosition = async (req, res) => {
  try {
    const position = req.params.position;
    console.log(`Getting banners for position: ${position}`);
    
    const banners = await Banner.findByPosition(position);
    
    res.status(200).json({
      status: true,
      banners,
      message: 'Lấy dữ liệu thành công'
    });
  } catch (error) {
    console.error('Lỗi khi lấy banner theo vị trí:', error);
    res.status(500).json({
      status: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};
