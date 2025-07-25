import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PostService from '../../services/PostService';
import ProductService from '../../services/ProductService';
import { normalizeImagePath } from '../../utils/imageUtils';
import './FeaturedGrid.css';

const FeaturedGrid = () => {
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postResponse, productResponse] = await Promise.all([
          PostService.getFeatured(4),
          ProductService.getFeatured(4)
        ]);
        
        if (postResponse.status) {
          setFeaturedPosts(postResponse.posts);
        }
        
        if (productResponse.status) {
          setFeaturedProducts(productResponse.products.filter(p => p.is_approved === 1));
        }
      } catch (error) {
        console.error('Error loading featured content:', error);
      }
    };
    
    fetchData();
  }, []);

  return (
    <div className="featured-grid">
      <div className="row">
        {/* Bài viết nổi bật */}
        <div className="col-lg-6">
          <div className="section-header">
            <h3 className="section-title">Tin tức nổi bật</h3>
            <Link to="/posts" className="view-all">Xem tất cả</Link>
          </div>
          
          <div className="featured-posts">
            {featuredPosts.slice(0, 1).map(post => (
              <div key={post.id} className="featured-post-large">
                <div className="post-image">
                  <img src={normalizeImagePath(post.image, 'post')} alt={post.title} />
                  <div className="post-category">Tin tức</div>
                </div>
                <div className="post-content">
                  <h4><Link to={`/post/${post.id}`}>{post.title}</Link></h4>
                  <p>{post.description}</p>
                  <div className="post-meta">
                    <span className="post-date">
                      {new Date(post.created_at).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="featured-posts-small">
              {featuredPosts.slice(1, 4).map(post => (
                <div key={post.id} className="featured-post-small">
                  <div className="post-image">
                    <img src={normalizeImagePath(post.image, 'post')} alt={post.title} />
                  </div>
                  <div className="post-content">
                    <h5><Link to={`/post/${post.id}`}>{post.title}</Link></h5>
                    <span className="post-date">
                      {new Date(post.created_at).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Sản phẩm nổi bật */}
        <div className="col-lg-6">
          <div className="section-header">
            <h3 className="section-title">Sản phẩm nổi bật</h3>
            <Link to="/products" className="view-all">Xem tất cả</Link>
          </div>
          
          <div className="featured-products">
            {featuredProducts.slice(0, 1).map(product => (
              <div key={product.id} className="featured-product-large">
                <div className="product-image">
                  <img src={normalizeImagePath(product.image, 'product')} alt={product.name} />
                  {product.price_sale && product.price_sale < product.price && (
                    <div className="discount-badge">
                      -{Math.round((1 - product.price_sale / product.price) * 100)}%
                    </div>
                  )}
                </div>
                <div className="product-content">
                  <h4><Link to={`/product/${product.id}`}>{product.name}</Link></h4>
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
            
            <div className="featured-products-small">
              {featuredProducts.slice(1, 4).map(product => (
                <div key={product.id} className="featured-product-small">
                  <div className="product-image">
                    <img src={normalizeImagePath(product.image, 'product')} alt={product.name} />
                  </div>
                  <div className="product-content">
                    <h5><Link to={`/product/${product.id}`}>{product.name}</Link></h5>
                    <div className="product-price">
                      {product.price_sale && product.price_sale < product.price ? (
                        <span className="sale-price">{product.price_sale.toLocaleString('vi-VN')} đ</span>
                      ) : (
                        <span className="price">{product.price.toLocaleString('vi-VN')} đ</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedGrid;