import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BrandService from '../../../services/BrandService';
import Swal from 'sweetalert2';

function BrandList() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadBrands = async () => {
    try {
      setLoading(true);
      const response = await BrandService.getAll();
      
      console.log('=== Brand Response Debug ===');
      console.log('Full response:', response);
      console.log('Response keys:', Object.keys(response || {}));
      
      // SỬA LOGIC XỬ LÝ RESPONSE - thử nhiều cách
      let brandList = [];
      
      if (response?.data?.brands && Array.isArray(response.data.brands)) {
        brandList = response.data.brands;
      } else if (response?.brands && Array.isArray(response.brands)) {
        brandList = response.brands;
      } else if (response?.data && Array.isArray(response.data)) {
        brandList = response.data;
      } else if (Array.isArray(response)) {
        brandList = response;
      }
      
      console.log('Processed brandList:', brandList);
      console.log('brandList length:', brandList.length);
      console.log('=== End Debug ===');
      
      setBrands(brandList);
      setError(null);
      
    } catch (error) {
      console.error('Error loading brands:', error);
      setBrands([]);
      setError('Đã xảy ra lỗi khi tải danh sách thương hiệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBrands();
  }, []);

  const handleDelete = (id, name) => {
    Swal.fire({
      title: 'Bạn có chắc chắn?',
      text: `Bạn muốn xóa thương hiệu "${name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await BrandService.delete(id);
          
          console.log('=== Brand Delete Response Debug ===');
          console.log('Full response:', response);
          console.log('response.httpStatus:', response.httpStatus);
          console.log('response.httpOk:', response.httpOk);
          console.log('response.status:', response.status);
          console.log('response.success:', response.success);
          console.log('response.message:', response.message);
          
          // SỬA LOGIC KIỂM TRA - dựa vào response thực tế
          const isSuccess = response?.httpOk === true || 
                           response?.httpStatus === 200 ||
                           response?.status === true || 
                           response?.success === true ||
                           (response?.message && response.message.includes('successfully'));
          
          console.log('isSuccess:', isSuccess);
          
          if (isSuccess) {
            Swal.fire({
              title: 'Đã xóa!',
              text: response?.message || 'Thương hiệu đã được xóa thành công.',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            });
            loadBrands(); // Reload danh sách
          } else {
            Swal.fire('Lỗi!', response?.message || 'Không thể xóa thương hiệu.', 'error');
          }
        } catch (error) {
          console.error('Error deleting brand:', error);
          Swal.fire('Lỗi!', 'Đã xảy ra lỗi khi xóa thương hiệu.', 'error');
        }
      }
    });
  };

  const handleChangeStatus = async (id) => {
    try {
      const response = await BrandService.changeStatus(id);
      if (response.status) {
        Swal.fire('Thành công!', 'Trạng thái thương hiệu đã được thay đổi.', 'success');
        loadBrands();
      } else {
        Swal.fire('Lỗi!', 'Không thể thay đổi trạng thái thương hiệu.', 'error');
      }
    } catch (error) {
      console.error('Error changing brand status:', error);
      Swal.fire('Lỗi!', 'Đã xảy ra lỗi khi thay đổi trạng thái thương hiệu.', 'error');
    }
  };

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
        <h2 className="page-title">Quản lý tác giả</h2>
        <Link to="/admin/brands/create" className="btn btn-primary">
          <i className="fas fa-plus-circle me-2"></i>Thêm tác giả
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
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th style={{ width: '50px' }}>ID</th>
                    <th>Tên thương hiệu</th>
                    <th>Slug</th>
                    <th>Trạng thái</th>
                    <th style={{ width: '150px' }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {brands && brands.length > 0 ? (
                    brands.map((brand) => (
                      <tr key={brand.id || brand._id}>
                        <td>{brand.id || brand._id}</td>
                        <td>{brand.name}</td>
                        <td>{brand.slug}</td>
                        <td>{renderStatus(brand.status)}</td>
                        <td>
                          <div className="btn-group">
                            <Link to={`/admin/brands/show/${brand.id || brand._id}`} className="btn btn-sm btn-primary">
                              <i className="fas fa-eye"></i>
                            </Link>
                            <Link to={`/admin/brands/edit/${brand.id || brand._id}`} className="btn btn-sm btn-info">
                              <i className="fas fa-edit"></i>
                            </Link>
                            <button className="btn btn-sm btn-warning" onClick={() => handleChangeStatus(brand.id || brand._id)}>
                              <i className="fas fa-sync-alt"></i>
                            </button>
                            <button className="btn btn-sm btn-danger" onClick={() => handleDelete(brand.id || brand._id, brand.name)}>
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center">Không có thương hiệu nào</td>
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

export default BrandList;

