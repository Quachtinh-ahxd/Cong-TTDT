import { urlAPI } from '../config';

console.log('BrandService loaded, urlAPI:', urlAPI);

class BrandService {
  // Lấy tất cả thương hiệu
  static async getAll() {
    try {
      console.log('=== BrandService.getAll() called ===');
      console.log('API URL:', `${urlAPI}/brands`);
      
      // SỬA: Đổi từ /brand thành /brands
      const response = await fetch(`${urlAPI}/brands`);
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      const data = await response.json();
      console.log('Brands API response:', data);
      
      return data;
    } catch (error) {
      console.error('Error fetching brands:', error);
      return { status: false, message: 'Không thể kết nối đến server' };
    }
  }

  // Lấy thương hiệu theo ID
  static async getById(id) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${urlAPI}/brands/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      return data; // Trả về data gốc như ProductService
      
    } catch (error) {
      console.error(`Error fetching brand with ID ${id}:`, error);
      return { status: false, message: 'Không thể kết nối đến server' };
    }
  }

  // Tạo thương hiệu mới
  static async create(brandData) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${urlAPI}/brands/store`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(brandData)
      });
      
      console.log('Create response status:', response.status);
      console.log('Create response ok:', response.ok);
      
      const data = await response.json();
      console.log('Create response data:', data);
      
      // Trả về format chuẩn
      return {
        success: response.ok,
        status: response.ok,
        httpStatus: response.status,
        httpOk: response.ok,
        message: data.message || (response.ok ? 'Tạo thành công' : 'Tạo thất bại'),
        data: data
      };
      
    } catch (error) {
      console.error('Error creating brand:', error);
      return { 
        success: false,
        status: false, 
        message: 'Không thể kết nối đến server' 
      };
    }
  }

  // Cập nhật thương hiệu
  static async update(id, brandData) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${urlAPI}/brands/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(brandData)
      });
      
      const data = await response.json();
      return data; // Trả về data gốc như ProductService
      
    } catch (error) {
      console.error(`Error updating brand with ID ${id}:`, error);
      return { status: false, message: 'Không thể cập nhật thương hiệu' };
    }
  }

  // Xóa thương hiệu
  static async delete(id) {
    try {
      const token = localStorage.getItem('token');
      
      // THỬ PATTERN RESTFUL TRƯỚC (như CategoryService đã hoạt động)
      console.log('Trying DELETE /brands/' + id);
      let response = await fetch(`${urlAPI}/brands/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Nếu 404, thử endpoint delete
      if (response.status === 404) {
        console.log('404 - Trying DELETE /brands/delete/' + id);
        response = await fetch(`${urlAPI}/brands/delete/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }
      
      // Nếu vẫn 404, thử endpoint force-delete  
      if (response.status === 404) {
        console.log('404 - Trying DELETE /brands/force-delete/' + id);
        response = await fetch(`${urlAPI}/brands/force-delete/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }
      
      // Nếu vẫn 404, thử endpoint hard-delete
      if (response.status === 404) {
        console.log('404 - Trying DELETE /brands/hard-delete/' + id);
        response = await fetch(`${urlAPI}/brands/hard-delete/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }
      
      console.log('Final response status:', response.status);
      
      const data = await response.json();
      console.log('Delete response data:', data);
      
      return {
        httpStatus: response.status,
        httpOk: response.ok,
        ...data
      };
      
    } catch (error) {
      console.error('Error deleting brand:', error);
      return { status: false, message: 'Không thể kết nối đến server' };
    }
  }

  // Đổi trạng thái thương hiệu
  static async changeStatus(id) {
    try {
      const token = localStorage.getItem('token');
      // SỬA: Đổi từ /brand thành /brands
      const response = await fetch(`${urlAPI}/brands/status/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error changing brand status:', error);
      return { status: false, message: 'Không thể kết nối đến server' };
    }
  }
}

export default BrandService;

