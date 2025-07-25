import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CategoryService from '../../../services/CategoryService';
import Swal from 'sweetalert2';

function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Định nghĩa hàm loadCategories ở mức component để có thể tái sử dụng
  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await CategoryService.getAll();
      if (response.status) {
        console.log('Categories loaded:', response.categories);
        setCategories(response.categories);
      } else {
        setError('Không thể tải danh sách danh mục');
      }
    } catch (error) {
      console.error('Error loading categories:', error);
      setError('Đã xảy ra lỗi khi tải danh sách danh mục');
    } finally {
      setLoading(false);
    }
  };

  // Lấy danh sách danh mục khi component được mount
  useEffect(() => {
    loadCategories();
  }, []);

  // Hàm xử lý xóa danh mục
  const handleDelete = async (id, categoryName) => {
    try {
      const result = await Swal.fire({
        title: 'Xác nhận xóa',
        text: `Bạn có chắc chắn muốn xóa danh mục "${categoryName}"?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Hủy'
      });

      if (result.isConfirmed) {
        console.log('=== Deleting category ===');
        const response = await CategoryService.delete(id);
        
        console.log('Delete response:', response);
        
        // SỬA LOGIC KIỂM TRA RESPONSE
        if (response.success || response.status || response.ok) {
          Swal.fire({
            title: 'Đã xóa!',
            text: 'Danh mục đã được xóa thành công.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
          loadCategories(); // Reload danh sách
        } else {
          Swal.fire({
            title: 'Lỗi!',
            text: response.message || 'Không thể xóa danh mục.',
            icon: 'error'
          });
        }
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      Swal.fire({
        title: 'Lỗi!',
        text: 'Đã xảy ra lỗi khi xóa danh mục.',
        icon: 'error'
      });
    }
  };

  // Hàm xử lý thay đổi trạng thái
  const handleChangeStatus = async (id) => {
    try {
      const response = await CategoryService.changeStatus(id);
      if (response.status) {
        Swal.fire(
          'Thành công!',
          'Trạng thái danh mục đã được thay đổi.',
          'success'
        );
        // Tải lại danh sách danh mục
        loadCategories();
      } else {
        Swal.fire(
          'Lỗi!',
          'Không thể thay đổi trạng thái danh mục.',
          'error'
        );
      }
    } catch (error) {
      console.error('Error changing category status:', error);
      Swal.fire(
        'Lỗi!',
        'Đã xảy ra lỗi khi thay đổi trạng thái danh mục.',
        'error'
      );
    }
  };

  // Hiển thị trạng thái danh mục
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
        <h2 className="page-title">Quản lý chuyên mục</h2>
        <Link to="/admin/categories/create" className="btn btn-primary">
          <i className="fas fa-plus-circle me-2"></i>Thêm chuyên mục
        </Link>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
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
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th style={{ width: '50px' }}>ID</th>
                    <th>Tên danh mục</th>
                    <th>Slug</th>
                    <th>Trạng thái</th>
                    <th style={{ width: '150px' }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.length > 0 ? (
                    categories.map((category) => (
                      <tr key={category.id}>
                        <td>{category.id}</td>
                        <td>{category.name}</td>
                        <td>{category.slug}</td>
                        <td>{renderStatus(category.status)}</td>
                        <td>
                          <div className="btn-group">
                            <Link to={`/admin/categories/show/${category.id}`} className="btn btn-sm btn-primary">
                              <i className="fas fa-eye"></i>
                            </Link>
                            <Link to={`/admin/categories/edit/${category.id}`} className="btn btn-sm btn-info">
                              <i className="fas fa-edit"></i>
                            </Link>
                            <button 
                              className="btn btn-sm btn-warning" 
                              onClick={() => handleChangeStatus(category.id)}
                            >
                              <i className="fas fa-sync-alt"></i>
                            </button>
                            <button 
                              className="btn btn-sm btn-danger" 
                              onClick={() => handleDelete(category.id, category.name)}
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center">Không có danh mục nào</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CategoryList;





