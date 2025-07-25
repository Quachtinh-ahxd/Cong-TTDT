import axios from 'axios';
import { urlAPI } from './config';

console.log('=== httpAxios DEBUG ===');
console.log('urlAPI from config:', urlAPI);
console.log('=== END httpAxios DEBUG ===');

// Tạo instance axios với cấu hình mặc định
const httpAxios = axios.create({
  baseURL: urlAPI, // 'http://localhost:5000/api'
  timeout: 10000, // Giảm timeout xuống 10 giây
});

// Thêm interceptor cho request
httpAxios.interceptors.request.use(
  (config) => {
    // Lấy token từ localStorage
    const token = localStorage.getItem('token');
    
    // Nếu có token, thêm vào header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // DEBUG: Log chi tiết để tìm nguyên nhân URL duplicate
    console.log('=== AXIOS REQUEST DEBUG ===');
    console.log('config.baseURL:', config.baseURL);
    console.log('config.url:', config.url);
    console.log('Expected fullURL:', config.baseURL + config.url);
    console.log('=== END REQUEST DEBUG ===');
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Thêm interceptor cho response
httpAxios.interceptors.response.use(
  (response) => {
    // DEBUG: Log response để kiểm tra
    console.log('=== AXIOS RESPONSE DEBUG ===');
    console.log('Response URL:', response.config.url);
    console.log('Response status:', response.status);
    console.log('=== END RESPONSE DEBUG ===');
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    console.error('Error config:', error.config);
    
    // Xử lý lỗi 401 Unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default httpAxios;
