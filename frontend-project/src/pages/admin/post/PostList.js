import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PostService from '../../../services/PostService';
import TopicService from '../../../services/TopicService';
import { postImage } from '../../../config';
import Swal from 'sweetalert2';

function PostList() {
  const [posts, setPosts] = useState([]);
  const [topics, setTopics] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'pending', 'published', 'rejected'

  // Định nghĩa hàm loadPosts ở mức component để có thể tái sử dụng
  const loadPosts = async () => {
    try {
      setLoading(true);
      const response = await PostService.getAll();
      console.log('Posts response:', response);

      // Ưu tiên lấy mảng posts nếu có
      if (Array.isArray(response.data) && response.data.length > 0) {
        setPosts(response.data);
        setError(null);
      } else if (Array.isArray(response.posts) && response.posts.length > 0) {
        setPosts(response.posts);
        setError(null);
      } else {
        setPosts([]);
        setError(null); // Không phải lỗi, chỉ là không có bài viết
      }
    } catch (error) {
      console.error('Error loading posts:', error);
      setError('Đã xảy ra lỗi khi tải danh sách bài viết');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  // Lấy danh sách chủ đề
  const loadTopics = async () => {
    try {
      const response = await TopicService.getAll();
      // Xử lý cho cả trường hợp topics hoặc categories
      if (response.status && response.data && response.data.topics) {
        const topicsObj = {};
        response.data.topics.forEach(topic => {
          topicsObj[topic.id] = topic;
        });
        setTopics(topicsObj);
      } else if (response.status && response.categories) {
        const topicsObj = {};
        response.categories.forEach(topic => {
          topicsObj[topic.id] = topic;
        });
        setTopics(topicsObj);
      } else if (Array.isArray(response.data)) {
        // Trường hợp API trả về mảng trực tiếp
        const topicsObj = {};
        response.data.forEach(topic => {
          topicsObj[topic.id] = topic;
        });
        setTopics(topicsObj);
      } else {
        setTopics({});
      }
    } catch (error) {
      setTopics({});
    }
  };

  // Lấy danh sách bài viết và chủ đề khi component được mount
  useEffect(() => {
    loadPosts();
    loadTopics();
  }, []);

  // Hàm xử lý xóa bài viết
  const handleDelete = (id, title) => {
    console.log(`Attempting to delete post ID: ${id}, Title: ${title}`);
    
    Swal.fire({
      title: 'Bạn có chắc chắn?',
      text: `Bạn muốn xóa bài viết "${title}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          console.log(`User confirmed deletion of post ID: ${id}`);
          
          const response = await PostService.delete(id);
          console.log('Delete response:', response);
          
          if (response.status || response.success) {
            Swal.fire('Đã xóa!', 'Bài viết đã được xóa thành công.', 'success');
            loadPosts();
          } else {
            Swal.fire('Lỗi!', response.message || 'Không thể xóa bài viết.', 'error');
          }
        } catch (error) {
          console.error('Error deleting post:', error);
          Swal.fire('Lỗi!', 'Đã xảy ra lỗi khi xóa bài viết.', 'error');
        }
      }
    });
  };

  // Hàm xử lý thay đổi trạng thái
  const handleChangeStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 1 ? 2 : 1;
      const actionText = newStatus === 1 ? 'duyệt' : 'ẩn';
      
      const result = await Swal.fire({
        title: `Bạn có chắc chắn muốn ${actionText} bài viết này?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: newStatus === 1 ? '#28a745' : '#6c757d',
        cancelButtonColor: '#dc3545',
        confirmButtonText: 'Đồng ý',
        cancelButtonText: 'Hủy'
      });

      if (result.isConfirmed) {
        const response = await PostService.changeStatus(id);
        console.log('Status change response:', response);
        
        if (response.status || response.success) {
          Swal.fire('Thành công!', `Bài viết đã được ${actionText}.`, 'success');
          loadPosts();
        } else {
          Swal.fire('Lỗi!', response.message || 'Không thể thay đổi trạng thái bài viết.', 'error');
        }
      }
    } catch (error) {
      console.error('Error changing post status:', error);
      Swal.fire('Lỗi!', 'Đã xảy ra lỗi khi thay đổi trạng thái bài viết.', 'error');
    }
  };

  // Hiển thị trạng thái bài viết
  const renderStatus = (status) => {
    if (status === 1) {
      return <span className="badge bg-success">Xuất bản</span>;
    } else if (status === 2) {
      return <span className="badge bg-warning">Chưa xuất bản</span>;
    } else {
      return <span className="badge bg-danger">Đã xóa</span>;
    }
  };

  // Format ngày tháng
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="page-title">Quản lý bài viết</h2>
        <div>
          {/* Thêm button test create tạm thời */}
          <button 
            className="btn btn-success me-2"
            onClick={async () => {
              const testData = {
                title: `Test Post ${Date.now()}`,
                slug: `test-post-${Date.now()}`,
                detail: '<p>Test content</p>',
                topic_id: 1,
                status: 1
              };
              const result = await PostService.create(testData);
              console.log('Quick create result:', result);
              if (result.status || result.success) {
                loadPosts();
              }
            }}
          >
            🧪 Quick Test Create
          </button>
          
          <Link to="/admin/posts/create" className="btn btn-primary">
            <i className="fas fa-plus-circle me-2"></i>Thêm bài viết
          </Link>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      
      <div className="alert alert-info">
        <strong>Debug Info:</strong> 
        Loading: {loading.toString()} | 
        Posts count: {posts.length} | 
        Topics count: {Object.keys(topics).length} |
        API Response: {posts.length === 0 ? '✅ Success but empty array' : '✅ Has data'}
      </div>

      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
          <p className="mt-2">Đang tải dữ liệu...</p>
        </div>
      ) : (
        <div className="card">
          <div className="card-body">
            {posts.length === 0 ? (
              <div className="text-center py-5">
                <i className="fas fa-inbox fa-3x text-muted mb-3"></i>
                <h4>Chưa có bài viết nào</h4>
                <p className="text-muted">Database trống. Hãy tạo bài viết đầu tiên!</p>
                <Link to="/admin/posts/create" className="btn btn-primary">
                  <i className="fas fa-plus me-2"></i>Tạo bài viết đầu tiên
                </Link>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-striped table-hover">
                  <thead>
                    <tr>
                      <th style={{ width: '50px' }}>ID</th>
                      <th style={{ width: '100px' }}>Hình ảnh</th>
                      <th>Tiêu đề</th>
                      <th>Chủ đề</th>
                      <th>Ngày đăng</th>
                      <th>Trạng thái</th>
                      <th style={{ width: '150px' }}>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {posts.length > 0 ? (
                      posts.map((post) => (
                        <tr key={post.id}>
                          <td>{post.id}</td>
                          <td>
                            {post.image ? (
                              <img 
                                src={post.image.includes('/images/post/') 
                                  ? `${postImage}/${post.image.split('/images/post/').pop()}` 
                                  : `${postImage}/${post.image.startsWith('/') ? post.image.substring(1) : post.image}`}
                                alt={post.title} 
                                className="img-thumbnail" 
                                style={{ width: '80px', height: '60px', objectFit: 'cover' }}
                                crossOrigin="anonymous"
                                onError={(e) => {
                                  console.error('Image failed to load:', e.target.src);
                                  const currentSrc = e.target.src;
                                  if (currentSrc.includes('/images/post/images/post/')) {
                                    const correctedSrc = currentSrc.replace('/images/post/images/post/', '/images/post/');
                                    console.log('Correcting image path to:', correctedSrc);
                                    e.target.src = correctedSrc;
                                  } else {
                                    e.target.onerror = null;
                                    e.target.style.display = 'none';
                                    e.target.parentNode.innerHTML = '<div class="no-image-text">Không có ảnh</div>';
                                  }
                                }}
                              />
                            ) : (
                              <div className="no-image-text">Không có ảnh</div>
                            )}
                          </td>
                          <td>{post.title}</td>
                          <td>{topics[post.topic_id]?.name || 'Không có chủ đề'}</td>
                          <td>{formatDate(post.created_at)}</td>
                          <td>{renderStatus(post.status)}</td>
                          <td>
                            <div className="d-flex">
                              <Link to={`/admin/posts/show/${post.id}`} className="btn btn-sm btn-info me-1" title="Xem chi tiết">
                                <i className="fas fa-eye"></i>
                              </Link>
                              <Link to={`/admin/posts/edit/${post.id}`} className="btn btn-sm btn-warning me-1" title="Chỉnh sửa">
                                <i className="fas fa-edit"></i>
                              </Link>
                              <button 
                                className={`btn btn-sm ${post.status === 1 ? 'btn-secondary' : 'btn-success'} me-1`}
                                onClick={() => handleChangeStatus(post.id, post.status)}
                                title={post.status === 1 ? 'Ẩn bài' : 'Duyệt bài'}
                              >
                                <i className={`fas ${post.status === 1 ? 'fa-eye-slash' : 'fa-check'}`}></i>
                              </button>
                              <button 
                                className="btn btn-sm btn-danger" 
                                onClick={() => handleDelete(post.id, post.title)}
                                title="Xóa"
                              >
                                <i className="fas fa-trash-alt"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center">Không có bài viết nào</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default PostList;




















