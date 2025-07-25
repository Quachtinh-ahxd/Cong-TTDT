import React, { useState } from 'react';

const SiteProductImage = ({ image, alt, className, style }) => {
  const [imageError, setImageError] = useState(false);

  console.log('=== SiteProductImage DEBUG ===');
  console.log('Received image prop:', image, typeof image);

  // Kiểm tra và xử lý đường dẫn ảnh
  const getImageUrl = (imagePath) => {
    // Kiểm tra null, undefined, empty string
    if (!imagePath || imagePath === 'undefined' || imagePath === 'null' || imagePath === '') {
      console.log('Invalid/empty image path:', imagePath);
      return null;
    }

    // Bỏ qua placeholder
    if (imagePath.includes('placeholder') || imagePath === 'placeholder.svg') {
      console.log('Skipping placeholder image');
      return null;
    }

    // Nếu đã là URL đầy đủ
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }

    // Lấy tên file từ đường dẫn
    let fileName = imagePath.toString().trim();
    fileName = fileName.replace(/^.*[\\\/]/, ''); // Loại bỏ path, chỉ giữ tên file

    // Kiểm tra tên file hợp lệ
    if (!fileName || fileName === '' || !fileName.includes('.')) {
      console.log('Invalid filename:', fileName);
      return null;
    }

    // Sử dụng backend server URL
    const finalUrl = `http://localhost:5000/images/product/${fileName}`;
    console.log('Final image URL:', finalUrl);
    return finalUrl;
  };

  const handleImageError = (e) => {
    console.log('Image failed to load:', e.target.src);
    setImageError(true);
  };

  const imageUrl = getImageUrl(image);

  // Nếu không có ảnh hợp lệ hoặc có lỗi, hiển thị fallback
  if (!imageUrl || imageError) {
    return (
      <div
        className={`no-image-fallback ${className || ''}`}
        style={{
          width: style?.width || '50px',
          height: style?.height || '50px',
          background: '#f8f9fa',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px',
          color: '#6c757d',
          border: '1px solid #dee2e6',
          borderRadius: '4px',
          ...style
        }}
      >
        Không có ảnh
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={alt || 'Product image'}
      className={className}
      style={style}
      onError={handleImageError}
    />
  );
};

export default SiteProductImage;









