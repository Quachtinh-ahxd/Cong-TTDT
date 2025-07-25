import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import UserService from '../../services/UserService';
import ProductService from '../../services/ProductService';
import SiteProductImage from '../../components/site/SiteProductImage';
import './Profile.css';
import ImageWithFallback from '../../components/common/ImageWithFallback';

function Profile() {
  const [user, setUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('info');

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (!token || !userData) {
        window.location.href = '/login';
        return;
      }

      // Sử dụng thông tin user từ localStorage trước
      const userFromStorage = JSON.parse(userData);
      setUser(userFromStorage);

      // Thử lấy thông tin từ API bằng getById
      try {
        const userResponse = await UserService.getById(userFromStorage.id);
        if (userResponse.data && userResponse.data.user) {
          setUser(userResponse.data.user);
        }
      } catch (apiError) {
        console.log('API getById failed, using localStorage data');
        // Tiếp tục với dữ liệu từ localStorage
      }
      
      // Lấy bài viết của user
      try {
        const postsResponse = await ProductService.getAll();
        if (postsResponse.data && postsResponse.data.products) {
          const myPosts = postsResponse.data.products.filter(
            product => product.created_by === userFromStorage.id
          );
          setUserPosts(myPosts);
        }
      } catch (postsError) {
        console.log('Failed to load user posts:', postsError);
      }
      
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning">
          Vui lòng đăng nhập để xem hồ sơ
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="container mt-4">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="row">
            <div className="col-md-3">
              <div className="profile-avatar">
                <ImageWithFallback 
                  type="user" 
                  filename={user.image}
                  alt={user.name}
                  className="avatar-img"
                />
              </div>
            </div>
            <div className="col-md-9">
              <div className="profile-info">
                <h2 className="profile-name">{user.name}</h2>
                <p className="profile-email">{user.email}</p>
                <div className="profile-stats">
                  <div className="stat-item">
                    <span className="stat-number">{userPosts.length}</span>
                    <span className="stat-label">Bài viết</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">{user.role === 1 ? 'Admin' : 'Thành viên'}</span>
                    <span className="stat-label">Vai trò</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Tabs */}
        <div className="profile-tabs">
          <ul className="nav nav-tabs">
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'info' ? 'active' : ''}`}
                onClick={() => setActiveTab('info')}
              >
                Thông tin cá nhân
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'posts' ? 'active' : ''}`}
                onClick={() => setActiveTab('posts')}
              >
                Bài viết của tôi
              </button>
            </li>
          </ul>
        </div>

        {/* Tab Content */}
        <div className="tab-content mt-4">
          {activeTab === 'info' && (
            <div className="profile-info-tab">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Thông tin cá nhân</h5>
                  <div className="row">
                    <div className="col-md-6">
                      <p><strong>Họ tên:</strong> {user.name}</p>
                      <p><strong>Email:</strong> {user.email}</p>
                      <p><strong>Vai trò:</strong> {user.role === 1 ? 'Quản trị viên' : 'Thành viên'}</p>
                    </div>
                    <div className="col-md-6">
                      <p><strong>Ngày tham gia:</strong> {new Date(user.created_at).toLocaleDateString('vi-VN')}</p>
                      <p><strong>Trạng thái:</strong> {user.status === 1 ? 'Hoạt động' : 'Không hoạt động'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'posts' && (
            <div className="profile-posts-tab">
              <h5>Bài viết của tôi ({userPosts.length})</h5>
              {userPosts.length > 0 ? (
                <div className="row">
                  {userPosts.map((post) => (
                    <div key={post.id} className="col-lg-4 col-md-6 mb-4">
                      <div className="card h-100">
                        <div style={{ height: '200px', overflow: 'hidden' }}>
                          <SiteProductImage
                            image={post.image}
                            alt={post.name}
                            className="card-img-top"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </div>
                        <div className="card-body">
                          <h6 className="card-title">
                            <Link to={`/products/${post.id}`}>
                              {post.name}
                            </Link>
                          </h6>
                          <p className="card-text text-muted">
                            {post.description?.substring(0, 100)}...
                          </p>
                          <div className="post-meta">
                            <small className="text-muted">
                              <i className="fas fa-calendar me-1"></i>
                              {new Date(post.created_at).toLocaleDateString('vi-VN')}
                            </small>
                            <br />
                            <small className={`badge ${post.is_approved === 1 ? 'bg-success' : 'bg-warning'}`}>
                              {post.is_approved === 1 ? 'Đã duyệt' : 'Chờ duyệt'}
                            </small>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-5">
                  <p className="text-muted">Bạn chưa có bài viết nào.</p>
                  <Link to="/create-post" className="btn btn-primary">
                    Tạo bài viết đầu tiên
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;





