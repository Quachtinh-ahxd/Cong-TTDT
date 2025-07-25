import React, { useState } from 'react';

const ImageWithFallback = ({ type, filename, alt, className, style, ...props }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const getImageUrl = () => {
    if (!filename || filename === 'placeholder.svg' || filename.includes('placeholder')) {
      return null;
    }

    if (filename.startsWith('http://') || filename.startsWith('https://')) {
      return filename;
    }

    // Chỉ lấy tên file
    const fileName = filename.toString().replace(/^.*[\\\/]/, '');
    
    // THỬ CÁC ĐƯỜNG DẪN KHÁC NHAU:
    let imageUrl = '';
    switch (type) {
      case 'user':
        // Thử từng đường dẫn có thể:
        imageUrl = `http://localhost:5000/images/user/${fileName}`;        // Thử 1
        // imageUrl = `http://localhost:5000/uploads/user/${fileName}`;     // Thử 2  
        // imageUrl = `http://localhost:5000/storage/user/${fileName}`;     // Thử 3
        // imageUrl = `http://localhost:5000/assets/user/${fileName}`;      // Thử 4
        break;
      case 'product':
        imageUrl = `http://localhost:5000/images/product/${fileName}`;
        break;
      case 'category':
        imageUrl = `http://localhost:5000/images/category/${fileName}`;
        break;
      case 'brand':
        imageUrl = `http://localhost:5000/images/brand/${fileName}`;
        break;
      default:
        imageUrl = `http://localhost:5000/images/${fileName}`;
    }
    
    console.log(`=== ImageWithFallback Debug (${type}) ===`);
    console.log('Original filename:', filename);
    console.log('Processed fileName:', fileName);
    console.log('Final imageUrl:', imageUrl);
    console.log('=== End Debug ===');
    
    return imageUrl;
  };

  const handleImageError = (e) => {
    console.log(`Image load error for ${type}:`, filename);
    setImageError(true);
    setImageLoaded(false);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const imageUrl = getImageUrl();

  // Nếu không có image hoặc có lỗi, hiển thị fallback
  if (!imageUrl || imageError) {
    return (
      <div 
        className={`image-fallback ${className || ''}`}
        style={{
          ...style,
          backgroundColor: '#f8f9fa',
          border: '1px solid #dee2e6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '4px'
        }}
      >
        <i className={`fa ${type === 'user' ? 'fa-user' : 'fa-image'} text-muted`}></i>
      </div>
    );
  }

  return (
    <>
      {!imageLoaded && (
        <div 
          className={`image-loading ${className || ''}`}
          style={{
            ...style,
            backgroundColor: '#f8f9fa',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '4px'
          }}
        >
          <div className="spinner-border spinner-border-sm text-muted" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      
      <img
        src={imageUrl}
        alt={alt}
        className={className}
        style={{
          ...style,
          display: imageLoaded ? 'block' : 'none'
        }}
        onLoad={handleImageLoad}
        onError={handleImageError}
        {...props}
      />
    </>
  );
};

export default ImageWithFallback;








