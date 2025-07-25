const Poll = require('../models/sql/Poll');

// Lấy tất cả polls
exports.getAllPolls = async (req, res) => {
  try {
    const polls = await Poll.findAll();
    
    res.status(200).json({
      status: true,
      polls,
      message: 'Lấy danh sách thăm dò thành công'
    });
  } catch (error) {
    console.error('Error getting polls:', error);
    res.status(500).json({
      status: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// Lấy poll theo ID
exports.getPollById = async (req, res) => {
  try {
    const { id } = req.params;
    const poll = await Poll.findById(id);
    
    if (!poll) {
      return res.status(404).json({
        status: false,
        message: 'Không tìm thấy thăm dò'
      });
    }
    
    res.status(200).json({
      status: true,
      poll,
      message: 'Lấy thông tin thăm dò thành công'
    });
  } catch (error) {
    console.error('Error getting poll:', error);
    res.status(500).json({
      status: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// Tạo poll mới
exports.createPoll = async (req, res) => {
  try {
    const { title, description, start_date, end_date, options } = req.body;
    
    // Validate
    if (!title || !options || options.length < 2) {
      return res.status(400).json({
        status: false,
        message: 'Tiêu đề và ít nhất 2 lựa chọn là bắt buộc'
      });
    }
    
    const pollData = {
      title,
      description,
      start_date: start_date ? new Date(start_date) : new Date(),
      end_date: end_date ? new Date(end_date) : null,
      options,
      created_by: req.user?.id || 1
    };
    
    const poll = await Poll.create(pollData);
    
    res.status(201).json({
      status: true,
      poll,
      message: 'Tạo thăm dò thành công'
    });
  } catch (error) {
    console.error('Error creating poll:', error);
    res.status(500).json({
      status: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// Vote cho poll
exports.votePoll = async (req, res) => {
  try {
    const { id } = req.params;
    const { option_id } = req.body;
    const userId = req.user?.id || null;
    const ipAddress = req.ip || req.connection.remoteAddress;
    
    if (!option_id) {
      return res.status(400).json({
        status: false,
        message: 'Vui lòng chọn một lựa chọn'
      });
    }
    
    await Poll.vote(id, option_id, userId, ipAddress);
    
    // Lấy kết quả mới
    const poll = await Poll.findById(id);
    
    res.status(200).json({
      status: true,
      poll,
      message: 'Vote thành công'
    });
  } catch (error) {
    console.error('Error voting poll:', error);
    res.status(400).json({
      status: false,
      message: error.message
    });
  }
};

// Lấy kết quả poll
exports.getPollResults = async (req, res) => {
  try {
    const { id } = req.params;
    const poll = await Poll.findById(id);
    
    if (!poll) {
      return res.status(404).json({
        status: false,
        message: 'Không tìm thấy thăm dò'
      });
    }
    
    // Tính phần trăm cho mỗi option
    const totalVotes = poll.options.reduce((sum, option) => sum + option.vote_count, 0);
    
    const results = poll.options.map(option => ({
      ...option,
      percentage: totalVotes > 0 ? Math.round((option.vote_count / totalVotes) * 100) : 0
    }));
    
    res.status(200).json({
      status: true,
      poll: {
        ...poll,
        options: results,
        total_votes: totalVotes
      },
      message: 'Lấy kết quả thăm dò thành công'
    });
  } catch (error) {
    console.error('Error getting poll results:', error);
    res.status(500).json({
      status: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};