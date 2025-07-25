import axios from 'axios';
import { fileAPI } from '../config';
import { FileClassifier } from '../utils/fileClassifier';

// Tạo axios instance riêng cho file service
const fileAxios = axios.create({
  baseURL: fileAPI,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token interceptor
fileAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token') || localStorage.getItem('access_token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  
  return config;
});

const FileService = {
  getAll: async () => {
    try {
      const response = await fileAxios.get('/files');
      return response.data;
    } catch (error) {
      console.error('FileService.getAll error:', error);
      throw error;
    }
  },

  getByCategory: async (category) => {
    try {
      const response = await fileAxios.get(`/files/category/${category}`);
      return response.data;
    } catch (error) {
      console.error('Error getting files by category:', error);
      throw error;
    }
  },

  upload: async (formData, onUploadProgress) => {
    try {
      const response = await fileAxios.post('/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress
      });
      
      return response;
    } catch (error) {
      console.error('FileService.upload error:', error);
      throw error;
    }
  },

  uploadMultiple: async (files, options = {}) => {
    try {
      const formData = new FormData();
      files.forEach((file, index) => {
        formData.append('files', file);
      });
      
      formData.append('category', options.category || 'other');
      formData.append('title', options.title || '');
      formData.append('description', options.description || '');
      
      const response = await fileAxios.post('/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      return response.data;
    } catch (error) {
      console.error('FileService.uploadMultiple error:', error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await fileAxios.delete(`/files/${id}`);
      return response;
    } catch (error) {
      console.error('FileService.delete error:', error);
      throw error;
    }
  }
};

// Export named function
export const upload = FileService.uploadMultiple;
export default FileService;










