import { urlAPI } from '../config';

class CategoryService {
  // Tạo danh mục mới
  static async create(categoryData) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${urlAPI}/categories`, { // Sửa: /categories thay vì /category
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(categoryData)
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating category:', error);
      return { status: false, message: 'Không thể kết nối đến server' };
    }
  }

  // Lấy tất cả danh mục
  static async getAll() {
    try {
      console.log('=== CategoryService.getAll() called ===');
      console.log('API URL:', `${urlAPI}/categories`); // Sửa: /categories thay vì /category
      
      const response = await fetch(`${urlAPI}/categories`, { // Sửa: /categories thay vì /category
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      if (!response.ok) {
        console.error('CategoryService API Error:', response.status, response.statusText);
        const errorText = await response.text();
        console.error('Error response body:', errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Categories API response:', data);
      return data;
    } catch (error) {
      console.error('CategoryService.getAll() error:', error);
      return { status: false, message: 'Không thể kết nối đến server' };
    }
  }

  // Lấy danh mục theo ID
  static async getById(id) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${urlAPI}/categories/${id}`, { // Sửa: /categories thay vì /category
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching category with ID ${id}:`, error);
      return { status: false, message: 'Không thể kết nối đến server' };
    }
  }

  // Cập nhật danh mục
  static async update(id, categoryData) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${urlAPI}/categories/${id}`, { // Sửa: /categories thay vì /category
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(categoryData)
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error updating category with ID ${id}:`, error);
      return { status: false, message: 'Không thể kết nối đến server' };
    }
  }

  // Xóa danh mục
  static async delete(id) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${urlAPI}/categories/${id}`, { 
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('=== DELETE Response Debug ===');
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      const data = await response.json();
      console.log('Response data:', data);
      console.log('=== End Debug ===');
      
      // Kiểm tra response thành công
      if (response.ok) {
        // Trả về format chuẩn
        return {
          success: true,
          status: true,
          message: data.message || 'Xóa danh mục thành công',
          data: data
        };
      } else {
        return {
          success: false,
          status: false,
          message: data.message || 'Không thể xóa danh mục',
          data: data
        };
      }
      
    } catch (error) {
      console.error(`Error deleting category with ID ${id}:`, error);
      return { 
        success: false,
        status: false, 
        message: 'Không thể kết nối đến server' 
      };
    }
  }

  // Thay đổi trạng thái danh mục
  static async changeStatus(id, status) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${urlAPI}/categories/change-status/${id}`, { // Sửa: /categories thay vì /category
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error changing status for category with ID ${id}:`, error);
      return { status: false, message: 'Không thể kết nối đến server' };
    }
  }
}

export default CategoryService;




