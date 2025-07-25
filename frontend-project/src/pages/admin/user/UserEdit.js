import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import UserService from '../../../services/UserService';
import ImageWithFallback from '../../../components/common/ImageWithFallback';
import Swal from 'sweetalert2';

function UserEdit() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    roles: 'user',
    status: '1',
    phone: '',
    image: null
  });
  
  const [currentImage, setCurrentImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadUser();
  }, [id]);

  const loadUser = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await UserService.getById(id);
      
      let userData = null;
      if (response?.data?.success && response.data.data) {
        userData = response.data.data;
      } else if (response?.data) {
        userData = response.data;
      }
      
      if (userData) {
        setFormData({
          name: userData.name || '',
          username: userData.username || '',
          email: userData.email || '',
          password: '', // Không load password cũ
          roles: userData.roles || userData.role || 'user',
          status: userData.status?.toString() || '1',
          phone: userData.phone || '',
          image: null
        });
        setCurrentImage(userData.image);
      } else {
        setError('Không tìm thấy thông tin người dùng');
      }
      
    } catch (error) {
      console.error('Error loading user:', error);
      setError('Đã xảy ra lỗi khi tải thông tin người dùng');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        image: file
      });
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      
      // Validation
      if (!formData.name.trim()) {
        Swal.fire('Lỗi!', 'Vui lòng nhập tên người dùng.', 'error');
        return;
      }
      
      if (!formData.email.trim()) {
        Swal.fire('Lỗi!', 'Vui lòng nhập email.', 'error');
        return;
      }
      
      // Tạo FormData để gửi file
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('username', formData.username);
      submitData.append('email', formData.email);
      
      // Chỉ gửi password nếu có nhập
      if (formData.password.trim()) {
        submitData.append('password', formData.password);
      }
      
      submitData.append('roles', formData.roles);
      submitData.append('status', formData.status);
      submitData.append('phone', formData.phone);
      
      // Thêm file ảnh nếu có
      if (formData.image) {
        submitData.append('image', formData.image);
      }
      
      const response = await UserService.update(id, submitData);
      
      if (response.success || response.status) {
        Swal.fire({
          title: 'Thành công!',
          text: 'Cập nhật người dùng thành công.',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          navigate('/admin/users');
        });
      } else {
        Swal.fire('Lỗi!', response.message || 'Không thể cập nhật người dùng.', 'error');
      }
      
    } catch (error) {
      console.error('Error updating user:', error);
      
      let errorMessage = 'Đã xảy ra lỗi khi cập nhật người dùng.';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors) {
        const errors = Object.values(error.response.data.errors).flat();
        errorMessage = errors.join('\n');
      }
      
      Swal.fire('Lỗi!', errorMessage, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container-fluid">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
          <p className="mt-2">Đang tải thông tin người dùng...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid">
        <div className="alert alert-danger">
          <i className="fa fa-exclamation-triangle me-2"></i>
          {error}
          <div className="mt-3">
            <Link to="/admin/users" className="btn btn-secondary">
              <i className="fa fa-arrow-left me-2"></i>
              Quay lại danh sách
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Chỉnh sửa người dùng #{id}</h3>
              <div className="card-tools">
                <Link to="/admin/users" className="btn btn-secondary">
                  <i className="fa fa-arrow-left me-2"></i>
                  Quay lại
                </Link>
              </div>
            </div>

            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-8">
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label">
                        Tên người dùng <span className="text-danger">*</span>
                      </label>
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

                    <div className="mb-3">
                      <label htmlFor="username" className="form-label">Username</label>
                      <input
                        type="text"
                        className="form-control"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">
                        Email <span className="text-danger">*</span>
                      </label>
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
                      <label htmlFor="password" className="form-label">
                        Mật khẩu mới
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Để trống nếu không muốn thay đổi"
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="phone" className="form-label">Số điện thoại</label>
                      <input
                        type="text"
                        className="form-control"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="row">
                      <div className="col-md-6">
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
                            <option value="admin">Quản trị viên</option>
                            <option value="manager">Quản lý</option>
                            <option value="customer">Khách hàng</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-md-6">
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
                            <option value="0">Không hoạt động</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-4">
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
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Ảnh hiện tại:</label>
                      <div className="text-center">
                        {imagePreview ? (
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="img-fluid rounded"
                            style={{ maxWidth: '200px', maxHeight: '200px' }}
                          />
                        ) : currentImage ? (
                          <ImageWithFallback
                            type="user"
                            filename={currentImage}
                            alt="Current"
                            className="img-fluid rounded"
                            style={{ maxWidth: '200px', maxHeight: '200px' }}
                          />
                        ) : (
                          <div 
                            className="bg-light rounded d-flex align-items-center justify-content-center"
                            style={{ width: '200px', height: '200px' }}
                          >
                            <i className="fa fa-user fa-3x text-muted"></i>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-12">
                    <div className="d-flex justify-content-end">
                      <Link to="/admin/users" className="btn btn-secondary me-2">
                        Hủy
                      </Link>
                      <button 
                        type="submit" 
                        className="btn btn-primary"
                        disabled={submitting}
                      >
                        {submitting ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            Đang cập nhật...
                          </>
                        ) : (
                          <>
                            <i className="fa fa-save me-2"></i>
                            Cập nhật
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserEdit;

