import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const location = useLocation();
  const [openDropdown, setOpenDropdown] = useState(null);

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const toggleDropdown = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  return (
    <nav className="main-navbar">
      <div className="container-fluid">
        <div className="navbar-content">
          {/* Breaking News */}
          <div className="breaking-news">
            <span className="breaking-label">Tin nóng</span>
            <div className="breaking-text">
              <marquee>Chào mừng bạn đến với Shop News - Trang tin tức mua sắm hàng đầu Việt Nam!</marquee>
            </div>
          </div>

          {/* Main Menu */}
          <ul className="main-menu">
            <li>
              <Link to="/" className={isActive('/')}>
                Trang chủ
              </Link>
            </li>
            
            <li className={`dropdown ${openDropdown === 'gioi-thieu' ? 'open' : ''}`}>
              <a 
                href="/gioi-thieu" 
                onClick={(e) => { e.preventDefault(); toggleDropdown('gioi-thieu'); }}
              >
                Giới thiệu
              </a>
              <ul className="dropdown-menu">
                <li><Link to="/gioi-thieu/chi-tiet">Trung Đoàn và cơ quan đơn vị</Link></li>
                <li><Link to="/gioi-thieu/lich-su">Lịch sử chiến đấu</Link></li>
                <li><Link to="/gioi-thieu/phan-thuong">Phần thưởng cao quý</Link></li>
                <li><Link to="/gioi-thieu/lanh-dao">Lãnh đạo qua các thời kỳ</Link></li>
              </ul>
            </li>

            <li className={`dropdown ${openDropdown === 'tin-tuc' ? 'open' : ''}`}>
              <a 
                href="/tin-tuc" 
                onClick={(e) => { e.preventDefault(); toggleDropdown('tin-tuc'); }}
              >
                Tin tức
              </a>
              <ul className="dropdown-menu">
                <li><Link to="/tin-tuc/trong-ngoai-nuoc">Trong nước và quốc tế</Link></li>
                <li><Link to="/tin-tuc/quan-su">Quân sự</Link></li>
                <li><Link to="/tin-tuc/hoat-dong">Hoạt động của Trung Đoàn, Sư Đoàn</Link></li>
              </ul>
            </li>

            <li className={`dropdown ${openDropdown === 'thu-vien' ? 'open' : ''}`}>
              <a 
                href="/thu-vien" 
                onClick={(e) => { e.preventDefault(); toggleDropdown('thu-vien'); }}
              >
                Thư viện
              </a>
              <ul className="dropdown-menu">
                <li><Link to="/thu-vien/thu-vien-so">Thư viện số</Link></li>
                <li><Link to="/thu-vien/tai-lieu">Phim ảnh, tài liệu</Link></li>
                <li><Link to="/thu-vien/phan-mem">Phần mềm</Link></li>
              </ul>
            </li>

            <li className={`dropdown ${openDropdown === 'chuyen-de' ? 'open' : ''}`}>
              <a 
                href="/chuyen-de" 
                onClick={(e) => { e.preventDefault(); toggleDropdown('chuyen-de'); }}
              >
                Chuyên đề
              </a>
              <ul className="dropdown-menu">
                <li><Link to="/chuyen-de/cchc-cds">CCHC và chuyển đổi số</Link></li>
                <li><Link to="/chuyen-de/tuyen-truyen">Thông tin tuyên truyền</Link></li>
                <li><Link to="/chuyen-de/phap-luat">Thông tin pháp luật</Link></li>
                <li><Link to="/chuyen-de/khoa-hoc-quan-su">Thông tin KHQS</Link></li>
              </ul>
            </li>

            <li className={`dropdown ${openDropdown === 'van-ban' ? 'open' : ''}`}>
              <a 
                href="/van-ban" 
                onClick={(e) => { e.preventDefault(); toggleDropdown('van-ban'); }}
              >
                Văn bản
              </a>
              <ul className="dropdown-menu">
                <li><Link to="/van-ban/huong-dan">Hướng dẫn chỉ đạo</Link></li>
                <li><Link to="/van-ban/quy-pham">Quy phạm pháp luật</Link></li>
                <li><Link to="/van-ban/bieu-mau">Các mẫu văn bản</Link></li>
              </ul>
            </li>

            <li>
              <Link to="/lien-he" className={isActive('/lien-he')}>
                Liên hệ
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;


