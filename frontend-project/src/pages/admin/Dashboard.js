import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductService from '../../services/ProductService';
import PostService from '../../services/PostService';
import CategoryService from '../../services/CategoryService';
import UserService from '../../services/UserService';
import MovieService from '../../services/MovieService';
import BrandService from '../../services/BrandService';

function Dashboard() {
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    users: 0,
    files: 7,
    posts: 0,
    banners: 0,
    brands: 0,
    movies: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStatistics = async () => {
      try {
        const [
          productsRes,
          postsRes,
          categoriesRes,
          usersRes,
          moviesRes,
          brandsRes
        ] = await Promise.all([
          ProductService.getAll(),
          PostService.getAll(),
          CategoryService.getAll(),
          UserService.getAll(),
          MovieService.getAll(),
          BrandService.getAll()
        ]);

        // Sử dụng Array.isArray để lấy đúng số lượng
        const productCount = Array.isArray(productsRes?.data) ? productsRes.data.length : 0;
        const postCount = Array.isArray(postsRes?.data) ? postsRes.data.length : 0;
        let categoryCount = 0;
        if (Array.isArray(categoriesRes?.data)) {
          categoryCount = categoriesRes.data.length;
        } else if (Array.isArray(categoriesRes?.data?.categories)) {
          categoryCount = categoriesRes.data.categories.length;
        } else if (Array.isArray(categoriesRes?.categories)) {
          categoryCount = categoriesRes.categories.length;
        }
        const userCount = Array.isArray(usersRes?.data) ? usersRes.data.length : 0;
        const movieCount = Array.isArray(moviesRes?.data) ? moviesRes.data.length : 0;
        const brandCount = Array.isArray(brandsRes?.data) ? brandsRes.data.length : 0;

        setStats({
          products: productCount,
          posts: postCount,
          categories: categoryCount,
          users: userCount,
          movies: movieCount,
          banners: 0,
          files: 7,
          brands: brandCount
        });
      } catch (error) {
        console.error('Error loading statistics:', error);
        setStats({
          products: 0,
          posts: 0,
          categories: 0,
          users: 0,
          movies: 0,
          banners: 0,
          files: 7,
          brands: 0
        });
      } finally {
        setLoading(false);
      }
    };

    loadStatistics();
  }, []);

  const statsCards = [
    {
      title: 'Bài viết chính',
      value: stats.products,
      icon: 'fas fa-newspaper',
      color: 'primary',
      link: '/admin/products'
    },
    {
      title: 'Bài viết phụ',
      value: stats.posts,
      icon: 'fas fa-file-alt',
      color: 'secondary',
      link: '/admin/posts'
    },
    {
      title: 'Danh mục',
      value: stats.categories,
      icon: 'fas fa-list',
      color: 'warning',
      link: '/admin/categories'
    },
    {
      title: 'Thành viên',
      value: stats.users,
      icon: 'fas fa-users',
      color: 'success',
      link: '/admin/users'
    },
    {
      title: 'Phim',
      value: stats.movies,
      icon: 'fas fa-film',
      color: 'info',
      link: '/admin/movies'
    },
    {
      title: 'Slide Banner',
      value: stats.banners,
      icon: 'fas fa-image',
      color: 'danger',
      link: '/admin/banners'
    },
    {
      title: 'Tệp tin',
      value: stats.files,
      icon: 'fas fa-folder',
      color: 'dark',
      link: '/admin/uploads'
    },
    {
      title: 'Nhãn hiệu',
      value: stats.brands,
      icon: 'fas fa-tags',
      color: 'light',
      link: '/admin/brands'
    }
  ];

  return (
    <div className="container-fluid">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        <Link to="/admin/statistics" className="btn btn-outline-primary">
          <i className="fas fa-chart-bar me-2"></i>Xem thống kê chi tiết
        </Link>
      </div>

      {loading ? (
        <div className="dashboard-loading">
          <div className="dashboard-spinner"></div>
        </div>
      ) : (
        <>
          {/* 8 Stats cards */}
          <div className="row">
            {statsCards.map((card, index) => (
              <div className="col-xl-3 col-md-6 mb-4" key={index}>
                <div className="dashboard-stat-card">
                  <div className={`dashboard-stat-icon ${card.color}`}>
                    <i className={card.icon}></i>
                  </div>
                  <div className="dashboard-stat-content">
                    <h3>{card.value}</h3>
                    <p>{card.title}</p>
                  </div>
                  <div className="dashboard-stat-footer">
                    <Link to={card.link} className="dashboard-stat-link">
                      Xem chi tiết <i className="fas fa-arrow-right"></i>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 8 items summary */}
          <div className="dashboard-summary-card">
            <div className="dashboard-summary-header">
              <h2 className="dashboard-summary-title">Tổng quan hệ thống</h2>
              <Link to="/admin/statistics" className="btn btn-light btn-sm">
                <i className="fas fa-chart-line me-1"></i>Thống kê chi tiết
              </Link>
            </div>
            <div className="dashboard-summary-body">
              <div className="row text-center">
                <div className="col-md-3 col-sm-6 mb-3">
                  <div className="dashboard-summary-item">
                    <div className="dashboard-summary-number">{stats.products}</div>
                    <div className="dashboard-summary-label">Sản phẩm</div>
                  </div>
                </div>
                <div className="col-md-3 col-sm-6 mb-3">
                  <div className="dashboard-summary-item">
                    <div className="dashboard-summary-number">{stats.posts}</div>
                    <div className="dashboard-summary-label">Bài viết phụ</div>
                  </div>
                </div>
                <div className="col-md-3 col-sm-6 mb-3">
                  <div className="dashboard-summary-item">
                    <div className="dashboard-summary-number">{stats.categories}</div>
                    <div className="dashboard-summary-label">Chuyên mục</div>
                  </div>
                </div>
                <div className="col-md-3 col-sm-6 mb-3">
                  <div className="dashboard-summary-item">
                    <div className="dashboard-summary-number">{stats.users}</div>
                    <div className="dashboard-summary-label">Người dùng</div>
                  </div>
                </div>
                <div className="col-md-3 col-sm-6 mb-3">
                  <div className="dashboard-summary-item">
                    <div className="dashboard-summary-number">{stats.movies}</div>
                    <div className="dashboard-summary-label">Phim</div>
                  </div>
                </div>
                <div className="col-md-3 col-sm-6 mb-3">
                  <div className="dashboard-summary-item">
                    <div className="dashboard-summary-number">{stats.banners}</div>
                    <div className="dashboard-summary-label">Banner</div>
                  </div>
                </div>
                <div className="col-md-3 col-sm-6 mb-3">
                  <div className="dashboard-summary-item">
                    <div className="dashboard-summary-number">{stats.files}</div>
                    <div className="dashboard-summary-label">Upload Files</div>
                  </div>
                </div>
                <div className="col-md-3 col-sm-6 mb-3">
                  <div className="dashboard-summary-item">
                    <div className="dashboard-summary-number">{stats.brands}</div>
                    <div className="dashboard-summary-label">Thương hiệu</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;
