import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ProductService from '../../../services/ProductService';
import SiteProductImage from '../../../components/site/SiteProductImage';
import CommentSection from '../../../components/CommentSection';

function PostShow() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await ProductService.getById(id);
        
        if (response.status) {
          setPost(response.product);
        } else {
          setError(response.message || 'Không thể tải thông tin sản phẩm');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Đã xảy ra lỗi khi tải thông tin sản phẩm');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPost();
  }, [id]);
  
  // Định dạng ngày tháng
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };
  
  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
          <p className="mt-2">Đang tải thông tin bài viết...</p>
        </div>
      </div>
    );
  }
  
  if (error || !post) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          {error || 'Không tìm thấy bài viết'}
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => navigate(-1)}
        >
          <i className="fas fa-arrow-left me-2"></i> Quay lại
        </button>
      </div>
    );
  }
  
  return (
    <div className="container py-5">
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/">Trang chủ</Link></li>
          <li className="breadcrumb-item"><Link to="/posts">Bài viết</Link></li>
          <li className="breadcrumb-item active" aria-current="page">{post.title}</li>
        </ol>
      </nav>
      
      <div className="row">
        <div className="col-lg-8">
          <article className="blog-post">
            <h1 className="blog-post-title mb-3">{post.title}</h1>
            
            <div className="blog-post-meta mb-4">
              <span className="me-3"><i className="fas fa-folder me-1"></i> {post.topic_name}</span>
              <span className="me-3"><i className="far fa-calendar-alt me-1"></i> {formatDate(post.created_at)}</span>
              <span><i className="fas fa-user me-1"></i> Admin</span>
            </div>
            
            {post.image && (
              <div className="blog-post-image mb-4">
                <SiteProductImage
                  image={post.image}
                  alt={post.name || post.title}
                  className="img-fluid rounded"
                  style={{ width: '100%', height: 'auto' }}
                />
              </div>
            )}
            
            <div className="blog-post-content">
              <div dangerouslySetInnerHTML={{ __html: post.detail || 'Không có nội dung' }} />
            </div>
            
            <div className="blog-post-tags mt-4">
              {post.metakey && (
                <>
                  <h5>Từ khóa:</h5>
                  <div>
                    {post.metakey.split(',').map((tag, index) => (
                      <span key={index} className="badge bg-secondary me-2 mb-2">{tag.trim()}</span>
                    ))}
                  </div>
                </>
              )}
            </div>
          </article>
          
          <div className="mt-5">
            <button 
              className="btn btn-primary"
              onClick={() => navigate(-1)}
            >
              <i className="fas fa-arrow-left me-2"></i> Quay lại
            </button>
          </div>
          
          <div className="mt-5">
            <CommentSection postId={post.id} postType="product" />
          </div>
        </div>
        
        <div className="col-lg-4">
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="mb-0">Chủ đề</h5>
            </div>
            <div className="card-body">
              <div className="d-flex align-items-center">
                <i className="fas fa-folder me-2"></i>
                <span>{post.topic_name}</span>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Chia sẻ bài viết</h5>
            </div>
            <div className="card-body">
              <div className="d-flex gap-2">
                <button className="btn btn-primary">
                  <i className="fab fa-facebook-f"></i>
                </button>
                <button className="btn btn-info">
                  <i className="fab fa-twitter"></i>
                </button>
                <button className="btn btn-danger">
                  <i className="fab fa-pinterest"></i>
                </button>
                <button className="btn btn-success">
                  <i className="fab fa-whatsapp"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostShow;

