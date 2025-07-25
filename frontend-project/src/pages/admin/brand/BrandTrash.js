import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BrandService from '../../../services/BrandService';
import Swal from 'sweetalert2';

function BrandTrash() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadBrands = async () => {
    try {
      setLoading(true);
      const response = await BrandService.getAll();
      if (response.status && response.brands) {
        setBrands(response.brands.filter(b => b.status === 0));
      } else {
        setError('Không thể tải danh sách thương hiệu');
      }
    } catch (error) {
      setError('Đã xảy ra lỗi khi tải danh sách thương hiệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBrands();
  }, []);

  // Khôi phục thương hiệu
  const handleRestore = async (id) => {
    try {
      const res = await BrandService.changeStatus(id);
      if (res.status) {
        Swal.fire('Thành công', 'Đã khôi phục thương hiệu!', 'success');
        loadBrands();
      } else {
        Swal.fire('Lỗi', res.message || 'Không thể khôi phục', 'error');
      }
    } catch (error) {
      Swal.fire('Lỗi', 'Đã xảy ra lỗi khi khôi phục', 'error');
    }
  };

  return (
    <div className="container-fluid">
      <h2 className="mb-4">Thương hiệu đã xóa</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Tên thương hiệu</th>
                    <th>Slug</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {brands.length > 0 ? brands.map(brand => (
                    <tr key={brand.id}>
                      <td>{brand.id}</td>
                      <td>{brand.name}</td>
                      <td>{brand.slug}</td>
                      <td>
                        <button className="btn btn-success btn-sm" onClick={() => handleRestore(brand.id)}>
                          Khôi phục
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="4" className="text-center">Không có thương hiệu nào</td>
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

export default BrandTrash;
