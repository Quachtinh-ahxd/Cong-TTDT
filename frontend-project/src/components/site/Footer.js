import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  return (
    <footer className="site-footer bg-dark text-white py-5 mt-5">
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-4 mb-md-0">
            <h5 className="mb-3">Về Trung đoàn 290</h5>
            <p>
              Trung đoàn Ra đa 290 - Đơn vị anh hùng của Quân đội nhân dân Việt Nam. 
              Với truyền thống "Trung thành - Dũng cảm - Sáng tạo - Quyết thắng".
            </p>
            <div className="social-links mt-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="me-2">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="me-2">
                <i className="fab fa-youtube"></i>
              </a>
              <a href="mailto:info@trungdoan290.vn" className="me-2">
                <i className="fas fa-envelope"></i>
              </a>
            </div>
          </div>
          
          <div className="col-md-2 mb-4 mb-md-0">
            <h5 className="mb-3">Thông tin</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><Link to="/">Trang chủ</Link></li>
              <li className="mb-2"><Link to="/gioi-thieu/chi-tiet">Giới thiệu</Link></li>
              <li className="mb-2"><Link to="/lich-su">Lịch sử - Truyền thống</Link></li>
              <li className="mb-2"><Link to="/trung-doan-va-co-quan">Tổ chức</Link></li>
              <li><Link to="/lien-he">Liên hệ</Link></li>
            </ul>
          </div>
          
          <div className="col-md-3 mb-4 mb-md-0">
            <h5 className="mb-3">Chuyên đề</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><Link to="/chuyen-de/cchc-cds">CCHC và chuyển đổi số</Link></li>
              <li className="mb-2"><Link to="/chuyen-de/tuyen-truyen">Thông tin tuyên truyền</Link></li>
              <li className="mb-2"><Link to="/chuyen-de/phap-luat">Thông tin pháp luật</Link></li>
              <li className="mb-2"><Link to="/chuyen-de/khoa-hoc-quan-su">Khoa học quân sự</Link></li>
              <li><Link to="/phan-mem-quan-doi">Phần mềm quân đội</Link></li>
            </ul>
          </div>
          
          <div className="col-md-3">
            <h5 className="mb-3">Thông tin liên hệ</h5>
            <ul className="list-unstyled contact-info">
              <li className="mb-2">
                <i className="fas fa-map-marker-alt me-2"></i>
                Trung đoàn Ra đa 290, Sư đoàn 375, Quân chủng Phòng không - không quân
              </li>
              <li className="mb-2">
                <i className="fas fa-phone-alt me-2"></i>
                (028) 1234 5678
              </li>
              <li className="mb-2">
                <i className="fas fa-envelope me-2"></i>
                info@trungdoan290.vn
              </li>
              <li>
                <i className="fas fa-clock me-2"></i>
                Thứ 2 - Thứ 6: 7:30 - 16:30
              </li>
            </ul>
          </div>
        </div>
        
        <hr className="my-4" />
        
        <div className="row">
          <div className="col-md-6 mb-3 mb-md-0">
            <p className="mb-0">© 2025 Trung đoàn Ra đa 290. Tất cả quyền được bảo lưu.</p>
          </div>
          <div className="col-md-6 text-md-end">
            <ul className="list-inline mb-0">
              <li className="list-inline-item"><Link to="/van-ban/bieu-mau">Văn bản - Biểu mẫu</Link></li>
              <li className="list-inline-item mx-3">|</li>
              <li className="list-inline-item"><Link to="/thu-vien-so">Thư viện số</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;


