const sql = require('mssql');
const bcrypt = require('bcryptjs'); // ← THÊM DÒNG NÀY
const { connectSqlServer } = require('../../config/sqlServer');

class User {
  static tableName = 'Users'; // ← THÊM TABLENAME

  // Lấy tất cả người dùng
  static async findAll() {
    try {
      console.log('Getting all users');
      
      const pool = await connectSqlServer();
      const result = await pool.request()
        .query(`
          SELECT *
          FROM ${this.tableName}
          WHERE status != 0
          ORDER BY created_at DESC
        `);
      
      return result.recordset;
    } catch (error) {
      console.error('Error in User.findAll:', error);
      throw error;
    }
  }

  // Tìm người dùng theo ID
  static async findById(id) {
    try {
      console.log(`=== USER FIND BY ID: ${id} ===`);
      const pool = await connectSqlServer();
      const result = await pool.request()
        .input('id', sql.Int, id)
        .query('SELECT * FROM [Users] WHERE id = @id');
      
      console.log('Find by ID result:', result.recordset[0]);
      return result.recordset[0];
    } catch (error) {
      console.error('❌ User.findById error:', error);
      throw error;
    }
  }

  // Tìm người dùng theo username
  static async findByUsername(username) {
    try {
      console.log(`=== USER FIND BY USERNAME: ${username} ===`);
      const pool = await connectSqlServer();
      const result = await pool.request()
        .input('username', sql.NVarChar, username)
        .query('SELECT * FROM [Users] WHERE username = @username');
      
      console.log('Find by username result:', result.recordset[0]);
      return result.recordset[0];
    } catch (error) {
      console.error('❌ User.findByUsername error:', error);
      throw error;
    }
  }

  // Tìm người dùng theo email
  static async findByEmail(email) {
    try {
      const pool = await connectSqlServer();
      const result = await pool.request()
        .input('email', sql.NVarChar, email)
        .query('SELECT * FROM [Users] WHERE email = @email');
      
      return result.recordset[0];
    } catch (error) {
      console.error('❌ User.findByEmail error:', error);
      throw error;
    }
  }

