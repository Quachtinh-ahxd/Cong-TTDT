const { connectSqlServer } = require('../../config/sqlServer');
const sql = require('mssql');
const slugify = require('slugify');

class Movie {
  static tableName = 'Movies';

  // Lấy tất cả phim
  static async findAll(filters = {}) {
    try {
      const pool = await connectSqlServer();
      let query = `
        SELECT m.*, 
               AVG(CAST(mr.rating AS FLOAT)) as avg_rating,
               COUNT(mr.id) as review_count
        FROM ${this.tableName} m
        LEFT JOIN MovieReviews mr ON m.id = mr.movie_id AND mr.status = 1
        WHERE m.status != 0
      `;
      
      const params = [];
      
      // Filter theo thể loại
      if (filters.genre) {
        query += ` AND m.genre LIKE @genre`;
        params.push({ name: 'genre', type: sql.NVarChar(255), value: `%${filters.genre}%` });
      }
      
      // Filter theo năm
      if (filters.year) {
        query += ` AND YEAR(m.release_date) = @year`;
        params.push({ name: 'year', type: sql.Int, value: filters.year });
      }
      
      // Search theo tên
      if (filters.search) {
        query += ` AND (m.title LIKE @search OR m.director LIKE @search OR m.cast LIKE @search)`;
        params.push({ name: 'search', type: sql.NVarChar(255), value: `%${filters.search}%` });
      }
      
      query += `
        GROUP BY m.id, m.title, m.slug, m.description, m.director, m.cast, 
                 m.genre, m.release_date, m.duration, m.rating, m.poster, 
                 m.trailer_url, m.video_url, m.video_file, m.video_size, m.video_duration,
                 m.imdb_id, m.country, m.language, m.view_count, 
                 m.status, m.created_by, m.updated_by, m.created_at, m.updated_at
        ORDER BY m.created_at DESC
      `;
      
      const request = pool.request();
      params.forEach(param => {
        request.input(param.name, param.type, param.value);
      });
      
      const result = await request.query(query);
      return result.recordset;
    } catch (error) {
      console.error('Error in Movie.findAll:', error);
      throw error;
    }
  }

  // Lấy phim theo ID
  static async findById(id) {
    try {
      const pool = await connectSqlServer();
      const result = await pool.request()
        .input('id', sql.Int, id)
        .query(`
          SELECT m.*, 
                 AVG(CAST(mr.rating AS FLOAT)) as avg_rating,
                 COUNT(mr.id) as review_count
          FROM ${this.tableName} m
          LEFT JOIN MovieReviews mr ON m.id = mr.movie_id AND mr.status = 1
          WHERE m.id = @id AND m.status != 0
          GROUP BY m.id, m.title, m.slug, m.description, m.director, m.cast, 
                   m.genre, m.release_date, m.duration, m.rating, m.poster, 
                   m.trailer_url, m.video_url, m.video_file, m.video_size, m.video_duration,
                   m.imdb_id, m.country, m.language, m.view_count, 
                   m.status, m.created_by, m.updated_by, m.created_at, m.updated_at
        `);
      
      if (result.recordset.length === 0) return null;
      
      // Tăng view count
      await pool.request()
        .input('id', sql.Int, id)
        .query(`UPDATE ${this.tableName} SET view_count = view_count + 1 WHERE id = @id`);
      
      return result.recordset[0];
    } catch (error) {
      console.error('Error in Movie.findById:', error);
      throw error;
    }
  }

  // Tạo phim mới
  static async create(movieData) {
    try {
      const pool = await connectSqlServer();
      
      // Tạo slug
      let baseSlug = slugify(movieData.title, { lower: true, strict: true });
      let finalSlug = baseSlug;
      let counter = 1;
      
      // Kiểm tra slug trùng
      while (true) {
        const existingMovie = await pool.request()
          .input('slug', sql.VarChar(255), finalSlug)
          .query(`SELECT id FROM ${this.tableName} WHERE slug = @slug`);
        
        if (existingMovie.recordset.length === 0) break;
        finalSlug = `${baseSlug}-${counter}`;
        counter++;
      }
      
      const result = await pool.request()
        .input('title', sql.NVarChar(255), movieData.title)
        .input('slug', sql.VarChar(255), finalSlug)
        .input('description', sql.NVarChar(sql.MAX), movieData.description || null)
        .input('director', sql.NVarChar(255), movieData.director || null)
        .input('cast', sql.NVarChar(sql.MAX), movieData.cast || null)
        .input('genre', sql.NVarChar(255), movieData.genre || null)
        .input('release_date', sql.Date, movieData.release_date || null)
        .input('duration', sql.Int, movieData.duration || null)
        .input('poster', sql.VarChar(500), movieData.poster || null)
        .input('trailer_url', sql.VarChar(500), movieData.trailer_url || null)
        .input('imdb_id', sql.VarChar(50), movieData.imdb_id || null)
        .input('country', sql.NVarChar(100), movieData.country || null)
        .input('language', sql.NVarChar(100), movieData.language || null)
        .input('status', sql.Int, movieData.status || 2)
        .input('created_by', sql.Int, movieData.created_by || 1)
        .query(`
          INSERT INTO ${this.tableName} (
            title, slug, description, director, cast, genre, release_date, 
            duration, poster, trailer_url, imdb_id, country, language, 
            status, created_by
          )
          VALUES (
            @title, @slug, @description, @director, @cast, @genre, @release_date,
            @duration, @poster, @trailer_url, @imdb_id, @country, @language,
            @status, @created_by
          );
          SELECT SCOPE_IDENTITY() AS id;
        `);
      
      const movieId = result.recordset[0].id;
      return await this.findById(movieId);
    } catch (error) {
      console.error('Error in Movie.create:', error);
      throw error;
    }
  }

