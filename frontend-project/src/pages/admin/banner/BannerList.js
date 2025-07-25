import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BannerService from '../../../services/BannerService';
import Swal from 'sweetalert2';
import { bannerImage } from '../../../config';
import './BannerList.css';

function BannerList() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Tải danh sách banner
  useEffect(() => {
    loadBanners();
  }, []);

  // Định nghĩa hàm loadBanners ở mức component để có thể tái sử dụng
  const loadBanners = async () => {
    try {
      setLoading(true);
      const response = await BannerService.getAll();
      if (response.status) {
        console.log('Banners loaded:', response.banners);
        setBanners(response.banners);
      } else {
        setError('Không thể tải danh sách banner');
      }
    } catch (error) {
      console.error('Error loading banners:', error);
      setError('Đã xảy ra lỗi khi tải danh sách banner');
    } finally {
      setLoading(false);
    }
  };

  // Xử lý xóa banner
  const handleDelete = (id) => {
    Swal.fire({
      title: 'Bạn có chắc chắn?',
      text: "Bạn không thể hoàn tác hành động này!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await BannerService.delete(id);
          if (response.status) {
            Swal.fire(
              'Đã xóa!',
              'Banner đã được xóa thành công.',
              'success'
            );
            // Tải lại danh sách banner
            loadBanners();
          } else {
            Swal.fire(
              'Lỗi!',
              response.message || 'Không thể xóa banner.',
              'error'
            );
          }
        } catch (error) {
          console.error('Error deleting banner:', error);
          Swal.fire(
            'Lỗi!',
            'Đã xảy ra lỗi khi xóa banner.',
            'error'
          );
        }
      }
    });
  };

  // Xử lý thay đổi trạng thái
  const handleChangeStatus = async (id) => {
    try {
      const response = await BannerService.changeStatus(id);
      if (response.status) {
        Swal.fire(
          'Thành công!',
          'Trạng thái banner đã được cập nhật.',
          'success'
        );
        // Tải lại danh sách banner
        loadBanners();
      } else {
        Swal.fire(
          'Lỗi!',
          response.message || 'Không thể cập nhật trạng thái banner.',
          'error'
        );
      }
    } catch (error) {
      console.error('Error changing banner status:', error);
      Swal.fire(
        'Lỗi!',
        'Đã xảy ra lỗi khi cập nhật trạng thái banner.',
        'error'
      );
    }
  };

  // Hiển thị trạng thái banner
  const renderStatus = (status) => {
    if (status === 1) {
      return <span className="badge bg-success">Xuất bản</span>;
    } else if (status === 2) {
      return <span className="badge bg-warning">Chưa xuất bản</span>;
    } else {
      return <span className="badge bg-danger">Đã xóa</span>;
    }
  };

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="page-title">Quản lý banner</h2>
        <Link to="/admin/banners/create" className="btn btn-primary">
          <i className="fas fa-plus-circle me-2"></i>Thêm banner
        </Link>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="card">
        <div className="card-body">
          {loading ? (
            <div className="text-center my-3">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Đang tải...</span>
              </div>
              <p className="mt-2">Đang tải danh sách banner...</p>
            </div>
          ) : banners.length === 0 ? (
            <div className="alert alert-info" role="alert">
              Chưa có banner nào. Hãy thêm banner mới.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th style={{ width: '5%' }}>ID</th>
                    <th style={{ width: '15%' }}>Hình ảnh</th>
                    <th style={{ width: '20%' }}>Tên banner</th>
                    <th style={{ width: '15%' }}>Vị trí</th>
                    <th style={{ width: '15%' }}>Liên kết</th>
                    <th style={{ width: '10%' }}>Trạng thái</th>
                    <th style={{ width: '20%' }}>Chức năng</th>
                  </tr>
                </thead>
                <tbody>
                  {banners.map((banner) => (
                    <tr key={banner.id}>
                      <td>{banner.id}</td>
                      <td>
                        {banner.image ? (
                          <img 
                            src={banner.image.includes('/') 
                              ? banner.image 
                              : `${bannerImage}/${banner.image}`} 
                            alt={banner.name}
                            className="banner-thumbnail"
                            crossOrigin="anonymous"
                            onError={(e) => {
                              console.error('Image failed to load:', e.target.src);
                              e.target.onerror = null;
                              e.target.style.display = 'none';
                              e.target.parentNode.innerHTML = '<div class="no-image-text">Không có ảnh</div>';
                            }}
                          />
                        ) : (
                          <div className="no-image-text">Không có ảnh</div>
                        )}
                      </td>
                      <td>{banner.name}</td>
                      <td>{banner.position}</td>
                      <td>
                        {banner.link ? (
                          <a href={banner.link} target="_blank" rel="noopener noreferrer">
                            {banner.link.length > 20 ? banner.link.substring(0, 20) + '...' : banner.link}
                          </a>
                        ) : (
                          <span className="text-muted">Không có</span>
                        )}
                      </td>
                      <td>{renderStatus(banner.status)}</td>
                      <td>
                        <div className="btn-group" role="group">
                          <Link to={`/admin/banners/show/${banner.id}`} className="btn btn-sm btn-info">
                            <i className="fas fa-eye"></i>
                          </Link>
                          <Link to={`/admin/banners/edit/${banner.id}`} className="btn btn-sm btn-primary">
                            <i className="fas fa-edit"></i>
                          </Link>
                          <button 
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(banner.id)}
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                          <button 
                            className="btn btn-sm btn-warning"
                            onClick={() => handleChangeStatus(banner.id)}
                          >
                            <i className="fas fa-sync-alt"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BannerList;






