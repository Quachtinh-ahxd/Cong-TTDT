import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import UserService from '../../../services/UserService';
import ImageWithFallback from '../../../components/common/ImageWithFallback';
import Swal from 'sweetalert2';

function UserShow() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadUser();
  }, [id]);

  const loadUser = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await UserService.getById(id);
      
      if (response?.data?.success && response.data.data) {
        setUser(response.data.data);
      } else if (response?.data) {
        setUser(response.data);
      } else {
        setError('Không tìm thấy thông tin người dùng');
      }
      
    } catch (error) {
      console.error('Error loading user:', error);
      setError('Đã xảy ra lỗi khi tải thông tin người dùng');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const result = await Swal.fire({
        title: 'Xác nhận xóa',
        text: `Bạn có chắc chắn muốn xóa người dùng "${user.name}"?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Hủy'
      });

      if (result.isConfirmed) {
        const response = await UserService.delete(id);
        
        if (response.success || response.status) {
          Swal.fire('Đã xóa!', 'Người dùng đã được xóa thành công.', 'success');
          navigate('/admin/users');
        } else {
          Swal.fire('Lỗi!', response.message || 'Không thể xóa người dùng.', 'error');
        }
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      Swal.fire('Lỗi!', 'Đã xảy ra lỗi khi xóa người dùng.', 'error');
    }
  };

  const renderStatus = (status) => {
    if (status === 1 || status === '1' || status === 'active') {
      return <span className="badge bg-success">Hoạt động</span>;
    }
    return <span className="badge bg-danger">Không hoạt động</span>;
  };

  const renderRole = (role) => {
    const roleColors = {
      'admin': 'bg-danger',
      'manager': 'bg-warning', 
      'user': 'bg-primary',
      'customer': 'bg-info'
    };
    
    const roleNames = {
      'admin': 'Quản trị viên',
      'manager': 'Quản lý',
      'user': 'Người dùng',
      'customer': 'Khách hàng'
    };

    return (
      <span className={`badge ${roleColors[role] || 'bg-secondary'}`}>
        {roleNames[role] || role}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="container-fluid">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
          <p className="mt-2">Đang tải thông tin người dùng...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid">
        <div className="alert alert-danger">
          <i className="fa fa-exclamation-triangle me-2"></i>
          {error}
          <div className="mt-3">
            <Link to="/admin/users" className="btn btn-secondary">
              <i className="fa fa-arrow-left me-2"></i>
              Quay lại danh sách
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container-fluid">
        <div className="alert alert-warning">
          Không tìm thấy thông tin người dùng.
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Chi tiết người dùng #{user.id}</h3>
              <div className="card-tools">
                <Link to="/admin/users" className="btn btn-secondary me-2">
                  <i className="fa fa-arrow-left me-2"></i>
                  Quay lại
                </Link>
                <Link 
                  to={`/admin/users/edit/${user.id}`} 
                  className="btn btn-warning me-2"
                >
                  <i className="fa fa-edit me-2"></i>
                  Chỉnh sửa
                </Link>
                <button 
                  className="btn btn-danger"
                  onClick={handleDelete}
                >
                  <i className="fa fa-trash me-2"></i>
                  Xóa
                </button>
              </div>
            </div>

            <div className="card-body">
              <div className="row">
                <div className="col-md-4">
                  <div className="text-center">
                    {user.image ? (
                      <ImageWithFallback
                        type="user"
                        filename={user.image}
                        alt={user.name}
                        className="img-fluid rounded"
                        style={{ maxWidth: '300px', maxHeight: '300px' }}
                      />
                    ) : (
                      <div 
                        className="bg-light rounded d-flex align-items-center justify-content-center mx-auto"
                        style={{ width: '200px', height: '200px' }}
                      >
                        <i className="fa fa-user fa-5x text-muted"></i>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="col-md-8">
                  <table className="table table-borderless">
                    <tbody>
                      <tr>
                        <td><strong>ID:</strong></td>
                        <td>#{user.id}</td>
                      </tr>
                      <tr>
                        <td><strong>Tên:</strong></td>
                        <td>{user.name}</td>
                      </tr>
                      {user.username && (
                        <tr>
                          <td><strong>Username:</strong></td>
                          <td>@{user.username}</td>
                        </tr>
                      )}
                      <tr>
                        <td><strong>Email:</strong></td>
                        <td>{user.email}</td>
                      </tr>
                      {user.phone && (
                        <tr>
                          <td><strong>Số điện thoại:</strong></td>
                          <td>{user.phone}</td>
                        </tr>
                      )}
                      <tr>
                        <td><strong>Vai trò:</strong></td>
                        <td>{renderRole(user.roles || user.role)}</td>
                      </tr>
                      <tr>
                        <td><strong>Trạng thái:</strong></td>
                        <td>{renderStatus(user.status)}</td>
                      </tr>
                      {user.created_at && (
                        <tr>
                          <td><strong>Ngày tạo:</strong></td>
                          <td>{new Date(user.created_at).toLocaleDateString('vi-VN')}</td>
                        </tr>
                      )}
                      {user.updated_at && (
                        <tr>
                          <td><strong>Cập nhật lần cuối:</strong></td>
                          <td>{new Date(user.updated_at).toLocaleDateString('vi-VN')}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserShow;

