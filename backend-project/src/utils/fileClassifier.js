const path = require('path');

// Phân loại file dựa trên extension
function classifyFile(filename, mimetype) {
  const ext = path.extname(filename).toLowerCase();
  const name = filename.toLowerCase();
  
  // Phân loại dựa trên tên file và extension
  if (name.includes('van ban') || name.includes('quy dinh') || name.includes('thong tu')) {
    return 'van-ban';
  }
  
  if (name.includes('bao cao') || name.includes('report')) {
    return 'bao-cao';
  }
  
  if (name.includes('huong dan') || name.includes('guide') || name.includes('manual')) {
    return 'huong-dan';
  }
  
  if (name.includes('quy che') || name.includes('regulation')) {
    return 'quy-che';
  }
  
  if (name.includes('ke hoach') || name.includes('plan')) {
    return 'ke-hoach';
  }
  
  // Default fallback - KHÔNG dùng 'other'
  return 'tai-lieu';
}

// Tạo title thông minh
const generateSmartTitle = (originalName, category) => {
  const nameWithoutExt = path.basename(originalName, path.extname(originalName));
  
  // Làm sạch tên file
  const cleanName = nameWithoutExt
    .replace(/[-_]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  return cleanName || 'Tài liệu không tên';
};

// Tạo description
const generateDescription = (originalName, category, fileSize) => {
  const ext = path.extname(originalName).toLowerCase();
  const sizeInMB = (fileSize / (1024 * 1024)).toFixed(2);
  
  const categoryNames = {
    'tai-lieu': 'Tài liệu',
    'van-ban': 'Văn bản',
    'bao-cao': 'Báo cáo',
    'huong-dan': 'Hướng dẫn',
    'quy-che': 'Quy chế',
    'ke-hoach': 'Kế hoạch'
  };
  
  return `${categoryNames[category] || 'Tài liệu'} ${ext.toUpperCase()} - Kích thước: ${sizeInMB}MB`;
};

module.exports = {
  classifyFile,
  generateSmartTitle,
  generateDescription
};
