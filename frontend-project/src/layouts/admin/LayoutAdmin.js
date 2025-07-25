import React, { useEffect } from "react";
import { Outlet, Link } from "react-router-dom";
import AdminSidebar from "../../components/AdminSidebar";
import HeaderAdmin from "../../components/HeaderAdmin";

// Import CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../../assets/css/admin.css';

export default function LayoutAdmin() {
  useEffect(() => {
    // Import jQuery và Bootstrap JS trong useEffect để tránh lỗi
    const loadScripts = async () => {
      try {
        // Đảm bảo jQuery được load trước Bootstrap
        const $ = await import('jquery');
        window.$ = window.jQuery = $.default;
        
        // Sau đó mới load Bootstrap
        await import('bootstrap/dist/js/bootstrap.bundle.min.js');
        
        // Khởi tạo các component Bootstrap nếu cần
        console.log('Scripts loaded successfully');
      } catch (error) {
        console.error('Error loading scripts:', error);
      }
    };
    
    loadScripts();
    
    // Cleanup function
    return () => {
      // Cleanup code nếu cần
    };
  }, []);

  return (
    <div>
      <HeaderAdmin />

      <section className="hdl-content">
        <div className="container-fluid">
          <div className="row">
            <AdminSidebar />
            <div className="col-md-9">
              <Outlet />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}



