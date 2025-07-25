const { Comment } = require('../models');

// Lấy bình luận theo bài viết
exports.getByPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { type = 'post' } = req.query;
    
    const comments = await Comment.findByPost(postId, type);
    
    return res.json({
      status: true,
      comments: comments || []
    });
  } catch (error) {
    console.error('Error getting comments:', error);
    return res.status(500).json({
      status: false,
      message: 'Lỗi server'
    });
  }
};

// Tạo bình luận mới
exports.create = async (req, res) => {
  try {
    const { post_id, post_type = 'product', content, user_name = 'Anonymous' } = req.body;
    
    // Không bắt buộc đăng nhập - cho phép comment ẩn danh
    const user_id = req.user?.id || null;
    
    if (!content || !content.trim()) {
      return res.status(400).json({
        status: false,
        message: 'Nội dung bình luận không được để trống'
      });
    }
    
    const result = await Comment.create({
      post_id,
      post_type,
      user_id,
      content: content.trim(),
      user_name: user_name || 'Anonymous'
    });
    
    return res.json({
      status: true,
      message: 'Bình luận đã được tạo thành công',
      comment_id: result.insertId
    });
  } catch (error) {
    console.error('Error creating comment:', error);
    return res.status(500).json({
      status: false,
      message: 'Lỗi server'
    });
  }
};

// Thay đổi trạng thái bình luận (admin)
exports.toggleStatus = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Toggle comment status for ID:', id);
    
    // Kiểm tra quyền (tạm thời bỏ qua để test)
    // const user_role = req.user?.roles;
    // if (!['admin', 'editor'].includes(user_role)) {
    //   return res.status(403).json({
    //     status: false,
    //     message: 'Không có quyền thực hiện thao tác này'
    //   });
    // }
    
    const { connectSqlServer } = require('../config/sqlServer');
    const pool = await connectSqlServer();
    
    // Lấy trạng thái hiện tại
    const getCurrentQuery = 'SELECT status FROM Comments WHERE id = ?';
    const currentResult = await pool.request()
      .input('id', id)
      .query('SELECT status FROM Comments WHERE id = @id');
    
    if (!currentResult.recordset || currentResult.recordset.length === 0) {
      return res.status(404).json({
        status: false,
        message: 'Không tìm thấy bình luận'
      });
    }
    
    const currentStatus = currentResult.recordset[0].status;
    const newStatus = currentStatus === 1 ? 0 : 1;
    
    // Cập nhật trạng thái
    await pool.request()
      .input('id', id)
      .input('status', newStatus)
      .query('UPDATE Comments SET status = @status, updated_at = GETDATE() WHERE id = @id');
    
    return res.json({
      status: true,
      message: newStatus === 1 ? 'Đã hiện bình luận' : 'Đã ẩn bình luận',
      newStatus: newStatus
    });
  } catch (error) {
    console.error('Error toggling comment status:', error);
    return res.status(500).json({
      status: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// Xóa bình luận (admin)
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const user_role = req.user?.roles;
    
    if (!['admin', 'editor'].includes(user_role)) {
      return res.status(403).json({
        status: false,
        message: 'Không có quyền thực hiện thao tác này'
      });
    }
    
    const query = 'DELETE FROM Comments WHERE id = ?';
    const result = await db.query(query, [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: false,
        message: 'Không tìm thấy bình luận'
      });
    }
    
    return res.json({
      status: true,
      message: 'Đã xóa bình luận thành công'
    });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return res.status(500).json({
      status: false,
      message: 'Lỗi server'
    });
  }
};


