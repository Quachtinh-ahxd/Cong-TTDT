import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MovieService from '../../../services/MovieService';
import Swal from 'sweetalert2';

function MovieCreate() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    genre: '',
    director: '',
    cast: '',
    release_date: '',
    duration: '',
    poster: null
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'poster') {
      setFormData({ ...formData, poster: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key]) {
          data.append(key, formData[key]);
        }
      });

      const response = await MovieService.create(data);
      
      if (response.data.status) {
        Swal.fire('Thành công!', 'Phim đã được tạo', 'success');
        navigate('/admin/movies');
      } else {
        Swal.fire('Lỗi!', response.data.message || 'Không thể tạo phim', 'error');
      }
    } catch (error) {
      Swal.fire('Lỗi!', 'Đã xảy ra lỗi khi tạo phim', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Thêm phim mới</h2>
        <button onClick={() => navigate('/admin/movies')} className="btn btn-secondary">
          <i className="fas fa-arrow-left"></i> Quay lại
        </button>
      </div>

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Tên phim *</label>
                  <input
                    type="text"
                    name="title"
                    className="form-control"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Thể loại</label>
                  <select
                    name="genre"
                    className="form-control"
                    value={formData.genre}
                    onChange={handleChange}
                  >
                    <option value="">Chọn thể loại</option>
                    <option value="Action">Hành động</option>
                    <option value="Comedy">Hài</option>
                    <option value="Drama">Chính kịch</option>
                    <option value="Horror">Kinh dị</option>
                    <option value="Romance">Lãng mạn</option>
                    <option value="Sci-Fi">Khoa học viễn tưởng</option>
                    <option value="Thriller">Ly kỳ</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Đạo diễn</label>
                  <input
                    type="text"
                    name="director"
                    className="form-control"
                    value={formData.director}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Diễn viên</label>
                  <input
                    type="text"
                    name="cast"
                    className="form-control"
                    value={formData.cast}
                    onChange={handleChange}
                    placeholder="Ngăn cách bằng dấu phẩy"
                  />
                </div>
              </div>

              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Ngày phát hành</label>
                  <input
                    type="date"
                    name="release_date"
                    className="form-control"
                    value={formData.release_date}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Thời lượng (phút)</label>
                  <input
                    type="number"
                    name="duration"
                    className="form-control"
                    value={formData.duration}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Poster</label>
                  <input
                    type="file"
                    name="poster"
                    className="form-control"
                    accept="image/*"
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Mô tả</label>
              <textarea
                name="description"
                className="form-control"
                rows="4"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="text-end">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Đang tạo...' : 'Tạo phim'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default MovieCreate;