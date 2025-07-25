const { connectSqlServer } = require('../src/config/sqlServer');

const seedFileCategories = async () => {
  try {
    const pool = await connectSqlServer();
    
    const categories = [
      {
        name: 'Phần mềm quân đội',
        slug: 'phan-mem-quan-doi',
        description: 'Các phần mềm, ứng dụng dành cho quân đội',
        status: 1
      },
      {
        name: 'Hướng dẫn chỉ đạo',
        slug: 'huong-dan-chi-dao', 
        description: 'Tài liệu hướng dẫn, chỉ đạo công việc',
        status: 1
      },
      {
        name: 'Mẫu văn bản',
        slug: 'mau-van-ban',
        description: 'Các mẫu văn bản, biểu mẫu',
        status: 1
      },
      {
        name: 'Tài liệu kỹ thuật',
        slug: 'tai-lieu-ky-thuat',
        description: 'Tài liệu kỹ thuật, specification',
        status: 1
      },
      {
        name: 'Báo cáo',
        slug: 'bao-cao',
        description: 'Các báo cáo, thống kê',
        status: 1
      },
      {
        name: 'Văn bản pháp lý',
        slug: 'van-ban-phap-ly',
        description: 'Quyết định, thông tư, nghị định',
        status: 1
      }
    ];
    
    for (const category of categories) {
      // Kiểm tra đã tồn tại chưa
      const existing = await pool.request()
        .input('slug', category.slug)
        .query('SELECT id FROM Categories WHERE slug = @slug');
      
      if (existing.recordset.length === 0) {
        await pool.request()
          .input('name', category.name)
          .input('slug', category.slug)
          .input('description', category.description)
          .input('status', category.status)
          .query(`
            INSERT INTO Categories (name, slug, description, status, created_by)
            VALUES (@name, @slug, @description, @status, 1)
          `);
        
        console.log(`✅ Created category: ${category.name}`);
      } else {
        console.log(`⚠️ Category exists: ${category.name}`);
      }
    }
    
    console.log('🎉 File categories seeded successfully!');
    await pool.close();
  } catch (error) {
    console.error('❌ Error seeding categories:', error);
  }
};

seedFileCategories();