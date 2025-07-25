import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BannerService from '../../../services/BannerService';
import { bannerImage } from '../../../config';
import Swal from 'sweetalert2';
import './BannerForm.css';

function BannerEdit() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  // State cho form
  const [formData, setFormData] = useState({
    name: '',
    link: '',
    position: '',
    sort_order: '0',
    status: '2',
    image: null
  });
  
  const [currentImage, setCurrentImage] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Tải thông tin banner
  useEffect(() => {
    const fetchBanner = async () => {
      try {
        setFetchLoading(true);
        const response = await BannerService.getById(id);
        
        if (response.status) {
          const banner = response.banner;
          setFormData({
            name: banner.name || '',
            link: banner.link || '',
            position: banner.position || 'slideshow',
            sort_order: banner.sort_order?.toString() || '0',
            status: banner.status?.toString() || '2',
            image: null
          });
          
          if (banner.image) {
            setCurrentImage(banner.image);
            setImagePreview(banner.image.includes('/') 
              ? banner.image 
              : `${bannerImage}/${banner.image}`);
          }
        } else {
          setError(response.message || 'Không thể tải thông tin banner');
        }
      } catch (error) {
        console.error('Error fetching banner:', error);
        setError('Đã xảy ra lỗi khi tải thông tin banner');
      } finally {
        setFetchLoading(false);
      }
    };
    
    fetchBanner();
  }, [id]);
  
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
    if (!formData.name || !formData.position) {
      Swal.fire(
        'Lỗi!',
        'Vui lòng điền đầy đủ thông tin banner.',
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
      
      // Gọi API cập nhật banner
      const response = await BannerService.update(id, data);
      
      if (response.status) {
        Swal.fire(
          'Thành công!',
          'Banner đã được cập nhật thành công.',
          'success'
        ).then(() => {
          // Chuyển hướng về trang danh sách banner
          navigate('/admin/banners');
        });
      } else {
        Swal.fire(
          'Lỗi!',
          response.message || 'Không thể cập nhật banner.',
          'error'
        );
      }
    } catch (error) {
      console.error('Error updating banner:', error);
      Swal.fire(
        'Lỗi!',
        'Đã xảy ra lỗi khi cập nhật banner.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };
  
  if (fetchLoading) {
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
  
  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="page-title">Chỉnh sửa banner</h2>
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
                  <label htmlFor="image" className="form-label">Hình ảnh</label>
                  <input 
                    type="file" 
                    className="form-control" 
                    id="image" 
                    name="image"
                    onChange={handleImageChange}
                    accept="image/*"
                  />
                  <small className="form-text text-muted">
                    Chọn file hình ảnh mới nếu muốn thay đổi (JPG, PNG, GIF, WEBP). Kích thước tối đa 2MB.
                  </small>
                </div>
                
                {currentImage && !imagePreview && (
                  <div className="mb-3">
                    <label className="form-label">Hình ảnh hiện tại</label>
                    <div className="image-preview-container">
                      <img 
                        src={currentImage.includes('/') 
                          ? currentImage 
                          : `${bannerImage}/${currentImage}`} 
                        alt="Current banner" 
                        className="img-fluid banner-preview"
                        crossOrigin="anonymous"
                        onError={(e) => {
                          console.error('Image failed to load:', e.target.src);
                          e.target.onerror = null;
                          e.target.style.display = 'none';
                          e.target.parentNode.innerHTML = '<div class="no-image-text">Không có ảnh</div>';
                        }}
                      />
                    </div>
                  </div>
                )}
                
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
                  'Lưu thay đổi'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default BannerEdit;
