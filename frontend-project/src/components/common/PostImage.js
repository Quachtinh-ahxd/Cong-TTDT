import React from 'react';
import { normalizeImagePath } from '../../utils/imageUtils';

const PostImage = ({ image, alt, className, style }) => {
  if (!image) {
    return (
      <div className={`no-image-container ${className || ''}`} style={style}>
        <div className="no-image-text">Không có ảnh</div>
      </div>
    );
  }

  return (
    <img
      src={normalizeImagePath(image, 'post')}
      alt={alt || 'Hình ảnh'}
      className={className}
      style={style}
      onError={(e) => {
        console.error('Image failed to load:', e.target.src);
        e.target.onerror = null;
        e.target.style.display = 'none';
        e.target.parentNode.innerHTML = '<div class="no-image-text">Không có ảnh</div>';
      }}
    />
  );
};

export default PostImage;


