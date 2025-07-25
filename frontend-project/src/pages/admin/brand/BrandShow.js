import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import BrandService from '../../../services/BrandService';

function BrandShow() {
  const { id } = useParams();
  const [brand, setBrand] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBrand();
  }, [id]);

  // Sửa function fetchBrand
  const fetchBrand = async () => {
    try {
      setLoading(true);
      const response = await BrandService.getById(id);
      
      console.log('Brand response:', response);
      
      // SỬA LOGIC KIỂM TRA - dựa vào response thực tế
      if (response.success && response.data) {  // Đổi từ response.status thành response.success
        setBrand(response.data);
        setError(null);
        console.log('✅ Brand data set successfully:', response.data);
      } else {
        setError(response.message || 'Không thể tải thông tin thương hiệu');
        setBrand(null);
        console.log('❌ Failed to set brand data');
      }
    } catch (error) {
      console.error('Error loading brand:', error);
      setError('Đã xảy ra lỗi khi tải thông tin thương hiệu');
      setBrand(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="page-title">Chi tiết thương hiệu</h2>
        <div>
          <Link to={`/admin/brands/edit/${id}`} className="btn btn-warning me-2">
            <i className="fas fa-edit me-2"></i>Chỉnh sửa
          </Link>
          <Link to="/admin/brands" className="btn btn-secondary">
            <i className="fas fa-arrow-left me-2"></i>Quay lại
          </Link>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">{error}</div>
      )}

      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
          <p className="mt-2">Đang tải dữ liệu...</p>
        </div>
      ) : brand ? (
        <div className="card">
          <div className="card-body">
            <div className="row">
              <div className="col-md-8">
                <h3>Thông tin thương hiệu</h3>
                <table className="table table-borderless">
                  <tbody>
                    <tr>
                      <td><strong>ID:</strong></td>
                      <td>{brand.id}</td>
                    </tr>
                    <tr>
                      <td><strong>TÊN THƯƠNG HIỆU:</strong></td>
                      <td>{brand.name}</td>
                    </tr>
                    <tr>
                      <td><strong>SLUG:</strong></td>
                      <td>{brand.slug}</td>
                    </tr>
                    <tr>
                      <td><strong>MÔ TÀ:</strong></td>
                      <td>{brand.description || 'Không có mô tả'}</td>
                    </tr>
                    <tr>
                      <td><strong>TRẠNG THÁI:</strong></td>
                      <td>
                        {brand.status === 1 ? (
                          <span className="badge bg-success">Hoạt động</span>
                        ) : (
                          <span className="badge bg-danger">Không hoạt động</span>
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td><strong>NGÀY TẠO:</strong></td>
                      <td>
                        {brand.created_at ? 
                          new Date(brand.created_at).toLocaleDateString('vi-VN') : 
                          'N/A'}
                      </td>
                    </tr>
                    <tr>
                      <td><strong>CẬP NHẬT LẦN CUỐI:</strong></td>
                      <td>
                        {brand.updated_at ? 
                          new Date(brand.updated_at).toLocaleDateString('vi-VN') : 
                          'N/A'}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="col-md-4">
                <h3>Logo thương hiệu</h3>
                {brand.image ? (
                  <img 
                    src={brand.image} 
                    alt={brand.name} 
                    className="img-fluid rounded shadow"
                    style={{ maxHeight: '200px' }}
                  />
                ) : (
                  <div className="text-center p-5 bg-light rounded">
                    <i className="fas fa-image fa-3x text-muted mb-3"></i>
                    <p className="text-muted">Không có hình ảnh</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="alert alert-warning" role="alert">
          Không tìm thấy thông tin thương hiệu.
        </div>
      )}
    </div>
  );
}

export default BrandShow;
