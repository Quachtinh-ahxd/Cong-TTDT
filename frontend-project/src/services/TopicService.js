import { urlAPI } from '../config';

class TopicService {
  static async getAll() {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${urlAPI}/topic`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      // Chuẩn hóa về dạng topics
      if (data.status && Array.isArray(data.data)) {
        return {
          status: true,
          success: true,
          data: { topics: data.data },
          message: data.message
        };
      }
      return data;
    } catch (error) {
      console.error('Error fetching topics:', error);
      return { status: false, message: 'Không thể kết nối đến server' };
    }
  }
}

export default TopicService;

