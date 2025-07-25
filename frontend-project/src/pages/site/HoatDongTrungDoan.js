import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductService from '../../services/ProductService';
import SiteProductImage from '../../components/site/SiteProductImage';
import UserService from '../../services/UserService';

const HoatDongTrungDoan = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userNames, setUserNames] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        console.log('=== HoatDongTrungDoan: Fetching products ===');
        
        const response = await ProductService.getAll();
        console.log('HoatDongTrungDoan response:', response);
        
        // SỬA: API trả về response.data (array), không phải response.data.products
        if (response.data && Array.isArray(response.data)) {
          console.log('Total products:', response.data.length);
          
          // Debug: Xem tất cả brand_name có trong data
          const allBrandNames = [...new Set(response.data.map(p => p.brand_name).filter(Boolean))];
          console.log('All brand names in data:', allBrandNames);
          
          const approvedProducts = response.data.filter(product => product.is_approved === 1);
          console.log('Approved products:', approvedProducts.length);
          
          // Lấy sản phẩm đã duyệt và có brand_name chứa "trung đoàn 290" hoặc "sư đoàn"
          const regimentProducts = response.data.filter(product => {
            if (product.is_approved !== 1) return false;
            
            const brandName = (product.brand_name || '').toLowerCase();
            const isRegiment = brandName.includes('trung đoàn 290') || 
                              brandName.includes('sư đoàn') ||
                              brandName.includes('trung doan 290');
            
            console.log(`Product ${product.id}: brand_name="${product.brand_name}", matches=${isRegiment}`);
            return isRegiment;
          });
          
          console.log('Regiment products found:', regimentProducts.length);
          console.log('Regiment products:', regimentProducts);
          
          if (regimentProducts.length === 0) {
            console.warn('⚠️ No products found with regiment/division brand names');
            console.log('🔧 TEMPORARILY SHOWING ALL APPROVED PRODUCTS FOR TESTING');
            setProducts(approvedProducts); // Tạm thời hiển thị tất cả approved products
          } else {
            setProducts(regimentProducts);
          }
        } else {
          console.error('❌ Invalid response structure:', response);
        }
      } catch (error) {
        console.error('Error loading regiment activities:', error);
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

  console.log('=== HoatDongTrungDoan RENDER DEBUG ===');
  console.log('products.length:', products.length);
  console.log('loading:', loading);

  return (
    <div className="container py-5">
      <div className="section-header mb-4">
        <h2 className="section-title text-center">Hoạt động của Trung Đoàn, Sư Đoàn</h2>
        <p className="text-center text-muted">Tin tức và hoạt động của Trung Đoàn 290 và các đơn vị Sư Đoàn</p>
      </div>
      
      {/* DEBUG INFO - tạm thời */}
      <div style={{ background: '#f0f0f0', padding: '10px', margin: '10px 0', fontSize: '12px' }}>
        <strong>DEBUG:</strong> Regiment activities loaded: {products.length}, Loading: {loading ? 'Yes' : 'No'}
      </div>
      
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
        </div>
      ) : (
        <div className="row">
          {products.length > 0 ? (
            products.map((product) => (
              <div key={product.id} className="col-lg-4 col-md-6 mb-4">
                <div className="card h-100 shadow-sm border-success">
                  <div style={{ height: '200px', overflow: 'hidden' }}>
                    <SiteProductImage
                      image={product.image}
                      alt={product.name}
                      className="card-img-top"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div className="card-body d-flex flex-column">
                    <div className="mb-2">
                      <span className="badge bg-success text-white small">
                        {product.brand_name || 'Trung Đoàn 290'}
                      </span>
                    </div>
                    <h6 className="card-title">
                      <Link to={`/products/${product.id}`} className="text-decoration-none text-dark">
                        {product.name}
                      </Link>
                    </h6>
                    <p className="card-text text-muted flex-grow-1 small">
                      {product.description?.substring(0, 120)}...
                    </p>
                    <div className="mt-auto">
                      <div className="d-flex justify-content-between align-items-center">
                        <small className="text-muted">
                          <i className="fas fa-user me-1"></i>
                          {userNames[product.created_by] || 'Không xác định'}
                        </small>
                        <small className="text-muted">
                          <i className="fas fa-calendar me-1"></i>
                          {new Date(product.created_at).toLocaleDateString('vi-VN')}
                        </small>
                      </div>
                      <Link to={`/products/${product.id}`} className="btn btn-success btn-sm mt-2 w-100">
                        <i className="fas fa-eye me-1"></i>
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
                <i className="fas fa-info-circle me-2"></i>
                Hiện tại chưa có hoạt động nào của Trung Đoàn, Sư Đoàn.
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HoatDongTrungDoan;