  // Thêm đánh giá phim
  static async addReview(movieId, userId, rating, review, userName = null) {
    try {
      const pool = await connectSqlServer();
      
      // Kiểm tra đã đánh giá chưa (chỉ check nếu có userId)
      if (userId) {
        const existingReview = await pool.request()
          .input('movieId', sql.Int, movieId)
          .input('userId', sql.Int, userId)
          .query(`SELECT id FROM MovieReviews WHERE movie_id = @movieId AND user_id = @userId`);
        
        if (existingReview.recordset.length > 0) {
          throw new Error('Bạn đã đánh giá phim này rồi!');
        }
      }
      
      await pool.request()
        .input('movieId', sql.Int, movieId)
        .input('userId', sql.Int, userId)
        .input('rating', sql.Int, rating)
        .input('review', sql.NVarChar(sql.MAX), review)
        .input('userName', sql.NVarChar(100), userName)
        .query(`
          INSERT INTO MovieReviews (movie_id, user_id, rating, review, user_name)
          VALUES (@movieId, @userId, @rating, @review, @userName)
        `);
      
      return true;
    } catch (error) {
      console.error('Error in Movie.addReview:', error);
      throw error;
    }
  }

  // Cập nhật phim
  static async update(id, updateData) {
    try {
      const pool = await connectSqlServer();
      
      // Tạo slug mới nếu title thay đổi
      if (updateData.title) {
        let baseSlug = slugify(updateData.title, { lower: true, strict: true });
        let finalSlug = baseSlug;
        let counter = 1;
        
        while (true) {
          const existingMovie = await pool.request()
            .input('slug', sql.VarChar(255), finalSlug)
            .input('id', sql.Int, id)
            .query(`SELECT id FROM ${this.tableName} WHERE slug = @slug AND id != @id`);
          
          if (existingMovie.recordset.length === 0) break;
          finalSlug = `${baseSlug}-${counter}`;
          counter++;
        }
        updateData.slug = finalSlug;
      }
      
      const fields = [];
      const request = pool.request();
      
      Object.keys(updateData).forEach(key => {
        if (updateData[key] !== undefined) {
          fields.push(`${key} = @${key}`);
          request.input(key, updateData[key]);
        }
      });
      
      request.input('id', sql.Int, id);
      request.input('updated_at', sql.DateTime, new Date());
      fields.push('updated_at = @updated_at');
      
      await request.query(`
        UPDATE ${this.tableName} 
        SET ${fields.join(', ')}
        WHERE id = @id
      `);
      
      return await this.findById(id);
    } catch (error) {
      console.error('Error in Movie.update:', error);
      throw error;
    }
  }

  // Xóa phim (soft delete)
  static async delete(id, deletedBy) {
    try {
      const pool = await connectSqlServer();
      await pool.request()
        .input('id', sql.Int, id)
        .input('updated_by', sql.Int, deletedBy)
        .query(`
          UPDATE ${this.tableName} 
          SET status = 0, updated_by = @updated_by, updated_at = GETDATE()
          WHERE id = @id
        `);
      
      return true;
    } catch (error) {
      console.error('Error in Movie.delete:', error);
      throw error;
    }
  }

  // Cập nhật trạng thái
  static async updateStatus(id, status, updatedBy) {
    try {
      const pool = await connectSqlServer();
      await pool.request()
        .input('id', sql.Int, id)
        .input('status', sql.Int, status)
        .input('updated_by', sql.Int, updatedBy)
        .query(`
          UPDATE ${this.tableName} 
          SET status = @status, updated_by = @updated_by, updated_at = GETDATE()
          WHERE id = @id
        `);
      
      return true;
    } catch (error) {
      console.error('Error in Movie.updateStatus:', error);
      throw error;
    }
  }

