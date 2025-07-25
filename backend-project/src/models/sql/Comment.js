const sql = require('mssql');
const { getConnection } = require('../../config/sql.config');

class Comment {
  static async getAll() {
    try {
      const pool = await getConnection();
      const result = await pool.request().query('SELECT * FROM comments');
      return result.recordset;
    } catch (error) {
      throw error;
    }
  }

  static async create(data) {
    try {
      const pool = await getConnection();
      const result = await pool.request()
        .input('content', sql.NVarChar, data.content)
        .input('user_id', sql.Int, data.user_id)
        .input('product_id', sql.Int, data.product_id)
        .query(`
          INSERT INTO comments (content, user_id, product_id, created_at)
          OUTPUT INSERTED.*
          VALUES (@content, @user_id, @product_id, GETDATE())
        `);
      return result.recordset[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Comment;
