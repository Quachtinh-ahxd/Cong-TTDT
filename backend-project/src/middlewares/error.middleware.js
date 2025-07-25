// Kiểm tra middleware xử lý lỗi
exports.errorHandler = (err, req, res, next) => {
  // Debug thông tin lỗi
  console.log('=== ERROR HANDLER DEBUGGING ===');
  console.log('Error message:', err.message);
  console.log('Error stack:', err.stack);
  console.log('=== END ERROR HANDLER DEBUGGING ===');
  
  const statusCode = err.statusCode || 500;
  
  res.status(statusCode).json({
    message: err.message || 'Lỗi server',
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack
  });
};
