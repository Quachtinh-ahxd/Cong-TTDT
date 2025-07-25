const sql = require('mssql');
const { connectSqlServer } = require('../../config/sqlServer');

class Brand {
  static tableName = 'Brands';

  // GET ALL BRANDS
  static async getAll() {
    try {
      console.log('=== BRAND MODEL GET ALL ===');
      const pool = await connectSqlServer();
      
      const result = await pool.request().query(`
        SELECT 
          id, name, slug, description, status,
          image, created_by, updated_by, created_at, updated_at
        FROM [${this.tableName}]
        WHERE [status] != 0
        ORDER BY created_at DESC
      `);
      
      console.log('Total brands:', result.recordset.length);
      return result.recordset;
    } catch (error) {
      console.error('❌ Brand.getAll error:', error);
      throw error;
    }
  }

  // FIND BY ID
  static async findById(id) {
    try {
      console.log(`=== BRAND FIND BY ID: ${id} ===`);
      const pool = await connectSqlServer();
      
      const result = await pool.request()
        .input('id', sql.Int, id)
        .query(`
          SELECT 
            id, name, slug, description, status,
            image, created_by, updated_by, created_at, updated_at
          FROM [${this.tableName}]
          WHERE id = @id AND [status] != 0
        `);
      
      return result.recordset[0] || null;
    } catch (error) {
      console.error('❌ Brand.findById error:', error);
      throw error;
    }
  }

  // CREATE BRAND
  static async create(brandData) {
    try {
      console.log('=== BRAND CREATE ===');
      console.log('Input brandData:', brandData);
      
      const pool = await connectSqlServer();
      
      // Kiểm tra slug đã tồn tại chưa
      if (brandData.slug) {
        const checkSlug = await pool.request()
          .input('slug', sql.VarChar(255), brandData.slug)
          .query(`
            SELECT COUNT(*) as count FROM [${this.tableName}]
            WHERE slug = @slug AND status != 0
          `);
        
        if (checkSlug.recordset[0].count > 0) {
          throw new Error('Slug đã được sử dụng');
        }
      }
      
      const result = await pool.request()
        .input('name', sql.NVarChar(255), brandData.name)
        .input('slug', sql.VarChar(255), brandData.slug)
        .input('description', sql.NText, brandData.description || '')
        .input('status', sql.Int, brandData.status || 1)
        .input('image', sql.VarChar(255), brandData.image)
        .input('created_by', sql.Int, brandData.created_by || 1)
        .query(`
          INSERT INTO [${this.tableName}] (
            name, slug, description, status, image, 
            created_by, created_at, updated_at
          )
          OUTPUT INSERTED.*
          VALUES (
            @name, @slug, @description, @status, @image,
            @created_by, GETDATE(), GETDATE()
          )
        `);

      console.log('✅ Brand created:', result.recordset[0]);
      return result.recordset[0];
    } catch (error) {
      console.error('❌ Brand.create error:', error);
      throw error;
    }
  }

  // UPDATE BRAND
  static async update(id, brandData) {
    try {
      console.log(`=== BRAND UPDATE ID: ${id} ===`);
      console.log('Update data:', brandData);
      
      const pool = await connectSqlServer();
      
      // Kiểm tra slug đã tồn tại chưa (trừ brand hiện tại)
      if (brandData.slug) {
        const checkSlug = await pool.request()
          .input('slug', sql.VarChar(255), brandData.slug)
          .input('id', sql.Int, id)
          .query(`
            SELECT COUNT(*) as count FROM [${this.tableName}]
            WHERE slug = @slug AND id != @id AND status != 0
          `);
        
        if (checkSlug.recordset[0].count > 0) {
          throw new Error('Slug đã được sử dụng');
        }
      }
      
      const result = await pool.request()
        .input('id', sql.Int, id)
        .input('name', sql.NVarChar(255), brandData.name)
        .input('slug', sql.VarChar(255), brandData.slug)
        .input('description', sql.NText, brandData.description || '')
        .input('status', sql.Int, brandData.status || 1)
        .input('image', sql.VarChar(255), brandData.image)
        .input('updated_by', sql.Int, brandData.updated_by || 1)
        .query(`
          UPDATE [${this.tableName}]
          SET 
            name = @name,
            slug = @slug,
            description = @description,
            status = @status,
            image = @image,
            updated_by = @updated_by,
            updated_at = GETDATE()
          OUTPUT INSERTED.*
          WHERE id = @id
        `);

      console.log('✅ Brand updated:', result.recordset[0]);
      return result.recordset[0];
    } catch (error) {
      console.error('❌ Brand.update error:', error);
      throw error;
    }
  }

  // DELETE BRAND
  static async delete(id) {
    try {
      console.log(`=== DELETE BRAND ID: ${id} ===`);
      const pool = await connectSqlServer();
      
      const result = await pool.request()
        .input('id', sql.Int, id)
        .query(`
          DELETE FROM [${this.tableName}] 
          WHERE id = @id
        `);

      console.log('Brand delete result - rows affected:', result.rowsAffected[0]);
      return result.rowsAffected[0] > 0;
    } catch (error) {
      console.error('❌ Brand.delete error:', error);
      throw error;
    }
  }
}

module.exports = Brand;











