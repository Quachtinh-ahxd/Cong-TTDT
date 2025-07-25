const sql = require('mssql');
const { connectSqlServer } = require('../../config/sqlServer');

class Product {
  static async getAll() {
    try {
      console.log('=== PRODUCT GET ALL DEBUG ===');
      const pool = await connectSqlServer();
      
      const result = await pool.request().query(`
        SELECT 
          p.*,
          c.name as category_name,
          b.name as brand_name,
          u.name as user_name
        FROM Products p
        LEFT JOIN Categories c ON p.category_id = c.id
        LEFT JOIN Brands b ON p.brand_id = b.id
        LEFT JOIN Users u ON p.created_by = u.id
        ORDER BY p.created_at DESC
      `);
      
      console.log(`✅ Found ${result.recordset.length} products`);
      return result.recordset;
    } catch (error) {
      console.error('❌ Product.getAll error:', error);
      throw error;
    }
  }

  static async findById(id) {
    try {
      console.log(`=== PRODUCT FIND BY ID: ${id} ===`);
      const pool = await connectSqlServer();
      const result = await pool.request()
        .input('id', sql.Int, id)
        .query(`
          SELECT 
            p.*,
            c.name as category_name,
            b.name as brand_name,
            u.name as user_name
          FROM Products p
          LEFT JOIN Categories c ON p.category_id = c.id
          LEFT JOIN Brands b ON p.brand_id = b.id
          LEFT JOIN Users u ON p.created_by = u.id
          WHERE p.id = @id
        `);
      
      console.log(`✅ Product findById result:`, result.recordset[0]);
      return result.recordset[0];
    } catch (error) {
      console.error('❌ Product.findById error:', error);
      throw error;
    }
  }

  static async create(data) {
    try {
      console.log('=== PRODUCT CREATE DEBUG ===');
      console.log('Raw create data:', data);
      
      // CONVERT DATA TYPES TRƯỚC KHI QUERY
      const processedData = {
        name: data.name || '',
        description: data.description || null,
        detail: data.detail || data.description || null,
        category_id: data.category_id ? parseInt(data.category_id) : null,
        brand_id: data.brand_id ? parseInt(data.brand_id) : null,
        image: data.image || null,
        status: data.status ? parseInt(data.status) : 2, // ← CONVERT TO INT
        created_by: data.user_id || data.created_by ? parseInt(data.user_id || data.created_by) : 1, // ← CONVERT TO INT
        slug: data.slug || (data.name ? data.name.toLowerCase().replace(/\s+/g, '-') : '')
      };
      
      console.log('Processed data:', processedData);
      console.log('Status type:', typeof processedData.status, 'Value:', processedData.status);
      console.log('Category ID type:', typeof processedData.category_id, 'Value:', processedData.category_id);
      console.log('Brand ID type:', typeof processedData.brand_id, 'Value:', processedData.brand_id);
      console.log('Created by type:', typeof processedData.created_by, 'Value:', processedData.created_by);
      
      const pool = await connectSqlServer();
      const result = await pool.request()
        .input('name', sql.NVarChar, processedData.name)
        .input('description', sql.NVarChar, processedData.description)
        .input('detail', sql.NVarChar, processedData.detail)
        .input('category_id', sql.Int, processedData.category_id)
        .input('brand_id', sql.Int, processedData.brand_id)
        .input('image', sql.NVarChar, processedData.image)
        .input('status', sql.Int, processedData.status) // ← ĐẢM BẢO LÀ INT
        .input('created_by', sql.Int, processedData.created_by) // ← ĐẢM BẢO LÀ INT
        .input('slug', sql.NVarChar, processedData.slug)
        .query(`
          INSERT INTO Products (name, description, detail, category_id, brand_id, image, status, created_by, slug, created_at, updated_at)
          OUTPUT INSERTED.*
          VALUES (@name, @description, @detail, @category_id, @brand_id, @image, @status, @created_by, @slug, GETDATE(), GETDATE())
        `);
    
      console.log('✅ Product created:', result.recordset[0]);
      return result.recordset[0];
    } catch (error) {
      console.error('❌ Product.create error:', error);
      throw error;
    }
  }

