// Thống kê sản phẩm (bài viết) - lượt xem, bình luận
exports.getProductStats = async (req, res) => {
  try {
    const pool = await connectSqlServer();
    
    // Top sản phẩm có lượt xem cao nhất
    const topViewedProducts = await pool.request().query(`
      SELECT TOP 10
        p.id,
        p.name as title,
        p.view_count,
        p.created_at,
        c.name as category_name,
        b.name as brand_name,
        (SELECT COUNT(*) FROM Comments cm WHERE cm.product_id = p.id AND cm.status = 1) as comment_count
      FROM Products p
      LEFT JOIN Categories c ON p.category_id = c.id
      LEFT JOIN Brands b ON p.brand_id = b.id
      WHERE p.status = 1 AND p.is_approved = 1
      ORDER BY p.view_count DESC
    `);
    
    // Thống kê bình luận theo sản phẩm
    const commentStats = await pool.request().query(`
      SELECT 
        p.id,
        p.name as title,
        COUNT(cm.id) as comment_count,
        p.view_count,
        c.name as category_name
      FROM Products p
      LEFT JOIN Comments cm ON p.id = cm.product_id AND cm.status = 1
      LEFT JOIN Categories c ON p.category_id = c.id
      WHERE p.status = 1 AND p.is_approved = 1
      GROUP BY p.id, p.name, p.view_count, c.name
      HAVING COUNT(cm.id) > 0
      ORDER BY COUNT(cm.id) DESC
    `);
    
    // Thống kê theo danh mục
    const categoryStats = await pool.request().query(`
      SELECT 
        c.name as category_name,
        COUNT(p.id) as product_count,
        SUM(p.view_count) as total_views,
        AVG(p.view_count) as avg_views
      FROM Products p
      LEFT JOIN Categories c ON p.category_id = c.id
      WHERE p.status = 1 AND p.is_approved = 1
      GROUP BY c.name
      ORDER BY total_views DESC
    `);
    
    res.json({
      success: true,
      data: {
        topViewedProducts: topViewedProducts.recordset,
        commentStats: commentStats.recordset,
        categoryStats: categoryStats.recordset
      }
    });
  } catch (error) {
    console.error('Error getting product stats:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thống kê sản phẩm'
    });
  }
};

// Thống kê chi tiết một sản phẩm
exports.getProductDetailStats = async (req, res) => {
  try {
    const { productId } = req.params;
    const pool = await connectSqlServer();
    
    const productStats = await pool.request()
      .input('productId', productId)
      .query(`
        SELECT 
          p.id,
          p.name as title,
          p.view_count,
          p.created_at,
          c.name as category_name,
          b.name as brand_name,
          u.name as author_name,
          (SELECT COUNT(*) FROM Comments cm WHERE cm.product_id = p.id AND cm.status = 1) as comment_count,
          (SELECT COUNT(*) FROM Comments cm WHERE cm.product_id = p.id AND cm.created_at >= DATEADD(day, -7, GETDATE())) as comments_this_week
        FROM Products p
        LEFT JOIN Categories c ON p.category_id = c.id
        LEFT JOIN Brands b ON p.brand_id = b.id
        LEFT JOIN Users u ON p.created_by = u.id
        WHERE p.id = @productId
      `);
    
    res.json({
      success: true,
      data: {
        productInfo: productStats.recordset[0]
      }
    });
  } catch (error) {
    console.error('Error getting product detail stats:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thống kê chi tiết sản phẩm'
    });
  }
};