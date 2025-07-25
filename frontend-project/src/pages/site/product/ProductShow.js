import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ProductService from '../../../services/ProductService';
import ProductImage from '../../../components/common/ProductImage';
import CommentSection from '../../../components/CommentSection';
import './ProductShow.css';

function ProductShow() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [latestProducts, setLatestProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productResponse, allProductsResponse] = await Promise.all([
          ProductService.getById(id),
          ProductService.getAll()
        ]);
        
        if (productResponse.status) {
          setProduct(productResponse.product);
          // Track view sau khi load thành công
          const trackResult = await ProductService.trackView(id);
          console.log('Track view result:', trackResult);

          // Reload product để lấy view_count mới
          if (trackResult) {
            const updatedProduct = await ProductService.getById(id);
            if (updatedProduct.status) {
              setProduct(updatedProduct.product);
            }
          }
        } else {
          setError(productResponse.message || 'Không thể tải thông tin bài viết');
        }
        
        if (allProductsResponse.data && allProductsResponse.data.products) {
          // Lọc sản phẩm đã duyệt, loại bỏ sản phẩm đang đọc, và sắp xếp theo ngày tạo mới nhất
          const approvedProducts = allProductsResponse.data.products
            .filter(p => p.is_approved === 1 && p.id !== parseInt(id))
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .slice(0, 3);
          setLatestProducts(approvedProducts);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Đã xảy ra lỗi khi tải thông tin bài viết');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);
  
  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !product) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">{error || 'Không tìm thấy bài viết'}</div>
        <button className="btn btn-primary" onClick={() => navigate(-1)}>
          <i className="fas fa-arrow-left me-2"></i> Quay lại
        </button>
      </div>
    );
  }
  
  const handleCommentUpdate = async () => {
    try {
      // Reload product để cập nhật comment_count
      const response = await ProductService.getById(id);
      if (response.status && response.product) {
        setProduct(response.product);
      }
    } catch (error) {
      console.error('Error reloading product:', error);
    }
  };

  return (
    <div className="blog-detail">
      <div className="container py-5">
        <div className="row">
          <div className="col-lg-8">
            <article className="blog-post">
              {/* Breadcrumb */}
              <nav aria-label="breadcrumb" className="mb-4">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item"><Link to="/">Trang chủ</Link></li>
                  <li className="breadcrumb-item"><Link to="/">Bài viết</Link></li>
                  <li className="breadcrumb-item active">{product.category_name}</li>
                </ol>
              </nav>
              
              {/* Title */}
              <h1 className="blog-title">{product.name}</h1>
              
              {/* Meta info */}
              <div className="blog-meta mb-4">
                <div className="d-flex align-items-center">
                  <div className="author-info me-4">
                    <i className="fas fa-user me-2"></i>
                    <span>{product.created_by_name || 'Admin'}</span>
                  </div>
                  <div className="date-info me-4">
                    <i className="far fa-calendar-alt me-2"></i>
                    <span>{new Date(product.created_at).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <div className="view-count me-4">
                    <i className="far fa-eye me-2"></i>
                    <span>{product.view_count || 0} lượt xem</span>
                  </div>
                  <div className="comment-count">
                    <i className="fas fa-comments me-2"></i>
                    <span>{product.comment_count || 0} bình luận</span>
                  </div>
                </div>
              </div>
              
              {/* Featured image */}
              {product.image && (
                <div className="featured-image mb-4">
                  <ProductImage 
                    image={product.image}
                    alt={product.name}
                    className="img-fluid rounded"
                  />
                </div>
              )}
              
              {/* Content */}
              <div className="blog-content">
                <div className="lead mb-4" dangerouslySetInnerHTML={{ __html: product.description }} />
                <div dangerouslySetInnerHTML={{ __html: product.detail || 'Không có nội dung chi tiết' }} />
              </div>
              
              {/* Tags */}
              <div className="blog-tags mt-5">
                <span className="me-3"><strong>Tags:</strong></span>
                <span className="badge bg-secondary me-2">{product.category_name}</span>
                <span className="badge bg-secondary me-2">{product.brand_name}</span>
                <span className="badge bg-secondary">Kinh doanh</span>
              </div>
            </article>
          </div>
          
          {/* Sidebar */}
          <div className="col-lg-4">
            <div className="sidebar">
              {/* Advertisement */}
              <div className="card mb-4">
                <div className="card-body text-center">
                  <div className="ad-placeholder bg-light p-5">
                    <h5>Quảng cáo</h5>
                    <p className="text-muted">Vị trí quảng cáo</p>
                  </div>
                </div>
              </div>
              
              {/* Latest Posts */}
              <div className="card mb-4">
                <div className="card-header bg-success text-white">
                  <h5 className="mb-0">
                    <i className="fas fa-clock me-2"></i>
                    BÀI VIẾT MỚI NHẤT
                  </h5>
                </div>
                <div className="card-body p-0">
                  {latestProducts.map(latestProduct => (
                    <div key={latestProduct.id} className="latest-post d-flex p-3 border-bottom">
                      <div className="post-thumbnail me-3">
                        <Link to={`/products/${latestProduct.id}`}>
                          <ProductImage
                            image={latestProduct.image}
                            alt={latestProduct.name}
                            className="rounded"
                            style={{ width: '80px', height: '60px', objectFit: 'cover' }}
                          />
                        </Link>
                      </div>
                      <div className="post-info flex-grow-1">
                        <h6 className="post-title mb-1">
                          <Link to={`/products/${latestProduct.id}`} className="text-decoration-none">
                            {latestProduct.name}
                          </Link>
                        </h6>
                        <div className="post-meta">
                          <small className="text-muted">
                            <i className="far fa-calendar-alt me-1"></i>
                            {new Date(latestProduct.created_at).toLocaleDateString('vi-VN')}
                          </small>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {latestProducts.length === 0 && (
                    <div className="p-3 text-center text-muted">
                      Chưa có sản phẩm nào
                    </div>
                  )}
                </div>
              </div>
              
              {/* Recent Comments - chỉ gọi component không cần card wrapper */}
              <CommentSection 
                postId={product.id} 
                postType="product" 
                onCommentUpdate={handleCommentUpdate}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductShow;