  static async update(id, data) {
    try {
      console.log(`=== PRODUCT UPDATE DEBUG: ${id} ===`);
      console.log('Update data:', data);
      
      const pool = await connectSqlServer();
      
      // Build dynamic update query
      const updates = [];
      const request = pool.request().input('id', sql.Int, id);
      
      if (data.name) {
        updates.push('name = @name');
        request.input('name', sql.NVarChar, data.name);
      }
      if (data.description !== undefined) {
        updates.push('description = @description');
        request.input('description', sql.NVarChar, data.description);
      }
      if (data.detail !== undefined) {
        updates.push('detail = @detail');
        request.input('detail', sql.NVarChar, data.detail);
      }
      if (data.category_id) {
        updates.push('category_id = @category_id');
        request.input('category_id', sql.Int, data.category_id);
      }
      if (data.brand_id) {
        updates.push('brand_id = @brand_id');
        request.input('brand_id', sql.Int, data.brand_id);
      }
      if (data.image) {
        updates.push('image = @image');
        request.input('image', sql.NVarChar, data.image);
      }
      if (data.status !== undefined) {
        updates.push('status = @status');
        request.input('status', sql.Int, data.status);
      }
      
      updates.push('updated_at = GETDATE()');
      
      if (updates.length === 1) { // Chỉ có updated_at
        console.log('❌ No fields to update');
        throw new Error('No fields to update');
      }
      
      const result = await request.query(`
        UPDATE Products 
        SET ${updates.join(', ')}
        OUTPUT INSERTED.*
        WHERE id = @id
      `);
      
      console.log('✅ Product updated:', result.recordset[0]);
      return result.recordset[0];
    } catch (error) {
      console.error('❌ Product.update error:', error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      console.log(`=== PRODUCT DELETE DEBUG: ${id} ===`);
      const pool = await connectSqlServer();
      const result = await pool.request()
        .input('id', sql.Int, id)
        .query('DELETE FROM Products WHERE id = @id');
      
      const deleted = result.rowsAffected[0] > 0;
      console.log(`✅ Product delete result: ${deleted}`);
      return deleted;
    } catch (error) {
      console.error('❌ Product.delete error:', error);
      throw error;
    }
  }

  static async findByCategory(categoryId) {
    try {
      const pool = await connectSqlServer();
      const result = await pool.request()
        .input('categoryId', sql.Int, categoryId)
        .query(`
          SELECT 
            p.*,
            c.name as category_name,
            b.name as brand_name
          FROM Products p
          LEFT JOIN Categories c ON p.category_id = c.id
          LEFT JOIN Brands b ON p.brand_id = b.id
          WHERE p.category_id = @categoryId AND p.status = 2
          ORDER BY p.created_at DESC
        `);
      
      return result.recordset;
    } catch (error) {
      console.error('Product.findByCategory error:', error);
      throw error;
    }
  }

  static async findByBrand(brandId) {
    try {
      const pool = await connectSqlServer();
      const result = await pool.request()
        .input('brandId', sql.Int, brandId)
        .query(`
          SELECT 
            p.*,
            c.name as category_name,
            b.name as brand_name
          FROM Products p
          LEFT JOIN Categories c ON p.category_id = c.id
          LEFT JOIN Brands b ON p.brand_id = b.id
          WHERE p.brand_id = @brandId AND p.status = 2
          ORDER BY p.created_at DESC
        `);
      
      return result.recordset;
    } catch (error) {
      console.error('Product.findByBrand error:', error);
      throw error;
    }
  }

  static async search(query) {
    try {
      const pool = await connectSqlServer();
      const result = await pool.request()
        .input('query', sql.NVarChar, `%${query}%`)
        .query(`
          SELECT 
            p.*,
            c.name as category_name,
            b.name as brand_name
          FROM Products p
          LEFT JOIN Categories c ON p.category_id = c.id
          LEFT JOIN Brands b ON p.brand_id = b.id
          WHERE (p.name LIKE @query OR p.description LIKE @query) 
            AND p.status = 2
          ORDER BY p.created_at DESC
        `);
      
      return result.recordset;
    } catch (error) {
      console.error('Product.search error:', error);
      throw error;
    }
  }

  static async findBySlug(slug) {
    try {
      const pool = await connectSqlServer();
      const result = await pool.request()
        .input('slug', sql.NVarChar, slug)
        .query(`
          SELECT 
            p.*,
            c.name as category_name,
            b.name as brand_name
          FROM Products p
          LEFT JOIN Categories c ON p.category_id = c.id
          LEFT JOIN Brands b ON p.brand_id = b.id
          WHERE p.slug = @slug
        `);
      
      return result.recordset[0];
    } catch (error) {
      console.error('Product.findBySlug error:', error);
      throw error;
    }
  }

  static async updateStatus(id, status) {
    try {
      const pool = await connectSqlServer();
      const statusValue = status === 'approved' ? 2 : (status === 'rejected' ? 0 : 1);
      
      const result = await pool.request()
        .input('id', sql.Int, id)
        .input('status', sql.Int, statusValue)
        .query(`
          UPDATE Products 
          SET status = @status, updated_at = GETDATE()
          OUTPUT INSERTED.*
          WHERE id = @id
        `);
      
      return result.recordset[0];
    } catch (error) {
      console.error('Product.updateStatus error:', error);
      throw error;
    }
  }

  static async approve(id) {
    try {
      const pool = await connectSqlServer();
      const result = await pool.request()
        .input('id', sql.Int, id)
        .query(`
          UPDATE Products
          SET is_approved = 1, status = 1, updated_at = GETDATE()
          OUTPUT INSERTED.*
          WHERE id = @id
        `);
      return result.recordset[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Product;

// CategoryService.js
const getAll = async () => {
  try {
    console.log('🔍 Calling API: /api/categories'); // ← SỬA THÀNH categories (có s)
    const response = await httpAxios.get('/api/categories'); // ← SỬA ĐÂY
    console.log('✅ Categories API response:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ CategoryService Error:', error);
    throw error;
  }
};





















