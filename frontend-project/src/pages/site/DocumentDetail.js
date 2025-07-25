import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FileService from '../../services/FileService';
import { fileUrl } from '../../config';

const DocumentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fileError, setFileError] = useState(false);

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return 'N/A';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
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

  const getFileExtension = (filename) => {
    if (!filename) return 'N/A';
    return filename.split('.').pop()?.toUpperCase() || 'N/A';
  };

  const getFileUrl = (doc) => {
    if (!doc) return null;
    
    const filename = doc.path || doc.filename || doc.name;
    if (!filename) return null;
    
    // Nếu đã là URL đầy đủ
    if (filename.startsWith('http')) {
      return filename;
    }
    
    // Loại bỏ dấu / ở đầu nếu có
    const cleanFilename = filename.startsWith('/') ? filename.substring(1) : filename;
    
    return `${fileUrl}/${cleanFilename}`;
  };

  useEffect(() => {
    loadDocument();
  }, [id]);

  useEffect(() => {
    if (document) {
      console.log('Document structure:', document);
      console.log('File path:', document.path || document.filename);
      console.log('Full URL:', `${fileUrl}/${document.path || document.filename}`);
    }
  }, [document]);

  const loadDocument = async () => {
    try {
      setLoading(true);
      const response = await FileService.getById(id);
      console.log('Document response:', response);
      
      if (response && response.data && response.data.success) {
        setDocument(response.data.file);
      } else if (response && response.data) {
        setDocument(response.data);
      }
    } catch (error) {
      console.error('Error loading document:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const downloadUrl = `${fileUrl}/${document.path || document.filename}`;
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = document.original_name || document.name || document.filename;
    link.click();
  };

  const handleIframeError = () => {
    setFileError(true);
  };

  const handleViewFile = () => {
    const viewUrl = `${fileUrl}/${document.path || document.filename}`;
    window.open(viewUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">Không tìm thấy tài liệu</div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-lg-8">
          <div className="card">
            <div className="card-header">
              <h3>{document.original_name}</h3>
            </div>
            <div className="card-body">
              <div className="row mb-4">
                <div className="col-md-6">
                  <p><strong>Kích thước:</strong> {formatFileSize(document.size || document.file_size)}</p>
                  <p><strong>Loại file:</strong> {getFileExtension(document.original_name || document.filename || document.name)}</p>
                  <p><strong>Ngày tải lên:</strong> {formatDate(document.created_at || document.createdAt)}</p>
                </div>
                <div className="col-md-6">
                  <p><strong>Mô tả:</strong> {document.description || 'Multiple files uploaded'}</p>
                </div>
              </div>
              
              <div className="text-center">
                {!fileError && getFileUrl(document) ? (
                  <iframe 
                    src={getFileUrl(document)}
                    width="100%" 
                    height="600px"
                    style={{ border: 'none' }}
                    title={document.original_name || document.name}
                    onError={handleIframeError}
                  />
                ) : (
                  <div className="file-preview-error p-5">
                    <i className="fas fa-file-alt fa-5x text-muted mb-3"></i>
                    <h5>Không thể xem trước file</h5>
                    <p className="text-muted">File có thể không hỗ trợ xem trước hoặc không tồn tại</p>
                    <button className="btn btn-primary" onClick={handleViewFile}>
                      <i className="fas fa-external-link-alt me-2"></i>
                      Mở file trong tab mới
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="card-footer">
              <button className="btn btn-primary me-2" onClick={handleDownload}>
                <i className="fas fa-download me-2"></i>Tải xuống
              </button>
              <button className="btn btn-secondary me-2" onClick={handleViewFile}>
                <i className="fas fa-eye me-2"></i>Xem file
              </button>
              <button className="btn btn-secondary" onClick={() => navigate(-1)}>
                <i className="fas fa-arrow-left me-2"></i>Quay lại
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentDetail;











