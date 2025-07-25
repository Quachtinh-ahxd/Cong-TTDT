const fs = require('fs');
const path = require('path');

// Tạo placeholder SVG động
const createPlaceholderSVG = (width = 300, height = 300, text = 'No Image') => {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#f8f9fa"/>
  <rect x="10%" y="10%" width="80%" height="80%" fill="#e9ecef" stroke="#dee2e6" stroke-width="2"/>
  <circle cx="50%" cy="35%" r="15%" fill="#ced4da"/>
  <rect x="25%" y="55%" width="50%" height="8%" fill="#ced4da"/>
  <rect x="30%" y="65%" width="40%" height="6%" fill="#ced4da"/>
  <text x="50%" y="85%" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" fill="#6c757d">${text}</text>
</svg>`;
};

