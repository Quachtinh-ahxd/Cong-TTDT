import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProductService from '../../../services/ProductService';
import Swal from 'sweetalert2';
import { productImage } from '../../../config';

function ProductApproval() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('pending'); // 'pending', 'approved', 'rejected'
  const navigate = useNavigate();

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    
    console.log('=== Image URL Debug ===');
    console.log('Original imagePath:', imagePath);
    console.log('productImage config:', productImage);
    
    // Bỏ qua các ảnh không hợp lệ
    if (imagePath.includes('placeholder') || imagePath === 'placeholder.svg') {
      console.log('Skipping placeholder image');
      return null;
    }
    
    // Kiểm tra nếu đã là URL đầy đủ
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      console.log('Using full URL:', imagePath);
      return imagePath;
    }
    
    // Xử lý đường dẫn ảnh - chỉ lấy tên file
    let fileName = imagePath.toString().trim();
    
    // Loại bỏ mọi phần thừa, chỉ giữ tên file
    fileName = fileName.replace(/^.*[\\\/]/, '');
    
    // Nếu không có extension, có thể là tên file không hợp lệ
    if (!fileName.includes('.') || fileName === '') {
      console.log('Invalid filename:', fileName);
      return null;
    }
    
    // Đường dẫn ảnh chính xác theo backend server
    const correctImageUrl = `http://localhost:5000/uploads/products/${fileName}`;
    
    console.log('Final image URL:', correctImageUrl);
    console.log('=== End Image URL Debug ===');
    
    return correctImageUrl;
  };

  const handleImageError = (e, productId, imagePath) => {
    console.error('Image failed to load:', e.target.src);
    
    // Nếu là placeholder hoặc ảnh không hợp lệ, không thử lại nữa
    if (imagePath && (imagePath.includes('placeholder') || imagePath === 'placeholder.svg')) {
      e.target.onerror = null;
      e.target.style.display = 'none';
      
      const parent = e.target.parentElement;
      if (parent && !parent.querySelector('.no-image-fallback')) {
        const fallbackDiv = document.createElement('div');
        fallbackDiv.className = 'no-image-fallback';
        fallbackDiv.style.cssText = `
          width: 50px;
          height: 50px;
          background: #f8f9fa;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          color: #6c757d;
          border: 1px solid #dee2e6;
          border-radius: 4px;
        `;
        fallbackDiv.textContent = 'Không có ảnh';
        parent.appendChild(fallbackDiv);
      }
      return;
    }
    
    const originalSrc = e.target.src;
    const fileName = imagePath ? imagePath.replace(/^.*[\\\/]/, '') : '';
    
    if (!fileName || fileName === '') {
      e.target.onerror = null;
      e.target.style.display = 'none';
      return;
    }
    
    // Danh sách các đường dẫn để thử
    const pathsToTry = [
      `${productImage}/uploads/${fileName}`,
      `http://localhost:3000/images/product/uploads/${fileName}`,
      `${productImage}/${fileName}`,
      `http://localhost:3000/uploads/products/${fileName}`,
      `http://localhost:3000/uploads/${fileName}`
    ];
    
    // Tìm đường dẫn tiếp theo để thử
    const currentIndex = pathsToTry.findIndex(path => path === originalSrc);
    const nextIndex = currentIndex + 1;
    
    if (nextIndex < pathsToTry.length) {
      console.log(`Trying next path: ${pathsToTry[nextIndex]}`);
      e.target.src = pathsToTry[nextIndex];
      return;
    }
    
    // Nếu tất cả đều thất bại, ẩn ảnh và hiển thị text
    e.target.onerror = null;
    e.target.style.display = 'none';
    
    // Tạo element text thay thế
    const parent = e.target.parentElement;
    if (parent && !parent.querySelector('.no-image-fallback')) {
      const fallbackDiv = document.createElement('div');
      fallbackDiv.className = 'no-image-fallback';
      fallbackDiv.style.cssText = `
        width: 50px;
        height: 50px;
        background: #f8f9fa;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 10px;
        color: #6c757d;
        border: 1px solid #dee2e6;
        border-radius: 4px;
      `;
      fallbackDiv.textContent = 'Không có ảnh';
      parent.appendChild(fallbackDiv);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [filter]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use the existing getAll() method instead of the non-existent getProductsByApprovalStatus
      const response = await ProductService.getAll();
      
      console.log('=== APPROVAL API RESPONSE ===');
      console.log('Filter:', filter);
      console.log('Response:', response);
      
      let allProducts = [];
      
      // Handle response format - same logic as other components
      if (response?.data && Array.isArray(response.data)) {
        allProducts = response.data;
        console.log('Method 1: Using response.data as array');
      } else if (response?.data?.products && Array.isArray(response.data.products)) {
        allProducts = response.data.products;
        console.log('Method 2: Using response.data.products');
      } else if (response?.products && Array.isArray(response.products)) {
        allProducts = response.products;
        console.log('Method 3: Using response.products');
      } else if (Array.isArray(response)) {
        allProducts = response;
        console.log('Method 4: Using response as array');
      }
      
      console.log('All products found:', allProducts.length);
      
      // Filter products based on approval status
      let filteredProducts = [];
      
      if (filter === 'pending') {
        filteredProducts = allProducts.filter(product => product.is_approved === 0);
      } else if (filter === 'approved') {
        filteredProducts = allProducts.filter(product => product.is_approved === 1);
      } else if (filter === 'rejected') {
        filteredProducts = allProducts.filter(product => product.is_approved === 2);
      }
      
      console.log('Filtered products:', filteredProducts.length);
      setProducts(filteredProducts);
      
    } catch (error) {
      console.error('Error loading products:', error);
      setError('Đã xảy ra lỗi khi tải danh sách sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (productId) => {
    try {
      const response = await ProductService.approveProduct(productId);
      if (response.success || response.status) {
        Swal.fire('Thành công!', 'Sản phẩm đã được duyệt.', 'success');
        await loadProducts(); // reload lại danh sách sản phẩm
      } else {
        Swal.fire('Lỗi!', response.message || 'Không thể duyệt sản phẩm.', 'error');
      }
    } catch (error) {
      console.error('Approve error:', error);
      Swal.fire('Lỗi!', 'Có lỗi xảy ra khi duyệt sản phẩm.', 'error');
    }
  };

  const handleReject = async (id) => {
    try {
      const { value: rejectReason } = await Swal.fire({
        title: 'Từ chối sản phẩm',
        input: 'textarea',
        inputLabel: 'Lý do từ chối',
        inputPlaceholder: 'Nhập lý do từ chối sản phẩm...',
        showCancelButton: true,
        confirmButtonText: 'Từ chối',
        cancelButtonText: 'Hủy',
        inputValidator: (value) => {
          if (!value) return 'Vui lòng nhập lý do từ chối!';
        }
      });
      
      if (rejectReason) {
        // Use the update method to set is_approved to 2 (rejected)
        const product = products.find(p => p.id === id);
        if (product) {
          const updateData = {
            ...product,
            is_approved: 2,
            reject_reason: rejectReason
          };
          
          const response = await ProductService.update(id, updateData);
          if (response.success || response.status) {
            Swal.fire('Thành công!', 'Sản phẩm đã bị từ chối.', 'success');
            loadProducts();
          } else {
            Swal.fire('Lỗi!', 'Không thể từ chối sản phẩm.', 'error');
          }
        }
      }
    } catch (error) {
      console.error('Error rejecting product:', error);
      Swal.fire('Lỗi!', 'Đã xảy ra lỗi khi từ chối sản phẩm.', 'error');
    }
  };

  const handleDelete = async (id, name) => {
    try {
      const result = await Swal.fire({
        title: 'Bạn có chắc chắn?',
        text: `Bạn muốn xóa vĩnh viễn sản phẩm "${name}"? Hành động này không thể hoàn tác!`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Xóa vĩnh viễn',
        cancelButtonText: 'Hủy'
      });

      if (result.isConfirmed) {
        const response = await ProductService.delete(id);
        if (response.status) {
          Swal.fire('Đã xóa!', 'Sản phẩm đã được xóa vĩnh viễn khỏi hệ thống.', 'success');
          loadProducts();
        } else {
          Swal.fire('Lỗi!', 'Không thể xóa sản phẩm.', 'error');
        }
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      Swal.fire('Lỗi!', 'Đã xảy ra lỗi khi xóa sản phẩm.', 'error');
    }
  };

  const renderStatus = (status) => {
    if (status === 1) return <span className="badge bg-success">Xuất bản</span>;
    return <span className="badge bg-secondary">Chưa xuất bản</span>;
  };

  const renderApprovalStatus = (approvalStatus) => {
    if (approvalStatus === 0) {
      return <span className="badge bg-warning">Chờ duyệt</span>;
    } else if (approvalStatus === 1) {
      return <span className="badge bg-success">Đã duyệt</span>;
    } else if (approvalStatus === 2) {
      return <span className="badge bg-danger">Từ chối</span>;
    } else {
      return <span className="badge bg-secondary">Không xác định</span>;
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Duyệt Sản Phẩm</h3>
              <div className="card-tools">
                <div className="btn-group" role="group">
                  <button
                    type="button"
                    className={`btn ${filter === 'pending' ? 'btn-warning' : 'btn-outline-warning'}`}
                    onClick={() => setFilter('pending')}
                  >
                    Chờ duyệt
                  </button>
                  <button
                    type="button"
                    className={`btn ${filter === 'approved' ? 'btn-success' : 'btn-outline-success'}`}
                    onClick={() => setFilter('approved')}
                  >
                    Đã duyệt
                  </button>
                  <button
                    type="button"
                    className={`btn ${filter === 'rejected' ? 'btn-danger' : 'btn-outline-danger'}`}
                    onClick={() => setFilter('rejected')}
                  >
                    Từ chối
                  </button>
                </div>
              </div>
            </div>

            <div className="card-body">
              {loading ? (
                <div className="text-center">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Đang tải...</span>
                  </div>
                  <p className="mt-2">Đang tải danh sách sản phẩm...</p>
                </div>
              ) : error ? (
                <div className="alert alert-danger">
                  <i className="fa fa-exclamation-triangle me-2"></i>
                  {error}
                </div>
              ) : products.length === 0 ? (
                <div className="text-center p-4">
                  <i className="fa fa-inbox fa-3x text-muted mb-3"></i>
                  <h5>Không có sản phẩm nào</h5>
                  <p className="text-muted">
                    {filter === 'pending' && 'Không có sản phẩm nào đang chờ duyệt.'}
                    {filter === 'approved' && 'Không có sản phẩm nào đã được duyệt.'}
                    {filter === 'rejected' && 'Không có sản phẩm nào bị từ chối.'}
                  </p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="table-light">
                      <tr>
                        <th>ID</th>
                        <th>Hình ảnh</th>
                        <th>Tên sản phẩm</th>
                        <th>Danh mục</th>
                        <th>Thương hiệu</th>
                        <th>Người tạo</th>
                        <th>Trạng thái</th>
                        <th>Trạng thái duyệt</th>
                        <th>Ngày tạo</th>
                        <th>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map(product => (
                        <tr key={product.id}>
                          <td>#{product.id}</td>
                          <td>
                            {product.image ? (
                              <img
                                src={getImageUrl(product.image)}
                                alt={product.name}
                                style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                className="rounded"
                                onError={(e) => handleImageError(e, product.id, product.image)}
                              />
                            ) : (
                              <div 
                                className="bg-light rounded d-flex align-items-center justify-content-center"
                                style={{ width: '50px', height: '50px' }}
                              >
                                <i className="fa fa-image text-muted"></i>
                              </div>
                            )}
                          </td>
                          <td>
                            <div>
                              <strong>{product.name}</strong>
                              {product.description && (
                                <>
                                  <br />
                                  <small className="text-muted">
                                    {product.description.length > 50 
                                      ? product.description.substring(0, 50) + '...'
                                      : product.description
                                    }
                                  </small>
                                </>
                              )}
                            </div>
                          </td>
                          <td>{product.category_name || `ID: ${product.category_id}`}</td>
                          <td>{product.brand_name || `ID: ${product.brand_id}`}</td>
                          <td>{product.user_name || product.created_by}</td>
                          <td>{renderStatus(product.status)}</td>
                          <td>{renderApprovalStatus(product.is_approved)}</td>
                          <td>{new Date(product.created_at).toLocaleDateString('vi-VN')}</td>
                          <td>
                            <div className="btn-group" role="group">
                              {filter === 'pending' && (
                                <>
                                  <button
                                    className="btn btn-sm btn-success"
                                    onClick={() => handleApprove(product.id)}
                                    title="Duyệt sản phẩm"
                                  >
                                    <i className="fa fa-check"></i>
                                  </button>
                                  <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => handleReject(product.id)}
                                    title="Từ chối sản phẩm"
                                  >
                                    <i className="fa fa-times"></i>
                                  </button>
                                </>
                              )}
                              <Link
                                to={`/admin/products/show/${product.id}`}
                                className="btn btn-sm btn-info"
                                title="Xem chi tiết"
                              >
                                <i className="fa fa-eye"></i>
                              </Link>
                              <Link
                                to={`/admin/products/edit/${product.id}`}
                                className="btn btn-sm btn-warning"
                                title="Chỉnh sửa"
                              >
                                <i className="fa fa-edit"></i>
                              </Link>
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => handleDelete(product.id, product.name)}
                                title="Xóa sản phẩm"
                              >
                                <i className="fa fa-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

}; // Đóng function ProductApproval

export default ProductApproval;
