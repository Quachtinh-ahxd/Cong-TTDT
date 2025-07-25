import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import FileService from '../../../services/FileService';
import { fileUrl } from '../../../config';
import './FileUpload.css';

function FileUpload() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      setLoading(true);
      const response = await FileService.getAll();
      console.log('FileUpload - Full response:', response);
      
      if (response.data && response.data.status) {
        const filesData = response.data.files || [];
        console.log('FileUpload - Files data:', filesData);
        setFiles(filesData);
      } else if (response.data) {
        // Fallback nếu structure khác
        const filesData = response.data.files || response.data || [];
        console.log('FileUpload - Fallback files:', filesData);
        setFiles(Array.isArray(filesData) ? filesData : []);
      }
    } catch (error) {
      console.error('Error loading files:', error);
      Swal.fire('Lỗi!', 'Không thể tải danh sách file', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      Swal.fire('Lỗi!', 'Vui lòng chọn file để upload', 'error');
      return;
    }

    setUploading(true);
    const uploadPromises = selectedFiles.map(async (file, index) => {
      try {
        const formData = new FormData();
        formData.append('file', file);
        
        // Tự động phân loại và hiển thị
        const category = FileClassifier.classifyFile(file.name);
        formData.append('category', category);
        formData.append('description', `Uploaded file: ${file.name} - Category: ${category}`);
        
        setUploadProgress(prev => ({
          ...prev,
          [index]: 0
        }));

        const response = await FileService.upload(formData, (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(prev => ({
            ...prev,
            [index]: progress
          }));
        });

        return response;
      } catch (error) {
        console.error(`Error uploading ${file.name}:`, error);
        return { error: true, fileName: file.name };
      }
    });

    try {
      const results = await Promise.all(uploadPromises);
      const successCount = results.filter(r => r.data?.status).length;
      const errorCount = results.filter(r => r.error).length;

      if (successCount > 0) {
        Swal.fire(
          'Thành công!',
          `Đã upload ${successCount} file thành công${errorCount > 0 ? `, ${errorCount} file thất bại` : ''}`,
          successCount === selectedFiles.length ? 'success' : 'warning'
        );
        loadFiles();
      } else {
        Swal.fire('Lỗi!', 'Không thể upload file nào', 'error');
      }
    } catch (error) {
      console.error('Upload error:', error);
      Swal.fire('Lỗi!', 'Đã xảy ra lỗi khi upload file', 'error');
    } finally {
      setUploading(false);
      setSelectedFiles([]);
      setUploadProgress({});
      // Reset input
      document.getElementById('fileInput').value = '';
    }
  };

  const handleDelete = async (id, fileName) => {
    Swal.fire({
      title: 'Bạn có chắc chắn?',
      text: `Bạn muốn xóa file "${fileName}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await FileService.delete(id);
          if (response.data && response.data.status) {
            Swal.fire('Đã xóa!', 'File đã được xóa thành công.', 'success');
            loadFiles();
          } else {
            Swal.fire('Lỗi!', response.data?.message || 'Không thể xóa file.', 'error');
          }
        } catch (error) {
          console.error('Error deleting file:', error);
          Swal.fire('Lỗi!', 'Đã xảy ra lỗi khi xóa file.', 'error');
        }
      }
    });
  };

  const getFileType = (mimeType) => {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    if (mimeType.includes('pdf')) return 'pdf';
    if (mimeType.includes('word') || mimeType.includes('document')) return 'document';
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return 'spreadsheet';
    return 'other';
  };

  const getFileIcon = (type, fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    
    switch (type) {
      case 'image': return 'fas fa-image text-success';
      case 'video': return 'fas fa-video text-primary';
      case 'audio': return 'fas fa-music text-info';
      case 'pdf': return 'fas fa-file-pdf text-danger';
      case 'document': return 'fas fa-file-word text-primary';
      case 'spreadsheet': return 'fas fa-file-excel text-success';
      default:
        if (['zip', 'rar', '7z'].includes(extension)) return 'fas fa-file-archive text-warning';
        if (['txt', 'log'].includes(extension)) return 'fas fa-file-alt text-secondary';
        return 'fas fa-file text-muted';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url).then(() => {
      Swal.fire({
        title: 'Đã sao chép!',
        text: 'URL đã được sao chép vào clipboard',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });
    });
  };

  const filteredFiles = files.filter(file => {
    const matchesFilter = filter === 'all' || file.type === filter;
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="container-fluid pt-4 px-4">
        <div className="bg-light rounded p-4 text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Đang tải danh sách file...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid pt-4 px-4">
      <div className="row">
        <div className="col-12">
          <div className="bg-light rounded p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="mb-0">Quản lý File Upload</h4>
              <div className="d-flex gap-2">
                <span className="badge bg-primary">Tổng: {files.length} file</span>
                <span className="badge bg-success">
                  Dung lượng: {formatFileSize(files.reduce((total, file) => total + (file.size || 0), 0))}
                </span>
              </div>
            </div>

            {/* Upload Section */}
            <div className="upload-section mb-4">
              <div className="card">
                <div className="card-header">
                  <h5 className="mb-0">
                    <i className="fas fa-cloud-upload-alt me-2"></i>
                    Upload File Mới
                  </h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-8">
                      <input
                        type="file"
                        id="fileInput"
                        className="form-control"
                        multiple
                        onChange={handleFileSelect}
                        accept="*/*"
                      />
                      <small className="form-text text-muted">
                        Hỗ trợ tất cả loại file. Kích thước tối đa: 1GB/file
                      </small>
                    </div>
                    <div className="col-md-4">
                      <button
                        className="btn btn-primary w-100"
                        onClick={handleUpload}
                        disabled={uploading || selectedFiles.length === 0}
                      >
                        {uploading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Đang upload...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-upload me-2"></i>
                            Upload ({selectedFiles.length})
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Upload Progress */}
                  {uploading && Object.keys(uploadProgress).length > 0 && (
                    <div className="mt-3">
                      <h6>Tiến trình upload:</h6>
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="mb-2">
                          <div className="d-flex justify-content-between">
                            <small>{file.name}</small>
                            <small>{uploadProgress[index] || 0}%</small>
                          </div>
                          <div className="progress" style={{ height: '4px' }}>
                            <div
                              className="progress-bar"
                              style={{ width: `${uploadProgress[index] || 0}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Filter and Search */}
            <div className="row mb-4">
              <div className="col-md-6">
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="fas fa-search"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Tìm kiếm file..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <select
                  className="form-select"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all">Tất cả loại file</option>
                  <option value="image">Hình ảnh</option>
                  <option value="video">Video</option>
                  <option value="audio">Audio</option>
                  <option value="pdf">PDF</option>
                  <option value="document">Document</option>
                  <option value="other">Khác</option>
                </select>
              </div>
            </div>

            {/* Files Grid */}
            <div className="files-grid">
              {filteredFiles.length === 0 ? (
                <div className="text-center py-5">
                  <i className="fas fa-folder-open fa-3x text-muted mb-3"></i>
                  <h5 className="text-muted">Không có file nào</h5>
                  <p className="text-muted">Upload file đầu tiên của bạn</p>
                </div>
              ) : (
                <div className="row">
                  {filteredFiles.map((file) => (
                    <div key={file.id} className="col-lg-3 col-md-4 col-sm-6 mb-4">
                      <div className="file-card">
                        <div className="file-preview">
                          {file.type === 'image' ? (
                            <img
                              src={`${fileUrl}/${file.path}`}
                              alt={file.name}
                              className="preview-image"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div className="file-icon" style={{ display: file.type === 'image' ? 'none' : 'flex' }}>
                            <i className={getFileIcon(file.type, file.name)}></i>
                          </div>
                        </div>
                        
                        <div className="file-info">
                          <h6 className="file-name" title={file.name}>
                            {file.name.length > 20 ? file.name.substring(0, 20) + '...' : file.name}
                          </h6>
                          <p className="file-size">{formatFileSize(file.size || 0)}</p>
                          <p className="file-date">
                            {new Date(file.created_at).toLocaleDateString('vi-VN')}
                          </p>
                        </div>

                        <div className="file-actions">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => copyToClipboard(`${fileUrl}/${file.path}`)}
                            title="Sao chép URL"
                          >
                            <i className="fas fa-copy"></i>
                          </button>
                          <a
                            href={`${fileUrl}/${file.path}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-outline-success"
                            title="Xem file"
                          >
                            <i className="fas fa-eye"></i>
                          </a>
                          <a
                            href={`${fileUrl}/${file.path}`}
                            download={file.name}
                            className="btn btn-sm btn-outline-info"
                            title="Tải xuống"
                          >
                            <i className="fas fa-download"></i>
                          </a>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(file.id, file.name)}
                            title="Xóa file"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FileUpload;




