import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import ProductService from '../../services/ProductService';
import SiteProductImage from '../../components/site/SiteProductImage';

const Search = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const query = searchParams.get('q');

  useEffect(() => {
    if (query) {
      searchProducts(query);
    }
  }, [query]);

  const searchProducts = async (keyword) => {
    try {
      setLoading(true);
      setError(null);
      
      // Lấy tất cả sản phẩm và filter phía client
      const response = await ProductService.getAll();
      
      if (response.data && response.data.products) {
        const approvedProducts = response.data.products.filter(product => {
          if (product.is_approved !== 1) return false;
          
          const searchTerm = keyword.toLowerCase();
          return (
            product.name?.toLowerCase().includes(searchTerm) ||
            product.description?.toLowerCase().includes(searchTerm) ||
            product.brand_name?.toLowerCase().includes(searchTerm)
          );
        });
        setProducts(approvedProducts);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error('Error searching products:', error);
      setError('Đã xảy ra lỗi khi tìm kiếm');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="section-header mb-4">
        <h2 className="section-title">Kết quả tìm kiếm</h2>
        {query && (
          <p className="text-muted">
            Tìm kiếm cho: "<strong>{query}</strong>" 
            {!loading && ` - ${products.length} kết quả`}
          </p>
        )}
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Đang tìm kiếm...</span>
          </div>
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <div className="row">
          {products.length > 0 ? (
            products.map((product) => (
              <div key={product.id} className="col-lg-3 col-md-6 mb-4">
                <div className="card h-100 shadow-sm">
                  <div style={{ height: '250px', overflow: 'hidden' }}>
                    <SiteProductImage
                      image={product.image}
                      alt={product.name}
                      className="card-img-top"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div className="card-body d-flex flex-column">
                    <h6 className="card-title">
                      <Link to={`/products/${product.id}`} className="text-decoration-none">
                        {product.name}
                      </Link>
                    </h6>
                    <p className="card-text text-muted flex-grow-1 small">
                      {product.description?.substring(0, 100)}...
                    </p>
                    <div className="mt-auto">
                      <small className="text-muted d-block">
                        <i className="fas fa-tag me-1"></i>
                        {product.brand_name || 'Không xác định'}
                      </small>
                      <small className="text-muted d-block">
                        <i className="fas fa-calendar me-1"></i>
                        {new Date(product.created_at).toLocaleDateString('vi-VN')}
                      </small>
                      <Link to={`/products/${product.id}`} className="btn btn-primary btn-sm mt-2">
                        Xem chi tiết
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center py-5">
              <div className="alert alert-info">
                <i className="fas fa-search me-2"></i>
                {query ? `Không tìm thấy kết quả nào cho "${query}"` : 'Nhập từ khóa để tìm kiếm'}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
