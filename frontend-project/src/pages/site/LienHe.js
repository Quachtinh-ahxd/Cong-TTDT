import React, { useState } from 'react';
import './LienHe.css';

const LienHe = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    department: '',
    message: '',
    priority: 'normal'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const departments = [
    { id: 'general', name: 'Văn phòng Trung đoàn' },
    { id: 'training', name: 'Phòng Huấn luyện' },
    { id: 'organization', name: 'Phòng Tổ chức' },
    { id: 'logistics', name: 'Phòng Hậu cần' },
    { id: 'technical', name: 'Phòng Kỹ thuật' },
    { id: 'finance', name: 'Phòng Tài chính' },
    { id: 'security', name: 'Phòng An ninh' },
    { id: 'political', name: 'Phòng Chính trị' }
  ];

  const contactInfo = [
    {
      icon: 'fas fa-map-marker-alt',
      title: 'Địa chỉ',
      content: 'Trung đoàn Ra đa 290, Quân chủng Phòng không - Không quân',
      details: 'Số 123, Đường ABC, Quận XYZ, TP. Hà Nội'
    },
    {
      icon: 'fas fa-phone-alt',
      title: 'Điện thoại',
      content: '(024) 1234 5678',
      details: 'Thời gian làm việc: 7:30 - 11:30, 13:30 - 17:00'
    },
    {
      icon: 'fas fa-fax',
      title: 'Fax',
      content: '(024) 1234 5679',
      details: 'Fax văn phòng Trung đoàn'
    },
    {
      icon: 'fas fa-envelope',
      title: 'Email',
      content: 'info@td290.mil.vn',
      details: 'Email chính thức của Trung đoàn'
    }
  ];

  const quickContacts = [
    {
      department: 'Trung đoàn trưởng',
      phone: '(024) 1234 5680',
      email: 'tdt@td290.mil.vn',
      time: '8:00 - 11:30, 14:00 - 17:00'
    },
    {
      department: 'Chính ủy',
      phone: '(024) 1234 5681',
      email: 'cu@td290.mil.vn',
      time: '8:00 - 11:30, 14:00 - 17:00'
    },
    {
      department: 'Phó Trung đoàn trưởng',
      phone: '(024) 1234 5682',
      email: 'ptdt@td290.mil.vn',
      time: '8:00 - 11:30, 14:00 - 17:00'
    },
    {
      department: 'Văn phòng',
      phone: '(024) 1234 5683',
      email: 'vanphong@td290.mil.vn',
      time: '7:30 - 11:30, 13:30 - 17:00'
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        department: '',
        message: '',
        priority: 'normal'
      });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="lien-he-page">
      {/* Header */}
      <div className="page-header">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h1 className="page-title">
                <i className="fas fa-phone-alt me-3"></i>
                Liên Hệ
              </h1>
              <p className="page-subtitle">
                Kết nối với Trung đoàn Ra đa 290 - Chúng tôi luôn sẵn sàng hỗ trợ bạn
              </p>
            </div>
            <div className="col-md-4 text-end">
              <div className="contact-badge">
                <div className="badge-icon">
                  <i className="fas fa-headset"></i>
                </div>
                <div className="badge-text">
                  <span>Hỗ trợ 24/7</span>
                  <small>Luôn sẵn sàng phục vụ</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-5">
        <div className="row">
          {/* Contact Information */}
          <div className="col-lg-4 mb-5">
            <div className="contact-info-section">
              <h3 className="section-title">
                <i className="fas fa-info-circle me-2"></i>
                Thông tin liên hệ
              </h3>
              
              <div className="contact-cards">
                {contactInfo.map((info, index) => (
                  <div key={index} className="contact-card">
                    <div className="contact-icon">
                      <i className={info.icon}></i>
                    </div>
                    <div className="contact-details">
                      <h5>{info.title}</h5>
                      <p className="contact-main">{info.content}</p>
                      <small className="contact-sub">{info.details}</small>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Contacts */}
              <div className="quick-contacts mt-4">
                <h4 className="quick-title">
                  <i className="fas fa-tachometer-alt me-2"></i>
                  Liên hệ nhanh
                </h4>
                {quickContacts.map((contact, index) => (
                  <div key={index} className="quick-contact-item">
                    <div className="quick-header">
                      <strong>{contact.department}</strong>
                      <span className="quick-time">{contact.time}</span>
                    </div>
                    <div className="quick-details">
                      <a href={`tel:${contact.phone}`} className="quick-link">
                        <i className="fas fa-phone"></i> {contact.phone}
                      </a>
                      <a href={`mailto:${contact.email}`} className="quick-link">
                        <i className="fas fa-envelope"></i> {contact.email}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="col-lg-8">
            <div className="contact-form-section">
              <h3 className="section-title">
                <i className="fas fa-paper-plane me-2"></i>
                Gửi tin nhắn cho chúng tôi
              </h3>
              
              {submitStatus === 'success' && (
                <div className="alert alert-success" role="alert">
                  <i className="fas fa-check-circle me-2"></i>
                  Tin nhắn của bạn đã được gửi thành công! Chúng tôi sẽ phản hồi trong thời gian sớm nhất.
                </div>
              )}
              
              {submitStatus === 'error' && (
                <div className="alert alert-danger" role="alert">
                  <i className="fas fa-exclamation-circle me-2"></i>
                  Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại sau.
                </div>
              )}

              <form onSubmit={handleSubmit} className="contact-form">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      <i className="fas fa-user me-1"></i>
                      Họ và tên *
                    </label>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="Nhập họ và tên của bạn"
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      <i className="fas fa-envelope me-1"></i>
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="Nhập địa chỉ email"
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      <i className="fas fa-phone me-1"></i>
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      className="form-control"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Nhập số điện thoại"
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      <i className="fas fa-building me-1"></i>
                      Phòng ban liên hệ
                    </label>
                    <select
                      name="department"
                      className="form-select"
                      value={formData.department}
                      onChange={handleInputChange}
                    >
                      <option value="">Chọn phòng ban</option>
                      {departments.map(dept => (
                        <option key={dept.id} value={dept.id}>
                          {dept.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-8 mb-3">
                    <label className="form-label">
                      <i className="fas fa-tag me-1"></i>
                      Tiêu đề *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      className="form-control"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      placeholder="Nhập tiêu đề tin nhắn"
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">
                      <i className="fas fa-exclamation-triangle me-1"></i>
                      Mức độ ưu tiên
                    </label>
                    <select
                      name="priority"
                      className="form-select"
                      value={formData.priority}
                      onChange={handleInputChange}
                    >
                      <option value="low">Thấp</option>
                      <option value="normal">Bình thường</option>
                      <option value="high">Cao</option>
                      <option value="urgent">Khẩn cấp</option>
                    </select>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label">
                    <i className="fas fa-comment me-1"></i>
                    Nội dung tin nhắn *
                  </label>
                  <textarea
                    name="message"
                    className="form-control"
                    rows="6"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    placeholder="Nhập nội dung tin nhắn của bạn..."
                  ></textarea>
                </div>

                <div className="form-actions">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Đang gửi...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-paper-plane me-2"></i>
                        Gửi tin nhắn
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-lg ms-3"
                    onClick={() => setFormData({
                      name: '',
                      email: '',
                      phone: '',
                      subject: '',
                      department: '',
                      message: '',
                      priority: 'normal'
                    })}
                  >
                    <i className="fas fa-redo me-2"></i>
                    Làm mới
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="row mt-5">
          <div className="col-12">
            <div className="map-section">
              <h3 className="section-title">
                <i className="fas fa-map-marked-alt me-2"></i>
                Vị trí trên bản đồ
              </h3>
              <div className="map-container">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.0967470394973!2d105.84117831533216!3d21.028511986010745!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab9bd9861ca1%3A0xe7887f7b72ca17a9!2zSMOgIE7hu5lpLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2s!4v1642678901234!5m2!1svi!2s"
                  width="100%"
                  height="400"
                  style={{ border: 0, borderRadius: '15px' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Vị trí Trung đoàn 290"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LienHe;