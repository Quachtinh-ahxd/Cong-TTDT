import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BannerService from '../../../services/BannerService';
import { bannerImage } from '../../../config';
import './BannerShow.css';

function BannerShow() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchBanner = async () => {
      try {
        setLoading(true);
        const response = await BannerService.getById(id);
        
        if (response.status) {
          setBanner(response.banner);
        } else {
          setError(response.message || 'Không thể tải thông tin banner');
        }
      } catch (error) {
        console.error('Error fetching banner:', error);
        setError('Đã xảy ra lỗi khi tải thông tin banner');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBanner();
  }, [id]);
  
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
  
  if (loading) {
    return (
      <div className="container-fluid">
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
          <p className="mt-2">Đang tải thông tin banner...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container-fluid">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/admin/banners')}
        >
          Quay lại danh sách
        </button>
      </div>
    );
  }
  
  if (!banner) {
    return (
      <div className="container-fluid">
        <div className="alert alert-warning" role="alert">
          Không tìm thấy thông tin banner
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/admin/banners')}
        >
          Quay lại danh sách
        </button>
      </div>
    );
  }
  
  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="page-title">Chi tiết banner</h2>
        <div>
          <button 
            className="btn btn-secondary me-2"
            onClick={() => navigate('/admin/banners')}
          >
            <i className="fas fa-arrow-left me-2"></i>Quay lại
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => navigate(`/admin/banners/edit/${banner.id}`)}
          >
            <i className="fas fa-edit me-2"></i>Chỉnh sửa
          </button>
        </div>
      </div>
      
      <div className="row">
        <div className="col-md-8">
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="card-title mb-0">Thông tin banner</h5>
            </div>
            <div className="card-body">
              <table className="table table-bordered">
                <tbody>
                  <tr>
                    <th style={{ width: '30%' }}>ID</th>
                    <td>{banner.id}</td>
                  </tr>
                  <tr>
                    <th>Tên banner</th>
                    <td>{banner.name}</td>
                  </tr>
                  <tr>
                    <th>Vị trí</th>
                    <td>{banner.position}</td>
                  </tr>
                  <tr>
                    <th>Liên kết</th>
                    <td>
                      {banner.link ? (
                        <a href={banner.link} target="_blank" rel="noopener noreferrer">
                          {banner.link}
                        </a>
                      ) : (
                        <span className="text-muted">Không có</span>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <th>Thứ tự sắp xếp</th>
                    <td>{banner.sort_order}</td>
                  </tr>
                  <tr>
                    <th>Trạng thái</th>
                    <td>{renderStatus(banner.status)}</td>
                  </tr>
                  <tr>
                    <th>Ngày tạo</th>
                    <td>{banner.created_at ? new Date(banner.created_at).toLocaleString() : 'N/A'}</td>
                  </tr>
                  <tr>
                    <th>Cập nhật lần cuối</th>
                    <td>{banner.updated_at ? new Date(banner.updated_at).toLocaleString() : 'N/A'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">Hình ảnh banner</h5>
            </div>
            <div className="card-body text-center">
              {banner.image ? (
                <img 
                  src={banner.image.includes('/') 
                    ? banner.image 
                    : `${bannerImage}/${banner.image}`} 
                  alt={banner.name}
                  className="img-fluid banner-detail-image"
                  crossOrigin="anonymous"
                  onError={(e) => {
                    console.error('Image failed to load:', e.target.src);
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                    e.target.parentNode.innerHTML = '<div class="no-image-container"><i class="fas fa-image no-image-icon"></i><p>Không có hình ảnh</p></div>';
                  }}
                />
              ) : (
                <div className="no-image-container">
                  <i className="fas fa-image no-image-icon"></i>
                  <p>Không có hình ảnh</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BannerShow;


