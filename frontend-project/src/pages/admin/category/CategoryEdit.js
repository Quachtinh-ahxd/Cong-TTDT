import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CategoryService from '../../../services/CategoryService';
import Swal from 'sweetalert2';

function CategoryEdit() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  // State cho form
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    status: '2'
  });
  
  // State loading
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  
  // Lấy thông tin danh mục khi component được mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingData(true);
        
        // Lấy thông tin danh mục
        const categoryResponse = await CategoryService.getById(id);
        if (categoryResponse.status && categoryResponse.category) {
          const category = categoryResponse.category;
          setFormData({
            name: category.name || '',
            slug: category.slug || '',
            description: category.description || '',
            status: category.status.toString() || '2',
          });
        } else {
          Swal.fire(
            'Lỗi!',
            'Không thể tải thông tin danh mục.',
            'error'
          ).then(() => {
            navigate('/admin/categories');
          });
          return;
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        Swal.fire(
          'Lỗi!',
          'Không thể tải dữ liệu.',
          'error'
        ).then(() => {
          navigate('/admin/categories');
        });
      } finally {
        setLoadingData(false);
      }
    };
    
    fetchData();
  }, [id, navigate]);
  
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
        'Vui lòng nhập tên danh mục.',
        'error'
      );
      return;
    }
    
    try {
      setLoading(true);
      
      // Gọi API cập nhật danh mục
      const response = await CategoryService.update(id, formData);
      
      if (response.status) {
        Swal.fire(
          'Thành công!',
          'Danh mục đã được cập nhật thành công.',
          'success'
        ).then(() => {
          // Chuyển hướng về trang danh sách danh mục
          navigate('/admin/categories');
        });
      } else {
        Swal.fire(
          'Lỗi!',
          response.message || 'Không thể cập nhật danh mục.',
          'error'
        );
      }
    } catch (error) {
      console.error('Error updating category:', error);
      Swal.fire(
        'Lỗi!',
        'Đã xảy ra lỗi khi cập nhật danh mục.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="page-title">Chỉnh sửa danh mục</h2>
        <button 
          className="btn btn-secondary" 
          onClick={() => navigate('/admin/categories')}
        >
          <i className="fas fa-arrow-left me-2"></i>Quay lại
        </button>
      </div>
      
      <div className="card">
        <div className="card-body">
          {loadingData ? (
            <div className="text-center my-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Đang tải...</span>
              </div>
              <p className="mt-2">Đang tải dữ liệu...</p>
            </div>
          ) : (
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
                    <>Lưu danh mục</>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default CategoryEdit;

