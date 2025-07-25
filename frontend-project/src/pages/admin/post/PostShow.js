import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import PostService from '../../../services/PostService';
import { postImage } from '../../../config';

function PostShow() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await PostService.getById(id);
      
      console.log('Post response:', response);
      
      if (response.status && response.data) {
        setPost(response.data);
        setError(null);
      } else if (response.success && response.data) {
        setPost(response.data);
        setError(null);
      } else {
        setError(response.message || 'Không thể tải thông tin bài viết');
        setPost(null);
      }
    } catch (error) {
      console.error('Error loading post:', error);
      setError('Đã xảy ra lỗi khi tải thông tin bài viết');
      setPost(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="page-title">Chi tiết bài viết</h2>
        <div>
          <Link to={`/admin/posts/edit/${id}`} className="btn btn-warning me-2">
            <i className="fas fa-edit me-2"></i>Chỉnh sửa
          </Link>
          <Link to="/admin/posts" className="btn btn-secondary">
            <i className="fas fa-arrow-left me-2"></i>Quay lại
          </Link>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">{error}</div>
      )}

      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
          <p className="mt-2">Đang tải dữ liệu...</p>
        </div>
      ) : post ? (
        <div className="card">
          <div className="card-body">
            <div className="row">
              <div className="col-md-8">
                <h3>Thông tin bài viết</h3>
                <table className="table table-borderless">
                  <tbody>
                    <tr>
                      <td><strong>ID:</strong></td>
                      <td>{post.id}</td>
                    </tr>
                    <tr>
                      <td><strong>TIÊU ĐỀ:</strong></td>
                      <td>{post.title}</td>
                    </tr>
                    <tr>
                      <td><strong>SLUG:</strong></td>
                      <td>{post.slug}</td>
                    </tr>
                    <tr>
                      <td><strong>TÓM TẮT:</strong></td>
                      <td>{post.summary || 'Không có tóm tắt'}</td>
                    </tr>
                    <tr>
                      <td><strong>NỘI DUNG:</strong></td>
                      <td>
                        <div dangerouslySetInnerHTML={{ __html: post.detail }} />
                      </td>
                    </tr>
                    <tr>
                      <td><strong>TRẠNG THÁI:</strong></td>
                      <td>
                        {post.status === 1 ? (
                          <span className="badge bg-success">Xuất bản</span>
                        ) : post.status === 2 ? (
                          <span className="badge bg-warning">Chưa xuất bản</span>
                        ) : (
                          <span className="badge bg-danger">Đã xóa</span>
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td><strong>NGÀY TẠO:</strong></td>
                      <td>
                        {post.created_at ? 
                          new Date(post.created_at).toLocaleDateString('vi-VN') : 
                          'N/A'}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="col-md-4">
                <h3>Hình ảnh bài viết</h3>
                {post.image ? (
                  <img 
                    src={`${postImage}/${post.image}`}
                    alt={post.title} 
                    className="img-fluid rounded shadow"
                    style={{ maxHeight: '300px' }}
                  />
                ) : (
                  <div className="text-center p-5 bg-light rounded">
                    <i className="fas fa-image fa-3x text-muted mb-3"></i>
                    <p className="text-muted">Không có hình ảnh</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="alert alert-warning" role="alert">
          Không tìm thấy thông tin bài viết.
        </div>
      )}
    </div>
  );
}

export default PostShow;


