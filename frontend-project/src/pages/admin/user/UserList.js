import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import UserService from '../../../services/UserService';
import Swal from 'sweetalert2';
import './UserList.css';
import ImageWithFallback from '../../../components/common/ImageWithFallback';

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Di chuyển loadUsers ra ngoài useEffect
  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('=== Loading users ===');
      const response = await UserService.getAll();
      
      console.log('=== USER LIST RESPONSE DEBUG ===');
      console.log('Full response:', response);
      console.log('Response status:', response?.status);
      console.log('Response data:', response?.data);
      console.log('Response data type:', typeof response?.data);
      
      let usersData = [];
      
      // Handle different response formats
      if (response?.data?.success && Array.isArray(response.data.data)) {
        usersData = response.data.data;
        console.log('Using response.data.data (success format)');
      } else if (response?.data?.users && Array.isArray(response.data.users)) {
        usersData = response.data.users;
        console.log('Using response.data.users');
      } else if (Array.isArray(response?.data)) {
        usersData = response.data;
        console.log('Using response.data directly');
      } else if (Array.isArray(response)) {
        usersData = response;
        console.log('Using response directly');
      } else {
        console.error('Unknown response format:', response);
        usersData = [];
      }
      
      console.log('Users extracted:', usersData.length);
      console.log('Sample user:', usersData[0]);
      console.log('=== END USER LIST DEBUG ===');
      
      console.log('=== USER IMAGE DEBUG ===');
      console.log('Sample user full data:', JSON.stringify(usersData[0], null, 2));
      console.log('User image field:', usersData[0]?.image);
      console.log('User image type:', typeof usersData[0]?.image);
      
      // Kiểm tra tất cả users có image
      usersData.forEach((user, index) => {
        console.log(`User ${index + 1} (${user.name}):`, {
          id: user.id,
          image: user.image,
          imageType: typeof user.image
        });
      });
      console.log('=== END USER IMAGE DEBUG ===');
      
      setUsers(usersData);
      
    } catch (error) {
      console.error('Error loading users:', error);
      console.error('Error response:', error.response);
      console.error('Error response data:', error.response?.data);
      
      let errorMessage = 'Không thể tải danh sách người dùng';
      
      if (error.response?.status === 401) {
        errorMessage = 'Bạn không có quyền truy cập danh sách người dùng';
      } else if (error.response?.status === 403) {
        errorMessage = 'Quyền truy cập bị từ chối';
      } else if (error.response?.status === 404) {
        errorMessage = 'API không tìm thấy';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      setError(errorMessage);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Hàm xử lý xóa người dùng
  const handleDelete = (id, name) => {
    Swal.fire({
      title: 'Bạn có chắc chắn?',
      text: `Bạn muốn xóa người dùng "${name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await UserService.delete(id);
          if (response.status) {
            Swal.fire('Đã xóa!', 'Người dùng đã được xóa thành công.', 'success');
            // Tải lại danh sách người dùng
            loadUsers();
          } else {
            Swal.fire('Lỗi!', 'Không thể xóa người dùng.', 'error');
          }
        } catch (error) {
          console.error('Error deleting user:', error);
          Swal.fire('Lỗi!', 'Đã xảy ra lỗi khi xóa người dùng.', 'error');
        }
      }
    });
  };

  // Hàm xử lý thay đổi trạng thái người dùng
  const handleChangeStatus = async (id) => {
    try {
      const response = await UserService.changeStatus(id);
      if (response.status) {
        // Tải lại danh sách người dùng
        loadUsers();
        Swal.fire('Thành công!', 'Đã thay đổi trạng thái người dùng.', 'success');
      } else {
        Swal.fire('Lỗi!', 'Không thể thay đổi trạng thái người dùng.', 'error');
      }
    } catch (error) {
      console.error('Error changing user status:', error);
      Swal.fire('Lỗi!', 'Đã xảy ra lỗi khi thay đổi trạng thái người dùng.', 'error');
    }
  };

  // Hiển thị trạng thái người dùng
  const renderStatus = (status) => {
    if (status === 1) {
      return <span className="badge bg-success">Hoạt động</span>;
    } else {
      return <span className="badge bg-danger">Bị khóa</span>;
    }
  };

  const getUserImageUrl = (imagePath) => {
    if (!imagePath || imagePath === 'placeholder.svg') {
      return null;
    }

    // Kiểm tra nếu đã là URL đầy đủ
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }

    // Xử lý đường dẫn ảnh - chỉ lấy tên file
    const fileName = imagePath.toString().replace(/^.*[\\\/]/, '');
    
    // Đường dẫn ảnh user theo cấu trúc backend
    const imageUrl = `http://localhost:5000/public/images/user/${fileName}`;
    
    console.log('=== User Image URL Debug ===');
    console.log('Original imagePath:', imagePath);
    console.log('Processed fileName:', fileName);
    console.log('Final imageUrl:', imageUrl);
    
    return imageUrl;
  };

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="page-title">Quản lý người dùng</h2>
        <Link to="/admin/users/create" className="btn btn-primary">
          <i className="fas fa-plus-circle me-2"></i>Thêm người dùng
        </Link>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
          <p className="mt-2">Đang tải dữ liệu...</p>
        </div>
      ) : (
        <div className="card">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th style={{ width: '50px' }}>ID</th>
                    <th style={{ width: '100px' }}>Hình ảnh</th>
                    <th>Tên</th>
                    <th>Email</th>
                    <th>Vai trò</th>
                    <th>Trạng thái</th>
                    <th style={{ width: '150px' }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length > 0 ? (
                    users.map((user) => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>
                          {user.image ? (
                            <ImageWithFallback
                              type="user"
                              filename={user.image}
                              alt={user.name}
                              className="rounded"
                              style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                            />
                          ) : (
                            <div className="bg-light rounded d-flex align-items-center justify-content-center"
                                 style={{ width: '50px', height: '50px' }}>
                              <i className="fa fa-user text-muted"></i>
                            </div>
                          )}
                        </td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>
                          {user.roles === 'admin' ? 'Quản trị viên' : 
                           user.roles === 'editor' ? 'Biên tập viên' : 'Người dùng'}
                        </td>
                        <td>{renderStatus(user.status)}</td>
                        <td>
                          <div className="btn-group">
                            <Link to={`/admin/users/show/${user.id}`} className="btn btn-sm btn-primary">
                              <i className="fas fa-eye"></i>
                            </Link>
                            <Link to={`/admin/users/edit/${user.id}`} className="btn btn-sm btn-info">
                              <i className="fas fa-edit"></i>
                            </Link>
                            <button 
                              className="btn btn-sm btn-warning" 
                              onClick={() => handleChangeStatus(user.id)}
                            >
                              <i className="fas fa-sync-alt"></i>
                            </button>
                            <button 
                              className="btn btn-sm btn-danger" 
                              onClick={() => handleDelete(user.id, user.name)}
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center">Không có người dùng nào</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserList;



