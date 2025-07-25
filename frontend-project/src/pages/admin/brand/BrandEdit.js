import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import BrandService from '../../../services/BrandService';
import Swal from 'sweetalert2';

function BrandEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    status: 1
  });

  useEffect(() => {
    fetchBrand();
  }, [id]);

  const fetchBrand = async () => {
    try {
      setLoading(true);
      const response = await BrandService.getById(id);
      
      console.log('Brand edit response:', response);
      
      if (response.success && response.data) {
        const brand = response.data;
        setFormData({
          name: brand.name || '',
          slug: brand.slug || '',
          description: brand.description || '',
          status: brand.status || 1
        });
        setError(null);
        console.log('✅ Brand edit data set successfully:', brand);
      } else {
        setError(response.message || 'Không thể tải thông tin thương hiệu');
        console.log('❌ Failed to set brand edit data');
      }
    } catch (error) {
      console.error('Error loading brand:', error);
      setError('Đã xảy ra lỗi khi tải thông tin thương hiệu');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await BrandService.update(id, formData);
      
      console.log('Update response:', response);
      
      if (response.success) {
        Swal.fire({
          title: 'Thành công!',
          text: response.message || 'Cập nhật thương hiệu thành công!',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          navigate('/admin/brands');
        });
      } else {
        Swal.fire('Lỗi!', response.message || 'Không thể cập nhật thương hiệu', 'error');
      }
    } catch (error) {
      console.error('Error updating brand:', error);
      Swal.fire('Lỗi!', 'Đã xảy ra lỗi khi cập nhật thương hiệu', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="page-title">Chỉnh sửa thương hiệu</h2>
        <Link to="/admin/brands" className="btn btn-secondary">
          <i className="fas fa-arrow-left me-2"></i>Quay lại
        </Link>
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
      ) : (
        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Tên thương hiệu</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="slug" className="form-label">Slug</label>
                <input
                  type="text"
                  className="form-control"
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="description" className="form-label">Mô tả</label>
                <textarea
                  className="form-control"
                  id="description"
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleInputChange}
                ></textarea>
              </div>

              <div className="mb-3">
                <label htmlFor="status" className="form-label">Trạng thái</label>
                <select
                  className="form-select"
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value={1}>Hoạt động</option>
                  <option value={0}>Không hoạt động</option>
                </select>
              </div>

              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Đang lưu...
                    </>
                  ) : 'Lưu'}
                </button>
                <Link to="/admin/brands" className="btn btn-secondary">
                  Hủy
                </Link>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default BrandEdit;
