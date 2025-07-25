import { urlImage, productImage, brandImage, postImage, bannerImage, userImage } from '../config';

class ImageService {
  // Lấy hình ảnh sản phẩm
  static async getProductImage(filename) {
    return this.getImage('product', filename);
  }

  // Lấy hình ảnh thương hiệu
  static async getBrandImage(filename) {
    return this.getImage('brand', filename);
  }

  // Lấy hình ảnh bài viết
  static async getPostImage(filename) {
    return this.getImage('post', filename);
  }

  // Lấy hình ảnh banner
  static async getBannerImage(filename) {
    return this.getImage('banner', filename);
  }

  // Lấy hình ảnh người dùng
  static async getUserImage(filename) {
    return this.getImage('user', filename);
  }

  // Phương thức chung để lấy hình ảnh
  static async getImage(type, filename) {
    if (!filename) {
      return { success: false, message: 'Không có tên file' };
    }

    try {
      let baseUrl;
      switch (type) {
        case 'product':
          baseUrl = productImage;
          break;
        case 'brand':
          baseUrl = brandImage;
          break;
        case 'post':
          baseUrl = postImage;
          break;
        case 'banner':
          baseUrl = bannerImage;
          break;
        case 'user':
          baseUrl = userImage;
          break;
        default:
          baseUrl = `${urlImage}/${type}`;
      }

      let cleanFilename = filename;
      
      // Nếu filename đã chứa đường dẫn đầy đủ
      if (cleanFilename.includes('http://') || cleanFilename.includes('https://')) {
        // Sửa lỗi lặp lại đường dẫn
        cleanFilename = cleanFilename.replace(new RegExp(`/images/${type}/+images/${type}/+`, 'g'), `/images/${type}/`);
        cleanFilename = cleanFilename.replace(/\/+/g, '/').replace('http:/', 'http://');
        return { success: true, url: cleanFilename };
      }
      
      // Nếu filename chứa đường dẫn /images/type/, chỉ lấy tên file
      if (cleanFilename.includes(`/images/${type}/`)) {
        const parts = cleanFilename.split(`/images/${type}/`);
        cleanFilename = parts[parts.length - 1];
      }
      
      // Nếu filename chứa đường dẫn images/type/, chỉ lấy tên file
      if (cleanFilename.includes(`images/${type}/`)) {
        const parts = cleanFilename.split(`images/${type}/`);
        cleanFilename = parts[parts.length - 1];
      }
      
      // Loại bỏ dấu / ở đầu
      cleanFilename = cleanFilename.startsWith('/') ? cleanFilename.substring(1) : cleanFilename;
      
      // Tạo URL cuối cùng
      const imageUrl = `${baseUrl}/${cleanFilename}`;

      console.log('Final image URL:', imageUrl);
      return { success: true, url: imageUrl };
    } catch (error) {
      console.error('Lỗi khi tải hình ảnh:', error);
      return { 
        success: false, 
        message: `Không thể kết nối đến server (${error.message})` 
      };
    }
  }
}

export default ImageService;










