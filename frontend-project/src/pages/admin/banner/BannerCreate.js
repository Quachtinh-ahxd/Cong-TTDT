import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BannerService from '../../../services/BannerService';
import Swal from 'sweetalert2';
import './BannerForm.css';

function BannerCreate() {
  const navigate = useNavigate();
  
  // State cho form
  const [formData, setFormData] = useState({
    name: '',
    link: '',
    position: 'slideshow', // Giá trị mặc định
    sort_order: '0',
    status: '2', // Mặc định là chưa xuất bản
    image: null
  });
  
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Xử lý thay đổi file ảnh
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        image: file
      });
      
      // Tạo preview ảnh
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Kiểm tra dữ liệu
    if (!formData.name || !formData.position || !formData.image) {
      Swal.fire(
        'Lỗi!',
        'Vui lòng điền đầy đủ thông tin và chọn hình ảnh.',
        'error'
      );
      return;
    }
    
    try {
      setLoading(true);
      
      // Tạo FormData để gửi file
      const data = new FormData();
      data.append('name', formData.name);
      data.append('link', formData.link);
      data.append('position', formData.position);
      data.append('sort_order', formData.sort_order);
      data.append('status', formData.status);
      
      if (formData.image) {
        data.append('image', formData.image);
      }
      
      // Gọi API tạo banner
      const response = await BannerService.create(data);
      
      if (response.status) {
        Swal.fire(
          'Thành công!',
          'Banner đã được tạo thành công.',
          'success'
        ).then(() => {
          // Chuyển hướng về trang danh sách banner
          navigate('/admin/banners');
        });
      } else {
        Swal.fire(
          'Lỗi!',
          response.message || 'Không thể tạo banner.',
          'error'
        );
      }
    } catch (error) {
      console.error('Error creating banner:', error);
      Swal.fire(
        'Lỗi!',
        'Đã xảy ra lỗi khi tạo banner.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="page-title">Thêm banner mới</h2>
        <button 
          className="btn btn-secondary"
          onClick={() => navigate('/admin/banners')}
        >
          <i className="fas fa-arrow-left me-2"></i>Quay lại
        </button>
      </div>
      
      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-8">
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Tên banner <span className="text-danger">*</span></label>
                  <input 
                    type="text" 
                    className="form-control" 
                    id="name" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="link" className="form-label">Liên kết</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    id="link" 
                    name="link"
                    value={formData.link}
                    onChange={handleChange}
                    placeholder="https://example.com"
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="position" className="form-label">Vị trí <span className="text-danger">*</span></label>
                  <select 
                    className="form-select" 
                    id="position" 
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    required
                  >
                    <option value="slideshow">Slideshow</option>
                    <option value="banner-top">Banner trên</option>
                    <option value="banner-bottom">Banner dưới</option>
                    <option value="banner-left">Banner trái</option>
                    <option value="banner-right">Banner phải</option>
                  </select>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="sort_order" className="form-label">Thứ tự sắp xếp</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    id="sort_order" 
                    name="sort_order"
                    value={formData.sort_order}
                    onChange={handleChange}
                    min="0"
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="status" className="form-label">Trạng thái</label>
                  <select 
                    className="form-select" 
                    id="status" 
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="1">Xuất bản</option>
                    <option value="2">Chưa xuất bản</option>
                  </select>
                </div>
              </div>
              
              <div className="col-md-4">
                <div className="mb-3">
                  <label htmlFor="image" className="form-label">Hình ảnh <span className="text-danger">*</span></label>
                  <input 
                    type="file" 
                    className="form-control" 
                    id="image" 
                    name="image"
                    onChange={handleImageChange}
                    accept="image/*"
                    required
                  />
                  <small className="form-text text-muted">
                    Chọn file hình ảnh (JPG, PNG, GIF, WEBP). Kích thước tối đa 2MB.
                  </small>
                </div>
                
                {imagePreview && (
                  <div className="mb-3">
                    <label className="form-label">Xem trước</label>
                    <div className="image-preview-container">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="img-fluid banner-preview"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-4 d-flex justify-content-end">
              <button 
                type="button" 
                className="btn btn-secondary me-2"
                onClick={() => navigate('/admin/banners')}
                disabled={loading}
              >
                Hủy
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Đang xử lý...
                  </>
                ) : (
                  'Lưu banner'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default BannerCreate;

