import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductService from '../../../services/ProductService';
import CategoryService from '../../../services/CategoryService';
import BrandService from '../../../services/BrandService';
import Swal from 'sweetalert2';
import './ProductForm.css';

function ProductCreate() {
  const navigate = useNavigate();
  
  // State cho form
  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    brand_id: '',
    description: '',
    detail: '',
    status: '2', // Mặc định là chưa xuất bản
    image: null
  });
  
  // State cho preview ảnh
  const [imagePreview, setImagePreview] = useState(null);
  
  // State cho danh sách danh mục và thương hiệu
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  
  // State loading
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  
  // Lấy danh sách danh mục và thương hiệu khi component được mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingData(true);
        console.log('=== ProductCreate: Fetching categories and brands ===');
        
        // Lấy danh sách danh mục
        console.log('Calling CategoryService.getAll()...');
        const categoryResponse = await CategoryService.getAll();
        console.log('CategoryService response:', categoryResponse);
        if (categoryResponse.status) {
          setCategories(categoryResponse.categories);
          console.log('Categories set:', categoryResponse.categories);
        } else {
          console.log('Failed to get categories:', categoryResponse.message);
        }
        
        // Lấy danh sách thương hiệu
        console.log('Calling BrandService.getAll()...');
        const brandResponse = await BrandService.getAll();
        console.log('BrandService response:', brandResponse);
        if (brandResponse.success && Array.isArray(brandResponse.data)) {
          setBrands(brandResponse.data);
          console.log('Brands set:', brandResponse.data);
        } else {
          console.log('Failed to get brands:', brandResponse.message);
        }
      } catch (error) {
        console.error('=== ProductCreate Error ===');
        console.error('Error fetching data:', error);
        Swal.fire(
          'Lỗi!',
          'Không thể tải dữ liệu danh mục và thương hiệu.',
          'error'
        );
      } finally {
        console.log('=== ProductCreate: Data loading finished ===');
        setLoadingData(false);
      }
    };
    
    fetchData();
  }, []);
  
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
    if (!formData.name || !formData.category_id || !formData.brand_id || !formData.description || !formData.detail) {
      Swal.fire(
        'Lỗi!',
        'Vui lòng điền đầy đủ thông tin sản phẩm.',
        'error'
      );
      return;
    }
    
    try {
      setLoading(true);
      
      // Tạo FormData để gửi file
      const data = new FormData();
      data.append('name', formData.name);
      data.append('category_id', formData.category_id);
      data.append('brand_id', formData.brand_id);
      data.append('description', formData.description);
      data.append('detail', formData.detail);
      data.append('status', formData.status);
      
      console.log('=== CREATE PRODUCT DEBUG ===');
      console.log('Form data image:', formData.image);
      
      if (formData.image) {
        console.log('Image file:', formData.image.name, formData.image.size, formData.image.type);
        data.append('image', formData.image);
      } else {
        console.log('No image selected');
      }
      
      // Log FormData content
      console.log('FormData entries:');
      for (let pair of data.entries()) {
        console.log(pair[0] + ':', pair[1]);
      }
      console.log('=== END DEBUG ===');
      
      // Gọi API tạo sản phẩm
      const response = await ProductService.create(data);

      // SỬA: Thêm log chi tiết để debug
      console.log('=== CREATE RESPONSE DEBUG ===');
      console.log('Full response:', response);
      console.log('Response status:', response.status);
      console.log('Response data:', response.data);
      console.log('Response data status:', response.data?.status);
      console.log('Response data success:', response.data?.success);
      console.log('=== END CREATE RESPONSE DEBUG ===');
      
      // SỬA: Kiểm tra nhiều format response có thể
      const isSuccess = response?.status === 200 || 
                       response?.status === 201 || 
                       response?.data?.status === true || 
                       response?.data?.success === true ||
                       response?.status === true;
      
      console.log('Is success:', isSuccess);
      
      if (isSuccess) {
        Swal.fire({
          title: 'Thành công!',
          text: 'Sản phẩm đã được tạo thành công và đang chờ duyệt.',
          icon: 'success',
          confirmButtonText: 'Đi đến trang duyệt sản phẩm',
          showCancelButton: true,
          cancelButtonText: 'Tạo sản phẩm mới'
        }).then((result) => {
          if (result.isConfirmed) {
            // SỬA: Chuyển hướng đến trang duyệt sản phẩm
            console.log('Navigating to approval page...');
            navigate('/admin/products/approval');
          } else {
            // Reset form để tạo sản phẩm mới
            setFormData({
              name: '',
              category_id: '',
              brand_id: '',
              description: '',
              detail: '',
              status: '2',
              image: null
            });
            setImagePreview(null);
          }
        });
      } else {
        // SỬA: Hiển thị thông tin chi tiết về lỗi
        console.error('Create failed - response analysis:');
        console.error('- response.status:', response?.status);
        console.error('- response.data:', response?.data);
        
        const errorMessage = response?.data?.message || 
                            response?.message || 
                            'Không thể tạo sản phẩm.';
        
        Swal.fire(
          'Lỗi!',
          errorMessage,
          'error'
        );
      }
    } catch (error) {
      console.error('=== CREATE ERROR ===');
      console.error('Error creating product:', error);
      console.error('Error response:', error.response);
      console.error('Error response data:', error.response?.data);
      console.error('Error response status:', error.response?.status);
      
      let errorMessage = 'Đã xảy ra lỗi khi tạo sản phẩm.';
      
      if (error.response?.status === 500) {
        errorMessage = 'Lỗi server. Vui lòng kiểm tra backend console.';
      } else if (error.response?.status === 422) {
        errorMessage = 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      Swal.fire(
        'Lỗi!',
        errorMessage,
        'error'
      );
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="page-title">Thêm sản phẩm mới</h2>
        <button 
          className="btn btn-secondary" 
          onClick={() => navigate('/admin/products')}
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
              <div className="row">
                <div className="col-md-8">
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Tên sản phẩm <span className="text-danger">*</span></label>
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
                  
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="category_id" className="form-label">Chuyên mục <span className="text-danger">*</span></label>
                        <select 
                          className="form-select" 
                          id="category_id" 
                          name="category_id"
                          value={formData.category_id}
                          onChange={handleChange}
                          required
                        >
                          <option value="">-- Chọn chuyên mục --</option>
                          {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="brand_id" className="form-label">Chủ đề <span className="text-danger">*</span></label>
                        <select 
                          className="form-select" 
                          id="brand_id" 
                          name="brand_id"
                          value={formData.brand_id}
                          onChange={handleChange}
                          required
                        >
                          <option value="">-- Chọn chủ đề --</option>
                          {brands.map((brand) => (
                            <option key={brand.id} value={brand.id}>
                              {brand.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">Mô tả ngắn <span className="text-danger">*</span></label>
                    <textarea 
                      className="form-control" 
                      id="description" 
                      name="description"
                      rows="3"
                      value={formData.description}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="detail" className="form-label">Chi tiết sản phẩm <span className="text-danger">*</span></label>
                    <textarea 
                      className="form-control" 
                      id="detail" 
                      name="detail"
                      rows="6"
                      value={formData.detail}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>
                </div>
                
                <div className="col-md-4">
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
                  
                  <div className="mb-3">
                    <label htmlFor="image" className="form-label">Hình ảnh</label>
                    <input 
                      type="file" 
                      className="form-control" 
                      id="image" 
                      name="image"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    
                    {imagePreview && (
                      <div className="mt-3 text-center">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="img-thumbnail product-image-preview" 
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="text-end mt-4">
                <button 
                  type="button" 
                  className="btn btn-secondary me-2"
                  onClick={() => navigate('/admin/products')}
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
                    <>Lưu sản phẩm</>
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

export default ProductCreate;