  // Tạo người dùng mới
  static async create(userData) {
    try {
      console.log('=== USER MODEL CREATE DEBUG ===');
      console.log('Input userData:', { ...userData, password: '[HIDDEN]' });
      console.log('Image field:', userData.image);

      // Kiểm tra password có tồn tại không
      if (!userData.password) {
        throw new Error('Password is required');
      }
      
      // Hash mật khẩu
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);
      
      const pool = await connectSqlServer();
      
      // Kiểm tra email đã tồn tại chưa
      const checkEmail = await pool.request()
        .input('email', sql.VarChar(255), userData.email)
        .query(`
          SELECT COUNT(*) as count FROM ${this.tableName}
          WHERE email = @email AND status != 0
        `);
      
      if (checkEmail.recordset[0].count > 0) {
        throw new Error('Email đã được sử dụng');
      }
      
      // Kiểm tra username đã tồn tại chưa
      if (userData.username) {
        const checkUsername = await pool.request()
          .input('username', sql.VarChar(255), userData.username)
          .query(`
            SELECT COUNT(*) as count FROM ${this.tableName}
            WHERE username = @username AND status != 0
          `);
        
        if (checkUsername.recordset[0].count > 0) {
          throw new Error('Tên đăng nhập đã được sử dụng');
        }
      }
      
      // Thêm người dùng mới
      const result = await pool.request()
        .input('username', sql.VarChar(255), userData.username)
        .input('email', sql.VarChar(255), userData.email)
        .input('name', sql.NVarChar(255), userData.name || '')
        .input('password', sql.VarChar(255), hashedPassword)
        .input('phone', sql.VarChar(20), userData.phone)
        .input('roles', sql.VarChar(50), userData.roles || 'user')
        .input('status', sql.Int, userData.status || 1)
        .input('image', sql.VarChar(255), userData.image) // ← DEBUG DÒNG NÀY
        .input('created_by', sql.Int, userData.created_by || 1)
        .query(`
          INSERT INTO ${this.tableName} (
            username, email, [name], [password], phone, [roles], [status], 
            [image], created_by, created_at, updated_at
          )
          OUTPUT INSERTED.*
          VALUES (
            @username, @email, @name, @password, @phone, @roles, @status,
            @image, @created_by, GETDATE(), GETDATE()
          )
        `);

      console.log('=== SQL INSERT RESULT ===');
      console.log('Inserted user:', result.recordset[0]);
      console.log('Inserted image field:', result.recordset[0].image);

      return result.recordset[0];
      
    } catch (error) {
      console.log('❌ User.create error:', error);
      throw error;
    }
  }

  // Cập nhật người dùng
  static async update(id, userData) {
    try {
      console.log(`Updating user ${id} with data:`, { ...userData, password: userData.password ? '******' : undefined });
      
      // Xây dựng câu truy vấn cập nhật động
      const updateParts = [];
      const pool = await connectSqlServer();
      const request = pool.request().input('id', sql.Int, id);
      
      // Cập nhật các trường nếu được cung cấp
      if (userData.name) {
        updateParts.push('name = @name');
        request.input('name', sql.NVarChar(255), userData.name);
      }
      
      if (userData.username) {
        // Kiểm tra username đã tồn tại chưa
        const checkUsername = await pool.request()
          .input('username', sql.VarChar(255), userData.username)
          .input('id', sql.Int, id)
          .query(`
            SELECT COUNT(*) as count FROM ${this.tableName}
            WHERE username = @username AND id != @id AND status != 0
          `);
        
        if (checkUsername.recordset[0].count > 0) {
          throw new Error('Tên đăng nhập đã được sử dụng');
        }
        
        updateParts.push('username = @username');
        request.input('username', sql.VarChar(255), userData.username);
      }
      
      if (userData.email) {
        // Kiểm tra email đã tồn tại chưa
        const checkEmail = await pool.request()
          .input('email', sql.VarChar(255), userData.email)
          .input('id', sql.Int, id)
          .query(`
            SELECT COUNT(*) as count FROM ${this.tableName}
            WHERE email = @email AND id != @id AND status != 0
          `);
        
        if (checkEmail.recordset[0].count > 0) {
          throw new Error('Email đã được sử dụng');
        }
        
        updateParts.push('email = @email');
        request.input('email', sql.VarChar(255), userData.email);
      }
      
      if (userData.password) {
        // Hash mật khẩu
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userData.password, salt);
        
        updateParts.push('password = @password');
        request.input('password', sql.VarChar(255), hashedPassword);
      }
      
      if (userData.address !== undefined) {
        updateParts.push('address = @address');
        request.input('address', sql.NVarChar(500), userData.address);
      }
      
      if (userData.gender !== undefined) {
        updateParts.push('gender = @gender');
        request.input('gender', sql.VarChar(10), userData.gender);
      }
      
      if (userData.phone !== undefined) {
        updateParts.push('phone = @phone');
        request.input('phone', sql.VarChar(20), userData.phone);
      }
      
      if (userData.image !== undefined) {
        updateParts.push('image = @image');
        request.input('image', sql.VarChar(255), userData.image);
      }
      
      if (userData.roles !== undefined) {
        updateParts.push('roles = @roles');
        request.input('roles', sql.VarChar(20), userData.roles);
      }
      
      if (userData.status !== undefined) {
        updateParts.push('status = @status');
        request.input('status', sql.Int, userData.status);
      }
      
      // Luôn cập nhật updated_by và updated_at
      updateParts.push('updated_by = @updated_by');
      updateParts.push('updated_at = GETDATE()');
      request.input('updated_by', sql.Int, userData.updated_by || 1);
      
      // Nếu không có trường nào cần cập nhật, trả về người dùng
      if (updateParts.length === 0) {
        return this.findById(id);
      }
      
      // Thực thi truy vấn cập nhật
      await request.query(`
        UPDATE ${this.tableName}
        SET ${updateParts.join(', ')}
        WHERE id = @id
      `);
      
      // Trả về người dùng đã cập nhật
      return this.findById(id);
    } catch (error) {
      console.error('Error in User.update:', error);
      throw error;
    }
  }

  // Xóa người dùng (soft delete)
  static async delete(id, userId) {
    try {
      console.log(`Deleting user with ID: ${id}`);
      
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
      console.error('Error in User.delete:', error);
      throw error;
    }
  }

  // Cập nhật trạng thái người dùng
  static async updateStatus(id, status, updatedBy = 1) {
    try {
      console.log(`Updating user ${id} status to ${status}`);
      
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
      console.error('Error in User.updateStatus:', error);
      throw error;
    }
  }

  // So sánh password
  static async comparePassword(user, password) {
    try {
      console.log('=== PASSWORD COMPARISON DEBUG ===');
      console.log('Input password:', password);
      console.log('Stored password hash:', user.password);
      console.log('Password length:', password.length);
      console.log('Hash length:', user.password.length);
      
      const isMatch = await bcrypt.compare(password, user.password);
      
      console.log('Password comparison result:', isMatch);
      console.log('================================');
      
      return isMatch;
    } catch (error) {
      console.error('Error comparing password:', error);
      throw error;
    }
  }

  // Lấy tất cả người dùng - Phiên bản có debug chi tiết
  static async getAll() {
    try {
      console.log('=== USER MODEL GET ALL ===');
      const pool = await connectSqlServer();
      
      const result = await pool.request().query(`
        SELECT 
          id, username, email, [name], phone, [roles], [status],
          [image], -- ← ĐẢMBẢO CÓ FIELD IMAGE VỚI BRACKETS
          created_by, updated_by, created_at, updated_at
        FROM [Users]
        WHERE [status] != 0
        ORDER BY created_at DESC
      `);
      
      console.log('=== USERS WITH IMAGE CHECK ===');
      result.recordset.forEach((user, index) => {
        console.log(`User ${index + 1}: id=${user.id}, image=${user.image || 'NULL'}`);
      });
      
      return result.recordset;
    } catch (error) {
      console.error('❌ User.getAll error:', error);
      throw error;
    }
  }

  // THÊM METHOD XÓA HOÀN TOÀN
  static async delete(id) {
    try {
      console.log(`=== DELETE USER ID: ${id} ===`);
      const pool = await connectSqlServer();
      
      // XÓA HOÀN TOÀN KHỎI DATABASE
      const result = await pool.request()
        .input('id', sql.Int, id)
        .query(`
          DELETE FROM ${this.tableName} 
          WHERE id = @id
        `);

      console.log('Delete result:', result);
      console.log('Rows affected:', result.rowsAffected[0]);
      
      return result.rowsAffected[0] > 0;
    } catch (error) {
      console.error('❌ User.delete error:', error);
      throw error;
    }
  }

  // HOẶC METHOD UPDATE STATUS = 0 (SOFT DELETE)
  static async softDelete(id) {
    try {
      console.log(`=== SOFT DELETE USER ID: ${id} ===`);
      const pool = await connectSqlServer();
      
      const result = await pool.request()
        .input('id', sql.Int, id)
        .input('status', sql.Int, 0)
        .query(`
          UPDATE ${this.tableName} 
          SET [status] = @status, updated_at = GETDATE()
          WHERE id = @id
        `);

      console.log('Soft delete result:', result);
      return result.rowsAffected[0] > 0;
    } catch (error) {
      console.error('❌ User.softDelete error:', error);
      throw error;
    }
  }
}

module.exports = User;











