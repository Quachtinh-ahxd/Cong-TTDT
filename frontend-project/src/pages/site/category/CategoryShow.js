import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import CategoryService from '../../../services/CategoryService';
import ProductService from '../../../services/ProductService';
import { productImage } from '../../../config';
import ProductImage from '../../../components/common/ProductImage';

function CategoryShow() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Lấy thông tin danh mục
        const categoryResponse = await CategoryService.getById(id);
        if (categoryResponse.status) {
          setCategory(categoryResponse.category);
          
          // Lấy sản phẩm theo danh mục
          const productsResponse = await ProductService.getByCategory(id);
          if (productsResponse.status) {
            setProducts(productsResponse.products);
          }
        } else {
          setError(categoryResponse.message || 'Không thể tải thông tin danh mục');
        }
      } catch (error) {
        console.error('Error fetching category data:', error);
        setError('Đã xảy ra lỗi khi tải thông tin danh mục');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);
  
  // Định dạng giá tiền
  const formatPrice = (price) => {
    return price?.toLocaleString('vi-VN') + ' đ';
  };
  
  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
          <p className="mt-2">Đang tải thông tin danh mục...</p>
        </div>
      </div>
    );
  }
  
  if (error || !category) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          {error || 'Không tìm thấy danh mục'}
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
          <li className="breadcrumb-item"><Link to="/categories">Danh mục</Link></li>
          <li className="breadcrumb-item active" aria-current="page">{category.name}</li>
        </ol>
      </nav>
      
      <div className="card mb-4">
        <div className="card-body">
          <h1 className="card-title">{category.name}</h1>
          {category.description && (
            <p className="card-text">{category.description}</p>
          )}
        </div>
      </div>
      
      <h2 className="mb-4">Sản phẩm trong danh mục</h2>
      
      {products.length === 0 ? (
        <div className="alert alert-info">
          Không có sản phẩm nào trong danh mục này.
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-3 row-cols-lg-4 g-4">
          {products.map(product => (
            <div className="col" key={product.id}>
              <div className="card h-100">
                <div className="position-relative">
                  <ProductImage 
                    image={product.image}
                    alt={product.name}
                    className="card-img-top"
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                  
                  {product.price_sale && product.price_sale < product.price && (
                    <div className="position-absolute top-0 end-0 bg-danger text-white px-2 py-1 m-2 rounded">
                      -{Math.round((1 - product.price_sale / product.price) * 100)}%
                    </div>
                  )}
                </div>
                
                <div className="card-body">
                  <h5 className="card-title">{product.name}</h5>
                  
                  <div className="mb-2">
                    {product.price_sale && product.price_sale < product.price ? (
                      <>
                        <span className="text-danger fw-bold me-2">{formatPrice(product.price_sale)}</span>
                        <span className="text-decoration-line-through text-muted">{formatPrice(product.price)}</span>
                      </>
                    ) : (
                      <span className="text-primary fw-bold">{formatPrice(product.price)}</span>
                    )}
                  </div>
                </div>
                
                <div className="card-footer bg-transparent border-top-0">
                  <Link to={`/products/${product.id}`} className="btn btn-outline-primary w-100">
                    Xem chi tiết
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CategoryShow;

