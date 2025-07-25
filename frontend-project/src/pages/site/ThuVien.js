import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductService from '../../services/ProductService';
import SiteProductImage from '../../components/site/SiteProductImage';
import './ThuVien.css';

const ThuVien = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [filter, setFilter] = useState('images');
  const [displayCount, setDisplayCount] = useState(20);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        console.log('=== ThuVien: Fetching products ===');
        
        const response = await ProductService.getAll();
        console.log('ThuVien response:', response);
        
        // SỬA: API trả về response.data (array), không phải response.data.products
        if (response.data && Array.isArray(response.data)) {
          console.log('Total products:', response.data.length);
          
          const approvedProducts = response.data.filter(product => product.is_approved === 1);
          console.log('Approved products:', approvedProducts.length);
          
          // Lấy tất cả sản phẩm đã duyệt có hình ảnh
          const productsWithImages = response.data.filter(
            product => product.is_approved === 1 && product.image && product.image.trim() !== ''
          );
          
          console.log('Products with image:', productsWithImages.length);
          console.log('Products with images:', productsWithImages);
          
          if (productsWithImages.length === 0) {
            console.warn('⚠️ No products found with images');
            console.log('🔧 TEMPORARILY SHOWING ALL APPROVED PRODUCTS FOR TESTING');
            setProducts(approvedProducts); // Tạm thời hiển thị tất cả approved products
          } else {
            setProducts(productsWithImages);
          }
        } else {
          console.error('❌ Invalid response structure:', response);
        }
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  // Filter products based on type
  const filteredProducts = products.filter(product => {
    if (filter === 'images') {
      const imageExt = product.image?.toLowerCase();
      const isImage = imageExt?.includes('.jpg') || imageExt?.includes('.jpeg') || 
             imageExt?.includes('.png') || imageExt?.includes('.gif') || 
             imageExt?.includes('.webp') || imageExt?.includes('.bmp') || 
             imageExt?.includes('.svg');
      console.log(`Product ${product.id} - Image: ${product.image} - Is Image: ${isImage}`);
      return isImage;
    }
    if (filter === 'videos') {
      const imageExt = product.image?.toLowerCase();
      return imageExt?.includes('.mp4') || imageExt?.includes('.avi') || 
             imageExt?.includes('.mov') || imageExt?.includes('.wmv') ||
             imageExt?.includes('.mkv') || imageExt?.includes('.flv');
    }
    return true;
  });

  console.log('=== ThuVien FILTER DEBUG ===');
  console.log('Total products after approval filter:', products.length);
  console.log('Filter type:', filter);
  console.log('Products after image filter:', filteredProducts.length);
  console.log('Display count:', displayCount);
  console.log('Final displayed products:', filteredProducts.slice(0, displayCount).length);

  // Get products to display
  const displayedProducts = filteredProducts.slice(0, displayCount);
  const hasMore = filteredProducts.length > displayCount;

  const handleLoadMore = () => {
    setDisplayCount(prev => prev + 8);
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setDisplayCount(8); // Reset display count when filter changes
  };

  const openModal = (product) => {
    setSelectedImage(product);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  console.log('=== ThuVien RENDER DEBUG ===');
  console.log('products.length:', products.length);
  console.log('filteredProducts.length:', filteredProducts.length);
  console.log('loading:', loading);

  return (
    <div className="container py-5">
      <div className="section-header mb-4">
        <h2 className="section-title text-center">Thư viện Hình ảnh & Phim</h2>
        <p className="text-center text-muted">Bộ sưu tập hình ảnh và video của đơn vị</p>
      </div>

      {/* DEBUG INFO - tạm thời */}
      <div style={{ background: '#f0f0f0', padding: '10px', margin: '10px 0', fontSize: '12px' }}>
        <strong>DEBUG:</strong> Products: {products.length}, Filtered: {filteredProducts.length}, Displayed: {displayedProducts.length}, Loading: {loading ? 'Yes' : 'No'}
      </div>

      {/* Filter buttons */}
      <div className="text-center mb-4">
        <div className="btn-group" role="group">
          <button 
            type="button" 
            className={`btn ${filter === 'images' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => handleFilterChange('images')}
          >
            <i className="fas fa-image me-1"></i>
            HÌNH ẢNH
          </button>
          <button 
            type="button" 
            className={`btn ${filter === 'videos' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => handleFilterChange('videos')}
          >
            <i className="fas fa-video me-1"></i>
            PHIM
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
        </div>
      ) : (
        <>
          <div className="row g-3">
            {displayedProducts.length > 0 ? (
              displayedProducts.map((product) => (
                <div key={product.id} className="col-lg-3 col-md-4 col-sm-6">
                  <div className="gallery-item position-relative">
                    <div 
                      className="gallery-image-container"
                      onClick={() => openModal(product)}
                      style={{ cursor: 'pointer' }}
                    >
                      <SiteProductImage
                        image={product.image}
                        alt={product.name}
                        className="gallery-image"
                        style={{ 
                          width: '100%', 
                          height: '200px', 
                          objectFit: 'cover',
                          borderRadius: '8px'
                        }}
                      />
                      <div className="gallery-overlay">
                        <i className="fas fa-search-plus text-white"></i>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12 text-center py-5">
                <div className="alert alert-info">
                  <i className="fas fa-info-circle me-2"></i>
                  Không có {filter === 'images' ? 'hình ảnh' : 'video'} nào trong thư viện.
                </div>
              </div>
            )}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="text-center mt-4">
              <button 
                className="btn btn-outline-primary btn-lg"
                onClick={handleLoadMore}
              >
                <i className="fas fa-plus me-2"></i>
                Xem thêm
              </button>
            </div>
          )}

          {/* Show current count info */}
          {filteredProducts.length > 0 && (
            <div className="text-center mt-3">
              <small className="text-muted">
                Hiển thị {displayedProducts.length} trong tổng số {filteredProducts.length} {filter === 'images' ? 'hình ảnh' : 'video'}
              </small>
            </div>
          )}

          {/* Modal for image preview */}
          {selectedImage && (
            <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
              <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">{selectedImage.name}</h5>
                    <button 
                      type="button" 
                      className="btn-close" 
                      onClick={closeModal}
                    ></button>
                  </div>
                  <div className="modal-body text-center">
                    <SiteProductImage
                      image={selectedImage.image}
                      alt={selectedImage.name}
                      className="img-fluid"
                      style={{ maxHeight: '500px' }}
                    />
                    <div className="mt-3">
                      <p className="text-muted">{selectedImage.description}</p>
                      <div className="d-flex justify-content-between">
                        <small className="text-muted">
                          <i className="fas fa-calendar me-1"></i>
                          {new Date(selectedImage.created_at).toLocaleDateString('vi-VN')}
                        </small>
                        <small className="text-muted">
                          <i className="fas fa-tag me-1"></i>
                          {selectedImage.brand_name || 'Không xác định'}
                        </small>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <Link 
                      to={`/products/${selectedImage.id}`} 
                      className="btn btn-primary"
                    >
                      Xem chi tiết
                    </Link>
                    <button 
                      type="button" 
                      className="btn btn-secondary" 
                      onClick={closeModal}
                    >
                      Đóng
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ThuVien;

















