const sql = require('mssql');
const bcrypt = require('bcrypt');
const { connectSqlServer } = require('../../config/sqlServer');

class Customer {
  static tableName = 'Customers';

  // Tìm customer theo ID
  static async findById(id) {
    try {
      const pool = await connectSqlServer();
      const result = await pool.request()
        .input('id', sql.Int, id)
        .query(`SELECT * FROM ${this.tableName} WHERE id = @id AND status != 0`);
      return result.recordset[0];
    } catch (error) {
      console.error('Error in Customer.findById:', error);
      throw error;
    }
  }

  // Tìm customer theo username
  static async findOne({ username }) {
    try {
      const pool = await connectSqlServer();
      const result = await pool.request()
        .input('username', sql.VarChar(50), username)
        .query(`SELECT * FROM ${this.tableName} WHERE username = @username AND status != 0`);
      return result.recordset[0];
    } catch (error) {
      console.error('Error in Customer.findOne:', error);
      throw error;
    }
  }

  // Tạo customer mới
  static async create(customerData) {
    try {
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(customerData.password, salt);
      
      const pool = await connectSqlServer();
      const result = await pool.request()
        .input('name', sql.NVarChar(255), customerData.name)
        .input('username', sql.VarChar(50), customerData.username)
        .input('password', sql.VarChar(255), hashedPassword)
        .input('gender', sql.VarChar(10), customerData.gender || null)
        .input('phone', sql.VarChar(20), customerData.phone)
        .input('email', sql.VarChar(255), customerData.email)
        .input('roles', sql.Int, customerData.roles || 2)
        .input('status', sql.Int, customerData.status || 2)
        .input('created_by', sql.Int, customerData.created_by || 1)
        .query(`
          INSERT INTO ${this.tableName} (name, username, password, gender, phone, email, roles, status, created_by)
          VALUES (@name, @username, @password, @gender, @phone, @email, @roles, @status, @created_by);
          SELECT SCOPE_IDENTITY() AS id;
        `);
      
      const id = result.recordset[0].id;
      return { id, ...customerData, password: undefined };
    } catch (error) {
      console.error('Error in Customer.create:', error);
      throw error;
    }
  }

  // So sánh password
  static async comparePassword(customer, candidatePassword) {
    try {
      return await bcrypt.compare(candidatePassword, customer.password);
    } catch (error) {
      console.error('Error comparing passwords:', error);
      throw error;
    }
  }

  // Thêm phương thức updateStatus
  static async updateStatus(id, status, updatedBy = 1) {
    try {
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
      console.error('Error in Customer.updateStatus:', error);
      throw error;
    }
  }
}

module.exports = Customer;
