import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ProductService from '../../services/ProductService';

function Sidebar() {
  const [pendingCount, setPendingCount] = useState(0);
  const location = useLocation();
  
  useEffect(() => {
    // Lấy số lượng sản phẩm chờ duyệt
    const fetchPendingProducts = async () => {
      try {
        const response = await ProductService.getProductsByApprovalStatus(0);
        if (response.status && response.products) {
          setPendingCount(response.products.length);
        }
      } catch (error) {
        console.error('Error fetching pending products:', error);
      }
    };
    
    fetchPendingProducts();
    
    // Cập nhật mỗi 5 phút
    const interval = setInterval(fetchPendingProducts, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">
      
      {/* Menu sản phẩm */}
      <li className="nav-item">
        <a className="nav-link collapsed" href="#" data-bs-toggle="collapse" data-bs-target="#collapseProducts" aria-expanded="false" aria-controls="collapseProducts">
          <i className="fas fa-box-open"></i>
          <span>Sản phẩm</span>
        </a>
        <div id="collapseProducts" className="collapse" aria-labelledby="headingProducts" data-bs-parent="#accordionSidebar">
          <div className="bg-white py-2 collapse-inner rounded">
            <h6 className="collapse-header">Quản lý sản phẩm:</h6>
            <Link className="collapse-item" to="/admin/products">Danh sách</Link>
            <Link className="collapse-item" to="/admin/products/create">Thêm mới</Link>
            <Link className="collapse-item position-relative" to="/admin/products/approval">
              Duyệt sản phẩm
              {pendingCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {pendingCount}
                  <span className="visually-hidden">sản phẩm chờ duyệt</span>
                </span>
              )}
            </Link>
          </div>
        </div>
      </li>
      
      {/* Menu Upload File */}
      <li className="nav-item">
        <Link 
          to="/admin/uploads" 
          className={`nav-link ${location.pathname.includes('/admin/uploads') ? 'active' : ''}`}
        >
          <i className="fas fa-cloud-upload-alt me-2"></i>
          Upload File
        </Link>
      </li>
      
    </ul>
  );
}

export default Sidebar;


