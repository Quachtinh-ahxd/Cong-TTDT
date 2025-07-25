import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductService from '../../services/ProductService';
import CategoryService from '../../services/CategoryService';
import SiteProductImage from '../site/SiteProductImage';
import UserService from '../../services/UserService';

const PostsByCategory = () => {
  console.log('=== PostsByCategory COMPONENT STARTED ===');
  
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userNames, setUserNames] = useState({});

  // Load categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log('Fetching products to get categories...');
        const response = await ProductService.getAll();
        console.log('Products response:', response);
        
        if (response.data && response.data.products) {
          // Lấy unique categories từ products
          const uniqueCategories = [];
          const categoryIds = new Set();
          
          response.data.products.forEach(product => {
            if (product.category_id && !categoryIds.has(product.category_id)) {
              categoryIds.add(product.category_id);
              uniqueCategories.push({
                id: product.category_id,
                name: product.category_name || `Category ${product.category_id}`
              });
            }
          });
          
          console.log('Unique categories from products:', uniqueCategories);
          setCategories(uniqueCategories.slice(0, 5));
          if (uniqueCategories.length > 0) {
            setSelectedCategory(uniqueCategories[0].id);
          }
        }
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    };
    
    fetchCategories();
  }, []);

  // Load posts by category
  useEffect(() => {
    if (selectedCategory) {
      const fetchPostsByCategory = async () => {
        try {
          setLoading(true);
          console.log('Fetching posts for category:', selectedCategory);
          const response = await ProductService.getAll();
          console.log('Products response:', response);
          
          if (response.data && response.data.products) {
            const categoryPosts = response.data.products.filter(
              product => product.category_id === selectedCategory && product.is_approved === 1
            );
            
            // Debug toàn bộ object của product đầu tiên
            console.log('Full product object:', categoryPosts[0]);
            console.log('All product keys:', categoryPosts[0] ? Object.keys(categoryPosts[0]) : 'No products');
            
            setPosts(categoryPosts.slice(0, 6));
          }
        } catch (error) {
          console.error('Error loading posts by category:', error);
        } finally {
          setLoading(false);
        }
      };
      
      fetchPostsByCategory();
    }
  }, [selectedCategory]);

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

  // Test render
  return (
    <section className="posts-by-category py-5">
      <div className="container">
        <div className="section-header mb-4">
          <h2 className="section-title text-center">Bài viết theo danh mục</h2>
          <p className="text-center text-muted">Khám phá sản phẩm theo từng danh mục</p>
        </div>
        
        {/* Category Navigation */}
        <div className="text-center mb-4">
          {categories.map(category => (
            <button
              key={category.id}
              className={`btn me-2 mb-2 ${selectedCategory === category.id ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Đang tải...</span>
            </div>
          </div>
        ) : (
          <div className="row">
            {posts.length > 0 ? (
              posts.map((product) => (
                <div key={product.id} className="col-lg-4 col-md-6 mb-4">
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
                      <h5 className="card-title">
                        <Link to={`/products/${product.id}`} className="text-decoration-none">
                          {product.name}
                        </Link>
                      </h5>
                      <p className="card-text text-muted flex-grow-1">
                        {product.description?.substring(0, 120)}...
                      </p>
                      <div className="mt-auto">
                        <small className="text-muted d-block">
                          <i className="fas fa-user me-1"></i>
                          Người đăng: {userNames[product.created_by] || `User ${product.created_by}` || 'Không xác định'}
                        </small>
                        <small className="text-muted d-block">
                          <i className="fas fa-folder me-1"></i>
                          Danh mục: {product.category_name || 'Chưa phân loại'}
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
                <p className="text-muted">Không có bài viết nào trong danh mục này.</p>
              </div>
            )}
          </div>
        )}
        
        <div className="text-center mt-4">
          <Link to="/products" className="btn btn-outline-primary">
            Xem tất cả sản phẩm
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PostsByCategory;











