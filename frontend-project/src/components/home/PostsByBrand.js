import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductService from '../../services/ProductService';
import BrandService from '../../services/BrandService';
import SiteProductImage from '../site/SiteProductImage';
import UserService from '../../services/UserService';

const PostsByBrand = () => {
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userNames, setUserNames] = useState({});

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        console.log('Fetching products to get brands...');
        const response = await ProductService.getAll();
        console.log('Products response:', response);
        
        if (response.data && response.data.products) {
          // Lấy unique brands từ products
          const uniqueBrands = [];
          const brandIds = new Set();
          
          response.data.products.forEach(product => {
            if (product.brand_id && !brandIds.has(product.brand_id)) {
              brandIds.add(product.brand_id);
              uniqueBrands.push({
                id: product.brand_id,
                name: product.brand_name || `Brand ${product.brand_id}`
              });
            }
          });
          
          console.log('Unique brands from products:', uniqueBrands);
          setBrands(uniqueBrands.slice(0, 4));
          if (uniqueBrands.length > 0) {
            setSelectedBrand(uniqueBrands[0].id);
          }
        }
      } catch (error) {
        console.error('Error loading brands:', error);
      }
    };
    
    fetchBrands();
  }, []);

  useEffect(() => {
    if (selectedBrand) {
      const fetchPostsByBrand = async () => {
        try {
          setLoading(true);
          const response = await ProductService.getAll();
          if (response.data && response.data.products) {
            const brandPosts = response.data.products.filter(
              product => product.brand_id == selectedBrand && product.is_approved === 1
            );
            setPosts(brandPosts.slice(0, 8));
          }
        } catch (error) {
          console.error('Error loading posts by brand:', error);
        } finally {
          setLoading(false);
        }
      };
      
      fetchPostsByBrand();
    }
  }, [selectedBrand]);

  // Fetch user names
  useEffect(() => {
    const fetchUserNames = async () => {
      const userIds = [...new Set(posts.map(post => post.created_by).filter(Boolean))];
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
    
    if (posts.length > 0) {
      fetchUserNames();
    }
  }, [posts]);

  const selectedBrandName = brands.find(brand => brand.id === selectedBrand)?.name || '';

  // Thêm debug cho state
  console.log('PostsByBrand state:', { brands, selectedBrand, posts });

  return (
    <section className="posts-by-brand py-5 bg-light">
      <div className="container">
        <div className="section-header mb-4">
          <h2 className="section-title text-center">Bài viết theo thương hiệu</h2>
          <p className="text-center text-muted">Khám phá sản phẩm theo từng thương hiệu</p>
        </div>
        
        {/* Brand Navigation */}
        <div className="text-center mb-4">
          {brands.map(brand => (
            <button
              key={brand.id}
              className={`btn me-2 mb-2 ${selectedBrand === brand.id ? 'btn-success' : 'btn-outline-success'}`}
              onClick={() => setSelectedBrand(brand.id)}
            >
              {brand.name}
            </button>
          ))}
        </div>
        
        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">Đang tải...</span>
            </div>
          </div>
        ) : (
          <div className="row">
            {posts.length > 0 ? (
              posts.map((product) => (
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
                          Người đăng: {userNames[product.created_by] || product.user_name || product.author || `User ${product.created_by}` || 'Không xác định'}
                        </small>
                        <small className="text-muted d-block">
                          <i className="fas fa-tag me-1"></i>
                          Thương hiệu: {product.brand_name || 'Chưa có'}
                        </small>
                        <Link to={`/products/${product.id}`} className="btn btn-success btn-sm mt-2">
                          Xem chi tiết
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12 text-center py-5">
                <p className="text-muted">Không có bài viết nào cho thương hiệu này.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default PostsByBrand;























