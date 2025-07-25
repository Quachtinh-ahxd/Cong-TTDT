import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import TopicService from '../../../services/TopicService';
import Swal from 'sweetalert2';
import './TopicShow.css';

function TopicShow() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [topic, setTopic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchTopic = async () => {
      try {
        setLoading(true);
        const response = await TopicService.getById(id);
        
        if (response.status) {
          setTopic(response.topic);
        } else {
          setError(response.message || 'Không thể tải thông tin chủ đề');
        }
      } catch (error) {
        console.error('Error fetching topic:', error);
        setError('Đã xảy ra lỗi khi tải thông tin chủ đề');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTopic();
  }, [id]);
  
  // Hiển thị trạng thái chủ đề
  const renderStatus = (status) => {
    if (status === 1) {
      return <span className="badge bg-success">Xuất bản</span>;
    } else if (status === 2) {
      return <span className="badge bg-warning">Chưa xuất bản</span>;
    } else {
      return <span className="badge bg-danger">Đã xóa</span>;
    }
  };
  
  if (loading) {
    return (
      <div className="container-fluid">
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
          <p className="mt-2">Đang tải thông tin chủ đề...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container-fluid">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/admin/topics')}
        >
          Quay lại danh sách
        </button>
      </div>
    );
  }
  
  if (!topic) {
    return (
      <div className="container-fluid">
        <div className="alert alert-warning" role="alert">
          Không tìm thấy thông tin chủ đề
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/admin/topics')}
        >
          Quay lại danh sách
        </button>
      </div>
    );
  }
  
  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="page-title">Chi tiết chủ đề</h2>
        <div>
          <Link to={`/admin/topics/edit/${topic.id}`} className="btn btn-warning me-2">
            <i className="fas fa-edit me-1"></i> Chỉnh sửa
          </Link>
          <button 
            className="btn btn-secondary"
            onClick={() => navigate('/admin/topics')}
          >
            <i className="fas fa-arrow-left me-1"></i> Quay lại
          </button>
        </div>
      </div>
      
      <div className="card">
        <div className="card-header">
          <h5 className="card-title mb-0">Thông tin chủ đề</h5>
        </div>
        <div className="card-body">
          <table className="table table-bordered detail-table">
            <tbody>
              <tr>
                <th style={{ width: '30%' }}>ID</th>
                <td>{topic.id}</td>
              </tr>
              <tr>
                <th>Tên chủ đề</th>
                <td>{topic.name}</td>
              </tr>
              <tr>
                <th>Slug</th>
                <td>{topic.slug}</td>
              </tr>
              <tr>
                <th>Mô tả</th>
                <td>{topic.description || 'Không có mô tả'}</td>
              </tr>
              <tr>
                <th>Trạng thái</th>
                <td>{renderStatus(topic.status)}</td>
              </tr>
              <tr>
                <th>Ngày tạo</th>
                <td>{new Date(topic.created_at).toLocaleString()}</td>
              </tr>
              <tr>
                <th>Cập nhật lần cuối</th>
                <td>{new Date(topic.updated_at).toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default TopicShow;