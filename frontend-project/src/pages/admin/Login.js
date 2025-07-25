import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Login.css';
import httpAxios from '../../httpAxios';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Lấy đường dẫn trước đó từ state, nếu không có thì mặc định là /admin
  const from = location.state?.from?.pathname || "/admin";
  
  // Kiểm tra nếu đã đăng nhập thì chuyển hướng theo vai trò
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (token && user) {
      if (user.roles === 'admin' || user.roles === 'editor') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: username,
          password: password
        })
      });
      
      const data = await response.json();
      console.log('Login response:', data);
      
      // Sửa điều kiện kiểm tra - kiểm tra token thay vì status
      if (data.token && data.user) {
        // Lưu token thật từ API
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        console.log('Login successful with real token');
        console.log('Token:', data.token);
        console.log('User:', data.user);
        
        // Kiểm tra vai trò và chuyển hướng
        if (data.user.roles === 'admin' || data.user.roles === 'editor') {
          navigate('/admin');
        } else {
          navigate('/'); // Chuyển về trang chủ cho người dùng thường
        }
      } else {
        setError(data.message || 'Đăng nhập thất bại');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Đăng nhập thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Đăng nhập hệ thống quản trị</h2>
        
        {error && (
          <div className="alert" role="alert">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Tên đăng nhập</label>
            <div className="input-with-icon">
              <i className="fas fa-user"></i>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <div className="input-with-icon">
              <i className="fas fa-lock"></i>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="forgot-password">
            <a href="#">Quên mật khẩu?</a>
          </div>
          
          <button
            type="submit"
            className="login-btn"
            disabled={loading}
          >
            {loading ? 'Đang xử lý...' : 'Đăng nhập'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;










