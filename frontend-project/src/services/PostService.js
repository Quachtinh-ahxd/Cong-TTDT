import { urlAPI } from '../config';

class PostService {
  // Lấy tất cả bài viết - chỉ dùng endpoint thật sự
  static async getAll() {
    try {
      const token = localStorage.getItem('token');
      // Đổi lại endpoint đúng
      const response = await fetch(`${urlAPI}/posts`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return { status: false, message: 'Không thể kết nối đến server' };
    }
  }

  // Lấy bài viết theo ID
  static async getById(id) {
    try {
      const token = localStorage.getItem('token');
      let response = await fetch(`${urlAPI}/posts/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.status === 404) {
        response = await fetch(`${urlAPI}/posts/show/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return { status: false, message: 'Không thể kết nối đến server' };
    }
  }

  // Tạo bài viết mới
  static async create(postData) {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      Object.keys(postData).forEach(key => {
        if (postData[key] !== null && postData[key] !== undefined) {
          formData.append(key, postData[key]);
        }
      });
      const response = await fetch(`${urlAPI}/posts/store`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return { status: false, message: 'Không thể tạo bài viết' };
    }
  }

  // Cập nhật bài viết
  static async update(id, postData) {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      Object.keys(postData).forEach(key => {
        if (postData[key] !== null && postData[key] !== undefined) {
          formData.append(key, postData[key]);
        }
      });
      formData.append('_method', 'PUT');
      let response = await fetch(`${urlAPI}/posts/${id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      if (response.status === 404) {
        response = await fetch(`${urlAPI}/posts/update/${id}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return { status: false, message: 'Không thể cập nhật bài viết' };
    }
  }

  // Xóa bài viết
  static async delete(id) {
    try {
      const token = localStorage.getItem('token');
      let response = await fetch(`${urlAPI}/posts/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.status === 404) {
        response = await fetch(`${urlAPI}/posts/destroy/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return { status: false, message: 'Không thể xóa bài viết' };
    }
  }

  // Thay đổi trạng thái
  static async changeStatus(id) {
    try {
      const token = localStorage.getItem('token');
      let response = await fetch(`${urlAPI}/posts/status/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.status === 404) {
        response = await fetch(`${urlAPI}/posts/${id}/status`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }
      if (response.status === 404) {
        response = await fetch(`${urlAPI}/posts/status/${id}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return { status: false, message: 'Không thể thay đổi trạng thái' };
    }
  }

  // Upload ảnh bài viết
  static async uploadImage(imageFile) {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('image', imageFile);
      const response = await fetch(`${urlAPI}/posts/upload-image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return { status: false, message: 'Không thể upload ảnh' };
    }
  }

  // Lấy bài viết theo topic
  static async getByTopic(topicId) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${urlAPI}/posts/topic/${topicId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return { status: false, message: 'Không thể kết nối đến server' };
    }
  }
}

export default PostService;




