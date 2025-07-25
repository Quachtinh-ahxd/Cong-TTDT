import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import FileService from '../../services/FileService';
import { fileUrl } from '../../config';
import './ThuVienSo.css';

const ThuVienSo = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('date');

  const categories = [
    { id: 'all', name: 'Tất cả', icon: 'fas fa-th-large' },
    { id: 'document', name: 'Văn bản', icon: 'fas fa-file-alt' },
    { id: 'pdf', name: 'PDF', icon: 'fas fa-file-pdf' },
    { id: 'spreadsheet', name: 'Bảng tính', icon: 'fas fa-file-excel' },
    { id: 'image', name: 'Hình ảnh', icon: 'fas fa-image' },
    { id: 'video', name: 'Video', icon: 'fas fa-video' },
    { id: 'audio', name: 'Audio', icon: 'fas fa-music' }
  ];

  useEffect(() => {
    loadDocuments();
  }, [activeCategory]);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      console.log('=== LOADING DOCUMENTS ===');
      console.log('Calling FileService.getAll()...');
      
      const response = await FileService.getAll();
      console.log('Raw response:', response);
      
      // SỬA: API trả về response.data, không phải response.files
      if (response && response.success && response.data) {
        console.log('Files from response:', response.data);
        console.log('Files count:', response.data.length);
        
        setDocuments(response.data); // ← Đổi từ response.files thành response.data
      } else {
        console.log('No files found, setting empty array');
        setDocuments([]);
      }
    } catch (error) {
      console.error('Error loading documents:', error);
      console.error('Error details:', error.message);
      setDocuments([]);
    } finally {
      setLoading(false);
      console.log('=== LOADING DOCUMENTS COMPLETE ===');
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadDocuments();
      return;
    }

    try {
      setLoading(true);
      const allFiles = await FileService.getAll();
      if (allFiles && allFiles.success && allFiles.files) {
        const filtered = allFiles.files.filter(file => 
          (file.filename || file.name || file.title || '').toLowerCase().includes(searchTerm.toLowerCase())
        );
        setDocuments(filtered);
      }
    } catch (error) {
      console.error('Error searching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (doc) => {
    try {
      // Tạo link download trực tiếp
      const downloadUrl = `${fileUrl}/${doc.path}`;
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = doc.name;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Có thể gọi API để tăng counter nếu backend hỗ trợ
      // await DocumentService.incrementDownload(doc.id);
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Không thể tải xuống file. Vui lòng thử lại.');
    }
  };

  const handleViewFile = (doc) => {
    const viewUrl = `${fileUrl}/${doc.path || doc.filename}`;
    window.open(viewUrl, '_blank');
  };

  const getFileName = (file) => {
    if (!file) {
      console.log('getFileName: file is null/undefined');
      return 'Không có tên';
    }
    
    const fileName = file.original_name || file.name || file.filename || 'Không có tên';
    console.log('getFileName result:', fileName);
    
    // Decode UTF-8 nếu bị encode sai
    try {
      return decodeURIComponent(escape(fileName));
    } catch (e) {
      console.log('getFileName decode error:', e);
      return fileName;
    }
  };

  const formatFileName = (fileName) => {
    try {
      // Thử decode UTF-8
      const decoded = decodeURIComponent(escape(fileName));
      return decoded;
    } catch (e) {
      // Nếu không decode được, trả về tên gốc
      return fileName;
    }
  };

  const filteredAndSortedDocuments = documents
    .filter(doc => {
      console.log('=== FILTERING DOCUMENT ===');
      console.log('Document:', doc);
      
      // Lọc theo category
      if (activeCategory !== 'all') {
        const fileName = getFileName(doc);
        console.log('fileName for filter:', fileName);
        
        if (!fileName) {
          console.log('No fileName, skipping filter');
          return false;
        }
        
        const ext = fileName.split('.').pop()?.toLowerCase();
        console.log('Extension:', ext);
        
        let categoryMatch = true;
        switch(activeCategory) {
          case 'document':
            categoryMatch = ['doc', 'docx', 'txt', 'rtf'].includes(ext);
            break;
          case 'pdf':
            categoryMatch = ext === 'pdf';
            break;
          case 'spreadsheet':
            categoryMatch = ['xls', 'xlsx', 'csv'].includes(ext);
            break;
          case 'image':
            categoryMatch = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'].includes(ext);
            break;
          case 'video':
            categoryMatch = ['mp4', 'avi', 'mov', 'wmv', 'mkv'].includes(ext);
            break;
          case 'audio':
            categoryMatch = ['mp3', 'wav', 'flac', 'aac'].includes(ext);
            break;
          default:
            categoryMatch = true;
        }
        
        console.log('Category match:', categoryMatch);
        if (!categoryMatch) return false;
      }
      
      // Lọc theo search term
      if (searchTerm.trim()) {
        const docName = getFileName(doc) || '';
        const docDescription = doc.description || '';
        const matchesSearch = docName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             docDescription.toLowerCase().includes(searchTerm.toLowerCase());
        console.log('Search match:', matchesSearch);
        return matchesSearch;
      }
      
      console.log('Document passed all filters');
      return true;
    })
    .sort((a, b) => {
      switch(sortBy) {
        case 'name':
          const nameA = a.name || a.filename || a.original_name || '';
          const nameB = b.name || b.filename || b.original_name || '';
          return nameA.localeCompare(nameB);
        case 'size':
          return (b.size || 0) - (a.size || 0);
        case 'date':
        default:
          return new Date(b.created_at || 0) - new Date(a.created_at || 0);
      }
    });

  console.log('=== FILTER RESULTS ===');
  console.log('Total documents:', documents.length);
  console.log('Active category:', activeCategory);
  console.log('Search term:', searchTerm);
  console.log('Filtered documents:', filteredAndSortedDocuments.length);
  console.log('Filtered documents:', filteredAndSortedDocuments);

  const getFileIcon = (filename, type) => {
    const ext = filename?.split('.').pop()?.toLowerCase();
    
    // Sử dụng type từ backend hoặc extension
    switch(type || ext) {
      case 'pdf': return 'fas fa-file-pdf text-danger';
      case 'document':
      case 'docx': 
      case 'doc': return 'fas fa-file-word text-primary';
      case 'spreadsheet':
      case 'xlsx': 
      case 'xls': return 'fas fa-file-excel text-success';
      case 'image':
      case 'jpg':
      case 'jpeg':
      case 'png': return 'fas fa-image text-info';
      case 'video':
      case 'mp4':
      case 'avi': return 'fas fa-video text-warning';
      case 'audio':
      case 'mp3':
      case 'wav': return 'fas fa-music text-success';
      default: return 'fas fa-file text-secondary';
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileTypeLabel = (filename, type) => {
    const ext = filename?.split('.').pop()?.toUpperCase();
    return ext || type?.toUpperCase() || 'FILE';
  };

  const formatDate = (dateString) => {
    if (!dateString || dateString === 'Invalid Date') return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'N/A';
      return date.toLocaleDateString('vi-VN');
    } catch (e) {
      return 'N/A';
    }
  };

  const getFileUrl = (doc) => {
    if (!doc) return '#';
    
    const filename = doc.path || doc.filename || doc.name;
    if (!filename) return '#';
    
    // Nếu đã là URL đầy đủ
    if (filename.startsWith('http')) {
      return filename;
    }
    
    // Trường hợp mặc định
    return `${fileUrl}/${filename}`;
  };

  return (
    <div className="digital-library">
      <div className="container py-5">
        {/* Search and Filter */}
        <div className="row mb-4">
          <div className="col-md-8">
            <div className="search-box">
              <i className="fas fa-search search-icon"></i>
              <input
                type="text"
                className="form-control search-input"
                placeholder="Tìm kiếm tài liệu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
          </div>
          <div className="col-md-4">
            <select 
              className="form-select filter-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="date">Sắp xếp theo ngày</option>
              <option value="name">Sắp xếp theo tên</option>
              <option value="size">Sắp xếp theo kích thước</option>
            </select>
          </div>
        </div>

        {/* Categories */}
        <div className="categories-section mb-5">
          <div className="categories-grid">
            {categories.map(category => (
              <button
                key={category.id}
                className={`category-card ${activeCategory === category.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(category.id)}
              >
                <i className={category.icon}></i>
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Documents Grid */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Đang tải...</span>
            </div>
          </div>
        ) : (
          <div className="documents-grid">
            {filteredAndSortedDocuments.length > 0 ? (
              filteredAndSortedDocuments.map(doc => (
                <div key={doc.id} className="document-card">
                  <div className="document-header">
                    <div className="file-icon">
                      <i className={getFileIcon(getFileName(doc), doc.type)}></i>
                    </div>
                    <div className="document-type">
                      {getFileTypeLabel(getFileName(doc), doc.type)}
                    </div>
                  </div>
                  
                  <div className="document-body">
                    <h5 className="document-title">{getFileName(doc)}</h5>
                    <p className="document-description">{doc.description || 'Multiple files uploaded'}</p>
                    
                    <div className="document-meta">
                      <div className="meta-item">
                        <i className="fas fa-calendar-alt"></i>
                        <span>{formatDate(doc.created_at) || 'Invalid Date'}</span>
                      </div>
                      <div className="meta-item">
                        <i className="fas fa-file-archive"></i>
                        <span>{formatFileSize(doc.size) || 'N/A'}</span>
                      </div>
                      <div className="meta-item">
                        <i className="fas fa-folder"></i>
                        <span>{getFileTypeLabel(getFileName(doc), doc.type) || 'File'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="document-footer">
                    <button 
                      className="btn btn-primary btn-download"
                      onClick={() => handleDownload(doc)}
                    >
                      <i className="fas fa-download me-2"></i>
                      TẢI XUỐNG
                    </button>
                    <Link 
                      to={`/documents/${doc.id}`}
                      className="btn btn-outline-secondary btn-preview"
                    >
                      <i className="fas fa-eye me-2"></i>
                      XEM
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-documents">
                <i className="fas fa-folder-open"></i>
                <h4>Không tìm thấy tài liệu</h4>
                <p>Thử thay đổi từ khóa tìm kiếm hoặc danh mục</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ThuVienSo;






















