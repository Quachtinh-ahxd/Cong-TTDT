import React, { useState, useEffect } from 'react';
import FileService from '../../../services/FileService';
import { FileClassifier } from '../../../utils/fileClassifier';
import './BieuMau.css';

const BieuMau = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0 || isNaN(bytes)) return '0 KB';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'N/A';
      return date.toLocaleDateString('vi-VN');
    } catch (e) {
      return 'N/A';
    }
  };

  const categories = [
    { id: 'all', name: 'Tất cả', icon: 'fas fa-th-large', color: 'primary' },
    { id: 'personnel', name: 'Nhân sự', icon: 'fas fa-users', color: 'success' },
    { id: 'meeting', name: 'Họp hành', icon: 'fas fa-handshake', color: 'info' },
    { id: 'report', name: 'Báo cáo', icon: 'fas fa-chart-line', color: 'warning' },
    { id: 'training', name: 'Huấn luyện', icon: 'fas fa-graduation-cap', color: 'danger' },
    { id: 'evaluation', name: 'Đánh giá', icon: 'fas fa-star', color: 'secondary' },
    { id: 'finance', name: 'Tài chính', icon: 'fas fa-coins', color: 'dark' },
    { id: 'administrative', name: 'Hành chính', icon: 'fas fa-file-alt', color: 'primary' }
  ];

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      setLoading(true);
      const response = await FileService.getAll();
      console.log('Full response:', response);
      
      const allFiles = response.data?.files || response.files || [];
      console.log('All files:', allFiles);
      
      const categoryFiles = FileClassifier.getFilesByCategory(allFiles, 'mau-van-ban');
      console.log('Category files:', categoryFiles);
      
      setFiles(categoryFiles);
    } catch (error) {
      console.error('Error loading files:', error);
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };

  const getFileName = (file) => {
    const fileName = file?.original_name || file?.name || file?.filename || 'Không có tên';
    return FileClassifier.decodeFileName(fileName);
  };

  const getFileIcon = (fileName) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'docx':
        return 'fas fa-file-word text-primary';
      case 'xlsx':
        return 'fas fa-file-excel text-success';
      case 'pdf':
        return 'fas fa-file-pdf text-danger';
      case 'pptx':
        return 'fas fa-file-powerpoint text-warning';
      default:
        return 'fas fa-file text-secondary';
    }
  };

  const filteredFiles = files.filter(file => {
    const fileName = getFileName(file).toLowerCase();
    return fileName.includes(searchTerm.toLowerCase());
  });

  const handleDownload = (file) => {
    console.log('Downloading:', getFileName(file));
    // Implement download logic here
  };

  if (loading) {
    return (
      <div className="bieu-mau-page">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bieu-mau-page">
      {/* Header */}
      <div className="page-header">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h1 className="page-title">
                <i className="fas fa-file-alt me-3"></i>
                Các Mẫu Văn Bản
              </h1>
              <p className="page-subtitle">
                Tổng hợp các mẫu văn bản, biểu mẫu sử dụng trong Trung đoàn 290
              </p>
            </div>
            <div className="col-md-4 text-end">
              <div className="stats-badge">
                <div className="stat-item">
                  <span className="stat-number">{files.length}</span>
                  <span className="stat-label">Mẫu văn bản</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-5">
        {/* Search and Filter */}
        <div className="row mb-4">
          <div className="col-md-8">
            <div className="search-box">
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="Tìm kiếm mẫu văn bản..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-control"
              />
            </div>
          </div>
          <div className="col-md-4">
            <select
              className="form-select"
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value)}
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Filters */}
        <div className="category-filters mb-4">
          {categories.map(category => (
            <button
              key={category.id}
              className={`category-btn ${activeCategory === category.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(category.id)}
            >
              <i className={category.icon}></i>
              <span>{category.name}</span>
            </button>
          ))}
        </div>

        {/* Documents Grid */}
        {filteredFiles.length > 0 ? (
          <div className="documents-grid">
            {filteredFiles.map(file => (
              <div key={file.id} className="document-card">
                <div className="document-header">
                  <div className="file-icon">
                    <i className={getFileIcon(getFileName(file))}></i>
                  </div>
                  <div className="document-code">
                    TD290-{file.id.toString().padStart(2, '0')}
                  </div>
                </div>

                <div className="document-body">
                  <h5 className="document-title">{getFileName(file)}</h5>
                  <p className="document-description">
                    {file.description || 'Mẫu văn bản sử dụng trong Trung đoàn 290'}
                  </p>
                  
                  <div className="document-meta">
                    <div className="meta-row">
                      <span className="meta-label">Phòng ban:</span>
                      <span className="meta-value">Văn phòng Trung đoàn</span>
                    </div>
                    <div className="meta-row">
                      <span className="meta-label">Kích thước:</span>
                      <span className="meta-value">{formatFileSize(file.size || file.file_size || 0)}</span>
                    </div>
                    <div className="meta-row">
                      <span className="meta-label">Cập nhật:</span>
                      <span className="meta-value">{formatDate(file.created_at || file.createdAt)}</span>
                    </div>
                    <div className="meta-row">
                      <span className="meta-label">Lượt tải:</span>
                      <span className="meta-value">{Math.floor(Math.random() * 1000) + 100}</span>
                    </div>
                  </div>
                </div>

                <div className="document-footer">
                  <button 
                    className="btn btn-primary"
                    onClick={() => handleDownload(file)}
                  >
                    <i className="fas fa-download me-2"></i>
                    Tải xuống
                  </button>
                  <button className="btn btn-outline-secondary">
                    <i className="fas fa-eye me-2"></i>
                    Xem trước
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-results">
            <i className="fas fa-search"></i>
            <h4>Không tìm thấy mẫu văn bản</h4>
            <p>Thử thay đổi từ khóa tìm kiếm hoặc danh mục</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BieuMau;
