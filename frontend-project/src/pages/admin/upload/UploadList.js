import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import FileService from '../../../services/FileService';
import { fileUrl } from '../../../config';
import Swal from 'sweetalert2';
import './UploadList.css';

function UploadList() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      setLoading(true);
      const response = await FileService.getAll();
      
      if (response && response.success) {
        setFiles(response.files || []);
      }
    } catch (error) {
      console.error('Error loading files:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const selectedFiles = Array.from(event.target.files);
    
    if (selectedFiles.length === 0) return;

    try {
      setUploading(true);
      let successCount = 0;
      let errorCount = 0;
      
      // Hiển thị thông báo đang upload
      const toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true
      });
      
      toast.fire({
        icon: 'info',
        title: 'Đang upload file...'
      });
      
      // Kiểm tra kích thước file
      const maxSize = 1024 * 1024 * 1024; // 1GB (tăng từ 50MB)
      const oversizedFiles = selectedFiles.filter(file => file.size > maxSize);
      
      if (oversizedFiles.length > 0) {
        const fileNames = oversizedFiles.map(f => f.name).join(', ');
        Swal.fire({
          icon: 'warning',
          title: 'File quá lớn',
          html: `Các file sau vượt quá 1GB:<br><strong>${fileNames}</strong><br>Bạn có muốn tiếp tục upload các file còn lại?`,
          showCancelButton: true,
          confirmButtonText: 'Tiếp tục',
          cancelButtonText: 'Hủy'
        }).then((result) => {
          if (result.isConfirmed) {
            // Tiếp tục với các file hợp lệ
            const validFiles = selectedFiles.filter(file => file.size <= maxSize);
            uploadFiles(validFiles);
          } else {
            setUploading(false);
            setUploadProgress(0);
          }
        });
        return;
      }
      
      // Upload tất cả file
      uploadFiles(selectedFiles);
      
    } catch (error) {
      console.error('Error uploading files:', error);
      Swal.fire('Lỗi!', 'Không thể upload file.', 'error');
      setUploading(false);
      setUploadProgress(0);
    }
  };
  
  // Tách hàm upload để tái sử dụng
  const uploadFiles = async (files) => {
    try {
      const response = await FileService.uploadMultiple(files, {
        title: 'Batch upload',
        description: 'Multiple files uploaded'
      });
      
      if (response && response.success) {
        Swal.fire('Thành công!', `Đã upload ${files.length} file thành công.`, 'success');
        loadFiles();
      } else {
        Swal.fire('Cảnh báo!', 'Upload có vẻ không thành công hoàn toàn.', 'warning');
      }
      
    } catch (error) {
      console.error('Batch upload failed:', error);
    }
    
    setUploading(false);
    setUploadProgress(0);
  };

  const handleDelete = async (id, filename) => {
    if (!id) {
      Swal.fire('Lỗi!', 'Không thể xóa file này (ID không hợp lệ).', 'error');
      return;
    }

    const result = await Swal.fire({
      title: 'Xác nhận xóa?',
      text: `Bạn có chắc muốn xóa file "${formatFileName(filename)}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy'
    });

    if (result.isConfirmed) {
      try {
        console.log('Attempting to delete file with ID:', id);
        const response = await FileService.delete(id);
        console.log('Delete response:', response);
        
        if (response && (response.status === 200 || response.data?.success || response.data?.status)) {
          Swal.fire('Đã xóa!', 'File đã được xóa thành công.', 'success');
          loadFiles();
        } else {
          Swal.fire('Lỗi!', response?.data?.message || 'Không thể xóa file.', 'error');
        }
      } catch (error) {
        console.error('Error deleting file:', error);
        const errorMessage = error.response?.data?.message || error.message || 'Không thể xóa file.';
        Swal.fire('Lỗi!', errorMessage, 'error');
      }
    }
  };

  const handleViewFile = (file) => {
    const fileUrl = getFileUrl(file);
    if (fileUrl && fileUrl !== '#') {
      window.open(fileUrl, '_blank');
    } else {
      Swal.fire('Lỗi!', 'Không thể mở file này.', 'error');
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0 || isNaN(bytes)) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    if (i >= sizes.length || i < 0) return `${bytes} Bytes`;
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (filename) => {
    if (!filename) return 'fa-file';
    
    const ext = filename.toLowerCase().split('.').pop();
    
    const iconMap = {
      // Images
      'jpg': 'fa-file-image',
      'jpeg': 'fa-file-image', 
      'png': 'fa-file-image',
      'gif': 'fa-file-image',
      'bmp': 'fa-file-image',
      'svg': 'fa-file-image',
      
      // Documents
      'pdf': 'fa-file-pdf',
      'doc': 'fa-file-word',
      'docx': 'fa-file-word',
      'xls': 'fa-file-excel',
      'xlsx': 'fa-file-excel',
      'ppt': 'fa-file-powerpoint',
      'pptx': 'fa-file-powerpoint',
      'txt': 'fa-file-alt',
      
      // Archives
      'zip': 'fa-file-archive',
      'rar': 'fa-file-archive',
      '7z': 'fa-file-archive',
      'tar': 'fa-file-archive',
      'gz': 'fa-file-archive',
      
      // Code
      'js': 'fa-file-code',
      'html': 'fa-file-code',
      'css': 'fa-file-code',
      'php': 'fa-file-code',
      'py': 'fa-file-code',
      'java': 'fa-file-code',
      
      // Video
      'mp4': 'fa-file-video',
      'avi': 'fa-file-video',
      'mov': 'fa-file-video',
      'wmv': 'fa-file-video',
      
      // Audio
      'mp3': 'fa-file-audio',
      'wav': 'fa-file-audio',
      'flac': 'fa-file-audio'
    };
    
    return iconMap[ext] || 'fa-file';
  };

  const getFileName = (file) => {
    const fileName = file?.original_name || file?.name || file?.filename || 'Không có tên';
    // Decode UTF-8 nếu bị encode sai
    try {
      return decodeURIComponent(escape(fileName));
    } catch (e) {
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

  const getFileUrl = (file) => {
    if (!file) return '#';
    
    const filename = file.filename || file.name || file.path;
    if (!filename) return '#';
    
    // Nếu đã là URL đầy đủ
    if (filename.startsWith('http')) {
      return filename;
    }
    
    // Nếu là đường dẫn tương đối
    if (filename.startsWith('/')) {
      return `http://localhost:5000${filename}`;
    }
    
    // Trường hợp mặc định
    return `${fileUrl}/${filename}`;
  };

  if (loading) {
    return (
      <div className="container-fluid">
        <div className="d-flex justify-content-center py-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid pt-4 px-4 upload-container">
      <div className="row">
        <div className="col-12">
          <div className="bg-light rounded p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="mb-0">Quản lý File Upload</h4>
              <div>
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                  id="fileInput"
                  accept="*/*"
                />
                <button 
                  className="btn btn-primary mb-3" 
                  onClick={() => document.getElementById('fileInput').click()}
                >
                  <i className="fas fa-plus me-2"></i>
                  UPLOAD FILE MỚI
                </button>
              </div>
            </div>

            {/* Upload Progress */}
            {uploading && (
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span>Đang upload...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="progress">
                  <div 
                    className="progress-bar progress-bar-striped progress-bar-animated" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* File Info */}
            <div className="row mb-3">
              <div className="col-md-6">
                <small className="text-muted">
                  Chọn tệp: <strong>không có tệp được chọn</strong>
                </small>
              </div>
              <div className="col-md-6 text-end">
                <small className="text-muted">
                  Chấp nhận: JPG, PNG, PDF, DOC, XLS, ZIP...
                </small>
              </div>
            </div>

            {/* Files Table */}
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead className="table-primary">
                  <tr>
                    <th style={{ width: '50px' }}>#</th>
                    <th style={{ width: '60px' }}>ICON</th>
                    <th>TÊN FILE</th>
                    <th style={{ width: '120px' }}>KÍCH THƯỚC</th>
                    <th style={{ width: '150px' }}>NGÀY UPLOAD</th>
                    <th style={{ width: '100px' }}>THAO TÁC</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="text-center py-4">
                        <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        <div className="mt-2">Đang tải danh sách file...</div>
                      </td>
                    </tr>
                  ) : files.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-4 text-muted">
                        <i className="fas fa-folder-open fa-3x mb-3 d-block"></i>
                        Chưa có file nào được upload
                      </td>
                    </tr>
                  ) : (
                    files.map((file, index) => (
                      <tr key={file.id || index}>
                        <td>{index + 1}</td>
                        <td className="text-center">
                          <i className={`fas ${getFileIcon(file.filename || file.original_name || file.name)} fa-2x text-primary`}></i>
                        </td>
                        <td>
                          <div>
                            <strong>{formatFileName(file.original_name || file.filename || file.name || 'Unknown')}</strong>
                            {file.title && (
                              <div className="small text-muted">
                                {file.title}
                              </div>
                            )}
                          </div>
                        </td>
                        <td>
                          <span className="badge bg-info">
                            {formatFileSize(file.file_size || file.size || file.fileSize || 0)}
                          </span>
                        </td>
                        <td>
                          <small className="text-muted">
                            {file.createdAt ? new Date(file.createdAt).toLocaleDateString('vi-VN') : 
                             file.created_at ? new Date(file.created_at).toLocaleDateString('vi-VN') : 'N/A'}
                          </small>
                        </td>
                        <td>
                          <div className="btn-group" role="group">
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => handleViewFile(file)}
                              title="Xem file"
                            >
                              <i className="fas fa-eye"></i>
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDelete(file.id, file.filename || file.original_name || file.name)}
                              title="Xóa file"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Summary */}
            {files.length > 0 && (
              <div className="mt-3 text-muted">
                <small>
                  Tổng cộng: <strong>{files.length}</strong> file | 
                  Dung lượng: <strong>{formatFileSize(files.reduce((total, file) => {
                    const fileSize = file.file_size || file.size || file.fileSize || 0;
                    return total + (parseInt(fileSize) || 0);
                  }, 0))}</strong>
                </small>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UploadList;













































