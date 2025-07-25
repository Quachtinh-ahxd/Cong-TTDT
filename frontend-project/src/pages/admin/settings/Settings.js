import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

function Settings() {
  const [settings, setSettings] = useState({
    site_name: '',
    site_description: '',
    site_keywords: '',
    contact_email: '',
    contact_phone: '',
    contact_address: '',
    maintenance_mode: false,
    items_per_page: 10
  });
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load settings from localStorage or API
    const savedSettings = localStorage.getItem('siteSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Save to localStorage (replace with API call)
      localStorage.setItem('siteSettings', JSON.stringify(settings));
      
      Swal.fire({
        title: 'Thành công!',
        text: 'Cài đặt đã được lưu.',
        icon: 'success',
        confirmButtonText: 'OK'
      });
    } catch (error) {
      Swal.fire({
        title: 'Lỗi!',
        text: 'Có lỗi xảy ra khi lưu cài đặt.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title mb-0">
                <i className="fas fa-cog me-2"></i>
                Cài đặt hệ thống
              </h4>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  {/* Thông tin website */}
                  <div className="col-md-6">
                    <div className="card mb-4">
                      <div className="card-header">
                        <h5 className="mb-0">Thông tin website</h5>
                      </div>
                      <div className="card-body">
                        <div className="mb-3">
                          <label className="form-label">Tên website</label>
                          <input
                            type="text"
                            className="form-control"
                            name="site_name"
                            value={settings.site_name}
                            onChange={handleChange}
                            placeholder="Nhập tên website"
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Mô tả website</label>
                          <textarea
                            className="form-control"
                            name="site_description"
                            value={settings.site_description}
                            onChange={handleChange}
                            rows="3"
                            placeholder="Nhập mô tả website"
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Từ khóa SEO</label>
                          <input
                            type="text"
                            className="form-control"
                            name="site_keywords"
                            value={settings.site_keywords}
                            onChange={handleChange}
                            placeholder="Nhập từ khóa, cách nhau bằng dấu phẩy"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Thông tin liên hệ */}
                  <div className="col-md-6">
                    <div className="card mb-4">
                      <div className="card-header">
                        <h5 className="mb-0">Thông tin liên hệ</h5>
                      </div>
                      <div className="card-body">
                        <div className="mb-3">
                          <label className="form-label">Email liên hệ</label>
                          <input
                            type="email"
                            className="form-control"
                            name="contact_email"
                            value={settings.contact_email}
                            onChange={handleChange}
                            placeholder="contact@example.com"
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Số điện thoại</label>
                          <input
                            type="text"
                            className="form-control"
                            name="contact_phone"
                            value={settings.contact_phone}
                            onChange={handleChange}
                            placeholder="0123456789"
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Địa chỉ</label>
                          <textarea
                            className="form-control"
                            name="contact_address"
                            value={settings.contact_address}
                            onChange={handleChange}
                            rows="3"
                            placeholder="Nhập địa chỉ"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Cài đặt hệ thống */}
                  <div className="col-md-12">
                    <div className="card mb-4">
                      <div className="card-header">
                        <h5 className="mb-0">Cài đặt hệ thống</h5>
                      </div>
                      <div className="card-body">
                        <div className="row">
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="form-label">Số item trên trang</label>
                              <select
                                className="form-select"
                                name="items_per_page"
                                value={settings.items_per_page}
                                onChange={handleChange}
                              >
                                <option value="5">5</option>
                                <option value="10">10</option>
                                <option value="20">20</option>
                                <option value="50">50</option>
                              </select>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mb-3">
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="maintenance_mode"
                                  checked={settings.maintenance_mode}
                                  onChange={handleChange}
                                  id="maintenanceMode"
                                />
                                <label className="form-check-label" htmlFor="maintenanceMode">
                                  Chế độ bảo trì
                                </label>
                              </div>
                              <small className="text-muted">
                                Khi bật, website sẽ hiển thị trang bảo trì cho người dùng
                              </small>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-end">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Đang lưu...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-save me-2"></i>
                        Lưu cài đặt
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
