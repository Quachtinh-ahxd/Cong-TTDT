import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function HeaderAdmin() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user')) || { name: 'Admin' };

  const handleLogout = () => {
    // Xóa token và thông tin người dùng
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Chuyển hướng đến trang đăng nhập
    navigate('/admin/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/admin">Admin Dashboard</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                <i className="fas fa-user-circle me-1"></i> {user.name}
              </a>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                <li><Link className="dropdown-item" to="/admin/profile"><i className="fas fa-user me-1"></i> Hồ sơ</Link></li>
                <li><Link className="dropdown-item" to="/admin/settings"><i className="fas fa-cog me-1"></i> Cài đặt</Link></li>
                <li><hr className="dropdown-divider" /></li>
                <li><button className="dropdown-item" onClick={handleLogout}><i className="fas fa-sign-out-alt me-1"></i> Đăng xuất</button></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default HeaderAdmin;



