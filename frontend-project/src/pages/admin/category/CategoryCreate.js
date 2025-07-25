import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CategoryService from '../../../services/CategoryService';
import Swal from 'sweetalert2';

function CategoryCreate() {
  const navigate = useNavigate();
  
  // State cho form
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    status: '2' // Mặc định là chưa xuất bản
  });
  
  // State loading
  const [loading, setLoading] = useState(false);
  
  // Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Tự động tạo slug từ tên
    if (name === 'name') {
      const slug = value
        .toLowerCase()
        .replace(/[áàảãạăắằẳẵặâấầẩẫậ]/g, 'a')
        .replace(/[éèẻẽẹêếềểễệ]/g, 'e')
        .replace(/[íìỉĩị]/g, 'i')
        .replace(/[óòỏõọôốồổỗộơớờởỡợ]/g, 'o')
        .replace(/[úùủũụưứừửữự]/g, 'u')
        .replace(/[ýỳỷỹỵ]/g, 'y')
        .replace(/đ/g, 'd')
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/-+/g, '-');
      
      setFormData(prev => ({
        ...prev,
        slug
      }));
    }
  };
  
  // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Kiểm tra dữ liệu
    if (!formData.name) {
      Swal.fire(
        'Lỗi!',
        'Vui lòng nhập tên chuyên mục.',
        'error'
      );
      return;
    }
    
    try {
      setLoading(true);
      
      // Gọi API tạo chuyên mục
      const response = await CategoryService.create(formData);
      
      if (response.status) {
        Swal.fire(
          'Thành công!',
          'Chuyên mục đã được tạo thành công.',
          'success'
        ).then(() => {
          // Chuyển hướng về trang danh sách chuyên mục
          navigate('/admin/categories');
        });
      } else {
        Swal.fire(
          'Lỗi!',
          response.message || 'Không thể tạo chuyên mục.',
          'error'
        );
      }
    } catch (error) {
      console.error('Error creating category:', error);
      Swal.fire(
        'Lỗi!',
        'Đã xảy ra lỗi khi tạo chuyên mục.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="page-title">Thêm chuyên mục mới</h2>
        <button 
          className="btn btn-secondary" 
          onClick={() => navigate('/admin/categories')}
        >
          <i className="fas fa-arrow-left me-2"></i>Quay lại
        </button>
      </div>
      
      <div className="card">
        <div className="card-header">
          <h5 className="card-title mb-0">Thêm chuyên mục mới</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Tên chuyên mục <span className="text-danger">*</span></label>
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
              <label htmlFor="slug" className="form-label">Slug</label>
              <input 
                type="text" 
                className="form-control" 
                id="slug" 
                name="slug"
                value={formData.slug}
                onChange={handleChange}
              />
              <small className="text-muted">Slug sẽ được tạo tự động từ tên chuyên mục</small>
            </div>
            
            <div className="mb-3">
              <label htmlFor="description" className="form-label">Mô tả</label>
              <textarea 
                className="form-control" 
                id="description" 
                name="description"
                rows="3"
                value={formData.description}
                onChange={handleChange}
              ></textarea>
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
            
            <div className="text-end mt-4">
              <button 
                type="button" 
                className="btn btn-secondary me-2"
                onClick={() => navigate('/admin/categories')}
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
                  <>Lưu chuyên mục</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CategoryCreate;



