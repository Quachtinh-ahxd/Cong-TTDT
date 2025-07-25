// Fix title cho video aa.mp4
const { connectSqlServer } = require('./src/config/sqlServer');

async function fixVideoTitle() {
  try {
    const pool = await connectSqlServer();
    
    // Tìm movie có video_file = aa.mp4
    const movies = await pool.request().query(`
      SELECT id, title, video_file 
      FROM Movies 
      WHERE video_file LIKE '%aa.mp4%'
    `);
    
    if (movies.recordset.length > 0) {
      const movie = movies.recordset[0];
      console.log(`Found movie: ID ${movie.id}, Current title: "${movie.title}"`);
      
      // Cập nhật title thành "aa.mp4"
      await pool.request()
        .input('id', movie.id)
        .input('title', 'aa.mp4')
        .input('slug', 'aa-mp4-' + Date.now())
        .query(`
          UPDATE Movies 
          SET title = @title, slug = @slug, updated_at = GETDATE()
          WHERE id = @id
        `);
      
      console.log('✅ Updated movie title to "aa.mp4"');
    } else {
      console.log('❌ No movie found with aa.mp4');
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

fixVideoTitle();