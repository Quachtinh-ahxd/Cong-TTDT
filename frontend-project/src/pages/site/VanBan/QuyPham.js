import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './QuyPham.css';

const QuyPham = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState('all');

  // Dữ liệu mẫu quy phạm pháp luật
  const sampleDocuments = [
    {
      id: 1,
      title: 'Luật Quốc phòng số 22/2018/QH14',
      category: 'law',
      issueDate: '2018-06-08',
      effectiveDate: '2019-01-01',
      issuer: 'Quốc hội',
      documentNumber: '22/2018/QH14',
      status: 'active',
      level: 'national',
      summary: 'Luật quy định về quốc phòng, nhiệm vụ quốc phòng, xây dựng lực lượng vũ trang nhân dân, xây dựng nền quốc phòng toàn dân.',
      content: 'Luật này quy định về quốc phòng; nhiệm vụ quốc phòng; xây dựng lực lượng vũ trang nhân dân...',
      attachments: ['luat-quoc-phong-2018.pdf'],
      viewCount: 5432,
      downloadCount: 2156,
      year: 2018
    },
    {
      id: 2,
      title: 'Nghị định số 15/2020/NĐ-CP về quản lý vũ khí, vật liệu nổ',
      category: 'decree',
      issueDate: '2020-02-05',
      effectiveDate: '2020-04-01',
      issuer: 'Chính phủ',
      documentNumber: '15/2020/NĐ-CP',
      status: 'active',
      level: 'government',
      summary: 'Quy định về quản lý vũ khí, vật liệu nổ quân dụng; trách nhiệm của cơ quan, tổ chức, cá nhân.',
      content: 'Nghị định này quy định về quản lý vũ khí, vật liệu nổ quân dụng...',
      attachments: ['nghi-dinh-15-2020.pdf', 'phu-luc-danh-muc.xlsx'],
      viewCount: 3245,
      downloadCount: 1567,
      year: 2020
    },
    {
      id: 3,
      title: 'Thông tư số 08/2021/TT-BQP về kỷ luật quân đội',
      category: 'circular',
      issueDate: '2021-03-15',
      effectiveDate: '2021-05-01',
      issuer: 'Bộ Quốc phòng',
      documentNumber: '08/2021/TT-BQP',
      status: 'active',
      level: 'ministry',
      summary: 'Hướng dẫn thực hiện kỷ luật quân đội, xử lý vi phạm kỷ luật trong quân đội nhân dân Việt Nam.',
      content: 'Thông tư này hướng dẫn thực hiện kỷ luật quân đội...',
      attachments: ['thong-tu-08-2021.pdf'],
      viewCount: 2876,
      downloadCount: 1234,
      year: 2021
    },
    {
      id: 4,
      title: 'Quyết định số 1234/QĐ-BQP về tổ chức bộ máy',
      category: 'decision',
      issueDate: '2022-01-10',
      effectiveDate: '2022-02-01',
      issuer: 'Bộ trưởng Bộ Quốc phòng',
      documentNumber: '1234/QĐ-BQP',
      status: 'active',
      level: 'ministry',
      summary: 'Quy định về tổ chức bộ máy, chức năng nhiệm vụ của các đơn vị trong quân đội.',
      content: 'Quyết định này quy định về tổ chức bộ máy...',
      attachments: ['quyet-dinh-1234.pdf', 'so-do-to-chuc.png'],
      viewCount: 1987,
      downloadCount: 876,
      year: 2022
    },
    {
      id: 5,
      title: 'Chỉ thị số 05/CT-BQP về công tác huấn luyện',
      category: 'directive',
      issueDate: '2023-02-20',
      effectiveDate: '2023-03-01',
      issuer: 'Bộ Quốc phòng',
      documentNumber: '05/CT-BQP',
      status: 'active',
      level: 'ministry',
      summary: 'Chỉ thị về tăng cường công tác huấn luyện, nâng cao chất lượng huấn luyện quân sự.',
      content: 'Để nâng cao chất lượng huấn luyện quân sự...',
      attachments: ['chi-thi-05-2023.pdf'],
      viewCount: 3456,
      downloadCount: 1789,
      year: 2023
    },
    {
      id: 6,
      title: 'Luật Nghĩa vụ quân sự số 15/2015/QH13',
      category: 'law',
      issueDate: '2015-06-19',
      effectiveDate: '2016-01-01',
      issuer: 'Quốc hội',
      documentNumber: '15/2015/QH13',
      status: 'active',
      level: 'national',
      summary: 'Luật quy định về nghĩa vụ quân sự của công dân Việt Nam, tuyển chọn và gọi nhập ngũ.',
      content: 'Luật này quy định về nghĩa vụ quân sự của công dân Việt Nam...',
      attachments: ['luat-nghia-vu-quan-su.pdf'],
      viewCount: 6789,
      downloadCount: 3456,
      year: 2015
    }
  ];

  const categories = [
    { id: 'all', name: 'Tất cả', icon: 'fas fa-th-large', color: 'primary' },
    { id: 'law', name: 'Luật', icon: 'fas fa-balance-scale', color: 'danger' },
    { id: 'decree', name: 'Nghị định', icon: 'fas fa-file-contract', color: 'warning' },
    { id: 'circular', name: 'Thông tư', icon: 'fas fa-file-alt', color: 'info' },
    { id: 'decision', name: 'Quyết định', icon: 'fas fa-gavel', color: 'success' },
    { id: 'directive', name: 'Chỉ thị', icon: 'fas fa-bullhorn', color: 'secondary' }
  ];

  const levels = [
    { id: 'national', name: 'Quốc gia', color: 'danger' },
    { id: 'government', name: 'Chính phủ', color: 'warning' },
    { id: 'ministry', name: 'Bộ ngành', color: 'info' }
  ];

  const years = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];

  useEffect(() => {
    setTimeout(() => {
      setDocuments(sampleDocuments);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredDocuments = documents.filter(doc => {
    const matchesCategory = activeCategory === 'all' || doc.category === activeCategory;
    const matchesYear = selectedYear === 'all' || doc.year.toString() === selectedYear;
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.documentNumber.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesYear && matchesSearch;
  });

  const getLevelBadge = (level) => {
    const levelInfo = levels.find(l => l.id === level);
    return `badge bg-${levelInfo?.color || 'secondary'}`;
  };

  const getLevelText = (level) => {
    const levelInfo = levels.find(l => l.id === level);
    return levelInfo?.name || 'Khác';
  };

  return (
    <div className="quy-pham-page">
      {/* Header */}
      <div className="page-header">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h1 className="page-title">
                <i className="fas fa-balance-scale me-3"></i>
                Quy Phạm Pháp Luật
              </h1>
              <p className="page-subtitle">
                Hệ thống văn bản quy phạm pháp luật về quốc phòng và an ninh
              </p>
            </div>
            <div className="col-md-4 text-end">
              <div className="stats-container">
                <div className="stat-item">
                  <span className="stat-number">{documents.length}</span>
                  <span className="stat-label">Văn bản</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">
                    {documents.filter(d => d.status === 'active').length}
                  </span>
                  <span className="stat-label">Hiệu lực</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-5">
        {/* Search and Filter */}
        <div className="row mb-4">
          <div className="col-md-6">
            <div className="search-box">
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="Tìm kiếm văn bản quy phạm pháp luật..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-control"
              />
            </div>
          </div>
          <div className="col-md-3">
            <select
              className="form-select"
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value)}
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <select
              className="form-select"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option value="all">Tất cả năm</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Categories */}
        <div className="categories-grid mb-5">
          {categories.map(category => (
            <div
              key={category.id}
              className={`category-card ${activeCategory === category.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(category.id)}
            >
              <div className="category-icon">
                <i className={category.icon}></i>
              </div>
              <span className="category-name">{category.name}</span>
              <span className="category-count">
                {category.id === 'all' 
                  ? documents.length 
                  : documents.filter(d => d.category === category.id).length
                }
              </span>
            </div>
          ))}
        </div>

        {/* Documents List */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Đang tải...</span>
            </div>
          </div>
        ) : (
          <div className="documents-list">
            {filteredDocuments.map(doc => (
              <div key={doc.id} className="document-item">
                <div className="document-header">
                  <div className="document-meta">
                    <span className="document-number">{doc.documentNumber}</span>
                    <span className={getLevelBadge(doc.level)}>
                      {getLevelText(doc.level)}
                    </span>
                    <span className="document-year">{doc.year}</span>
                  </div>
                  <div className="document-dates">
                    <span className="issue-date">
                      <i className="fas fa-calendar-plus"></i>
                      Ban hành: {new Date(doc.issueDate).toLocaleDateString('vi-VN')}
                    </span>
                    <span className="effective-date">
                      <i className="fas fa-calendar-check"></i>
                      Hiệu lực: {new Date(doc.effectiveDate).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                </div>

                <div className="document-content">
                  <h3 className="document-title">{doc.title}</h3>
                  <div className="document-issuer">
                    <i className="fas fa-user-tie"></i>
                    <span>Cơ quan ban hành: {doc.issuer}</span>
                  </div>
                  <p className="document-summary">{doc.summary}</p>
                  
                  {doc.attachments && doc.attachments.length > 0 && (
                    <div className="attachments">
                      <h6><i className="fas fa-paperclip"></i> Tài liệu đính kèm:</h6>
                      <div className="attachment-list">
                        {doc.attachments.map((file, index) => (
                          <span key={index} className="attachment-item">
                            <i className="fas fa-file-pdf"></i>
                            {file}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="document-footer">
                  <div className="document-stats">
                    <span className="stat">
                      <i className="fas fa-eye"></i>
                      {doc.viewCount} lượt xem
                    </span>
                    <span className="stat">
                      <i className="fas fa-download"></i>
                      {doc.downloadCount} lượt tải
                    </span>
                  </div>
                  <div className="document-actions">
                    <button className="btn btn-outline-primary">
                      <i className="fas fa-eye me-2"></i>
                      Xem chi tiết
                    </button>
                    <button className="btn btn-primary">
                      <i className="fas fa-download me-2"></i>
                      Tải xuống
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredDocuments.length === 0 && !loading && (
          <div className="no-results">
            <i className="fas fa-search"></i>
            <h4>Không tìm thấy văn bản</h4>
            <p>Thử thay đổi từ khóa tìm kiếm, danh mục hoặc năm ban hành</p>
          </div>
        )}

        {/* Legal Notice */}
        <div className="legal-notice mt-5">
          <div className="notice-content">
            <h4>
              <i className="fas fa-exclamation-triangle me-2"></i>
              Lưu ý quan trọng
            </h4>
            <ul>
              <li>Các văn bản được cập nhật thường xuyên theo quy định của pháp luật</li>
              <li>Vui lòng kiểm tra tính hiệu lực của văn bản trước khi áp dụng</li>
              <li>Mọi thắc mắc về nội dung văn bản, vui lòng liên hệ phòng Pháp chế</li>
              <li>Nghiêm cấm sao chép, phát tán trái phép các văn bản mật</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuyPham;