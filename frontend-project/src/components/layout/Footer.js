import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="main-footer">
      <div className="footer-content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-4">
              <div className="footer-section">
                <h4>Về chúng tôi</h4>
                <p>
                  Trung đoàn Bộ binh Cơ giới 290 - Đơn vị anh hùng của Quân đội nhân dân Việt Nam.
                  Với truyền thống "Đoàn kết - Kỷ luật - Chiến đấu".
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="footer-section">
                <h4>Liên kết</h4>
                <ul className="footer-links">
                  <li><a href="/">Trang chủ</a></li>
                  <li><a href="/gioi-thieu">Giới thiệu</a></li>
                  <li><a href="/tin-tuc">Tin tức</a></li>
                  <li><a href="/thu-vien">Thư viện</a></li>
                </ul>
              </div>
            </div>
            <div className="col-md-4">
              <div className="footer-section">
                <h4>Danh mục</h4>
                <ul className="footer-links">
                  <li><a href="/dien-thoai">Điện thoại</a></li>
                  <li><a href="/laptop">Laptop</a></li>
                  <li><a href="/phu-kien">Phụ kiện</a></li>
                  <li><a href="/lien-he">Liên hệ</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-md-6">
              <p>&copy; 2025 Trung đoàn 290. Tất cả quyền được bảo lưu.</p>
            </div>
            <div className="col-md-6 text-end">
              <p>📍 123 Đường ABC, Quận XYZ, TP. HCM | ☎ (028) 1234 5678</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
