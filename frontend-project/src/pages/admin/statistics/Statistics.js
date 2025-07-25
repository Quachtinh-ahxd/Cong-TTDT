import React, { useState, useEffect } from 'react';
import DashboardService from '../../../services/DashboardService';
import './Statistics.css';

function Statistics() {
  const [stats, setStats] = useState({});
  const [detailedStats, setDetailedStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [basicStats, detailedStatsRes] = await Promise.all([
        DashboardService.getStats(),
        DashboardService.getDetailedStats()
      ]);
      setStats(basicStats);
      setDetailedStats(detailedStatsRes);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statsData = [
    { label: 'Bài viết', value: stats.products || 0, color: 'primary', icon: 'fas fa-newspaper' },
    { label: 'Chuyên mục', value: stats.categories || 0, color: 'warning', icon: 'fas fa-list' },
    { label: 'Tác giả', value: stats.brands || 0, color: 'info', icon: 'fas fa-user-edit' },
    { label: 'Người dùng', value: stats.users || 0, color: 'success', icon: 'fas fa-users' },
    { label: 'Bài đăng', value: stats.posts || 0, color: 'danger', icon: 'fas fa-file-alt' },
    { label: 'Banner', value: stats.banners || 0, color: 'secondary', icon: 'fas fa-image' },
    { label: 'Files', value: stats.files || 0, color: 'dark', icon: 'fas fa-folder' }
  ];

  const errorStats = stats.errors ? Object.values(stats.errors).reduce((sum, val) => sum + val, 0) : 0;
  const total = statsData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="container-fluid">
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 text-gray-800">Thống kê chi tiết</h1>
      </div>

      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
        </div>
      ) : (
        <>
          {/* Error Stats */}
          <div className="row mb-4">
            <div className="col-lg-3 col-md-6">
              <div className="card border-left-danger shadow h-100 py-2">
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                      <div className="text-xs font-weight-bold text-danger text-uppercase mb-1">
                        Lỗi kết nối API
                      </div>
                      <div className="h5 mb-0 font-weight-bold text-gray-800">
                        {errorStats}
                      </div>
                    </div>
                    <div className="col-auto">
                      <i className="fas fa-exclamation-triangle fa-2x text-gray-300"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="card border-left-warning shadow h-100 py-2">
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                      <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                        Bài viết chờ duyệt
                      </div>
                      <div className="h5 mb-0 font-weight-bold text-gray-800">
                        {detailedStats.products?.pending || 0}
                      </div>
                    </div>
                    <div className="col-auto">
                      <i className="fas fa-clock fa-2x text-gray-300"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="card border-left-success shadow h-100 py-2">
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                      <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                        Bài viết đã duyệt
                      </div>
                      <div className="h5 mb-0 font-weight-bold text-gray-800">
                        {detailedStats.products?.approved || 0}
                      </div>
                    </div>
                    <div className="col-auto">
                      <i className="fas fa-check-circle fa-2x text-gray-300"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="card border-left-danger shadow h-100 py-2">
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                      <div className="text-xs font-weight-bold text-danger text-uppercase mb-1">
                        Bài viết bị từ chối
                      </div>
                      <div className="h5 mb-0 font-weight-bold text-gray-800">
                        {detailedStats.products?.rejected || 0}
                      </div>
                    </div>
                    <div className="col-auto">
                      <i className="fas fa-times-circle fa-2x text-gray-300"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Existing stats cards */}
          <div className="row">
            {statsData.map((item, index) => (
              <div key={index} className="col-xl-3 col-md-6 mb-4">
                <div className={`card border-left-${item.color} shadow h-100 py-2`}>
                  <div className="card-body">
                    <div className="row no-gutters align-items-center">
                      <div className="col mr-2">
                        <div className={`text-xs font-weight-bold text-${item.color} text-uppercase mb-1`}>
                          {item.label}
                        </div>
                        <div className="h5 mb-0 font-weight-bold text-gray-800">
                          {loading ? '...' : item.value.toLocaleString()}
                        </div>
                      </div>
                      <div className="col-auto">
                        <i className={`${item.icon} fa-2x text-gray-300`}></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary Table */}
          <div className="row">
            <div className="col-lg-8">
              <div className="card shadow mb-4">
                <div className="card-header py-3">
                  <h6 className="m-0 font-weight-bold text-primary">Chi tiết thống kê</h6>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>Danh mục</th>
                          <th>Số lượng</th>
                          <th>Tỷ lệ %</th>
                          <th>Trạng thái</th>
                        </tr>
                      </thead>
                      <tbody>
                        {statsData.map((item, index) => (
                          <tr key={index}>
                            <td>
                              <i className={`${item.icon} me-2 text-${item.color}`}></i>
                              {item.label}
                            </td>
                            <td className="font-weight-bold">{item.value.toLocaleString()}</td>
                            <td>
                              <div className="progress" style={{height: '20px'}}>
                                <div 
                                  className={`progress-bar bg-${item.color}`}
                                  style={{width: `${total > 0 ? (item.value / total * 100) : 0}%`}}
                                >
                                  {total > 0 ? ((item.value / total * 100).toFixed(1)) : 0}%
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className={`badge bg-${item.value > 0 ? 'success' : 'secondary'}`}>
                                {item.value > 0 ? 'Có dữ liệu' : 'Trống'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="card shadow mb-4">
                <div className="card-header py-3">
                  <h6 className="m-0 font-weight-bold text-primary">Tổng quan</h6>
                </div>
                <div className="card-body text-center">
                  <div className="mb-3">
                    <h2 className="text-primary">{total.toLocaleString()}</h2>
                    <p className="text-muted">Tổng số bản ghi</p>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-6">
                      <h5 className="text-success">{statsData.filter(item => item.value > 0).length}</h5>
                      <small className="text-muted">Có dữ liệu</small>
                    </div>
                    <div className="col-6">
                      <h5 className="text-warning">{statsData.filter(item => item.value === 0).length}</h5>
                      <small className="text-muted">Trống</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Statistics;






