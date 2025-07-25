const sql = require('mssql');
const { connectSqlServer } = require('../../config/sqlServer');

class Document {
  static tableName = 'Documents';

  static async create(documentData) {
    try {
      const category = 'tai-lieu';
      
      const pool = await connectSqlServer();
      const result = await pool.request()
        .input('title', sql.NVarChar(255), documentData.title)
        .input('description', sql.NVarChar(1000), documentData.description || null)
        .input('category', sql.VarChar(50), category)
        .input('file_path', sql.VarChar(500), documentData.file_path)
        .input('original_name', sql.NVarChar(255), documentData.original_name)
        .input('file_size', sql.BigInt, documentData.file_size)
        .input('file_type', sql.VarChar(100), documentData.file_type)
        .input('created_by', sql.Int, documentData.created_by || null)
        .query(`
          INSERT INTO Documents (
            title, description, category, file_path, original_name, 
            file_size, file_type, created_by, status, createdAt
          )
          VALUES (
            @title, @description, @category, @file_path, @original_name,
            @file_size, @file_type, @created_by, 'active', GETDATE()
          );
          SELECT SCOPE_IDENTITY() as id;
        `);
      
      return { id: result.recordset[0].id, ...documentData, category };
    } catch (error) {
      console.error('Error creating document:', error);
      throw error;
    }
  }

  static async findAll() {
    try {
      const pool = await connectSqlServer();
      const result = await pool.request().query(`
        SELECT d.*, u.name as created_by_name, u.username as created_by_username
        FROM Documents d
        LEFT JOIN Users u ON d.created_by = u.id
        WHERE d.status = 'active'
        ORDER BY d.createdAt DESC
      `);
      
      return result.recordset;
    } catch (error) {
      console.error('Error in Document.findAll:', error);
      throw error;
    }
  }

  static async findById(id) {
    try {
      const pool = await connectSqlServer();
      const result = await pool.request()
        .input('id', sql.Int, id)
        .query(`SELECT * FROM ${this.tableName} WHERE id = @id AND status = 'active'`);
      
      return result.recordset[0];
    } catch (error) {
      console.error('Error in Document.findById:', error);
      throw error;
    }
  }

  static async delete(id, deletedBy) {
    try {
      const pool = await connectSqlServer();
      await pool.request()
        .input('id', sql.Int, id)
        .query(`
          DELETE FROM ${this.tableName} 
          WHERE id = @id
        `);
      
      return true;
    } catch (error) {
      console.error('Error in Document.delete:', error);
      throw error;
    }
  }

  static async incrementDownloads(id) {
    try {
      const pool = await connectSqlServer();
      await pool.request()
        .input('id', sql.Int, id)
        .query(`
          UPDATE ${this.tableName} 
          SET downloads = downloads + 1 
          WHERE id = @id
        `);
      
      return true;
    } catch (error) {
      console.error('Error incrementing downloads:', error);
      throw error;
    }
  }

  static async findByCategory(category, options = {}) {
    try {
      const { page = 1, limit = 20 } = options;
      const offset = (page - 1) * limit;
      
      const pool = await connectSqlServer();
      const result = await pool.request()
        .input('category', sql.VarChar(100), category)
        .input('limit', sql.Int, limit)
        .input('offset', sql.Int, offset)
        .query(`
          SELECT * FROM ${this.tableName} 
          WHERE category = @category AND status = 'active'
          ORDER BY createdAt DESC
          OFFSET @offset ROWS
          FETCH NEXT @limit ROWS ONLY
        `);
      
      return result.recordset;
    } catch (error) {
      console.error('Error in Document.findByCategory:', error);
      throw error;
    }
  }
}

module.exports = Document;





