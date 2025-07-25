import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductService from '../../../services/ProductService';

const ProductShow = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    try {
      console.log('=== ProductShow loading product ID:', productId);
      setLoading(true);
      
      const response = await ProductService.getById(productId);
      console.log('=== ProductShow response:', response);
      
      // SỬA: Handle đúng format {success: true, data: productObject}
      let productData = null;
      
      if (response && response.success && response.data) {
        productData = response.data;
        console.log('✅ Product data extracted:', productData);
      } else if (response && response.product) {
        productData = response.product;
      } else if (response && response.data && response.data.product) {
        productData = response.data.product;
      } else if (response && typeof response === 'object' && response.id) {
        productData = response;
      }
      
      if (productData && productData.id) {
        setProduct(productData);
        console.log('✅ Product state set successfully');
      } else {
        throw new Error('Không tìm thấy dữ liệu sản phẩm');
      }
      
    } catch (error) {
      console.error('=== ProductShow error:', error);
      setError(`Không thể tải thông tin sản phẩm: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container-fluid">
        <div className="text-center p-4">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
          <p className="mt-2">Đang tải thông tin sản phẩm...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid">
        <div className="alert alert-danger">
          <strong>Lỗi:</strong> {error}
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-fluid">
        <div className="alert alert-warning">
          Không tìm thấy thông tin sản phẩm
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h3>Chi tiết sản phẩm #{product.id}</h3>
              <div>
                <button 
                  className="btn btn-primary me-2"
                  onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                >
                  <i className="fa fa-edit me-1"></i>
                  Sửa
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={() => navigate('/admin/products')}
                >
                  <i className="fa fa-arrow-left me-1"></i>
                  Quay lại
                </button>
              </div>
            </div>
            
            <div className="card-body">
              <div className="row">
                <div className="col-md-4">
                  {/* Hình ảnh */}
                  {product.image ? (
                    <img 
                      src={`http://localhost:5000/images/product/${product.image}`}
                      alt={product.name}
                      className="img-fluid rounded"
                      style={{ maxHeight: '400px', width: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div className="bg-light rounded d-flex align-items-center justify-content-center" style={{ height: '300px' }}>
                      <span className="text-muted">Không có hình ảnh</span>
                    </div>
                  )}
                </div>
                
                <div className="col-md-8">
                  {/* Thông tin chi tiết */}
                  <h4 className="mb-3">{product.name}</h4>
                  
                  <div className="row mb-3">
                    <div className="col-sm-3"><strong>ID:</strong></div>
                    <div className="col-sm-9">{product.id}</div>
                  </div>
                  
                  <div className="row mb-3">
                    <div className="col-sm-3"><strong>Danh mục:</strong></div>
                    <div className="col-sm-9">
                      {product.category_name || `ID: ${product.category_id}`}
                    </div>
                  </div>
                  
                  <div className="row mb-3">
                    <div className="col-sm-3"><strong>Thương hiệu:</strong></div>
                    <div className="col-sm-9">
                      {product.brand_name || `ID: ${product.brand_id || 'Không có'}`}
                    </div>
                  </div>
                  
                  <div className="row mb-3">
                    <div className="col-sm-3"><strong>Trạng thái:</strong></div>
                    <div className="col-sm-9">
                      <span className={`badge ${product.status === 1 ? 'bg-success' : 'bg-danger'}`}>
                        {product.status === 1 ? 'Hoạt động' : 'Tạm dừng'}
                      </span>
                    </div>
                  </div>
                  
                  {product.created_at && (
                    <div className="row mb-3">
                      <div className="col-sm-3"><strong>Ngày tạo:</strong></div>
                      <div className="col-sm-9">
                        {new Date(product.created_at).toLocaleDateString('vi-VN')}
                      </div>
                    </div>
                  )}
                  
                  {product.updated_at && (
                    <div className="row mb-3">
                      <div className="col-sm-3"><strong>Cập nhật:</strong></div>
                      <div className="col-sm-9">
                        {new Date(product.updated_at).toLocaleDateString('vi-VN')}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Mô tả */}
              {product.description && (
                <div className="mt-4">
                  <h5>Mô tả:</h5>
                  <div className="bg-light p-3 rounded">
                    <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>
                      {product.description}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductShow;























