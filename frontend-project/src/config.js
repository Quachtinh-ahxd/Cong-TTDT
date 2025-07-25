// Cấu hình URL API và đường dẫn hình ảnh
const urlAPI = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const urlImage = process.env.REACT_APP_IMAGE_URL || 'http://localhost:5000/images';
const userImage = `${process.env.REACT_APP_IMAGE_URL || 'http://localhost:5000/images'}/user`;
const productImage = process.env.REACT_APP_PRODUCT_IMAGE_URL || 'http://localhost:5000/images/product';
const bannerImage = `${process.env.REACT_APP_IMAGE_URL || 'http://localhost:5000/images'}/banner`;
const postImage = `${process.env.REACT_APP_IMAGE_URL || 'http://localhost:5000/images'}/post`;
const brandImage = `${process.env.REACT_APP_IMAGE_URL || 'http://localhost:5000/images'}/brand`;
const movieImage = `${process.env.REACT_APP_IMAGE_URL || 'http://localhost:5000/images'}/movie`;

export const fileAPI = 'http://localhost:5000/api';
export const fileUrl = 'http://localhost:5000/uploads';

// CORS headers cho images
export const imageHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET',
  'Access-Control-Allow-Headers': 'Content-Type'
};

console.log('=== CONFIG DEBUG ===');
console.log('urlAPI:', urlAPI);
console.log('Current environment:', process.env.NODE_ENV);
console.log('=== END CONFIG DEBUG ===');

// Export tất cả các biến cần thiết
export { 
  urlAPI, 
  urlImage,
  userImage,
  productImage, 
  bannerImage, 
  postImage, 
  brandImage, 
  movieImage 
};
