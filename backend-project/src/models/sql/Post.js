const sql = require('mssql');
const { connectSqlServer } = require('../../config/sqlServer');

class Post {
  static tableName = 'Posts';

  // Lấy tất cả bài viết
  static async getAll() {
    try {
      const pool = await connectSqlServer();
      const result = await pool.request().query(`
        SELECT * FROM [dbo].[Posts]
        ORDER BY id DESC
      `);
      console.log('SQL result:', result);
      console.log('Posts:', result.recordset);
      return result.recordset;
    } catch (error) {
      console.error('❌ Post.getAll error:', error);
      throw error;
    }
  }

  // Lấy bài viết theo ID
  static async findById(id) {
    try {
      console.log(`=== POST FIND BY ID: ${id} ===`);
      const pool = await connectSqlServer();
      const result = await pool.request()
        .input('id', sql.Int, id)
        .query(`
          SELECT * FROM [${this.tableName}]
          WHERE id = @id
        `);
      return result.recordset[0] || null;
    } catch (error) {
      console.error('❌ Post.findById error:', error);
      throw error;
    }
  }

  // Thêm bài viết mới
  static async create(postData) {
    try {
      const pool = await connectSqlServer();
      const result = await pool.request()
        .input('title', sql.NVarChar(255), postData.title)
        .input('slug', sql.VarChar(255), postData.slug)
        .input('image', sql.VarChar(255), postData.image)
        .input('detail', sql.NText, postData.detail)
        .input('description', sql.NVarChar(sql.MAX), postData.description)
        .input('type', sql.VarChar(50), postData.type)
        .input('topic_id', sql.Int, postData.topic_id)
        .input('view_count', sql.Int, postData.view_count || 0)
        .input('status', sql.Int, postData.status || 1)
        .input('created_by', sql.Int, postData.created_by || 1)
        .query(`
          INSERT INTO [${this.tableName}]
            (title, slug, image, detail, description, type, topic_id, view_count, status, created_by, created_at, updated_at)
          OUTPUT INSERTED.*
          VALUES
            (@title, @slug, @image, @detail, @description, @type, @topic_id, @view_count, @status, @created_by, GETDATE(), GETDATE())
        `);
      return result.recordset[0];
    } catch (error) {
      console.error('❌ Post.create error:', error);
      throw error;
    }
  }

  // Cập nhật bài viết
  static async update(id, postData) {
    try {
      const pool = await connectSqlServer();
      const result = await pool.request()
        .input('id', sql.Int, id)
        .input('title', sql.NVarChar(255), postData.title)
        .input('slug', sql.VarChar(255), postData.slug)
        .input('image', sql.VarChar(255), postData.image)
        .input('detail', sql.NText, postData.detail)
        .input('description', sql.NVarChar(sql.MAX), postData.description)
        .input('type', sql.VarChar(50), postData.type)
        .input('topic_id', sql.Int, postData.topic_id)
        .input('view_count', sql.Int, postData.view_count || 0)
        .input('status', sql.Int, postData.status || 1)
        .input('updated_by', sql.Int, postData.updated_by || 1)
        .query(`
          UPDATE [${this.tableName}]
          SET
            title = @title,
            slug = @slug,
            image = @image,
            detail = @detail,
            description = @description,
            type = @type,
            topic_id = @topic_id,
            view_count = @view_count,
            status = @status,
            updated_by = @updated_by,
            updated_at = GETDATE()
          OUTPUT INSERTED.*
          WHERE id = @id
        `);
      return result.recordset[0];
    } catch (error) {
      console.error('❌ Post.update error:', error);
      throw error;
    }
  }

  // Xóa bài viết
  static async delete(id) {
    try {
      const pool = await connectSqlServer();
      const result = await pool.request()
        .input('id', sql.Int, id)
        .query(`
          DELETE FROM [${this.tableName}]
          WHERE id = @id
        `);
      return result.rowsAffected[0] > 0;
    } catch (error) {
      console.error('❌ Post.delete error:', error);
      throw error;
    }
  }
}

module.exports = Post;




