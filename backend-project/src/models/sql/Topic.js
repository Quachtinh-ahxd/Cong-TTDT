const sql = require('mssql');
const slugify = require('slugify');
const { connectSqlServer } = require('../../config/sqlServer');

class Topic {
  static tableName = 'Topics';

  // Lấy tất cả chủ đề
  static async findAll() {
    try {
      const pool = await connectSqlServer();
      const result = await pool.request()
        .query(`
          SELECT * FROM [${this.tableName}]
          WHERE status != 0
          ORDER BY created_at DESC
        `);
      
      return result.recordset;
    } catch (error) {
      console.error('Error in Topic.findAll:', error);
      throw error;
    }
  }

  // Tìm chủ đề theo ID
  static async findById(id) {
    try {
      console.log(`Finding topic with ID: ${id}`);
      
      const pool = await connectSqlServer();
      const result = await pool.request()
        .input('id', sql.Int, id)
        .query(`
          SELECT t.*, p.name as parent_name
          FROM ${this.tableName} t
          LEFT JOIN ${this.tableName} p ON t.parent_id = p.id
          WHERE t.id = @id AND t.status != 0
        `);
      
      if (result.recordset.length === 0) {
        return null;
      }
      
      return result.recordset[0];
    } catch (error) {
      console.error('Error in Topic.findById:', error);
      throw error;
    }
  }

  // Tạo chủ đề mới
  static async create(topicData) {
    try {
      console.log('Creating topic with data:', topicData);
      
      // Tạo slug từ tên
      const slug = slugify(topicData.name, {
        lower: true,
        strict: true,
        locale: 'vi'
      });
      
      // Kiểm tra slug đã tồn tại chưa
      const pool = await connectSqlServer();
      const checkResult = await pool.request()
        .input('slug', sql.VarChar(255), slug)
        .query(`
          SELECT COUNT(*) as count FROM ${this.tableName}
          WHERE slug = @slug
        `);
      
      // Nếu slug đã tồn tại, tạo slug duy nhất
      let finalSlug = slug;
      if (checkResult.recordset[0].count > 0) {
        const timestamp = Date.now();
        finalSlug = `${slug}-${timestamp}`;
      }
      
      // Thêm chủ đề mới
      const result = await pool.request()
        .input('name', sql.NVarChar(255), topicData.name)
        .input('slug', sql.VarChar(255), finalSlug)
        .input('parent_id', sql.Int, topicData.parent_id || null)
        .input('image', sql.VarChar(255), topicData.image || null)
        .input('description', sql.NVarChar(1000), topicData.description || null)
        .input('status', sql.Int, topicData.status || 2)
        .input('created_by', sql.Int, topicData.created_by || 1)
        .query(`
          INSERT INTO ${this.tableName} (
            name, slug, parent_id, image, description, status, created_by
          )
          VALUES (
            @name, @slug, @parent_id, @image, @description, @status, @created_by
          );
          SELECT SCOPE_IDENTITY() AS id;
        `);
      
      // Lấy chủ đề vừa thêm
      const id = result.recordset[0].id;
      return this.findById(id);
    } catch (error) {
      console.error('Error in Topic.create:', error);
      throw error;
    }
  }

  // Cập nhật chủ đề
  static async update(id, topicData) {
    try {
      console.log(`Updating topic ${id} with data:`, topicData);
      
      // Nếu tên thay đổi, cập nhật slug
      let slug = null;
      if (topicData.name) {
        slug = slugify(topicData.name, {
          lower: true,
          strict: true,
          locale: 'vi'
        });
        
        // Kiểm tra slug đã tồn tại cho chủ đề khác chưa
        const pool = await connectSqlServer();
        const checkResult = await pool.request()
          .input('slug', sql.VarChar(255), slug)
          .input('id', sql.Int, id)
          .query(`
            SELECT COUNT(*) as count FROM ${this.tableName}
            WHERE slug = @slug AND id != @id
          `);
        
        // Nếu slug đã tồn tại cho chủ đề khác, tạo slug duy nhất
        if (checkResult.recordset[0].count > 0) {
          const timestamp = Date.now();
          slug = `${slug}-${timestamp}`;
        }
      }
      
      // Xây dựng câu truy vấn cập nhật động
      const updateParts = [];
      const pool = await connectSqlServer();
      const request = pool.request().input('id', sql.Int, id);
      
      // Cập nhật các trường nếu được cung cấp
      if (topicData.name) {
        updateParts.push('name = @name');
        request.input('name', sql.NVarChar(255), topicData.name);
        
        updateParts.push('slug = @slug');
        request.input('slug', sql.VarChar(255), slug);
      }
      
      if (topicData.parent_id !== undefined) {
        updateParts.push('parent_id = @parent_id');
        request.input('parent_id', sql.Int, topicData.parent_id);
      }
      
      if (topicData.image !== undefined) {
        updateParts.push('image = @image');
        request.input('image', sql.VarChar(255), topicData.image);
      }
      
      if (topicData.description !== undefined) {
        updateParts.push('description = @description');
        request.input('description', sql.NVarChar(1000), topicData.description);
      }
      
      if (topicData.status !== undefined) {
        updateParts.push('status = @status');
        request.input('status', sql.Int, topicData.status);
      }
      
      // Luôn cập nhật updated_by và updated_at
      updateParts.push('updated_by = @updated_by');
      updateParts.push('updated_at = GETDATE()');
      request.input('updated_by', sql.Int, topicData.updated_by || 1);
      
      // Nếu không có trường nào cần cập nhật, trả về chủ đề
      if (updateParts.length === 0) {
        return this.findById(id);
      }
      
      // Thực thi câu truy vấn cập nhật
      await request.query(`
        UPDATE ${this.tableName}
        SET ${updateParts.join(', ')}
        WHERE id = @id
      `);
      
      // Trả về chủ đề đã cập nhật
      return this.findById(id);
    } catch (error) {
      console.error('Error in Topic.update:', error);
      throw error;
    }
  }

  // Xóa chủ đề (soft delete)
  static async delete(id, userId) {
    try {
      console.log(`Deleting topic with ID: ${id}`);
      
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
      console.error('Error in Topic.delete:', error);
      throw error;
    }
  }

  // Cập nhật trạng thái chủ đề
  static async updateStatus(id, status, updatedBy = 1) {
    try {
      console.log(`Updating topic ${id} status to ${status}`);
      
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
      console.error('Error in Topic.updateStatus:', error);
      throw error;
    }
  }

  static async getAll() {
    try {
      const pool = await connectSqlServer();
      const result = await pool.request().query(`
        SELECT * FROM [${this.tableName}]
        ORDER BY id DESC
      `);
      return result.recordset;
    } catch (error) {
      console.error('❌ Topic.getAll error:', error); // Thêm log này để debug
      throw error;
    }
  }
}

module.exports = Topic;


