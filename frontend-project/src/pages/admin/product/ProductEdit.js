import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductService from '../../../services/ProductService';
import CategoryService from '../../../services/CategoryService';
import BrandService from '../../../services/BrandService';

const ProductEdit = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  
  // State management - SỬA: Bỏ price và stock_quantity
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category_id: '',
    brand_id: '',
    image: null,
    status: 1
  });
  
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    loadProductData();
    loadCategories();
    loadBrands();
  }, [productId]);

  const loadProductData = async () => {
    try {
      console.log('=== loadProductData() called ===');
      console.log('Product ID from params:', productId);
      
      if (!productId) {
        console.error('No productId found in URL params');
        setError('Không tìm thấy ID sản phẩm');
        return;
      }
      
      setLoading(true);
      const response = await ProductService.getById(productId);
      
      console.log('=== loadProductData response ===');
      console.log('Full response:', response);
      console.log('Response type:', typeof response);
      console.log('Response keys:', Object.keys(response || {}));
      
      // SỬA: Handle format {success: true, data: {...}}
      let productData = null;
      
      if (response && response.success && response.data) {
        // Format: { success: true, data: {...} }
        productData = response.data;
        console.log('Using response.data (success format)');
      } else if (response && response.product) {
        // Format: { product: {...} }
        productData = response.product;
        console.log('Using response.product');
      } else if (response && response.data && response.data.product) {
        // Format: { data: { product: {...} } }
        productData = response.data.product;
        console.log('Using response.data.product');
      } else if (response && typeof response === 'object' && response.id) {
        // Format: product object trực tiếp
        productData = response;
        console.log('Using response directly as product');
      } else {
        console.error('Unknown response format:', response);
        console.log('Available keys:', Object.keys(response || {}));
        
        // Debug chi tiết structure
        if (response && response.data) {
          console.log('response.data:', response.data);
          console.log('response.data keys:', Object.keys(response.data || {}));
        }
        
        throw new Error(`Không thể parse dữ liệu sản phẩm. Response format: ${JSON.stringify(Object.keys(response || {}))}`);
      }
      
      console.log('=== Product data to set ===');
      console.log('Product data:', productData);
      console.log('Product ID:', productData?.id);
      console.log('Product name:', productData?.name);
      console.log('Product category_id:', productData?.category_id);
      console.log('Product brand_id:', productData?.brand_id);
      console.log('Product image:', productData?.image);
      
      if (productData && productData.id) {
        // Set form data
        setFormData({
          name: productData.name || '',
          description: productData.description || '',
          category_id: productData.category_id || '',
          brand_id: productData.brand_id || '',
          image: null, // Không set image cũ vào file input
          status: productData.status !== undefined ? productData.status : 1
        });
        
        console.log('Form data set successfully');
        console.log('New form data:', {
          name: productData.name || '',
          description: productData.description || '',
          category_id: productData.category_id || '',
          brand_id: productData.brand_id || '',
          status: productData.status !== undefined ? productData.status : 1
        });
        
        // Set image preview nếu có
        if (productData.image) {
          const imageUrl = `http://localhost:5000/images/product/${productData.image}`;
          setImagePreview(imageUrl);
          console.log('Image preview set:', imageUrl);
        }
      } else {
        throw new Error('Dữ liệu sản phẩm không hợp lệ (thiếu ID)');
      }
      
    } catch (error) {
      console.error('=== loadProductData ERROR ===');
      console.error('Error details:', error);
      console.error('Error message:', error.message);
      console.error('Error response:', error.response?.data);
      
      setError(`Không thể tải thông tin sản phẩm: ${error.message}`);
    } finally {
      setLoading(false);
      setDataLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await CategoryService.getAll();
      if (response && response.categories) {
        setCategories(response.categories);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadBrands = async () => {
    try {
      const response = await BrandService.getAll();
      if (response && response.brands) {
        setBrands(response.brands);
      }
    } catch (error) {
      console.error('Error loading brands:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');
      setSuccessMessage('');
      
      console.log('=== SUBMIT EDIT PRODUCT ===');
      console.log('Product ID:', productId);
      console.log('Form data before submit:', formData);
      
      // Validate required fields
      if (!formData.name || !formData.category_id) {
        throw new Error('Vui lòng điền đầy đủ thông tin bắt buộc (Tên sản phẩm và Danh mục)');
      }
      
      const submitData = new FormData();
      
      // Add form fields
      submitData.append('name', formData.name);
      submitData.append('description', formData.description || '');
      submitData.append('category_id', formData.category_id);
      
      if (formData.brand_id) {
        submitData.append('brand_id', formData.brand_id);
      }
      
      submitData.append('status', formData.status);
      
      // Add image if selected
      if (formData.image && formData.image instanceof File) {
        submitData.append('image', formData.image);
        console.log('Added image file:', formData.image.name);
      }
      
      // Add _method for Laravel
      submitData.append('_method', 'PUT');
      
      console.log('Calling ProductService.update...');
      const response = await ProductService.update(productId, submitData);
      
      console.log('=== UPDATE SUCCESS ===');
      console.log('Response:', response);
      
      // SỬA: Kiểm tra response format và redirect
      const responseData = response?.data || response;
      console.log('Response data:', responseData);
      
      // Check multiple success formats
      const isSuccess = responseData?.success === true || 
                       responseData?.status === true || 
                       response?.status === 200 || 
                       response?.status === 201;
      
      if (isSuccess) {
        setSuccessMessage('Cập nhật sản phẩm thành công!');
        console.log('✅ Update successful, redirecting...');
        
        // SỬA: Redirect ngay lập tức về trang quản lý products
        setTimeout(() => {
          console.log('Navigating to /admin/products');
          navigate('/admin/products');
        }, 1000); // Giảm thời gian chờ xuống 1 giây
        
      } else {
        console.log('❌ Response indicates failure:', responseData);
        throw new Error(responseData?.message || 'Cập nhật thất bại - không có confirmation từ server');
      }
      
    } catch (error) {
      console.error('=== SUBMIT ERROR ===');
      console.error('Error type:', error.constructor.name);
      console.error('Error message:', error.message);
      
      if (error.response) {
        console.error('HTTP Status:', error.response.status);
        console.error('Response data:', error.response.data);
        
        // Handle specific error responses
        if (error.response.status === 422) {
          // Validation errors
          const validationErrors = error.response.data?.errors;
          if (validationErrors) {
            const errorMessages = Object.values(validationErrors).flat().join(', ');
            setError(`Lỗi validation: ${errorMessages}`);
          } else {
            setError('Dữ liệu không hợp lệ');
          }
        } else if (error.response.status === 404) {
          setError('Không tìm thấy sản phẩm hoặc endpoint không tồn tại');
        } else if (error.response.status === 401) {
          setError('Bạn không có quyền thực hiện thao tác này');
        } else {
          setError(`Lỗi server: ${error.response.data?.message || error.response.statusText}`);
        }
      } else if (error.request) {
        setError('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
      } else {
        setError(`Lỗi: ${error.message}`);
      }
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h3>Chỉnh sửa sản phẩm {productId ? `#${productId}` : ''}</h3>
            </div>
            <div className="card-body">
              {/* Data loading */}
              {dataLoading && (
                <div className="text-center p-4">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Đang tải...</span>
                  </div>
                  <p className="mt-2">Đang tải dữ liệu sản phẩm...</p>
                </div>
              )}
              
              {/* Error display */}
              {error && !dataLoading && (
                <div className="alert alert-danger" role="alert">
                  <strong>Lỗi:</strong> {error}
                </div>
              )}
              
              {/* Success display */}
              {successMessage && (
                <div className="alert alert-success" role="alert">
                  <strong>Thành công:</strong> {successMessage}
                </div>
              )}
              
              {/* Form - chỉ hiển thị khi đã load xong data */}
              {!dataLoading && !error && (
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6">
                      {/* Tên sản phẩm */}
                      <div className="form-group mb-3">
                        <label>Tên sản phẩm *</label>
                        <input
                          type="text"
                          name="name"
                          className="form-control"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      {/* Danh mục */}
                      <div className="form-group mb-3">
                        <label>Danh mục *</label>
                        <select
                          name="category_id"
                          className="form-control"
                          value={formData.category_id}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Chọn danh mục</option>
                          {categories.map(category => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      {/* Thương hiệu */}
                      <div className="form-group mb-3">
                        <label>Thương hiệu</label>
                        <select
                          name="brand_id"
                          className="form-control"
                          value={formData.brand_id}
                          onChange={handleInputChange}
                        >
                          <option value="">Chọn thương hiệu</option>
                          {brands.map(brand => (
                            <option key={brand.id} value={brand.id}>
                              {brand.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div className="col-md-6">
                      {/* Hình ảnh */}
                      <div className="form-group mb-3">
                        <label>Hình ảnh</label>
                        <input
                          type="file"
                          name="image"
                          className="form-control"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                        {imagePreview && (
                          <div className="mt-2">
                            <img 
                              src={imagePreview} 
                              alt="Preview" 
                              style={{ maxWidth: '200px', maxHeight: '200px' }}
                              className="img-thumbnail"
                            />
                          </div>
                        )}
                      </div>
                      
                      {/* Trạng thái */}
                      <div className="form-group mb-3">
                        <label>Trạng thái</label>
                        <select
                          name="status"
                          className="form-control"
                          value={formData.status}
                          onChange={handleInputChange}
                        >
                          <option value={1}>Hoạt động</option>
                          <option value={0}>Tạm dừng</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  {/* Mô tả */}
                  <div className="form-group mb-3">
                    <label>Mô tả</label>
                    <textarea
                      name="description"
                      className="form-control"
                      rows={4}
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Nhập mô tả sản phẩm..."
                    />
                  </div>
                  
                  {/* Buttons */}
                  <div className="form-group">
                    <button 
                      type="submit" 
                      className="btn btn-primary me-2"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Đang cập nhật...
                        </>
                      ) : (
                        'Cập nhật sản phẩm'
                      )}
                    </button>
                    
                    <button 
                      type="button" 
                      className="btn btn-secondary"
                      onClick={() => navigate('/admin/products')}
                    >
                      Hủy
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductEdit;
