  // Lấy reviews của phim
  static async getReviews(movieId) {
    try {
      const pool = await connectSqlServer();
      const result = await pool.request()
        .input('movieId', sql.Int, movieId)
        .query(`
          SELECT mr.*, u.name as user_name
          FROM MovieReviews mr
          LEFT JOIN Users u ON mr.user_id = u.id
          WHERE mr.movie_id = @movieId AND mr.status = 1
          ORDER BY mr.created_at DESC
        `);
      
      return result.recordset;
    } catch (error) {
      console.error('Error in Movie.getReviews:', error);
      throw error;
    }
  }

  // Lấy phim theo trạng thái
  static async findByStatus(status) {
    try {
      const pool = await connectSqlServer();
      const result = await pool.request()
        .input('status', sql.Int, status)
        .query(`
          SELECT m.*, 
                 AVG(CAST(mr.rating as FLOAT)) as avg_rating,
                 COUNT(mr.id) as review_count
          FROM ${this.tableName} m
          LEFT JOIN MovieReviews mr ON m.id = mr.movie_id
          WHERE m.status = @status
          GROUP BY m.id, m.title, m.slug, m.description, m.director, m.cast, 
                   m.genre, m.release_date, m.duration, m.rating, m.poster, 
                   m.trailer_url, m.video_url, m.video_file, m.video_size, m.video_duration,
                   m.imdb_id, m.country, m.language, m.view_count, 
                   m.status, m.created_by, m.updated_by, m.created_at, m.updated_at
          ORDER BY m.created_at DESC
        `);
      
      return result.recordset;
    } catch (error) {
      console.error('Error in Movie.findByStatus:', error);
      throw error;
    }
  }

  // Bulk update status
  static async bulkUpdateStatus(ids, status, updatedBy) {
    try {
      const pool = await connectSqlServer();
      const idsString = ids.join(',');
      
      await pool.request()
        .input('status', sql.Int, status)
        .input('updated_by', sql.Int, updatedBy)
        .query(`
          UPDATE ${this.tableName} 
          SET status = @status, updated_by = @updated_by, updated_at = GETDATE()
          WHERE id IN (${idsString})
        `);
      
      return true;
    } catch (error) {
      console.error('Error in Movie.bulkUpdateStatus:', error);
      throw error;
    }
  }

  // Tìm kiếm phim
  static async search(keyword) {
    try {
      const pool = await connectSqlServer();
      const result = await pool.request()
        .input('keyword', sql.NVarChar(255), `%${keyword}%`)
        .query(`
          SELECT m.*, 
                 AVG(CAST(mr.rating as FLOAT)) as avg_rating,
                 COUNT(mr.id) as review_count
          FROM ${this.tableName} m
          LEFT JOIN MovieReviews mr ON m.id = mr.movie_id
          WHERE m.status = 1 AND (
            m.title LIKE @keyword OR 
            m.description LIKE @keyword OR
            m.director LIKE @keyword OR
            m.cast LIKE @keyword OR
            m.genre LIKE @keyword
          )
          GROUP BY m.id, m.title, m.slug, m.description, m.director, m.cast, 
                   m.genre, m.release_date, m.duration, m.rating, m.poster, 
                   m.trailer_url, m.video_url, m.video_file, m.video_size, m.video_duration,
                   m.imdb_id, m.country, m.language, m.view_count, 
                   m.status, m.created_by, m.updated_by, m.created_at, m.updated_at
          ORDER BY m.created_at DESC
        `);
      
      return result.recordset;
    } catch (error) {
      console.error('Error in Movie.search:', error);
      throw error;
    }
  }

  // Lấy phim theo thể loại
  static async findByGenre(genre) {
    try {
      const pool = await connectSqlServer();
      const result = await pool.request()
        .input('genre', sql.NVarChar(100), `%${genre}%`)
        .query(`
          SELECT m.*, 
                 AVG(CAST(mr.rating as FLOAT)) as avg_rating,
                 COUNT(mr.id) as review_count
          FROM ${this.tableName} m
          LEFT JOIN MovieReviews mr ON m.id = mr.movie_id
          WHERE m.status = 1 AND m.genre LIKE @genre
          GROUP BY m.id, m.title, m.slug, m.description, m.director, m.cast, 
                   m.genre, m.release_date, m.duration, m.rating, m.poster, 
                   m.trailer_url, m.video_url, m.video_file, m.video_size, m.video_duration,
                   m.imdb_id, m.country, m.language, m.view_count, 
                   m.status, m.created_by, m.updated_by, m.created_at, m.updated_at
          ORDER BY m.created_at DESC
        `);
      
      return result.recordset;
    } catch (error) {
      console.error('Error in Movie.findByGenre:', error);
      throw error;
    }
  }
}

module.exports = Movie;








