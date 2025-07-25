import { urlAPI } from '../config';

class BannerService {
  // Lấy tất cả banner
  static async getAll() {
    try {
      const response = await fetch(`${urlAPI}/banner`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching banners:', error);
      return { status: false, message: 'Không thể kết nối đến server' };
    }
  }

  // Lấy banner theo ID
  static async getById(id) {
    try {
      const response = await fetch(`${urlAPI}/banner/show/${id}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching banner with ID ${id}:`, error);
      return { status: false, message: 'Không thể kết nối đến server' };
    }
  }

  // Lấy banner theo vị trí
  static async getByPosition(position) {
    try {
      const response = await fetch(`${urlAPI}/banner/position/${position}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching banners for position ${position}:`, error);
      return { status: false, message: 'Không thể kết nối đến server' };
    }
  }

  // Tạo banner mới
  static async create(bannerData) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${urlAPI}/banner/store`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: bannerData // FormData object
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating banner:', error);
      return { status: false, message: 'Không thể kết nối đến server' };
    }
  }

  // Cập nhật banner
  static async update(id, bannerData) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${urlAPI}/banner/update/${id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: bannerData // FormData object
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error updating banner with ID ${id}:`, error);
      return { status: false, message: 'Không thể kết nối đến server' };
    }
  }

  // Xóa banner
  static async delete(id) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${urlAPI}/banner/destroy/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error deleting banner with ID ${id}:`, error);
      return { status: false, message: 'Không thể kết nối đến server' };
    }
  }

  // Thay đổi trạng thái banner
  static async changeStatus(id) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${urlAPI}/banner/status/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error changing status for banner with ID ${id}:`, error);
      return { status: false, message: 'Không thể kết nối đến server' };
    }
  }
}

export default BannerService;



