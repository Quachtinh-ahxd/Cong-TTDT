const Movie = require('../models/sql/Movie');

// Lấy tất cả phim
exports.getAllMovies = async (req, res) => {
  try {
    const { genre, year, search, page = 1, limit = 10 } = req.query;
    
    const filters = {};
    if (genre) filters.genre = genre;
    if (year) filters.year = parseInt(year);
    if (search) filters.search = search;
    
    const movies = await Movie.findAll(filters);
    
    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedMovies = movies.slice(startIndex, endIndex);
    
    res.status(200).json({
      status: true,
      movies: paginatedMovies,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(movies.length / limit),
        total_movies: movies.length,
        per_page: parseInt(limit)
      },
      message: 'Lấy danh sách phim thành công'
    });
  } catch (error) {
    console.error('Error getting movies:', error);
    res.status(500).json({
      status: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// Lấy phim theo ID
exports.getMovieById = async (req, res) => {
  try {
    const { id } = req.params;
    const movie = await Movie.findById(id);
    
    if (!movie) {
      return res.status(404).json({
        status: false,
        message: 'Không tìm thấy phim'
      });
    }
    
    res.status(200).json({
      status: true,
      movie,
      message: 'Lấy thông tin phim thành công'
    });
  } catch (error) {
    console.error('Error getting movie:', error);
    res.status(500).json({
      status: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// Tạo phim mới
exports.createMovie = async (req, res) => {
  try {
    const {
      title, description, director, cast, genre, release_date,
      duration, poster, trailer_url, imdb_id, country, language
    } = req.body;
    
    if (!title) {
      return res.status(400).json({
        status: false,
        message: 'Tên phim là bắt buộc'
      });
    }
    
    const movieData = {
      title,
      description,
      director,
      cast,
      genre,
      release_date: release_date ? new Date(release_date) : null,
      duration: duration ? parseInt(duration) : null,
      poster,
      trailer_url,
      imdb_id,
      country,
      language,
      status: 1, // Active by default
      created_by: 1 // Default user
    };
    
    if (req.file) {
      movieData.poster = `/images/movies/${req.file.filename}`;
    }
    
    const movie = await Movie.create(movieData);
    
    res.status(201).json({
      status: true,
      movie,
      message: 'Tạo phim thành công'
    });
  } catch (error) {
    console.error('Error creating movie:', error);
    res.status(500).json({
      status: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// Cập nhật phim
exports.updateMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    
    // Xử lý file upload nếu có
    if (req.file) {
      updateData.poster = `/images/movies/${req.file.filename}`;
    }
    
    updateData.updated_by = req.user?.id || 1;
    
    const movie = await Movie.update(id, updateData);
    
    res.status(200).json({
      status: true,
      movie,
      message: 'Cập nhật phim thành công'
    });
  } catch (error) {
    console.error('Error updating movie:', error);
    res.status(500).json({
      status: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// Xóa phim
exports.deleteMovie = async (req, res) => {
  try {
    const { id } = req.params;
    await Movie.delete(id, 1);
    
    res.status(200).json({
      status: true,
      message: 'Xóa phim thành công'
    });
  } catch (error) {
    console.error('Error deleting movie:', error);
    res.status(500).json({
      status: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// Đánh giá phim - Không cần login
exports.reviewMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, review, user_name = 'Anonymous' } = req.body;
    
    if (!rating || rating < 1 || rating > 10) {
      return res.status(400).json({
        status: false,
        message: 'Điểm đánh giá phải từ 1-10'
      });
    }
    
    await Movie.addReview(id, null, rating, review, user_name);
    
    res.status(201).json({
      status: true,
      message: 'Đánh giá phim thành công'
    });
  } catch (error) {
    console.error('Error reviewing movie:', error);
    res.status(400).json({
      status: false,
      message: error.message
    });
  }
};

// Lấy phim theo thể loại
exports.getMoviesByGenre = async (req, res) => {
  try {
    const { genre } = req.params;
    const movies = await Movie.findByGenre(genre);
    
    res.status(200).json({
      status: true,
      movies,
      message: `Lấy phim thể loại ${genre} thành công`
    });
  } catch (error) {
    console.error('Error getting movies by genre:', error);
    res.status(500).json({
      status: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// Lấy phim hot/nổi bật
exports.getHotMovies = async (req, res) => {
  try {
    const { connectSqlServer } = require('../config/sqlServer');
    const pool = await connectSqlServer();
    
    const result = await pool.request().query(`
      SELECT TOP 10 m.*, 
             AVG(CAST(mr.rating as FLOAT)) as avg_rating,
             COUNT(mr.id) as review_count
      FROM Movies m
      LEFT JOIN MovieReviews mr ON m.id = mr.movie_id
      WHERE m.status = 1
      GROUP BY m.id, m.title, m.slug, m.description, m.director, m.cast, 
               m.genre, m.release_date, m.duration, m.rating, m.poster, 
               m.trailer_url, m.video_url, m.video_file, m.video_size, m.video_duration,
               m.imdb_id, m.country, m.language, m.view_count, 
               m.status, m.created_by, m.updated_by, m.created_at, m.updated_at
      ORDER BY m.view_count DESC, avg_rating DESC
    `);
    
    res.status(200).json({
      status: true,
      movies: result.recordset,
      message: 'Lấy phim hot thành công'
    });
  } catch (error) {
    console.error('Error getting hot movies:', error);
    res.status(500).json({
      status: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// Tìm kiếm phim
exports.searchMovies = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({
        status: false,
        message: 'Từ khóa tìm kiếm không được để trống'
      });
    }
    
    const movies = await Movie.search(q);
    
    res.status(200).json({
      status: true,
      movies,
      message: 'Tìm kiếm thành công'
    });
  } catch (error) {
    console.error('Error searching movies:', error);
    res.status(500).json({
      status: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// Thay đổi trạng thái phim
exports.changeMovieStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const movie = await Movie.findById(id);
    
    if (!movie) {
      return res.status(404).json({
        status: false,
        message: 'Không tìm thấy phim'
      });
    }
    
    // Đảo ngược trạng thái (1 -> 2, 2 -> 1)
    const newStatus = movie.status === 1 ? 2 : 1;
    await Movie.updateStatus(id, newStatus, 1);
    
    res.status(200).json({
      status: true,
      message: 'Cập nhật trạng thái thành công'
    });
  } catch (error) {
    console.error('Error changing movie status:', error);
    res.status(500).json({
      status: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// Lấy reviews của phim
exports.getMovieReviews = async (req, res) => {
  try {
    const { id } = req.params;
    const reviews = await Movie.getReviews(id);
    
    res.status(200).json({
      status: true,
      reviews,
      message: 'Lấy đánh giá thành công'
    });
  } catch (error) {
    console.error('Error getting reviews:', error);
    res.status(500).json({
      status: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// Thống kê phim cho admin
exports.getMovieStats = async (req, res) => {
  try {
    const { connectSqlServer } = require('../config/sqlServer');
    const pool = await connectSqlServer();
    
    // Tổng số phim
    const totalMovies = await pool.request().query(`
      SELECT COUNT(*) as total FROM Movies WHERE status != 0
    `);
    
    // Phim theo trạng thái
    const statusStats = await pool.request().query(`
      SELECT 
        status,
        COUNT(*) as count,
        CASE 
          WHEN status = 1 THEN 'Active'
          WHEN status = 2 THEN 'Inactive'
          ELSE 'Unknown'
        END as status_name
      FROM Movies 
      WHERE status != 0
      GROUP BY status
    `);
    
    // Top phim có rating cao
    const topRatedMovies = await pool.request().query(`
      SELECT TOP 5
        m.id, m.title, 
        AVG(CAST(mr.rating as FLOAT)) as avg_rating,
        COUNT(mr.id) as review_count
      FROM Movies m
      LEFT JOIN MovieReviews mr ON m.id = mr.movie_id
      WHERE m.status = 1
      GROUP BY m.id, m.title
      HAVING COUNT(mr.id) > 0
      ORDER BY avg_rating DESC
    `);
    
    // Phim theo thể loại
    const genreStats = await pool.request().query(`
      SELECT 
        genre,
        COUNT(*) as count
      FROM Movies 
      WHERE status = 1 AND genre IS NOT NULL
      GROUP BY genre
      ORDER BY count DESC
    `);
    
    res.json({
      success: true,
      data: {
        total: totalMovies.recordset[0].total,
        statusStats: statusStats.recordset,
        topRated: topRatedMovies.recordset,
        genreStats: genreStats.recordset
      }
    });
  } catch (error) {
    console.error('Error getting movie stats:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thống kê phim'
    });
  }
};

// Lấy phim theo trạng thái cho admin
exports.getMoviesByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const movies = await Movie.findByStatus(parseInt(status));
    
    res.status(200).json({
      status: true,
      movies,
      message: `Lấy phim trạng thái ${status} thành công`
    });
  } catch (error) {
    console.error('Error getting movies by status:', error);
    res.status(500).json({
      status: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// Sync videos từ Documents sang Movies
exports.syncVideosFromDocuments = async (req, res) => {
  try {
    const { connectSqlServer } = require('../config/sqlServer');
    const pool = await connectSqlServer();
    
    // Lấy tất cả video từ Documents
    const videoDocuments = await pool.request().query(`
      SELECT * FROM Documents 
      WHERE category = 'video' OR file_type LIKE 'video%'
      ORDER BY created_at DESC
    `);
    
    const syncedMovies = [];
    
    for (const doc of videoDocuments.recordset) {
      // Kiểm tra xem đã có trong Movies chưa
      const existingMovie = await pool.request()
        .input('title', doc.title)
        .query(`SELECT id FROM Movies WHERE title = @title`);
      
      if (existingMovie.recordset.length === 0) {
        // Tạo slug từ title
        const slug = doc.title.toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim('-');
        
        // Tạo movie mới
        const movieData = {
          title: doc.title,
          slug: slug + '-' + Date.now(),
          description: doc.description || `Video: ${doc.original_name}`,
          director: 'Unknown',
          cast: '',
          genre: 'Video',
          release_date: doc.created_at,
          duration: null,
          rating: 0,
          poster: null,
          video_url: doc.file_path,
          video_file: doc.original_name,
          video_size: doc.file_size,
          video_duration: null,
          trailer_url: null,
          imdb_id: null,
          country: 'Vietnam',
          language: 'Vietnamese',
          view_count: 0,
          status: 1,
          created_by: doc.created_by || 1,
          updated_by: doc.created_by || 1
        };
        
        const result = await pool.request()
          .input('title', movieData.title)
          .input('slug', movieData.slug)
          .input('description', movieData.description)
          .input('director', movieData.director)
          .input('cast', movieData.cast)
          .input('genre', movieData.genre)
          .input('release_date', movieData.release_date)
          .input('duration', movieData.duration)
          .input('rating', movieData.rating)
          .input('poster', movieData.poster)
          .input('video_url', movieData.video_url)
          .input('video_file', movieData.video_file)
          .input('video_size', movieData.video_size)
          .input('video_duration', movieData.video_duration)
          .input('trailer_url', movieData.trailer_url)
          .input('imdb_id', movieData.imdb_id)
          .input('country', movieData.country)
          .input('language', movieData.language)
          .input('view_count', movieData.view_count)
          .input('status', movieData.status)
          .input('created_by', movieData.created_by)
          .input('updated_by', movieData.updated_by)
          .query(`
            INSERT INTO Movies (
              title, slug, description, director, cast, genre, release_date,
              duration, rating, poster, video_url, video_file, video_size, 
              video_duration, trailer_url, imdb_id, country, language, 
              view_count, status, created_by, updated_by, created_at, updated_at
            ) VALUES (
              @title, @slug, @description, @director, @cast, @genre, @release_date,
              @duration, @rating, @poster, @video_url, @video_file, @video_size,
              @video_duration, @trailer_url, @imdb_id, @country, @language,
              @view_count, @status, @created_by, @updated_by, GETDATE(), GETDATE()
            );
            SELECT SCOPE_IDENTITY() as id;
          `);
        
        syncedMovies.push({
          id: result.recordset[0].id,
          ...movieData,
          source_document_id: doc.id
        });
      }
    }
    
    res.json({
      status: true,
      message: `Đã sync ${syncedMovies.length} video thành phim`,
      synced_movies: syncedMovies,
      total_videos_found: videoDocuments.recordset.length
    });
    
  } catch (error) {
    console.error('Error syncing videos:', error);
    res.status(500).json({
      status: false,
      message: 'Lỗi khi sync videos',
      error: error.message
    });
  }
};


