import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PostService from '../../services/PostService';
import ProductService from '../../services/ProductService';
import { normalizeImagePath } from '../../utils/imageUtils';
import './Sidebar.css';

const Sidebar = () => {
  const [popularPosts, setPopularPosts] = useState([]);
  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    const fetchSidebarData = async () => {
      try {
        const [postResponse, productResponse] = await Promise.all([
          PostService.getPopular(5),
          ProductService.getLatest(5)
        ]);
        
        if (postResponse.status) {
          setPopularPosts(postResponse.posts);
        }
        
        if (productResponse.status) {
          setLatestProducts(productResponse.products.filter(p => p.is_approved === 1));
        }
      } catch (error) {
        console.error('Error loading sidebar data:', error);
      }
    };
    
    fetchSidebarData();
  }, []);

  return (
    <div className="sidebar">
      {/* Bài viết phổ biến */}
      <div className="sidebar-widget">
        <h4 className="widget-title">Bài viết phổ biến</h4>
        <div className="popular-posts">
          {popularPosts.map((post, index) => (
            <div key={post.id} className="popular-post">
              <div className="post-number">{index + 1}</div>
              <div className="post-image">
                <img src={normalizeImagePath(post.image, 'post')} alt={post.title} />
              </div>
              <div className="post-content">
                <h6><Link to={`/post/${post.id}`}>{post.title}</Link></h6>
                <span className="post-date">
                  {new Date(post.created_at).toLocaleDateString('vi-VN')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sản phẩm mới */}
      <div className="sidebar-widget">
        <h4 className="widget-title">Sản phẩm mới</h4>
        <div className="latest-products">
          {latestProducts.map(product => (
            <div key={product.id} className="latest-product">
              <div className="product-image">
                <img src={normalizeImagePath(product.image, 'product')} alt={product.name} />
              </div>
              <div className="product-content">
                <h6><Link to={`/product/${product.id}`}>{product.name}</Link></h6>
                <div className="product-price">
                  {product.price_sale && product.price_sale < product.price ? (
                    <>
                      <span className="sale-price">{product.price_sale.toLocaleString('vi-VN')} đ</span>
                      <span className="original-price">{product.price.toLocaleString('vi-VN')} đ</span>
                    </>
                  ) : (
                    <span className="price">{product.price.toLocaleString('vi-VN')} đ</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Banner quảng cáo */}
      <div className="sidebar-widget">
        <div className="sidebar-ad">
          <img src="/images/banner/sidebar-ad.jpg" alt="Advertisement" className="img-fluid" />
        </div>
      </div>

      {/* Newsletter */}
      <div className="sidebar-widget">
        <h4 className="widget-title">Đăng ký nhận tin</h4>
        <div className="newsletter">
          <p>Nhận thông tin khuyến mãi và tin tức mới nhất</p>
          <form className="newsletter-form">
            <input type="email" placeholder="Email của bạn" />
            <button type="submit" className="btn btn-primary">Đăng ký</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;