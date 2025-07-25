const Topic = require('../models/sql/Topic');

exports.getAllTopics = async (req, res) => {
  try {
    const topics = await Topic.getAll();
    res.json({
      success: true,
      data: topics,
      total: topics.length,
      message: 'Topics retrieved successfully'
    });
  } catch (error) {
    console.error('❌ getAllTopics error:', error); // Thêm log này để debug
    res.status(500).json({ success: false, message: error.message });
  }
};


