const { connectSqlServer } = require('../../config/sqlServer');
const sql = require('mssql');

class Poll {
  static tableName = 'Polls';

  // Lấy tất cả polls
  static async findAll() {
    try {
      const pool = await connectSqlServer();
      const result = await pool.request().query(`
        SELECT p.*, 
               (SELECT COUNT(*) FROM PollVotes pv WHERE pv.poll_id = p.id) as total_votes
        FROM ${this.tableName} p 
        ORDER BY p.created_at DESC
      `);
      return result.recordset;
    } catch (error) {
      console.error('Error in Poll.findAll:', error);
      throw error;
    }
  }

  // Lấy poll theo ID với options
  static async findById(id) {
    try {
      const pool = await connectSqlServer();
      
      // Lấy thông tin poll
      const pollResult = await pool.request()
        .input('id', sql.Int, id)
        .query(`SELECT * FROM ${this.tableName} WHERE id = @id`);
      
      if (pollResult.recordset.length === 0) return null;
      
      const poll = pollResult.recordset[0];
      
      // Lấy options
      const optionsResult = await pool.request()
        .input('pollId', sql.Int, id)
        .query(`SELECT * FROM PollOptions WHERE poll_id = @pollId ORDER BY id`);
      
      poll.options = optionsResult.recordset;
      
      return poll;
    } catch (error) {
      console.error('Error in Poll.findById:', error);
      throw error;
    }
  }

  // Tạo poll mới
  static async create(data) {
    try {
      const pool = await connectSqlServer();
      
      // Tạo poll
      const pollResult = await pool.request()
        .input('title', sql.NVarChar(255), data.title)
        .input('description', sql.NVarChar(sql.MAX), data.description)
        .input('start_date', sql.DateTime, data.start_date)
        .input('end_date', sql.DateTime, data.end_date)
        .input('created_by', sql.Int, data.created_by)
        .query(`
          INSERT INTO ${this.tableName} (title, description, start_date, end_date, created_by)
          OUTPUT INSERTED.id
          VALUES (@title, @description, @start_date, @end_date, @created_by)
        `);
      
      const pollId = pollResult.recordset[0].id;
      
      // Tạo options
      if (data.options && data.options.length > 0) {
        for (const option of data.options) {
          await pool.request()
            .input('pollId', sql.Int, pollId)
            .input('optionText', sql.NVarChar(255), option)
            .query(`
              INSERT INTO PollOptions (poll_id, option_text)
              VALUES (@pollId, @optionText)
            `);
        }
      }
      
      return await this.findById(pollId);
    } catch (error) {
      console.error('Error in Poll.create:', error);
      throw error;
    }
  }

  // Vote cho poll
  static async vote(pollId, optionId, userId = null, ipAddress = null) {
    try {
      const pool = await connectSqlServer();
      
      // Kiểm tra đã vote chưa
      const checkVote = await pool.request()
        .input('pollId', sql.Int, pollId)
        .input('userId', sql.Int, userId)
        .input('ipAddress', sql.VarChar(45), ipAddress)
        .query(`
          SELECT * FROM PollVotes 
          WHERE poll_id = @pollId 
          AND (user_id = @userId OR ip_address = @ipAddress)
        `);
      
      if (checkVote.recordset.length > 0) {
        throw new Error('Bạn đã vote cho poll này rồi!');
      }
      
      // Thêm vote
      await pool.request()
        .input('pollId', sql.Int, pollId)
        .input('optionId', sql.Int, optionId)
        .input('userId', sql.Int, userId)
        .input('ipAddress', sql.VarChar(45), ipAddress)
        .query(`
          INSERT INTO PollVotes (poll_id, option_id, user_id, ip_address)
          VALUES (@pollId, @optionId, @userId, @ipAddress)
        `);
      
      // Cập nhật vote count
      await pool.request()
        .input('optionId', sql.Int, optionId)
        .query(`
          UPDATE PollOptions 
          SET vote_count = vote_count + 1 
          WHERE id = @optionId
        `);
      
      return true;
    } catch (error) {
      console.error('Error in Poll.vote:', error);
      throw error;
    }
  }
}

module.exports = Poll;