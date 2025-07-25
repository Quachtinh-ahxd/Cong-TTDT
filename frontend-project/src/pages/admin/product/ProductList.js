import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ProductService from '../../../services/ProductService';
import { productImage } from '../../../config';
import Swal from 'sweetalert2';
import './ProductList.css';
import ProductImage from '../../../components/common/ProductImage';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('=== ProductList: Loading products ===');
      console.log('About to call ProductService.getAll()...');
      
      // Chỉ lấy sản phẩm đã được duyệt (is_approved = 1)
      const response = await ProductService.getAll();
      
      console.log('=== ProductList: Response received ===');
      console.log('Response type:', typeof response);
      console.log('Response:', response);
      
      // Debug cấu trúc response
      if (response) {
        console.log('Response keys:', Object.keys(response));
        if (response.data) {
          console.log('Response.data keys:', Object.keys(response.data));
          console.log('Response.data:', response.data);
        }
        if (response.products) {
          console.log('Response.products length:', response.products.length);
          console.log('First product:', response.products[0]);
        }
      }
      
      let allProducts = [];
      
      // Thử nhiều cách parse response
      if (response?.data?.status && response?.data?.products) {
        allProducts = response.data.products;
        console.log('Method 1: Using response.data.products');
      } else if (response?.data && Array.isArray(response.data)) {
        allProducts = response.data;
        console.log('Method 2: Using response.data as array');
      } else if (response?.products && Array.isArray(response.products)) {
        allProducts = response.products;
        console.log('Method 3: Using response.products');
      } else if (Array.isArray(response)) {
        allProducts = response;
        console.log('Method 4: Using response as array');
      } else {
        console.log('No products found in response structure');
        console.log('Available keys:', Object.keys(response || {}));
        allProducts = [];
      }
      
      console.log('All products found:', allProducts.length);
      if (allProducts.length > 0) {
        console.log('Sample product structure:', allProducts[0]);
        console.log('Sample product image field:', allProducts[0]?.image);
      }
      
      // Lọc sản phẩm đã duyệt
      const approvedProducts = allProducts.filter(product => {
        console.log(`Product ${product.id}: is_approved = ${product.is_approved}, image = ${product.image}`);
        return product.is_approved === 1;
      });
      
      console.log('Approved products:', approvedProducts.length);
      console.log('Setting products state...');
      setProducts(approvedProducts);
      
    } catch (error) {
      console.error('=== ProductList: Error loading products ===');
      console.error('Error type:', error.constructor.name);
      console.error('Error message:', error.message);
      console.error('Error details:', error);
      
      if (error.response) {
        console.error('HTTP Status:', error.response.status);
        console.error('HTTP Response:', error.response.data);
      } else if (error.request) {
        console.error('Network Error - No response received');
        console.error('Request details:', error.request);
      }
      
      setError(`Lỗi tải dữ liệu: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (location.state?.reload) {
      loadProducts();
    }
  }, [location.state]);

  const handleDelete = (id, name) => {
    Swal.fire({
      title: 'Bạn có chắc chắn?',
      text: `Bạn muốn xóa vĩnh viễn sản phẩm "${name}"? Hành động này không thể hoàn tác!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Xóa vĩnh viễn',
      cancelButtonText: 'Hủy'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await ProductService.delete(id);
          console.log('Delete response:', response);
          
          if (response.status || response.data?.status) {
            Swal.fire('Đã xóa!', 'Sản phẩm đã được xóa vĩnh viễn khỏi hệ thống.', 'success');
            loadProducts();
          } else {
            Swal.fire('Lỗi!', 'Không thể xóa sản phẩm.', 'error');
          }
        } catch (error) {
          console.error('Error deleting product:', error);
          Swal.fire('Lỗi!', 'Đã xảy ra lỗi khi xóa sản phẩm.', 'error');
        }
      }
    });
  };

  const renderStatus = (status) => {
    if (status === 1) return <span className="badge bg-success">Xuất bản</span>;
    if (status === 2) return <span className="badge bg-warning">Chưa xuất bản</span>;
    return <span className="badge bg-danger">Đã xóa</span>;
  };

  const renderApprovalStatus = (approvalStatus) => {
    if (approvalStatus === 1) return <span className="badge bg-success">Đã duyệt</span>;
    if (approvalStatus === 0) return <span className="badge bg-warning">Chờ duyệt</span>;
    return <span className="badge bg-danger">Từ chối</span>;
  };

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="page-title">Quản lý bài viết</h2>
        <div>
          <Link to="/admin/products/approval" className="btn btn-warning me-2">
            <i className="fas fa-check-circle me-2"></i>Duyệt bài
          </Link>
          <Link to="/admin/products/create" className="btn btn-primary">
            <i className="fas fa-plus-circle me-2"></i>Thêm bài viết
          </Link>
        </div>
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
                    <th style={{ width: '100px' }}>Hình ảnh</th>
                    <th>Tên sản phẩm</th>
                    <th>Danh mục</th>
                    <th>Thương hiệu</th>
                    <th>Trạng thái</th>
                    <th>Trạng thái duyệt</th>
                    <th style={{ width: '150px' }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length > 0 ? (
                    products.map((product) => (
                      <tr key={product.id}>
                        <td>{product.id}</td>
                        <td>
                          {product.image ? (
                            <ProductImage
                              image={product.image}
                              alt={product.name}
                              className="img-thumbnail"
                              style={{ width: '80px', height: '60px', objectFit: 'cover' }}
                            />
                          ) : (
                            <div className="no-image-text">Không có ảnh</div>
                          )}
                        </td>
                        <td>{product.name}</td>
                        <td>{product.category_name || product.category?.name || 'N/A'}</td>
                        <td>{product.brand_name || product.brand?.name || 'N/A'}</td>
                        <td>{renderStatus(product.status)}</td>
                        <td>{renderApprovalStatus(product.is_approved)}</td>
                        <td>
                          <div className="btn-group">
                            <Link 
                              to={`/admin/products/show/${product.id}`} 
                              className="btn btn-sm btn-info me-1"
                              title="Xem chi tiết"
                            >
                              <i className="fas fa-eye"></i>
                            </Link>
                            <Link 
                              to={`/admin/products/edit/${product.id}`} 
                              className="btn btn-sm btn-warning me-1"
                              title="Chỉnh sửa"
                            >
                              <i className="fas fa-edit"></i>
                            </Link>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDelete(product.id, product.name)}
                              title="Xóa"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center">Không có sản phẩm nào</td>
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

export default ProductList;
