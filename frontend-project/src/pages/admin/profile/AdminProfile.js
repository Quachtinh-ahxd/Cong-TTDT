import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserService from '../../../services/UserService';
import { userImage } from '../../../config';
import Swal from 'sweetalert2';
import './AdminProfile.css';

function AdminProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [updating, setUpdating] = useState(false);

  // Helper function để tạo URL ảnh đúng
  const getUserImageUrl = (imagePath) => {
    if (!imagePath) return '/default-avatar.png';
    
    // Nếu đã là URL đầy đủ
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // Nếu đã có prefix /images/user/
    if (imagePath.includes('/images/user/')) {
      return `${userImage}/${imagePath.split('/images/user/').pop()}`;
    }
    
    // Nếu chỉ là tên file
    return `${userImage}/${imagePath.startsWith('/') ? imagePath.substring(1) : imagePath}`;
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const currentUser = JSON.parse(localStorage.getItem('user'));
      if (!currentUser || !currentUser.id) {
        navigate('/admin/login');
        return;
      }

      const response = await UserService.getById(currentUser.id);
      console.log('Profile response:', response); // Debug log
      
      if (response.data && response.data.status) {
        const userData = response.data.user;
        console.log('User data:', userData); // Debug log
        console.log('User image:', userData.image); // Debug log
        
        setUser(userData);
        setFormData({
          name: userData.name || '',
          email: userData.email || '',
          password: '',
          confirmPassword: '',
          image: null
        });
        
        // Cập nhật cách xử lý ảnh
        if (userData.image) {
          const imageUrl = getUserImageUrl(userData.image);
          console.log('Generated image URL:', imageUrl); // Debug log
          setImagePreview(imageUrl);
        } else {
          setImagePreview('/default-avatar.png');
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      Swal.fire('Lỗi!', 'Không thể tải thông tin hồ sơ', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        Swal.fire('Lỗi!', 'Vui lòng chọn file hình ảnh', 'error');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire('Lỗi!', 'Kích thước file không được vượt quá 5MB', 'error');
        return;
      }
      
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password && formData.password !== formData.confirmPassword) {
      Swal.fire('Lỗi!', 'Mật khẩu xác nhận không khớp', 'error');
      return;
    }

    try {
      setUpdating(true);
      
      const updateData = new FormData();
      updateData.append('name', formData.name);
      updateData.append('email', formData.email);
      
      if (formData.password) {
        updateData.append('password', formData.password);
      }
      
      if (formData.image) {
        updateData.append('image', formData.image);
      }

      const response = await UserService.update(user.id, updateData);
      
      if (response.data && response.data.status) {
        Swal.fire('Thành công!', 'Cập nhật hồ sơ thành công', 'success');
        setEditing(false);
        loadProfile();
        
        // Update localStorage if needed
        const currentUser = JSON.parse(localStorage.getItem('user'));
        if (currentUser) {
          currentUser.name = formData.name;
          currentUser.email = formData.email;
          localStorage.setItem('user', JSON.stringify(currentUser));
        }
      } else {
        Swal.fire('Lỗi!', response.data?.message || 'Cập nhật thất bại', 'error');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Swal.fire('Lỗi!', 'Đã xảy ra lỗi khi cập nhật hồ sơ', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const cancelEdit = () => {
    setEditing(false);
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      password: '',
      confirmPassword: '',
      image: null
    });
    
    // Reset image preview về ảnh gốc
    if (user?.image) {
      setImagePreview(getUserImageUrl(user.image));
    } else {
      setImagePreview('/default-avatar.png');
    }
  };

  // Component để hiển thị ảnh với error handling
  const ProfileImage = ({ src, alt, className }) => {
    const [imgSrc, setImgSrc] = useState(src);
    const [loading, setLoading] = useState(true);

    const handleImageError = () => {
      console.error('Image failed to load:', imgSrc);
      setImgSrc('/default-avatar.png');
      setLoading(false);
    };

    const handleImageLoad = () => {
      setLoading(false);
    };

    useEffect(() => {
      setImgSrc(src);
      setLoading(true);
    }, [src]);

    return (
      <div className="image-container">
        {loading && (
          <div className="image-loading">
            <div className="spinner-border spinner-border-sm" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}
        <img 
          src={imgSrc}
          alt={alt}
          className={className}
          onError={handleImageError}
          onLoad={handleImageLoad}
          style={{ display: loading ? 'none' : 'block' }}
          crossOrigin="anonymous"
        />
      </div>
    );
  };

  if (loading) {
    return (
      <div className="container-fluid pt-4 px-4">
        <div className="bg-light rounded p-4 text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Đang tải hồ sơ...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container-fluid pt-4 px-4">
        <div className="bg-light rounded p-4 text-center">
          <h4>Không tìm thấy thông tin hồ sơ</h4>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid pt-4 px-4">
      <div className="row">
        <div className="col-12">
          <div className="bg-light rounded p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="mb-0">Hồ sơ của tôi</h4>
              {!editing && (
                <button 
                  className="btn btn-primary"
                  onClick={() => setEditing(true)}
                >
                  <i className="fas fa-edit me-1"></i> Chỉnh sửa
                </button>
              )}
            </div>

            <div className="row">
              {/* Profile Info */}
              <div className="col-lg-4">
                <div className="profile-card">
                  <div className="profile-avatar">
                    <ProfileImage 
                      src={imagePreview || '/default-avatar.png'} 
                      alt="Avatar"
                      className="avatar-image"
                    />
                    {editing && (
                      <div className="avatar-upload">
                        <input 
                          type="file" 
                          id="avatar-upload"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="d-none"
                        />
                        <label htmlFor="avatar-upload" className="upload-btn">
                          <i className="fas fa-camera"></i>
                        </label>
                      </div>
                    )}
                  </div>
                  
                  {!editing && (
                    <div className="profile-info">
                      <h5 className="profile-name">{user.name}</h5>
                      <p className="profile-email">{user.email}</p>
                      <span className="profile-role">
                        {user.roles === 'admin' ? 'Quản trị viên' : 
                         user.roles === 'editor' ? 'Biên tập viên' : 'Người dùng'}
                      </span>
                      <div className="profile-stats">
                        <div className="stat-item">
                          <span className="stat-label">Trạng thái</span>
                          <span className={`stat-value ${user.status == 1 ? 'active' : 'inactive'}`}>
                            {user.status == 1 ? 'Hoạt động' : 'Không hoạt động'}
                          </span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-label">Ngày tạo</span>
                          <span className="stat-value">
                            {new Date(user.created_at).toLocaleDateString('vi-VN')}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Profile Form */}
              <div className="col-lg-8">
                {editing ? (
                  <form onSubmit={handleSubmit} className="profile-form">
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Họ và tên</label>
                        <input
                          type="text"
                          className="form-control"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Email</label>
                        <input
                          type="email"
                          className="form-control"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Mật khẩu mới (để trống nếu không đổi)</label>
                        <input
                          type="password"
                          className="form-control"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          placeholder="Nhập mật khẩu mới"
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Xác nhận mật khẩu</label>
                        <input
                          type="password"
                          className="form-control"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          placeholder="Xác nhận mật khẩu mới"
                        />
                      </div>
                    </div>

                    <div className="form-actions">
                      <button 
                        type="submit" 
                        className="btn btn-success me-2"
                        disabled={updating}
                      >
                        {updating ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-1"></span>
                            Đang cập nhật...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-save me-1"></i> Lưu thay đổi
                          </>
                        )}
                      </button>
                      <button 
                        type="button" 
                        className="btn btn-secondary"
                        onClick={cancelEdit}
                        disabled={updating}
                      >
                        <i className="fas fa-times me-1"></i> Hủy
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="profile-details">
                    <h5 className="section-title">Thông tin chi tiết</h5>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <label>Họ và tên:</label>
                        <span>{user.name}</span>
                      </div>
                      <div className="detail-item">
                        <label>Email:</label>
                        <span>{user.email}</span>
                      </div>
                      <div className="detail-item">
                        <label>Vai trò:</label>
                        <span>
                          {user.roles === 'admin' ? 'Quản trị viên' : 
                           user.roles === 'editor' ? 'Biên tập viên' : 'Người dùng'}
                        </span>
                      </div>
                      <div className="detail-item">
                        <label>Trạng thái:</label>
                        <span className={user.status == 1 ? 'text-success' : 'text-danger'}>
                          {user.status == 1 ? 'Hoạt động' : 'Không hoạt động'}
                        </span>
                      </div>
                      <div className="detail-item">
                        <label>Ngày tạo:</label>
                        <span>{new Date(user.created_at).toLocaleDateString('vi-VN')}</span>
                      </div>
                      <div className="detail-item">
                        <label>Cập nhật lần cuối:</label>
                        <span>{new Date(user.updated_at).toLocaleDateString('vi-VN')}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminProfile;

