import React, { useState, useEffect } from 'react';
import FileService from '../../../services/FileService';
import { FileClassifier } from '../../../utils/fileClassifier';
import './HuongDan.css';

const HuongDan = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

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

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      setLoading(true);
      console.log('=== HuongDan: Loading files ===');
      
      const response = await FileService.getAll();
      console.log('Full response:', response);
      
      // SỬA: API trả về response.data (array trực tiếp), không phải response.data.files
      const allFiles = response.data || [];
      console.log('All files:', allFiles);
      console.log('All files count:', allFiles.length);
      
      // Debug: Xem structure của files
      if (allFiles.length > 0) {
        console.log('Sample file structure:', allFiles[0]);
        console.log('File names:', allFiles.map(f => f.original_name || f.name || f.filename));
      }
      
      const categoryFiles = FileClassifier.getFilesByCategory(allFiles, 'huong-dan-chi-dao');
      console.log('Category files (huong-dan-chi-dao):', categoryFiles);
      console.log('Category files count:', categoryFiles.length);
      
      if (categoryFiles.length === 0) {
        console.warn('⚠️ No files found for category "huong-dan-chi-dao"');
        console.log('🔧 TEMPORARILY SHOWING ALL FILES FOR TESTING');
        setFiles(allFiles); // Tạm thời hiển thị tất cả files
      } else {
        setFiles(categoryFiles);
      }
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
      case 'pdf':
        return 'fas fa-file-pdf text-danger';
      case 'doc':
      case 'docx':
        return 'fas fa-file-word text-primary';
      case 'xls':
      case 'xlsx':
        return 'fas fa-file-excel text-success';
      case 'ppt':
      case 'pptx':
        return 'fas fa-file-powerpoint text-warning';
      default:
        return 'fas fa-file-alt text-secondary';
    }
  };

  const filteredFiles = files.filter(file => {
    const fileName = getFileName(file).toLowerCase();
    return fileName.includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return (
      <div className="huong-dan-page">
        <div className="text-center py-5">
          <div className="spinner-border text-light" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="huong-dan-page">
      {/* Header */}
      <div className="page-header">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h1 className="page-title">
                <i className="fas fa-clipboard-list me-3"></i>
                Hướng Dẫn Chỉ Đạo
              </h1>
              <p className="page-subtitle">
                Các văn bản hướng dẫn, chỉ thị và quyết định của Trung đoàn 290
              </p>
            </div>
            <div className="col-md-4">
              <div className="stats-badge">
                <i className="fas fa-file-alt"></i>
                <div className="stat-number">{files.length}</div>
                <div className="stat-label">Văn bản</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container py-5">
        {/* Search */}
        <div className="row mb-4">
          <div className="col-md-8 mx-auto">
            <div className="search-box">
              <i className="fas fa-search"></i>
              <input
                type="text"
                className="form-control"
                placeholder="Tìm kiếm văn bản hướng dẫn..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Documents Grid */}
        {filteredFiles.length > 0 ? (
          <div className="documents-grid">
            {filteredFiles.map(file => (
              <div key={file.id} className="document-card">
                <div className="document-header">
                  <div className="document-icon">
                    <i className={getFileIcon(getFileName(file))}></i>
                  </div>
                  <div className="document-badges">
                    <span className="badge bg-success">
                      {getFileName(file).split('.').pop()?.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="document-body">
                  <h5 className="document-title">{getFileName(file)}</h5>
                  <p className="document-description">
                    {file.description || 'Văn bản hướng dẫn chỉ đạo'}
                  </p>

                  <div className="document-meta">
                    <div className="meta-item">
                      <i className="fas fa-hdd"></i>
                      <span>Kích thước: {formatFileSize(file.size || file.file_size || 0)}</span>
                    </div>
                    <div className="meta-item">
                      <i className="fas fa-calendar"></i>
                      <span>Ngày ban hành: {formatDate(file.created_at || file.createdAt)}</span>
                    </div>
                  </div>
                </div>

                <div className="document-footer">
                  <button className="btn btn-primary">
                    <i className="fas fa-download me-2"></i>
                    Tải xuống
                  </button>
                  <button className="btn btn-outline-secondary">
                    <i className="fas fa-eye me-2"></i>
                    Xem chi tiết
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-results">
            <i className="fas fa-search"></i>
            <h4>Không tìm thấy văn bản nào</h4>
            <p>Thử thay đổi từ khóa tìm kiếm hoặc kiểm tra lại danh mục</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HuongDan;


