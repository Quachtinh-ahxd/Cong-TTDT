import React from 'react';
import './TrungDoanVaCoQuan.css';

const TrungDoanVaCoQuan = () => {
  const coQuanDonVi = [
    {
      id: 1,
      name: 'Ban Chỉ huy Trung đoàn',
      description: 'Cơ quan chỉ huy cao nhất của Trung đoàn, chịu trách nhiệm lãnh đạo, chỉ đạo toàn bộ hoạt động',
      icon: 'fas fa-crown',
      color: '#dc3545',
      functions: [
        'Lãnh đạo, chỉ đạo toàn diện',
        'Xây dựng kế hoạch chiến lược',
        'Quản lý nhân sự cấp cao',
        'Đối ngoại và hợp tác'
      ]
    },
    {
      id: 2,
      name: 'Phòng Chính trị',
      description: 'Cơ quan tham mưu về công tác chính trị, tư tưởng và giáo dục truyền thống',
      icon: 'fas fa-flag',
      color: '#28a745',
      functions: [
        'Công tác chính trị tư tưởng',
        'Giáo dục truyền thống',
        'Tuyên truyền cổ động',
        'Công tác Đảng, Đoàn thể'
      ]
    },
    {
      id: 3,
      name: 'Phòng Tham mưu',
      description: 'Cơ quan tham mưu về tác chiến, huấn luyện và sẵn sàng chiến đấu',
      icon: 'fas fa-chess-knight',
      color: '#007bff',
      functions: [
        'Tham mưu tác chiến',
        'Kế hoạch huấn luyện',
        'Sẵn sàng chiến đấu',
        'Phối hợp tác chiến'
      ]
    },
    {
      id: 4,
      name: 'Phòng Kỹ thuật',
      description: 'Quản lý, bảo dưỡng và vận hành các thiết bị kỹ thuật Ra đa',
      icon: 'fas fa-cogs',
      color: '#fd7e14',
      functions: [
        'Bảo dưỡng thiết bị Ra đa',
        'Kỹ thuật viễn thông',
        'Quản lý vũ khí trang bị',
        'Đào tạo kỹ thuật'
      ]
    },
    {
      id: 5,
      name: 'Phòng Hậu cần',
      description: 'Đảm bảo hậu cần, tài chính và đời sống cho toàn Trung đoàn',
      icon: 'fas fa-truck',
      color: '#6f42c1',
      functions: [
        'Cung ứng hậu cần',
        'Quản lý tài chính',
        'Y tế quân y',
        'Đời sống cán bộ chiến sĩ'
      ]
    },
    {
      id: 6,
      name: 'Các Tiểu đoàn Ra đa',
      description: 'Đơn vị tác chiến trực tiếp, thực hiện nhiệm vụ phát hiện và theo dõi mục tiêu',
      icon: 'fas fa-satellite-dish',
      color: '#20c997',
      functions: [
        'Phát hiện mục tiêu hàng không',
        'Theo dõi và dẫn đường',
        'Cảnh báo sớm',
        'Phối hợp tác chiến'
      ]
    }
  ];

  return (
    <div className="trung-doan-co-quan-page">
      {/* Header */}
      <div className="page-header">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h1 className="page-title">
                <i className="fas fa-sitemap me-3"></i>
                Trung đoàn và Cơ quan đơn vị
              </h1>
              <p className="page-subtitle">
                Cơ cấu tổ chức và chức năng nhiệm vụ của Trung đoàn Ra đa 290
              </p>
            </div>
            <div className="col-md-4 text-end">
              <div className="org-badge">
                <div className="badge-icon">
                  <i className="fas fa-users"></i>
                </div>
                <div className="badge-text">
                  <span>Tổ chức</span>
                  <small>Vững mạnh</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-5">
        {/* Giới thiệu chung */}
        <div className="intro-section mb-5">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="intro-content">
                <h2 className="section-title">Cơ cấu tổ chức</h2>
                <p className="intro-text">
                  Trung đoàn Ra đa 290 được tổ chức theo mô hình hiện đại, đảm bảo tính thống nhất 
                  trong chỉ huy và hiệu quả trong tác chiến. Mỗi cơ quan, đơn vị đều có chức năng, 
                  nhiệm vụ cụ thể, phối hợp chặt chẽ để hoàn thành xuất sắc mọi nhiệm vụ được giao.
                </p>
                <div className="stats-row">
                  <div className="stat-item">
                    <span className="stat-number">6</span>
                    <span className="stat-label">Cơ quan chính</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">100%</span>
                    <span className="stat-label">Sẵn sàng chiến đấu</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="org-chart-visual">
                <div className="chart-container">
                  <div className="org-level level-1">
                    <div className="org-box commander">Ban Chỉ huy</div>
                  </div>
                  <div className="org-level level-2">
                    <div className="org-box political">Phòng CT</div>
                    <div className="org-box staff">Phòng TM</div>
                    <div className="org-box technical">Phòng KT</div>
                    <div className="org-box logistics">Phòng HC</div>
                  </div>
                  <div className="org-level level-3">
                    <div className="org-box battalion">Tiểu đoàn Ra đa</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Danh sách cơ quan đơn vị */}
        <div className="units-section">
          <h2 className="section-title text-center mb-5">Các cơ quan đơn vị</h2>
          <div className="row">
            {coQuanDonVi.map((unit, index) => (
              <div key={unit.id} className="col-lg-6 mb-4">
                <div className="unit-card" data-aos="fade-up" data-aos-delay={index * 100}>
                  <div className="unit-header" style={{ backgroundColor: unit.color }}>
                    <div className="unit-icon">
                      <i className={unit.icon}></i>
                    </div>
                    <div className="unit-title">
                      <h4>{unit.name}</h4>
                    </div>
                  </div>
                  <div className="unit-body">
                    <p className="unit-description">{unit.description}</p>
                    <div className="unit-functions">
                      <h6>Chức năng chính:</h6>
                      <ul>
                        {unit.functions.map((func, idx) => (
                          <li key={idx}>
                            <i className="fas fa-check-circle me-2"></i>
                            {func}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Phương châm hoạt động */}
        <div className="motto-section mt-5">
          <div className="motto-card">
            <div className="motto-header">
              <h3>Phương châm hoạt động</h3>
            </div>
            <div className="motto-content">
              <div className="row">
                <div className="col-md-3 text-center">
                  <div className="motto-item">
                    <i className="fas fa-heart text-danger"></i>
                    <h5>Trung thành</h5>
                    <p>Tuyệt đối trung thành với Đảng, Tổ quốc và nhân dân</p>
                  </div>
                </div>
                <div className="col-md-3 text-center">
                  <div className="motto-item">
                    <i className="fas fa-graduation-cap text-primary"></i>
                    <h5>Học tập</h5>
                    <p>Không ngừng học tập, nâng cao trình độ chuyên môn</p>
                  </div>
                </div>
                <div className="col-md-3 text-center">
                  <div className="motto-item">
                    <i className="fas fa-handshake text-success"></i>
                    <h5>Đoàn kết</h5>
                    <p>Đoàn kết nội bộ, đoàn kết quân dân</p>
                  </div>
                </div>
                <div className="col-md-3 text-center">
                  <div className="motto-item">
                    <i className="fas fa-trophy text-warning"></i>
                    <h5>Hiệp đồng</h5>
                    <p>Chủ động hiệp đồng, lập công tập thể</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrungDoanVaCoQuan;