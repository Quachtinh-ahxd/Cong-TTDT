import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MovieService from '../../../services/MovieService';
import Swal from 'sweetalert2';
import './MovieList.css';

function MovieList() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    try {
      const response = await MovieService.getAll();
      if (response.data.status) {
        setMovies(response.data.movies || []);
      }
    } catch (error) {
      console.error('Error loading movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Bạn có chắc chắn?',
      text: 'Phim sẽ bị xóa vĩnh viễn!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy'
    });

    if (result.isConfirmed) {
      try {
        await MovieService.delete(id);
        Swal.fire('Đã xóa!', 'Phim đã được xóa.', 'success');
        loadMovies();
      } catch (error) {
        Swal.fire('Lỗi!', 'Không thể xóa phim.', 'error');
      }
    }
  };

  const filteredMovies = movies.filter(movie =>
    movie.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    movie.genre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    movie.director?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="movie-management">
      <div className="movie-header">
        <div className="d-flex justify-content-between align-items-center">
          <h2>Quản lý phim</h2>
          <Link to="/admin/movies/create" className="btn btn-primary">
            <i className="fas fa-plus"></i> Thêm phim mới
          </Link>
        </div>
      </div>

      <div className="movie-card">
        <div className="movie-card-header">
          <div className="row">
            <div className="col-md-6">
              <input
                type="text"
                className="form-control movie-search"
                placeholder="Tìm kiếm phim..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="card-body">
          {loading ? (
            <div className="movie-loading">
              <div className="movie-spinner"></div>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table movie-table">
                <thead>
                  <tr>
                    <th>Poster</th>
                    <th>Tên phim</th>
                    <th>Thể loại</th>
                    <th>Đạo diễn</th>
                    <th>Thời lượng</th>
                    <th>Ngày phát hành</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMovies.length > 0 ? (
                    filteredMovies.map((movie) => (
                      <tr key={movie.id}>
                        <td>
                          {movie.poster ? (
                            <img
                              src={`${process.env.REACT_APP_API_URL}${movie.poster}`}
                              alt={movie.title}
                              className="movie-poster"
                              style={{ width: '50px', height: '75px', objectFit: 'cover' }}
                            />
                          ) : (
                            <div className="bg-light d-flex align-items-center justify-content-center movie-poster"
                                 style={{ width: '50px', height: '75px' }}>
                              <i className="fas fa-film"></i>
                            </div>
                          )}
                        </td>
                        <td><strong>{movie.title}</strong></td>
                        <td><span className="badge bg-secondary">{movie.genre}</span></td>
                        <td>{movie.director}</td>
                        <td><span className="badge bg-info">{movie.duration} phút</span></td>
                        <td>{movie.release_date ? new Date(movie.release_date).toLocaleDateString('vi-VN') : ''}</td>
                        <td>
                          <div className="movie-actions">
                            <Link
                              to={`/admin/movies/edit/${movie.id}`}
                              className="btn btn-sm movie-btn-edit"
                              title="Chỉnh sửa"
                            >
                              <i className="fas fa-edit"></i>
                            </Link>
                            <button
                              onClick={() => handleDelete(movie.id)}
                              className="btn btn-sm movie-btn-delete"
                              title="Xóa"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center">
                        <div className="movie-empty">
                          <i className="fas fa-film"></i>
                          <p>{searchTerm ? 'Không tìm thấy phim nào' : 'Chưa có phim nào'}</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MovieList;




