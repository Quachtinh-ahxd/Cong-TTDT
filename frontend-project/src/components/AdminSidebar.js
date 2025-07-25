import React from 'react';
import { Link } from 'react-router-dom';
import './AdminSidebar.css';

function AdminSidebar() {
  return (
    <div className="col-md-3">
      <div className="admin-sidebar-container">
        <div className="admin-sidebar-header">
          <i className="fas fa-bars"></i>
          Menu quản trị
        </div>
        <ul className="admin-sidebar-menu">
          <li className="admin-sidebar-item">
            <Link to="/admin" className="admin-sidebar-link">
              <i className="fas fa-tachometer-alt"></i>
              Dashboard
            </Link>
          </li>
          <li className="admin-sidebar-item">
            <Link to="/admin/products" className="admin-sidebar-link">
              <i className="fas fa-newspaper"></i>
              Bài viết chính
            </Link>
          </li>
          <li className="admin-sidebar-item">
            <Link to="/admin/products/approval" className="admin-sidebar-link">
              <i className="fas fa-check-circle"></i>
              Duyệt bài
            </Link>
          </li>
          <li className="admin-sidebar-item">
            <Link to="/admin/posts" className="admin-sidebar-link">
              <i className="fas fa-file-alt"></i>
              Bài viết phụ
            </Link>
          </li>
          <li className="admin-sidebar-item">
            <Link to="/admin/categories" className="admin-sidebar-link">
              <i className="fas fa-list"></i>
              Danh mục
            </Link>
          </li>
          <li className="admin-sidebar-item">
            <Link to="/admin/brands" className="admin-sidebar-link">
              <i className="fas fa-tags"></i>
              Nhãn hiệu
            </Link>
          </li>
          <li className="admin-sidebar-item">
            <Link to="/admin/users" className="admin-sidebar-link">
              <i className="fas fa-users"></i>
              Thành viên
            </Link>
          </li>
          <li className="admin-sidebar-item">
            <Link to="/admin/movies" className="admin-sidebar-link">
              <i className="fas fa-film"></i>
              Quản lý phim
            </Link>
          </li>
          <li className="admin-sidebar-item">
            <Link to="/admin/banners" className="admin-sidebar-link">
              <i className="fas fa-image"></i>
              Slide Banner
            </Link>
          </li>
          <li className="admin-sidebar-item">
            <Link to="/admin/uploads" className="admin-sidebar-link">
              <i className="fas fa-folder"></i>
              Tệp tin
            </Link>
          </li>
          <li className="admin-sidebar-item">
            <Link to="/admin/settings" className="admin-sidebar-link">
              <i className="fas fa-cog"></i>
              Cài đặt
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default AdminSidebar;
