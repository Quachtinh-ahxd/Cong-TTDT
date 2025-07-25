import httpAxios from '../httpAxios';
import { urlAPI } from '../config';

const MovieService = {
  // Lấy tất cả phim
  getAll: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await httpAxios.get(`${urlAPI}/movies?${queryString}`);
      return response;
    } catch (error) {
      console.error('Error getting movies:', error);
      return { data: { status: false, message: 'Không thể tải phim' } };
    }
  },

  // Lấy phim hot
  getHot: async () => {
    try {
      const response = await httpAxios.get(`${urlAPI}/movies/hot`);
      return response;
    } catch (error) {
      console.error('Error getting hot movies:', error);
      return { data: { status: false, movies: [] } };
    }
  },

  // Lấy chi tiết phim
  getById: async (id) => {
    try {
      const response = await httpAxios.get(`${urlAPI}/movies/show/${id}`);
      return response;
    } catch (error) {
      console.error('Error getting movie:', error);
      throw error;
    }
  },

  // Admin - Tạo phim
  create: async (formData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await httpAxios.post(`${urlAPI}/movies/store`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      return response;
    } catch (error) {
      console.error('Error creating movie:', error);
      throw error;
    }
  },

  // Admin - Xóa phim
  delete: async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await httpAxios.delete(`${urlAPI}/movies/destroy/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response;
    } catch (error) {
      console.error('Error deleting movie:', error);
      throw error;
    }
  }
};

export default MovieService;