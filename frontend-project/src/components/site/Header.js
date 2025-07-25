import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Header.css';

function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Kiểm tra trạng thái đăng nhập
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const toggleDropdown = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <>
      {/* Main Header with image */}
      <header className="main-header p-0" style={{background: 'none'}}>
        <img 
          src="/images/trungdoan.jpg" 
          alt="Trung đoàn 290" 
          className="img-fluid w-100"
          style={{objectFit: 'contain', width: '100vw', minHeight: '180px', maxHeight: 'none', display: 'block', background: '#fff'}}
        />
      </header>

      {/* Navigation Menu */}
      <nav className="main-nav">
        <div className="container-fluid">
          <div className="nav-container">
            {/* Left side - Menu */}
            <ul className="nav-menu">
              <li className={location.pathname === '/' ? 'active' : ''}>
                <Link to="/">TRANG CHỦ</Link>
              </li>
              
              <li className={`dropdown ${openDropdown === 'gioi-thieu' ? 'open' : ''}`}>
                <a href="#" onClick={(e) => { e.preventDefault(); toggleDropdown('gioi-thieu'); }}>
                  GIỚI THIỆU
                  <i className="fas fa-chevron-down dropdown-icon"></i>
                </a>
                <ul className="dropdown-menu">
                  <li><Link to="/gioi-thieu/chi-tiet">Trung Đoàn và cơ quan đơn vị</Link></li>
                  <li><Link to="lich-su">Lịch sử chiến đấu</Link></li>
                  <li><Link to="phan-thuong">Phần thưởng cao quý</Link></li>
                  <li><Link to="/gioi-thieu/lanh-dao">Lãnh đạo qua các thời kỳ</Link></li>
                </ul>
              </li>

              <li className={`dropdown ${openDropdown === 'tin-tuc' ? 'open' : ''}`}>
                <a href="#" onClick={(e) => { e.preventDefault(); toggleDropdown('tin-tuc'); }}>
                  TIN TỨC
                  <i className="fas fa-chevron-down dropdown-icon"></i>
                </a>
                <ul className="dropdown-menu">
                  <li><Link to="san-pham">Trong nước và quốc tế</Link></li>
                  <li><Link to="quan-su">Quân sự</Link></li>
                  <li><Link to="hoat-dong">Hoạt động của Trung Đoàn</Link></li>
                </ul>
              </li>

              <li className={`dropdown ${openDropdown === 'thu-vien' ? 'open' : ''}`}>
                <a href="#" onClick={(e) => { e.preventDefault(); toggleDropdown('thu-vien'); }}>
                  THƯ VIỆN
                  <i className="fas fa-chevron-down dropdown-icon"></i>
                </a>
                <ul className="dropdown-menu">
                  <li><Link to="/thu-vien">Thư viện tổng hợp</Link></li>
                  <li><Link to="/thu-vien/thu-vien-so">Thư viện số</Link></li>
                  <li><Link to="/phan-mem-quan-doi">Phần mềm quân đội</Link></li>
                </ul>
              </li>

              <li className={`dropdown ${openDropdown === 'van-ban' ? 'open' : ''}`}>
                <a href="#" onClick={(e) => { e.preventDefault(); toggleDropdown('van-ban'); }}>
                  VĂN BẢN
                  <i className="fas fa-chevron-down dropdown-icon"></i>
                </a>
                <ul className="dropdown-menu">
                  <li><Link to="/van-ban/huong-dan">Hướng dẫn chỉ đạo</Link></li>
                  <li><Link to="/van-ban/quy-pham">Quy phạm pháp luật</Link></li>
                  <li><Link to="/van-ban/bieu-mau">Các mẫu văn bản</Link></li>
                </ul>
              </li>

              <li className={location.pathname === '/lien-he' ? 'active' : ''}>
                <Link to="/lien-he">LIÊN HỆ</Link>
              </li>
            </ul>

            {/* Right side - Search & Auth */}
            <div className="nav-right">
              {/* Search */}
              <form className="search-form" onSubmit={handleSearch}>
                <div className="search-input-group">
                  <input
                    type="text"
                    placeholder="Tìm kiếm..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                  />
                  <button type="submit" className="search-btn">
                    <i className="fas fa-search"></i>
                  </button>
                </div>
              </form>

              {/* Auth Section */}
              <div className="auth-section">
                {user ? (
                  <div className="user-menu">
                    <Link to="/profile" className="user-name">
                      <i className="fas fa-user"></i>
                      {user.name}
                    </Link>
                    <button onClick={handleLogout} className="logout-btn">
                      <i className="fas fa-sign-out-alt"></i>
                      Đăng xuất
                    </button>
                  </div>
                ) : (
                  <Link to="/admin/login" className="login-btn">
                    <i className="fas fa-user"></i>
                    <span>Đăng nhập</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Trending/Announcement Bar */}
      <div
        className="trending-bar announcement-bar"
        style={{
          background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
          color: '#ffffff',
          fontWeight: 700,
          fontSize: '1.1rem',
          padding: '12px 0',
          textAlign: 'center',
          letterSpacing: '0.5px',
          marginBottom: '0',
          marginTop: '0',
          boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)',
          width: '100%',
          maxWidth: '100vw',
          borderTop: '3px solid #fbbf24',
          borderBottom: '3px solid #fbbf24'
        }}
      >
        <marquee scrollamount="5" style={{ width: '100vw', color: '#ffffff', fontWeight: 600 }}>
          🎖️ Chào mừng bạn đến với cổng thông tin điện tử Trung đoàn 290 - Đoàn Sông Mã Anh Hùng &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 🏛️ Welcome to the official online information portal of Regiment 290 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </marquee>
      </div>
    </>
  );
}

export default Header;











