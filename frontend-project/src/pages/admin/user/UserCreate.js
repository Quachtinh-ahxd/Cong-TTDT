import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import UserService from '../../../services/UserService';
import Swal from 'sweetalert2';
import './UserForm.css';

function UserCreate() {
  const navigate = useNavigate();
  
  // State cho form
  const [formData, setFormData] = useState({
    name: '',
    username: '', // Thêm trường username
    email: '',
    password: '',
    roles: 'user',
    status: '1',
    image: null
  });
  
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Xử lý thay đổi file ảnh
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        image: file
      });
      
      // Tạo preview ảnh
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Kiểm tra dữ liệu
    if (!formData.name || !formData.username || !formData.email || !formData.password) {
      Swal.fire(
        'Lỗi!',
        'Vui lòng điền đầy đủ thông tin người dùng.',
        'error'
      );
      return;
    }
    
    try {
      setLoading(true);
      
      // Tạo FormData để gửi file
      const data = new FormData();
      data.append('name', formData.name);
      data.append('username', formData.username); // Thêm username vào FormData
      data.append('email', formData.email);
      data.append('password', formData.password);
      data.append('roles', formData.roles);
      data.append('status', formData.status);
      
      if (formData.image) {
        data.append('image', formData.image);
      }
      
      // Log dữ liệu gửi đi để debug
      console.log('Sending user data:', {
        name: formData.name,
        username: formData.username, // Log username
        email: formData.email,
        roles: formData.roles,
        status: formData.status,
        hasImage: !!formData.image
      });
      
      // Gọi API tạo người dùng
      const response = await UserService.create(data);
      
      if (response.status) {
        Swal.fire(
          'Thành công!',
          'Người dùng đã được tạo thành công.',
          'success'
        ).then(() => {
          // Chuyển hướng về trang danh sách người dùng
          navigate('/admin/users');
        });
      } else {
        Swal.fire(
          'Lỗi!',
          response.message || 'Không thể tạo người dùng.',
          'error'
        );
      }
    } catch (error) {
      console.error('Error creating user:', error);
      
      // Hiển thị thông tin chi tiết về lỗi
      let errorMessage = 'Đã xảy ra lỗi khi tạo người dùng.';
      
      if (error.response) {
        // Lỗi từ server với response
        console.error('Error response:', error.response);
        errorMessage = `Lỗi server (${error.response.status}): ${error.response.data?.message || error.response.statusText}`;
        
        // Kiểm tra lỗi validation
        if (error.response.data?.errors) {
          const validationErrors = Object.values(error.response.data.errors).flat();
          if (validationErrors.length > 0) {
            errorMessage = validationErrors.join('\n');
          }
        }
      } else if (error.request) {
        // Lỗi không nhận được response
        console.error('Error request:', error.request);
        errorMessage = 'Không nhận được phản hồi từ server. Vui lòng kiểm tra kết nối mạng.';
      } else {
        // Lỗi khác
        errorMessage = `Lỗi: ${error.message}`;
      }
      
      Swal.fire(
        'Lỗi!',
        errorMessage,
        'error'
      );
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container-fluid">
      <h1 className="page-title">Thêm người dùng mới</h1>
      <ol className="breadcrumb mb-4">
        <li className="breadcrumb-item"><Link to="/admin">Dashboard</Link></li>
        <li className="breadcrumb-item"><Link to="/admin/users">Người dùng</Link></li>
        <li className="breadcrumb-item active">Thêm mới</li>
      </ol>
      
      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-8">
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Tên người dùng <span className="text-danger">*</span></label>
                  <input 
                    type="text" 
                    className="form-control" 
                    id="name" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                {/* Thêm trường username */}
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">Tên đăng nhập <span className="text-danger">*</span></label>
                  <input 
                    type="text" 
                    className="form-control" 
                    id="username" 
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                  <small className="form-text text-muted">Tên đăng nhập không được để trống</small>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email <span className="text-danger">*</span></label>
                  <input 
                    type="email" 
                    className="form-control" 
                    id="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Mật khẩu <span className="text-danger">*</span></label>
                  <input 
                    type="password" 
                    className="form-control" 
                    id="password" 
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="roles" className="form-label">Vai trò</label>
                  <select 
                    className="form-select" 
                    id="roles" 
                    name="roles"
                    value={formData.roles}
                    onChange={handleChange}
                  >
                    <option value="user">Người dùng</option>
                    <option value="editor">Biên tập viên</option>
                    <option value="admin">Quản trị viên</option>
                  </select>
                </div>
              </div>
              
              <div className="col-md-4">
                <div className="mb-3">
                  <label htmlFor="status" className="form-label">Trạng thái</label>
                  <select 
                    className="form-select" 
                    id="status" 
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="1">Hoạt động</option>
                    <option value="0">Bị khóa</option>
                  </select>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="image" className="form-label">Hình ảnh</label>
                  <input 
                    type="file" 
                    className="form-control" 
                    id="image" 
                    name="image"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  
                  {imagePreview && (
                    <div className="mt-3 text-center">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="img-thumbnail user-image-preview" 
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="text-end mt-4">
              <button 
                type="button" 
                className="btn btn-secondary me-2"
                onClick={() => navigate('/admin/users')}
              >
                Hủy
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Đang xử lý...
                  </>
                ) : (
                  <>Tạo người dùng</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UserCreate;






