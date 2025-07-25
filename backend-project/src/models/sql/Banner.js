const sql = require('mssql');
const slugify = require('slugify');
const { connectSqlServer } = require('../../config/sqlServer');

class Banner {
  static tableName = 'Banners';

  // Lấy tất cả banner
  static async findAll() {
    try {
      const pool = await connectSqlServer();
      const result = await pool.request()
        .query(`SELECT * FROM ${this.tableName} WHERE status != 0 ORDER BY created_at DESC`);
      return result.recordset;
    } catch (error) {
      console.error('Error in Banner.findAll:', error);
      throw error;
    }
  }

  // Lấy banner theo ID
  static async findById(id) {
    try {
      const pool = await connectSqlServer();
      const result = await pool.request()
        .input('id', sql.Int, id)
        .query(`SELECT * FROM ${this.tableName} WHERE id = @id AND status != 0`);
      
      if (result.recordset.length === 0) {
        return null;
      }
      
      return result.recordset[0];
    } catch (error) {
      console.error('Error in Banner.findById:', error);
      throw error;
    }
  }

  // Tạo banner mới
  static async create(bannerData) {
    try {
      console.log('Creating banner with data:', bannerData);
      
      // Tạo slug từ tên
      const slug = slugify(bannerData.name, {
        lower: true,
        strict: true,
        locale: 'vi'
      });
      
      const pool = await connectSqlServer();
      const result = await pool.request()
        .input('name', sql.NVarChar(255), bannerData.name)
        .input('slug', sql.VarChar(255), slug)
        .input('image', sql.VarChar(255), bannerData.image || null)
        .input('link', sql.VarChar(1000), bannerData.link || '#')
        .input('position', sql.VarChar(50), bannerData.position || 'homepage_top')
        .input('description', sql.NVarChar(1000), bannerData.description || null)
        .input('status', sql.Int, bannerData.status || 2)
        .input('created_by', sql.Int, bannerData.created_by || 1)
        .query(`
          INSERT INTO ${this.tableName} (
            name, slug, image, link, position, 
            description, status, created_by
          )
          VALUES (
            @name, @slug, @image, @link, @position, 
            @description, @status, @created_by
          );
          SELECT SCOPE_IDENTITY() AS id;
        `);
      
      const id = result.recordset[0].id;
      
      // Lấy banner vừa tạo
      const banner = await this.findById(id);
      
      return banner;
    } catch (error) {
      console.error('Error in Banner.create:', error);
      throw error;
    }
  }

  // Cập nhật banner
  static async update(id, bannerData) {
    try {
      console.log(`Updating banner ${id} with data:`, bannerData);
      
      // Nếu tên thay đổi, cập nhật slug
      let slug = null;
      if (bannerData.name) {
        slug = slugify(bannerData.name, {
          lower: true,
          strict: true,
          locale: 'vi'
        });
      }
      
      // Xây dựng câu truy vấn cập nhật động
      const updateParts = [];
      const pool = await connectSqlServer();
      const request = pool.request().input('id', sql.Int, id);
      
      // Cập nhật các trường nếu được cung cấp
      if (bannerData.name) {
        updateParts.push('name = @name');
        request.input('name', sql.NVarChar(255), bannerData.name);
        
        updateParts.push('slug = @slug');
        request.input('slug', sql.VarChar(255), slug);
      }
      
      if (bannerData.image !== undefined) {
        updateParts.push('image = @image');
        request.input('image', sql.VarChar(255), bannerData.image);
      }
      
      if (bannerData.link !== undefined) {
        updateParts.push('link = @link');
        request.input('link', sql.VarChar(1000), bannerData.link);
      }
      
      if (bannerData.position !== undefined) {
        updateParts.push('position = @position');
        request.input('position', sql.VarChar(50), bannerData.position);
      }
      
      if (bannerData.description !== undefined) {
        updateParts.push('description = @description');
        request.input('description', sql.NVarChar(1000), bannerData.description);
      }
      
      if (bannerData.status !== undefined) {
        updateParts.push('status = @status');
        request.input('status', sql.Int, bannerData.status);
      }
      
      // Luôn cập nhật updated_by và updated_at
      updateParts.push('updated_by = @updated_by');
      updateParts.push('updated_at = GETDATE()');
      request.input('updated_by', sql.Int, bannerData.updated_by || 1);
      
      // Nếu không có trường nào cần cập nhật, trả về banner
      if (updateParts.length === 0) {
        return this.findById(id);
      }
      
      // Thực thi câu truy vấn cập nhật
      await request.query(`
        UPDATE ${this.tableName}
        SET ${updateParts.join(', ')}
        WHERE id = @id
      `);
      
      // Trả về banner đã cập nhật
      return this.findById(id);
    } catch (error) {
      console.error('Error in Banner.update:', error);
      throw error;
    }
  }

  // Xóa banner (soft delete)
  static async delete(id, userId) {
    try {
      console.log(`Deleting banner with ID: ${id}`);
      
      const pool = await connectSqlServer();
      await pool.request()
        .input('id', sql.Int, id)
        .input('updated_by', sql.Int, userId || 1)
        .query(`
          UPDATE ${this.tableName}
          SET status = 0,
              updated_by = @updated_by,
              updated_at = GETDATE()
          WHERE id = @id
        `);
      
      return { id };
    } catch (error) {
      console.error('Error in Banner.delete:', error);
      throw error;
    }
  }

  // Cập nhật trạng thái banner
  static async updateStatus(id, status, updatedBy = 1) {
    try {
      console.log(`Updating banner ${id} status to ${status}`);
      
      const pool = await connectSqlServer();
      await pool.request()
        .input('id', sql.Int, id)
        .input('status', sql.Int, status)
        .input('updatedBy', sql.Int, updatedBy)
        .query(`
          UPDATE ${this.tableName}
          SET status = @status,
              updated_by = @updatedBy,
              updated_at = GETDATE()
          WHERE id = @id
        `);
      
      return { id, status };
    } catch (error) {
      console.error('Error in Banner.updateStatus:', error);
      throw error;
    }
  }

  // Lấy banner theo vị trí
  static async findByPosition(position) {
    try {
      const pool = await connectSqlServer();
      const result = await pool.request()
        .input('position', sql.VarChar(50), position)
        .query(`
          SELECT * FROM ${this.tableName}
          WHERE position = @position AND status = 1
          ORDER BY created_at DESC
        `);
      
      return result.recordset;
    } catch (error) {
      console.error('Error in Banner.findByPosition:', error);
      throw error;
    }
  }
}

module.exports = Banner;



