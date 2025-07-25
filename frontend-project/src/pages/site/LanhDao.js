import React, { useState } from 'react';
import './LanhDao.css';

// Import ảnh từ assets
import defaultAvatar from '../../assets/images/sam2.jpg';

const LanhDao = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('all');

  // Dữ liệu lãnh đạo qua các thời kỳ
  const leaders = [
    {
      id: 1,
      name: 'Đại tá Nguyễn Văn A',
      position: 'Trung đoàn trưởng',
      period: '1965-1970',
      era: 'kang-chien',
      avatar: defaultAvatar,
      achievements: [
        'Lãnh đạo đơn vị trong giai đoạn thành lập',
        'Xây dựng nền tảng tổ chức đầu tiên',
        'Huấn luyện lực lượng cán bộ cốt cán'
      ],
      biography: 'Sinh năm 1925 tại Hà Nội. Tham gia cách mạng từ năm 1945. Có nhiều đóng góp trong việc xây dựng và phát triển đơn vị.',
      awards: ['Huân chương Quân công hạng Nhì', 'Huân chương Kháng chiến chống Mỹ'],
      quote: 'Xây dựng đơn vị vững mạnh là nhiệm vụ hàng đầu của mỗi cán bộ chỉ huy.'
    },
    {
      id: 2,
      name: 'Đại tá Trần Văn B',
      position: 'Chính ủy',
      period: '1965-1972',
      era: 'kang-chien',
      avatar: defaultAvatar,
      achievements: [
        'Xây dựng công tác chính trị vững mạnh',
        'Giáo dục truyền thống cách mạng',
        'Phát triển Đảng bộ đơn vị'
      ],
      biography: 'Sinh năm 1920 tại Nam Định. Tham gia Đảng từ năm 1943. Có kinh nghiệm phong phú trong công tác chính trị.',
      awards: ['Huân chương Độc lập hạng Ba', 'Huân chương Lao động hạng Nhì'],
      quote: 'Công tác chính trị là linh hồn của quân đội, là sức mạnh tinh thần vô tận.'
    },
    {
      id: 3,
      name: 'Đại tá Lê Văn C',
      position: 'Trung đoàn trưởng',
      period: '1970-1978',
      era: 'kang-chien',
      avatar: defaultAvatar,
      achievements: [
        'Lãnh đạo đơn vị trong các chiến dịch lớn',
        'Phát hiện đầu tiên máy bay B52',
        'Xây dựng truyền thống chiến đấu'
      ],
      biography: 'Sinh năm 1930 tại Hải Phòng. Tốt nghiệp Học viện Quân sự. Có tài năng xuất sắc trong chỉ huy tác chiến.',
      awards: ['Huân chương Quân công hạng Nhất', 'Danh hiệu Anh hùng Lực lượng vũ trang nhân dân'],
      quote: 'Trong chiến đấu, sự chính xác và nhanh nhạy là yếu tố quyết định thắng lợi.'
    },
    {
      id: 4,
      name: 'Đại tá Phạm Văn D',
      position: 'Chính ủy',
      period: '1972-1980',
      era: 'kang-chien',
      avatar: defaultAvatar,
      achievements: [
        'Củng cố tinh thần chiến đấu',
        'Phát triển phong trào thi đua',
        'Giáo dục lý tưởng cách mạng'
      ],
      biography: 'Sinh năm 1925 tại Thái Bình. Có bề dày kinh nghiệm trong công tác tuyên truyền và giáo dục.',
      awards: ['Huân chương Quân công hạng Ba', 'Huân chương Lao động hạng Nhất'],
      quote: 'Tinh thần cách mạng là nguồn sức mạnh vô tận của người chiến sĩ.'
    },
    {
      id: 5,
      name: 'Đại tá Hoàng Văn E',
      position: 'Trung đoàn trưởng',
      period: '1978-1985',
      era: 'bao-ve-bien-gioi',
      avatar: defaultAvatar,
      achievements: [
        'Lãnh đạo bảo vệ biên giới phía Bắc',
        'Hiện đại hóa trang thiết bị',
        'Nâng cao chất lượng huấn luyện'
      ],
      biography: 'Sinh năm 1935 tại Quảng Ninh. Tốt nghiệp Học viện Kỹ thuật Quân sự. Chuyên gia về radar và phòng không.',
      awards: ['Huân chương Bảo vệ Tổ quốc hạng Nhì', 'Huân chương Quân công hạng Ba'],
      quote: 'Bảo vệ biên giới là bảo vệ độc lập, chủ quyền thiêng liêng của Tổ quốc.'
    },
    {
      id: 6,
      name: 'Đại tá Vũ Văn F',
      position: 'Chính ủy',
      period: '1980-1988',
      era: 'bao-ve-bien-gioi',
      avatar: defaultAvatar,
      achievements: [
        'Xây dựng đời sống tinh thần',
        'Phát triển phong trào văn hóa',
        'Giáo dục truyền thống đơn vị'
      ],
      biography: 'Sinh năm 1940 tại Hà Nam. Có trình độ cao về lý luận chính trị và tổ chức Đảng.',
      awards: ['Huân chương Lao động hạng Nhì', 'Huân chương Bảo vệ Tổ quốc hạng Ba'],
      quote: 'Văn hóa là nền tảng tinh thần, là sức mạnh nội sinh của đơn vị.'
    },
    {
      id: 7,
      name: 'Đại tá Đỗ Văn G',
      position: 'Trung đoàn trưởng',
      period: '1985-1995',
      era: 'doi-moi',
      avatar: defaultAvatar,
      achievements: [
        'Lãnh đạo đổi mới tổ chức',
        'Ứng dụng công nghệ mới',
        'Nâng cao năng lực sẵn sàng chiến đấu'
      ],
      biography: 'Sinh năm 1945 tại Hưng Yên. Tốt nghiệp Học viện Quân sự với thành tích xuất sắc.',
      awards: ['Huân chương Quân công hạng Nhì', 'Huân chương Lao động hạng Nhất'],
      quote: 'Đổi mới là con đường tất yếu để đơn vị phát triển và hoàn thiện.'
    },
    {
      id: 8,
      name: 'Đại tá Ngô Văn H',
      position: 'Chính ủy',
      period: '1988-1998',
      era: 'doi-moi',
      avatar: defaultAvatar,
      achievements: [
        'Đổi mới công tác chính trị',
        'Xây dựng đơn vị học tập',
        'Phát triển nguồn nhân lực'
      ],
      biography: 'Sinh năm 1948 tại Bắc Giang. Có nhiều nghiên cứu về công tác chính trị trong thời kỳ đổi mới.',
      awards: ['Huân chương Lao động hạng Nhất', 'Huân chương Quân công hạng Ba'],
      quote: 'Học tập suốt đời là phẩm chất cần thiết của mỗi cán bộ, chiến sĩ.'
    },
    {
      id: 9,
      name: 'Đại tá Bùi Văn I',
      position: 'Trung đoàn trưởng',
      period: '1995-2005',
      era: 'hien-dai-hoa',
      avatar: defaultAvatar,
      achievements: [
        'Hiện đại hóa trang thiết bị kỹ thuật',
        'Xây dựng đơn vị điểm',
        'Đạt danh hiệu Đơn vị Quyết thắng'
      ],
      biography: 'Sinh năm 1955 tại Hải Dương. Thạc sĩ Khoa học Quân sự. Chuyên gia về hiện đại hóa quân sự.',
      awards: ['Huân chương Quân công hạng Nhất', 'Huân chương Bảo vệ Tổ quốc hạng Nhì'],
      quote: 'Hiện đại hóa không chỉ là trang thiết bị mà còn là tư duy và phương pháp làm việc.'
    },
    {
      id: 10,
      name: 'Đại tá Lý Văn K',
      position: 'Chính ủy',
      period: '1998-2008',
      era: 'hien-dai-hoa',
      avatar: defaultAvatar,
      achievements: [
        'Xây dựng văn hóa đơn vị',
        'Phát triển phong trào thi đua',
        'Giáo dục truyền thống'
      ],
      biography: 'Sinh năm 1958 tại Vĩnh Phúc. Tiến sĩ Khoa học Chính trị. Có nhiều công trình nghiên cứu về giáo dục chính trị.',
      awards: ['Huân chương Lao động hạng Nhất', 'Huân chương Quân công hạng Nhì'],
      quote: 'Văn hóa đơn vị là bản sắc, là linh hồn của tập thể.'
    }
  ];

  const periods = [
    { id: 'all', name: 'Tất cả thời kỳ', color: 'primary' },
    { id: 'kang-chien', name: 'Kháng chiến chống Mỹ (1965-1975)', color: 'danger' },
    { id: 'bao-ve-bien-gioi', name: 'Bảo vệ biên giới (1975-1990)', color: 'warning' },
    { id: 'doi-moi', name: 'Đổi mới (1990-2000)', color: 'info' },
    { id: 'hien-dai-hoa', name: 'Hiện đại hóa (2000-nay)', color: 'success' }
  ];

  const positions = [
    { id: 'all', name: 'Tất cả chức vụ', icon: 'fas fa-users' },
    { id: 'Trung đoàn trưởng', name: 'Trung đoàn trưởng', icon: 'fas fa-star' },
    { id: 'Chính ủy', name: 'Chính ủy', icon: 'fas fa-flag' }
  ];

  const filteredLeaders = leaders.filter(leader => {
    const matchesPeriod = selectedPeriod === 'all' || leader.era === selectedPeriod;
    const matchesPosition = activeTab === 'all' || leader.position === activeTab;
    return matchesPeriod && matchesPosition;
  });

  const getPositionIcon = (position) => {
    return position === 'Trung đoàn trưởng' ? 'fas fa-star' : 'fas fa-flag';
  };

  const getPositionColor = (position) => {
    return position === 'Trung đoàn trưởng' ? 'primary' : 'success';
  };

  return (
    <div className="lanh-dao-page">
      {/* Header */}
      <div className="page-header">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h1 className="page-title">
                <i className="fas fa-crown me-3"></i>
                Lãnh Đạo Qua Các Thời Kỳ
              </h1>
              <p className="page-subtitle">
                Những người lãnh đạo xuất sắc đã góp phần xây dựng và phát triển Trung đoàn 290
              </p>
            </div>
            <div className="col-md-4 text-end">
              <div className="heritage-badge">
                <div className="badge-icon">
                  <i className="fas fa-medal"></i>
                </div>
                <div className="badge-text">
                  <span>Truyền thống</span>
                  <small>Vẻ vang</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-5">
        {/* Timeline Navigation */}
        <div className="timeline-nav mb-5">
          <h3 className="section-title">
            <i className="fas fa-clock me-2"></i>
            Các thời kỳ lịch sử
          </h3>
          <div className="period-buttons">
            {periods.map(period => (
              <button
                key={period.id}
                className={`btn btn-outline-${period.color} ${selectedPeriod === period.id ? 'active' : ''}`}
                onClick={() => setSelectedPeriod(period.id)}
              >
                {period.name}
              </button>
            ))}
          </div>
        </div>

        {/* Position Filter */}
        <div className="position-filter mb-4">
          <div className="filter-tabs">
            {positions.map(pos => (
              <button
                key={pos.id}
                className={`filter-tab ${activeTab === pos.id ? 'active' : ''}`}
                onClick={() => setActiveTab(pos.id)}
              >
                <i className={pos.icon}></i>
                <span>{pos.name}</span>
                <span className="count">
                  {pos.id === 'all' 
                    ? filteredLeaders.length 
                    : leaders.filter(l => l.position === pos.id && (selectedPeriod === 'all' || l.era === selectedPeriod)).length
                  }
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Leaders Grid */}
        <div className="leaders-grid">
          {filteredLeaders.map(leader => (
            <div key={leader.id} className="leader-card">
              <div className="leader-header">
                <div className="leader-avatar">
                  <img src={leader.avatar} alt={leader.name} />
                  <div className="position-badge">
                    <i className={getPositionIcon(leader.position)}></i>
                  </div>
                </div>
                <div className="leader-info">
                  <h4 className="leader-name">{leader.name}</h4>
                  <div className={`leader-position badge bg-${getPositionColor(leader.position)}`}>
                    {leader.position}
                  </div>
                  <div className="leader-period">
                    <i className="fas fa-calendar-alt"></i>
                    {leader.period}
                  </div>
                </div>
              </div>

              <div className="leader-content">
                <div className="leader-quote">
                  <i className="fas fa-quote-left"></i>
                  <p>"{leader.quote}"</p>
                </div>

                <div className="leader-biography">
                  <h6><i className="fas fa-user-circle"></i> Tiểu sử</h6>
                  <p>{leader.biography}</p>
                </div>

                <div className="leader-achievements">
                  <h6><i className="fas fa-trophy"></i> Thành tích nổi bật</h6>
                  <ul>
                    {leader.achievements.map((achievement, index) => (
                      <li key={index}>{achievement}</li>
                    ))}
                  </ul>
                </div>

                <div className="leader-awards">
                  <h6><i className="fas fa-medal"></i> Phần thưởng cao quý</h6>
                  <div className="awards-list">
                    {leader.awards.map((award, index) => (
                      <span key={index} className="award-item">
                        <i className="fas fa-award"></i>
                        {award}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredLeaders.length === 0 && (
          <div className="no-results">
            <i className="fas fa-search"></i>
            <h4>Không tìm thấy lãnh đạo</h4>
            <p>Thử thay đổi bộ lọc thời kỳ hoặc chức vụ</p>
          </div>
        )}

        {/* Legacy Section */}
        <div className="legacy-section mt-5">
          <div className="legacy-content">
            <h3>
              <i className="fas fa-heart me-2"></i>
              Di sản lãnh đạo
            </h3>
            <div className="row">
              <div className="col-md-4">
                <div className="legacy-item">
                  <div className="legacy-icon">
                    <i className="fas fa-lightbulb"></i>
                  </div>
                  <h5>Tầm nhìn chiến lược</h5>
                  <p>Các thế hệ lãnh đạo luôn có tầm nhìn xa, định hướng phát triển đúng đắn cho đơn vị.</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="legacy-item">
                  <div className="legacy-icon">
                    <i className="fas fa-hands-helping"></i>
                  </div>
                  <h5>Tinh thần đoàn kết</h5>
                  <p>Xây dựng tinh thần đoàn kết, tương trợ, tạo sức mạnh tập thể vững mạnh.</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="legacy-item">
                  <div className="legacy-icon">
                    <i className="fas fa-graduation-cap"></i>
                  </div>
                  <h5>Đào tạo nhân tài</h5>
                  <p>Chú trọng đào tạo, bồi dưỡng thế hệ cán bộ kế thừa, phát triển bền vững.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanhDao;
