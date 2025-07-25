import React, { useState, useEffect } from 'react';
import FileService from '../../services/FileService';
import { FileClassifier } from '../../utils/fileClassifier';
import './PhanMemQuanDoi.css';

const PhanMemQuanDoi = () => {
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
      console.log('=== PhanMemQuanDoi: Loading files ===');
      
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
      
      const categoryFiles = FileClassifier.getFilesByCategory(allFiles, 'phan-mem-quan-doi');
      console.log('Category files (phan-mem-quan-doi):', categoryFiles);
      console.log('Category files count:', categoryFiles.length);
      
      if (categoryFiles.length === 0) {
        console.warn('⚠️ No files found for category "phan-mem-quan-doi"');
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
      case 'mp3':
      case 'wav':
      case 'flac':
        return 'fas fa-music text-success';
      case 'mp4':
      case 'avi':
      case 'mkv':
        return 'fas fa-video text-primary';
      case 'pdf':
        return 'fas fa-file-pdf text-danger';
      case 'doc':
      case 'docx':
        return 'fas fa-file-word text-primary';
      case 'exe':
      case 'msi':
        return 'fas fa-cog text-warning';
      default:
        return 'fas fa-file text-secondary';
    }
  };

  const filteredFiles = files.filter(file => {
    const fileName = getFileName(file).toLowerCase();
    return fileName.includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return (
      <div className="military-software-page">
        <div className="text-center py-5">
          <div className="spinner-border text-light" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="military-software-page">
      {/* Header */}
      <div className="military-header">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h1 className="military-title">Phần Mềm Quân Đội</h1>
              <p className="military-subtitle">
                Tổng hợp các phần mềm, ứng dụng phục vụ công tác quân đội
              </p>
            </div>
            <div className="col-md-4">
              <div className="military-badge">
                <i className="fas fa-laptop-code"></i>
                <div className="stat-number">{files.length}</div>
                <div className="stat-label">Phần mềm</div>
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
                placeholder="Tìm kiếm phần mềm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Software Grid */}
        {filteredFiles.length > 0 ? (
          <div className="software-grid">
            {filteredFiles.map(file => (
              <div key={file.id} className="software-card">
                <div className="software-header">
                  <div className="software-icon">
                    <i className={getFileIcon(getFileName(file))}></i>
                  </div>
                  <div className="software-badges">
                    <span className="badge bg-primary">
                      {getFileName(file).split('.').pop()?.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="software-body">
                  <h5 className="software-title">{getFileName(file)}</h5>
                  <p className="software-description">
                    {file.description || 'Không có mô tả'}
                  </p>

                  <div className="software-meta">
                    <div className="meta-item">
                      <i className="fas fa-hdd"></i>
                      <span>Kích thước: {formatFileSize(file.size || file.file_size || 0)}</span>
                    </div>
                    <div className="meta-item">
                      <i className="fas fa-calendar"></i>
                      <span>Ngày tải: {formatDate(file.created_at || file.createdAt)}</span>
                    </div>
                  </div>
                </div>

                <div className="software-footer">
                  <button className="btn btn-primary">
                    <i className="fas fa-download me-2"></i>
                    Tải xuống
                  </button>
                  <button className="btn btn-outline-secondary">
                    <i className="fas fa-info-circle me-2"></i>
                    Chi tiết
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-results">
            <i className="fas fa-search"></i>
            <h4>Không tìm thấy phần mềm nào</h4>
            <p>Thử thay đổi từ khóa tìm kiếm hoặc kiểm tra lại danh mục</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhanMemQuanDoi;


