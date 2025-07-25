const sql = require('mssql');
const slugify = require('slugify');
const { connectSqlServer } = require('../../config/sqlServer');

class Category {
  static tableName = 'Categories';

  // Tạo danh mục mới
  static async create(categoryData) {
    try {
      console.log('SQL Category.create called with:', categoryData);
      
      // Tạo slug từ tên nếu không có
      if (!categoryData.slug) {
        categoryData.slug = slugify(categoryData.name, {
          lower: true,
          strict: true,
          locale: 'vi'
        });
      }
      
      const pool = await connectSqlServer();
      const result = await pool.request()
        .input('name', sql.NVarChar(255), categoryData.name)
        .input('slug', sql.VarChar(255), categoryData.slug)
        .input('parent_id', sql.Int, categoryData.parent_id || null)
        .input('image', sql.VarChar(255), categoryData.image || null)
        .input('description', sql.NVarChar(1000), categoryData.description || null)
        .input('status', sql.Int, categoryData.status || 1)
        .input('created_by', sql.Int, categoryData.created_by || 1)
        .query(`
          INSERT INTO ${this.tableName} (name, slug, parent_id, image, description, status, created_by)
          VALUES (@name, @slug, @parent_id, @image, @description, @status, @created_by);
          SELECT SCOPE_IDENTITY() AS id;
        `);
      
      const id = result.recordset[0].id;
      console.log('Category created with ID:', id);
      
      // Fetch the created category
      const category = await this.findById(id);
      return category;
    } catch (error) {
      console.error('Error in Category.create:', error);
      throw error;
    }
  }

  // Find category by ID
  static async findById(id) {
    try {
      console.log(`Finding category with ID: ${id}`);
      
      const pool = await connectSqlServer();
      const result = await pool.request()
        .input('id', sql.Int, id)
        .query(`
          SELECT * FROM ${this.tableName}
          WHERE id = @id
        `);
      
      if (result.recordset.length === 0) {
        return null;
      }
      
      return result.recordset[0];
    } catch (error) {
      console.error('Error in Category.findById:', error);
      throw error;
    }
  }

  // Update category
  static async update(id, categoryData) {
    try {
      console.log('Updating category with ID:', id);
      console.log('Update data:', categoryData);
      
      // Get current category
      const currentCategory = await this.findById(id);
      if (!currentCategory) {
        throw new Error('Category not found');
      }
      
      // Build SQL query
      const pool = await connectSqlServer();
      const request = pool.request().input('id', sql.Int, id);
      
      // Create array of SET parts
      const updateParts = [];
      
      // Update name and slug if provided
      if (categoryData.name) {
        const slug = categoryData.slug || slugify(categoryData.name, {
          lower: true,
          strict: true,
          locale: 'vi'
        });
        
        updateParts.push('name = @name');
        updateParts.push('slug = @slug');
        request.input('name', sql.NVarChar(255), categoryData.name);
        request.input('slug', sql.VarChar(255), slug);
      }
      
      // Update parent_id if provided
      if (categoryData.parent_id !== undefined) {
        updateParts.push('parent_id = @parent_id');
        request.input('parent_id', sql.Int, categoryData.parent_id);
      }
      
      // Update image if provided
      if (categoryData.image !== undefined) {
        updateParts.push('image = @image');
        request.input('image', sql.VarChar(255), categoryData.image);
      }
      
      // Update description if provided
      if (categoryData.description !== undefined) {
        updateParts.push('description = @description');
        request.input('description', sql.NVarChar(1000), categoryData.description);
      }
      
      // Update status if provided
      if (categoryData.status !== undefined) {
        updateParts.push('status = @status');
        request.input('status', sql.Int, categoryData.status);
      }
      
      // Always update updated_by and updated_at
      updateParts.push('updated_by = @updated_by');
      updateParts.push('updated_at = GETDATE()');
      request.input('updated_by', sql.Int, categoryData.updated_by || 1);
      
      // Create SQL query
      const updateQuery = `
        UPDATE ${this.tableName}
        SET ${updateParts.join(', ')}
        WHERE id = @id;
        
        SELECT * FROM ${this.tableName} WHERE id = @id;
      `;
      
      console.log('SQL Query:', updateQuery);
      
      // Execute query
      const result = await request.query(updateQuery);
      
      // Return updated category
      return result.recordset[0];
    } catch (error) {
      console.error('Error in Category.update:', error);
      throw error;
    }
  }

  // Delete category (soft delete)
  static async delete(id, userId) {
    try {
      console.log(`Deleting category with ID: ${id}`);
      
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
      console.error('Error in Category.delete:', error);
      throw error;
    }
  }

  // HARD DELETE CATEGORY
  static async delete(id) {
    try {
      console.log(`=== DELETE CATEGORY ID: ${id} ===`);
      const pool = await connectSqlServer();
      
      // XÓA HOÀN TOÀN KHỎI DATABASE
      const result = await pool.request()
        .input('id', sql.Int, id)
        .query(`
          DELETE FROM [Categories] 
          WHERE id = @id
        `);

      console.log('Category delete result - rows affected:', result.rowsAffected[0]);
      
      return result.rowsAffected[0] > 0;
    } catch (error) {
      console.error('❌ Category.delete error:', error);
      throw error;
    }
  }

  // Update category status
  static async updateStatus(id, status, updatedBy = 1) {
    try {
      console.log(`Updating category ${id} status to ${status}`);
      
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
      console.error('Error in Category.updateStatus:', error);
      throw error;
    }
  }

  // Get all categories
  static async findAll() {
    try {
      console.log('Getting all categories');
      
      const pool = await connectSqlServer();
      const result = await pool.request()
        .query(`
          SELECT * FROM ${this.tableName}
          WHERE status != 0
          ORDER BY created_at DESC
        `);
      
      return result.recordset;
    } catch (error) {
      console.error('Error in Category.findAll:', error);
      throw error;
    }
  }

  // Find categories by parent ID
  static async findByParentId(parentId) {
    try {
      console.log(`Finding categories with parent ID: ${parentId}`);
      
      const pool = await connectSqlServer();
      const result = await pool.request()
        .input('parentId', sql.Int, parentId)
        .query(`
          SELECT * FROM ${this.tableName}
          WHERE parent_id = @parentId AND status != 0
          ORDER BY created_at DESC
        `);
      
      return result.recordset;
    } catch (error) {
      console.error('Error in Category.findByParentId:', error);
      throw error;
    }
  }
}

module.exports = Category;








