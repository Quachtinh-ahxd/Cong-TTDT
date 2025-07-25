import httpAxios from '../httpAxios';
import { urlAPI } from '../config';

const CommentService = {
  // Lấy bình luận theo bài viết/sản phẩm
  getByPost: async (postId, postType = 'product') => {
    try {
      const response = await httpAxios.get(`${urlAPI}/comment/post/${postId}?type=${postType}`);
      return response;
    } catch (error) {
      console.error('Error getting comments:', error);
      return { data: { status: false, message: 'Không thể tải bình luận' } };
    }
  },

  // Tạo bình luận mới
  create: async (data) => {
    try {
      const token = localStorage.getItem('token');
      const response = await httpAxios.post(`${urlAPI}/comment/store`, data, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response;
    } catch (error) {
      console.error('Error creating comment:', error);
      throw error;
    }
  },

  // Thay đổi trạng thái bình luận (admin)
  toggleStatus: async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await httpAxios.put(`${urlAPI}/comment/toggle/${id}`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response;
    } catch (error) {
      console.error('Error toggling comment status:', error);
      throw error;
    }
  },

  // Xóa bình luận (admin)
  delete: async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await httpAxios.delete(`${urlAPI}/comment/delete/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response;
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  }
};

export default CommentService;




