import React, { useState, useEffect } from 'react';

const ImageLoader = ({ src, alt, className, style, fallback }) => {
  const [imageSrc, setImageSrc] = useState(src);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    setImageSrc(src);
    setHasError(false);
    setRetryCount(0);
  }, [src]);

  const handleError = () => {
    if (retryCount < 3) {
      // Thử lại với các cách khác nhau
      let newSrc = imageSrc;
      
      if (retryCount === 0) {
        // Lần 1: Loại bỏ crossOrigin
        const img = new Image();
        img.onload = () => setImageSrc(newSrc);
        img.onerror = () => setRetryCount(prev => prev + 1);
        img.src = newSrc.split('?')[0];
        return;
      }
      
      if (retryCount === 1) {
        // Lần 2: Thử với timestamp mới
        const separator = newSrc.includes('?') ? '&' : '?';
        newSrc = `${newSrc.split('?')[0]}${separator}retry=${Date.now()}`;
        setImageSrc(newSrc);
        setRetryCount(prev => prev + 1);
        return;
      }
      
      if (retryCount === 2) {
        // Lần 3: Thử với proxy hoặc fallback
        setRetryCount(prev => prev + 1);
        return;
      }
    }
    
    setHasError(true);
  };

  if (hasError) {
    return fallback || (
      <div className={`no-image-container ${className || ''}`} style={style}>
        <div className="no-image-text">Không có ảnh</div>
      </div>
    );
  }

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      style={style}
      onError={handleError}
      loading="lazy"
    />
  );
};

export default ImageLoader;