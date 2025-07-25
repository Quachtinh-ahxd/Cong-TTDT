import { postImage, productImage, bannerImage, userImage, brandImage } from '../config';

/**
 * Chuẩn hóa đường dẫn hình ảnh để tránh lặp lại
 * @param {string} imagePath - Đường dẫn hình ảnh từ API
 * @param {string} type - Loại hình ảnh (post, product, banner, user, brand)
 * @returns {string} - Đường dẫn hình ảnh đã chuẩn hóa
 */
export const normalizeImagePath = (imagePath, type = 'post') => {
  if (!imagePath) return null;
  
  console.log('Input imagePath:', imagePath, 'type:', type);
  
  let baseUrl;
  switch (type) {
    case 'post':
      baseUrl = postImage;
      break;
    case 'product':
      baseUrl = productImage;
      break;
    case 'banner':
      baseUrl = bannerImage;
      break;
    case 'user':
      baseUrl = userImage;
      break;
    case 'brand':
      baseUrl = brandImage;
      break;
    default:
      baseUrl = postImage;
  }
  
  let cleanPath = imagePath.toString();
  
  // Nếu đường dẫn đã có dạng đầy đủ với http
  if (cleanPath.startsWith('http')) {
    // Sửa lỗi lặp lại đường dẫn
    const regex = new RegExp(`/images/${type}/+images/${type}/+`, 'g');
    cleanPath = cleanPath.replace(regex, `/images/${type}/`);
    cleanPath = cleanPath.replace(/\/+/g, '/').replace('http:/', 'http://');
    console.log('Fixed full URL:', cleanPath);
    return cleanPath;
  }
  
  // Loại bỏ tất cả các dạng đường dẫn images
  cleanPath = cleanPath.replace(/^\/+/, ''); // Loại bỏ / ở đầu
  cleanPath = cleanPath.replace(/^images\/[^\/]+\//, ''); // Loại bỏ images/type/
  cleanPath = cleanPath.replace(/^\/images\/[^\/]+\//, ''); // Loại bỏ /images/type/
  
  // Tạo URL cuối cùng - chỉ nối baseUrl với tên file
  const finalUrl = `${baseUrl}/${cleanPath}`;
  
  console.log('Normalized path:', finalUrl);
  return finalUrl;
};

// Thêm function debug
export const debugImagePath = (imagePath, type) => {
  console.log('=== DEBUG IMAGE PATH ===');
  console.log('Original path:', imagePath);
  console.log('Type:', type);
  
  const normalized = normalizeImagePath(imagePath, type);
  console.log('Normalized path:', normalized);
  console.log('========================');
  
  return normalized;
};















