import httpAxios from '../httpAxios';

const DocumentService = {
  // Sử dụng API files hiện có
  getAll: async () => {
    try {
      const response = await httpAxios.get('/files');
      return response.data;
    } catch (error) {
      console.error('Error fetching documents:', error);
      return { status: false, message: 'Không thể kết nối đến server' };
    }
  },

  // Lọc theo loại file (category)
  getByCategory: async (category) => {
    try {
      const response = await httpAxios.get(`/files?type=${category}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching documents by category:', error);
      return { status: false, message: 'Không thể kết nối đến server' };
    }
  },

  // Tìm kiếm trong files
  search: async (keyword) => {
    try {
      const response = await httpAxios.get(`/files?search=${encodeURIComponent(keyword)}`);
      return response.data;
    } catch (error) {
      console.error('Error searching documents:', error);
      return { status: false, message: 'Không thể kết nối đến server' };
    }
  },

  // Upload file mới
  upload: async (formData, onUploadProgress) => {
    try {
      const response = await httpAxios.post('/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading document:', error);
      throw error;
    }
  },

  // Xóa file
  delete: async (id) => {
    try {
      const response = await httpAxios.delete(`/files/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  },

  // Cập nhật thông tin file
  update: async (id, data) => {
    try {
      const response = await httpAxios.put(`/files/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating document:', error);
      throw error;
    }
  }
};

export default DocumentService;