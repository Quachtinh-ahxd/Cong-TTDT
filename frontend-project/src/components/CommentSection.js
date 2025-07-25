import React, { useState, useEffect } from 'react';
import CommentService from '../services/CommentService';
import Swal from 'sweetalert2';

function CommentSection({ postId, postType = 'product', onCommentUpdate }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadComments();
    loadUser();
  }, [postId]);

  // Thêm useEffect để debug comments state
  useEffect(() => {
    console.log('Comments state updated:', comments);
    console.log('Comments length:', comments.length);
    console.log('First comment:', comments[0]);
    console.log('Comments array check:', Array.isArray(comments));
  }, [comments]);

  const loadUser = () => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  };

  const loadComments = async () => {
    try {
      console.log('Loading comments for postId:', postId, 'postType:', postType);
      const response = await CommentService.getByPost(postId, postType);
      console.log('Comments response:', response);
      console.log('Response data:', response.data);
      
      // Sửa logic check response
      if (response && response.data && response.data.status) {
        console.log('Comments loaded:', response.data.comments);
        setComments(response.data.comments || []);
      } else {
        console.log('No comments or failed response');
        setComments([]);
      }
    } catch (error) {
      console.error('Error loading comments:', error);
      setComments([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      Swal.fire('Thông báo', 'Vui lòng đăng nhập để bình luận', 'warning');
      return;
    }

    if (!newComment.trim()) {
      Swal.fire('Thông báo', 'Vui lòng nhập nội dung bình luận', 'warning');
      return;
    }

    setLoading(true);
    try {
      const response = await CommentService.create({
        post_id: postId,
        post_type: postType, // Sẽ là 'product'
        content: newComment.trim()
      });

      if (response.data && response.data.status) {
        setNewComment('');
        loadComments();
        // Callback để update parent component
        if (onCommentUpdate) {
          onCommentUpdate();
        }
        Swal.fire('Thành công', 'Bình luận đã được gửi', 'success');
      } else {
        Swal.fire('Lỗi', response.data?.message || 'Không thể gửi bình luận', 'error');
      }
    } catch (error) {
      console.error('Error creating comment:', error);
      Swal.fire('Lỗi', 'Đã xảy ra lỗi khi gửi bình luận', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (commentId) => {
    try {
      const response = await CommentService.toggleStatus(commentId);
      if (response.data && response.data.status) {
        loadComments();
        Swal.fire('Thành công', 'Đã cập nhật trạng thái bình luận', 'success');
      }
    } catch (error) {
      console.error('Error toggling comment status:', error);
      Swal.fire('Lỗi', 'Không thể cập nhật trạng thái bình luận', 'error');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const isAdmin = user && (user.roles === 'admin' || user.roles === 'editor');

  return (
    <div className="comment-section mt-4">
      <div className="card">
        <div className="card-header" style={{backgroundColor: '#dc3545', color: 'white'}}>
          <h5 className="mb-0">
            <i className="fas fa-comments me-2"></i>
            BÌNH LUẬN ({comments.length})
          </h5>
        </div>
        <div className="card-body">
          {/* Form bình luận */}
          {user ? (
            <form onSubmit={handleSubmit} className="mb-4">
              <div className="mb-3">
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Nhập bình luận của bạn..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  disabled={loading}
                />
              </div>
              <button
                type="submit"
                className="btn btn-danger"
                disabled={loading || !newComment.trim()}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Đang gửi...
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane me-2"></i>
                    Gửi bình luận
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="alert alert-info mb-4">
              <i className="fas fa-info-circle me-2"></i>
              Vui lòng đăng nhập để bình luận
            </div>
          )}

          {/* Danh sách bình luận */}
          {comments.length > 0 ? (
            <div className="comments-list">
              {comments.map((comment) => (
                <div key={comment.id} className={`comment-item mb-3 p-3 border rounded ${comment.status === 0 ? 'bg-light opacity-50' : ''}`}>
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center mb-2">
                        <strong className="me-2 text-primary">{comment.user_name || 'Người dùng'}</strong>
                        <small className="text-muted">{formatDate(comment.created_at)}</small>
                        {comment.status === 0 && (
                          <span className="badge bg-warning ms-2">Đã ẩn</span>
                        )}
                      </div>
                      <p className="mb-0">{comment.content}</p>
                    </div>
                    {isAdmin && (
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => handleToggleStatus(comment.id)}
                      >
                        {comment.status === 1 ? 'Ẩn' : 'Hiện'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted py-4">
              <i className="fas fa-comments fa-3x mb-3"></i>
              <p>Chưa có bình luận nào.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CommentSection;












