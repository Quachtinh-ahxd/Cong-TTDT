import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductService from '../../services/ProductService';
import SiteProductImage from '../../components/site/SiteProductImage';
import UserService from '../../services/UserService';

const QuanSu = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userNames, setUserNames] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        console.log('=== QuanSu: Fetching products ===');
        
        const response = await ProductService.getAll();
        console.log('QuanSu response:', response);
        
        // SỬA: API trả về response.data (array), không phải response.data.products
        if (response.data && Array.isArray(response.data)) {
          console.log('Total products:', response.data.length);
          
          // Debug: Xem có products nào có category_id = 1004 không
          const allCategoryIds = [...new Set(response.data.map(p => p.category_id))];
          console.log('All category IDs in data:', allCategoryIds);
          
          const approvedProducts = response.data.filter(product => product.is_approved === 1);
          console.log('Approved products:', approvedProducts.length);
          
          // Chỉ lấy sản phẩm đã duyệt và có category_id = 1004
          const militaryProducts = response.data.filter(
            product => product.is_approved === 1 && product.category_id === 1004
          );
          
          console.log('Military products (category_id = 1004, approved):', militaryProducts.length);
          console.log('Military products:', militaryProducts);
          
          if (militaryProducts.length === 0) {
            console.warn('⚠️ No products found with category_id = 1004 and is_approved = 1');
            console.log('🔧 TEMPORARILY SHOWING ALL APPROVED PRODUCTS FOR TESTING');
            setProducts(approvedProducts); // Tạm thời hiển thị tất cả approved products
          } else {
            setProducts(militaryProducts);
          }
        } else {
          console.error('❌ Invalid response structure:', response);
        }
      } catch (error) {
        console.error('Error loading military products:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  // Fetch user names
  useEffect(() => {
    const fetchUserNames = async () => {
      const userIds = [...new Set(products.map(product => product.created_by).filter(Boolean))];
      const names = {};
      
      for (const userId of userIds) {
        try {
          const response = await UserService.getById(userId);
          if (response.data?.status && response.data.user) {
            names[userId] = response.data.user.name;
          }
        } catch (error) {
          console.error(`Error fetching user ${userId}:`, error);
        }
      }
      
      setUserNames(names);
    };
    
    if (products.length > 0) {
      fetchUserNames();
    }
  }, [products]);

  console.log('=== QuanSu RENDER DEBUG ===');
  console.log('products.length:', products.length);
  console.log('loading:', loading);

  return (
    <div className="container py-5">
      <div className="section-header mb-4">
        <h2 className="section-title text-center">Quân sự</h2>
        <p className="text-center text-muted">Thông tin về lĩnh vực quân sự và quốc phòng</p>
      </div>
      
      {/* DEBUG INFO - tạm thời */}
      <div style={{ background: '#f0f0f0', padding: '10px', margin: '10px 0', fontSize: '12px' }}>
        <strong>DEBUG:</strong> Military products loaded: {products.length}, Loading: {loading ? 'Yes' : 'No'}
      </div>
      
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-danger" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
        </div>
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
                        <i className="fas fa-user me-1"></i>
                        Người đăng: {userNames[product.created_by] || 'Không xác định'}
                      </small>
                      <small className="text-muted d-block">
                        <i className="fas fa-calendar me-1"></i>
                        Ngày đăng: {new Date(product.created_at).toLocaleDateString('vi-VN')}
                      </small>
                      <Link to={`/products/${product.id}`} className="btn btn-danger btn-sm mt-2">
                        Xem chi tiết
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center py-5">
              <p className="text-muted">Không có bài viết quân sự nào.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuanSu;