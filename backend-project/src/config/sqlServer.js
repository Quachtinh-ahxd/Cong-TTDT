const sql = require('mssql');
const dotenv = require('dotenv');

dotenv.config();

// Cấu hình kết nối SQL Server với timeout cao hơn và retry
const sqlConfig = {
  user: process.env.SQL_USER || 'sa',
  password: process.env.SQL_PASSWORD || 'trungdoan290',
  database: process.env.SQL_DATABASE || 'td290',
  server: process.env.SQL_SERVER || 'localhost\\WIN-CG5N9MFCGQB', // Thêm instance name
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
    acquireTimeoutMillis: 60000, // Thêm acquire timeout
    createTimeoutMillis: 30000,  // Thêm create timeout
    destroyTimeoutMillis: 5000,  // Thêm destroy timeout
    reapIntervalMillis: 1000,    // Thêm reap interval
    createRetryIntervalMillis: 200 // Thêm retry interval
  },
  options: {
    encrypt: process.env.SQL_ENCRYPT === 'true' || false,
    trustServerCertificate: process.env.SQL_TRUST_SERVER_CERTIFICATE === 'true' || true,
    enableArithAbort: true,
    connectTimeout: 60000,       // Connection timeout
    requestTimeout: 300000,      // Request timeout
    cancelTimeout: 5000,         // Cancel timeout
    packetSize: 4096,           // Packet size
    useUTC: false               // Use local time
  },
  connectionTimeout: 60000,
  requestTimeout: 300000,
  parseJSON: true
};

// Kết nối đến SQL Server
const connectSqlServer = async () => {
  try {
    console.log('=== SQL SERVER CONNECTION DEBUG ===');
    console.log('Connection config:', {
      server: sqlConfig.server,
      database: sqlConfig.database,
      user: sqlConfig.user,
      requestTimeout: sqlConfig.requestTimeout,
      connectionTimeout: sqlConfig.connectionTimeout
    });
    
    const pool = await sql.connect(sqlConfig);
    console.log('✅ SQL Server connected successfully');
    return pool;
  } catch (error) {
    console.error('❌ SQL SERVER CONNECTION ERROR:', error.message);
    throw error;
  }
};

// Tạo database nếu chưa tồn tại (đơn giản hóa)
const createDatabaseIfNotExists = async () => {
  try {
    const masterConfig = { ...sqlConfig, database: 'master' };
    const masterPool = await new sql.ConnectionPool(masterConfig).connect();
    
    const dbName = sqlConfig.database;
    const result = await masterPool.request()
      .input('dbName', sql.VarChar, dbName)
      .query(`SELECT DB_ID(@dbName) as dbId`);
    
    if (!result.recordset[0].dbId) {
      console.log(`📝 Creating database ${dbName}...`);
      await masterPool.request()
        .query(`CREATE DATABASE [${dbName}]`);
      console.log(`✅ Database ${dbName} created`);
    } else {
      console.log(`✅ Database ${dbName} already exists`);
    }
    
    await masterPool.close();
  } catch (err) {
    console.error('❌ Error with database:', err.message);
    throw err;
  }
};

// Hàm tạo tất cả các bảng
const createAllTables = async () => {
  try {
    // Đảm bảo database đã tồn tại
    await createDatabaseIfNotExists();
    
    // Kết nối đến database
    const pool = await connectSqlServer();
    
    // Tạo bảng Users
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Users]') AND type in (N'U'))
      BEGIN
        CREATE TABLE Users (
          id INT IDENTITY(1,1) PRIMARY KEY,
          name NVARCHAR(255) NOT NULL,
          username VARCHAR(50) NOT NULL UNIQUE,
          email VARCHAR(255) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          address NVARCHAR(255),
          image VARCHAR(255),
          gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
          phone VARCHAR(20),
          roles VARCHAR(20) DEFAULT 'user',
          status INT DEFAULT 2,
          created_by INT DEFAULT 1,
          updated_by INT,
          created_at DATETIME DEFAULT GETDATE(),
          updated_at DATETIME DEFAULT GETDATE()
        );
        PRINT 'Table Users created.';
      END
    `);
    
    // Tạo bảng Customers
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Customers]') AND type in (N'U'))
      BEGIN
        CREATE TABLE Customers (
          id INT IDENTITY(1,1) PRIMARY KEY,
          name NVARCHAR(255) NOT NULL,
          username VARCHAR(50) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
          phone VARCHAR(20) NOT NULL,
          email VARCHAR(255) NOT NULL UNIQUE,
          roles INT DEFAULT 2,
          status INT DEFAULT 2,
          created_by INT DEFAULT 1,
          updated_by INT,
          created_at DATETIME DEFAULT GETDATE(),
          updated_at DATETIME DEFAULT GETDATE()
        );
        PRINT 'Table Customers created.';
      END
    `);
    
    // Tạo bảng Categories
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Categories]') AND type in (N'U'))
      BEGIN
        CREATE TABLE Categories (
          id INT IDENTITY(1,1) PRIMARY KEY,
          name NVARCHAR(255) NOT NULL,
          slug VARCHAR(255) NOT NULL UNIQUE,
          parent_id INT,
          image VARCHAR(255),
          description NVARCHAR(1000),
          status INT DEFAULT 2,
          created_by INT DEFAULT 1,
          updated_by INT,
          created_at DATETIME DEFAULT GETDATE(),
          updated_at DATETIME DEFAULT GETDATE()
        );
        PRINT 'Table Categories created.';
      END
    `);
    
    // Thêm khóa ngoại cho Categories
    await pool.request().query(`
      IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Categories]') AND type in (N'U'))
        AND NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_Categories_Categories]') AND parent_object_id = OBJECT_ID(N'[dbo].[Categories]'))
      BEGIN
        ALTER TABLE Categories
        ADD CONSTRAINT FK_Categories_Categories FOREIGN KEY (parent_id) REFERENCES Categories(id);
        PRINT 'Foreign key for Categories added.';
      END
    `);
    
    // Tạo bảng Brands
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Brands]') AND type in (N'U'))
      BEGIN
        CREATE TABLE Brands (
          id INT IDENTITY(1,1) PRIMARY KEY,
          name NVARCHAR(255) NOT NULL,
          slug VARCHAR(255) NOT NULL UNIQUE,
          image VARCHAR(255),
          description NVARCHAR(1000),
          status INT DEFAULT 2,
          created_by INT DEFAULT 1,
          updated_by INT,
          created_at DATETIME DEFAULT GETDATE(),
          updated_at DATETIME DEFAULT GETDATE()
        );
        PRINT 'Table Brands created.';
      END
    `);
    
    // Tạo bảng Products
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Products]') AND type in (N'U'))
      BEGIN
        CREATE TABLE Products (
          id INT IDENTITY(1,1) PRIMARY KEY,
          category_id INT NOT NULL,
          brand_id INT NOT NULL,
          name NVARCHAR(255) NOT NULL,
          slug VARCHAR(255) NOT NULL UNIQUE,
          detail NVARCHAR(MAX) NOT NULL,
          description NVARCHAR(1000) NOT NULL,
          image VARCHAR(255) NOT NULL,
          view_count INT DEFAULT 0,
          status INT DEFAULT 2,
          created_by INT DEFAULT 1,
          updated_by INT,
          created_at DATETIME DEFAULT GETDATE(),
          updated_at DATETIME DEFAULT GETDATE()
        );
        PRINT 'Table Products created.';
      END
      ELSE
      BEGIN
        -- Thêm cột view_count nếu chưa có
        IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Products') AND name = 'view_count')
        BEGIN
          ALTER TABLE Products ADD view_count INT DEFAULT 0;
          UPDATE Products SET view_count = 0 WHERE view_count IS NULL;
          PRINT 'Added view_count column to Products table.';
        END
      END
    `);
    
    // Thêm khóa ngoại cho Products
    await pool.request().query(`
      IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Products]') AND type in (N'U'))
        AND EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Categories]') AND type in (N'U'))
        AND NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_Products_Categories]') AND parent_object_id = OBJECT_ID(N'[dbo].[Products]'))
      BEGIN
        ALTER TABLE Products
        ADD CONSTRAINT FK_Products_Categories FOREIGN KEY (category_id) REFERENCES Categories(id);
        PRINT 'Foreign key for Products-Categories added.';
      END
    `);
    
    await pool.request().query(`
      IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Products]') AND type in (N'U'))
        AND EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Brands]') AND type in (N'U'))
        AND NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_Products_Brands]') AND parent_object_id = OBJECT_ID(N'[dbo].[Products]'))
      BEGIN
        ALTER TABLE Products
        ADD CONSTRAINT FK_Products_Brands FOREIGN KEY (brand_id) REFERENCES Brands(id);
        PRINT 'Foreign key for Products-Brands added.';
      END
    `);
    
    // Tạo bảng Topics
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Topics]') AND type in (N'U'))
      BEGIN
        CREATE TABLE Topics (
          id INT IDENTITY(1,1) PRIMARY KEY,
          name NVARCHAR(255) NOT NULL,
          slug VARCHAR(255) NOT NULL UNIQUE,
          parent_id INT,
          image VARCHAR(255),
          description NVARCHAR(1000),
          status INT DEFAULT 2,
          created_by INT DEFAULT 1,
          updated_by INT,
          created_at DATETIME DEFAULT GETDATE(),
          updated_at DATETIME DEFAULT GETDATE()
        );
        PRINT 'Table Topics created.';
      END
    `);
    
    // Thêm khóa ngoại cho Topics
    await pool.request().query(`
      IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Topics]') AND type in (N'U'))
        AND NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_Topics_Topics]') AND parent_object_id = OBJECT_ID(N'[dbo].[Topics]'))
      BEGIN
        ALTER TABLE Topics
        ADD CONSTRAINT FK_Topics_Topics FOREIGN KEY (parent_id) REFERENCES Topics(id);
        PRINT 'Foreign key for Topics added.';
      END
    `);
    
    // Tạo bảng Posts
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Posts]') AND type in (N'U'))
      BEGIN
        CREATE TABLE Posts (
          id INT IDENTITY(1,1) PRIMARY KEY,
          title NVARCHAR(255) NOT NULL,
          slug VARCHAR(255) NOT NULL UNIQUE,
          image VARCHAR(255),
          detail NVARCHAR(MAX) NOT NULL,
          description NVARCHAR(1000),
          type VARCHAR(20) DEFAULT 'post',
          topic_id INT,
          view_count INT DEFAULT 0,
          status INT DEFAULT 2,
          created_by INT DEFAULT 1,
          updated_by INT,
          deleted_at DATETIME,
          created_at DATETIME DEFAULT GETDATE(),
          updated_at DATETIME DEFAULT GETDATE()
        );
        PRINT 'Table Posts created.';
      END
    `);
    
    // Thêm khóa ngoại cho Posts
    await pool.request().query(`
      IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Posts]') AND type in (N'U'))
        AND EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Topics]') AND type in (N'U'))
        AND NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_Posts_Topics]') AND parent_object_id = OBJECT_ID(N'[dbo].[Posts]'))
      BEGIN
        ALTER TABLE Posts
        ADD CONSTRAINT FK_Posts_Topics FOREIGN KEY (topic_id) REFERENCES Topics(id);
        PRINT 'Foreign key for Posts-Topics added.';
      END
    `);
    
    // Tạo bảng Banners
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Banners]') AND type in (N'U'))
      BEGIN
        CREATE TABLE Banners (
          id INT IDENTITY(1,1) PRIMARY KEY,
          name NVARCHAR(255) NOT NULL,
          slug VARCHAR(255) NOT NULL UNIQUE,
          image VARCHAR(255) NOT NULL,
          link VARCHAR(255),
          position VARCHAR(50),
          description NVARCHAR(1000),
          status INT DEFAULT 2,
          created_by INT DEFAULT 1,
          updated_by INT,
          created_at DATETIME DEFAULT GETDATE(),
          updated_at DATETIME DEFAULT GETDATE()
        );
        PRINT 'Table Banners created.';
      END
    `);
    
    // Tạo bảng Documents
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Documents]') AND type in (N'U'))
      BEGIN
        CREATE TABLE Documents (
          id INT IDENTITY(1,1) PRIMARY KEY,
          title NVARCHAR(255) NOT NULL,
          description NVARCHAR(MAX),
          category VARCHAR(50) NOT NULL CHECK (category IN ('van-ban', 'tai-lieu', 'bao-cao', 'huong-dan', 'quy-che', 'ke-hoach')),
          file_path VARCHAR(500) NOT NULL,
          original_name NVARCHAR(255) NOT NULL,
          file_size BIGINT,
          file_type VARCHAR(100),
          downloads INT DEFAULT 0,
          status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
          created_by INT,
          updated_by INT,
          createdAt DATETIME DEFAULT GETDATE(),
          updatedAt DATETIME DEFAULT GETDATE()
        );
        PRINT 'Table Documents created.';
      END
      ELSE
      BEGIN
        -- Thêm cột updated_by nếu chưa có
        IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Documents') AND name = 'updated_by')
        BEGIN
          ALTER TABLE Documents ADD updated_by INT;
          PRINT 'Column updated_by added to Documents table.';
        END
      END
    `);
    
    // Tạo bảng Comments
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Comments]') AND type in (N'U'))
      BEGIN
        CREATE TABLE Comments (
          id INT IDENTITY(1,1) PRIMARY KEY,
          post_id INT NOT NULL,
          post_type VARCHAR(50) DEFAULT 'post',
          user_id INT NOT NULL,
          content NTEXT NOT NULL,
          status TINYINT DEFAULT 1,
          created_at DATETIME DEFAULT GETDATE(),
          updated_at DATETIME DEFAULT GETDATE()
        );
        PRINT 'Table Comments created.';
      END
    `);
    
    // Thêm vào function createAllTables, sau bảng Documents
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Movies]') AND type in (N'U'))
      BEGIN
        CREATE TABLE Movies (
          id INT IDENTITY(1,1) PRIMARY KEY,
          title NVARCHAR(255) NOT NULL,
          slug VARCHAR(255) NOT NULL UNIQUE,
          description NVARCHAR(MAX),
          director NVARCHAR(255),
          cast NVARCHAR(MAX),
          genre NVARCHAR(255),
          release_date DATE,
          duration INT, -- phút
          rating DECIMAL(3,1) DEFAULT 0, -- 0-10
          poster VARCHAR(500),
          video_url VARCHAR(500), -- URL video hoặc đường dẫn file
          video_file VARCHAR(500), -- Tên file video upload
          video_size BIGINT, -- Kích thước file video (bytes)
          video_duration INT, -- Thời lượng video thực tế (giây)
          trailer_url VARCHAR(500),
          imdb_id VARCHAR(50),
          country NVARCHAR(100),
          language NVARCHAR(100),
          view_count INT DEFAULT 0,
          status INT DEFAULT 2, -- 1: active, 2: inactive, 0: deleted
          created_by INT DEFAULT 1,
          updated_by INT,
          createdAt DATETIME DEFAULT GETDATE(),
          updatedAt DATETIME DEFAULT GETDATE()
        );
      END
      ELSE
      BEGIN
        -- Thêm cột video nếu chưa có
        IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Movies') AND name = 'video_url')
          ALTER TABLE Movies ADD video_url VARCHAR(500);
        IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Movies') AND name = 'video_file')
          ALTER TABLE Movies ADD video_file VARCHAR(500);
        IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Movies') AND name = 'video_size')
          ALTER TABLE Movies ADD video_size BIGINT;
        IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Movies') AND name = 'video_duration')
          ALTER TABLE Movies ADD video_duration INT;
      END
    `);

    // Tạo bảng MovieGenres (thể loại phim)
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[MovieGenres]') AND type in (N'U'))
      BEGIN
        CREATE TABLE MovieGenres (
          id INT IDENTITY(1,1) PRIMARY KEY,
          name NVARCHAR(100) NOT NULL UNIQUE,
          slug VARCHAR(100) NOT NULL UNIQUE,
          description NVARCHAR(500),
          status INT DEFAULT 1,
          created_at DATETIME DEFAULT GETDATE()
        );
        PRINT 'Table MovieGenres created.';
      END
    `);

    // Tạo bảng MovieReviews (đánh giá phim)
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[MovieReviews]') AND type in (N'U'))
      BEGIN
        CREATE TABLE MovieReviews (
          id INT IDENTITY(1,1) PRIMARY KEY,
          movie_id INT NOT NULL,
          user_id INT,
          rating INT CHECK (rating >= 1 AND rating <= 10),
          review NVARCHAR(MAX),
          status INT DEFAULT 1,
          created_at DATETIME DEFAULT GETDATE(),
          FOREIGN KEY (movie_id) REFERENCES Movies(id) ON DELETE CASCADE
        );
        PRINT 'Table MovieReviews created.';
      END
    `);
    
    // Thêm poll tables
    await createPollTables();
    
    console.log('✅ All tables created successfully');
    
    // Đóng kết nối
    await pool.close();
    
  } catch (err) {
    console.error('Error creating tables:', err);
    throw err;
  }
};

// Thêm function tạo bảng Polls
const createPollTables = async () => {
  try {
    const pool = await connectSqlServer();
    
    // Tạo bảng Polls
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Polls' AND xtype='U')
      CREATE TABLE Polls (
        id INT IDENTITY(1,1) PRIMARY KEY,
        title NVARCHAR(255) NOT NULL,
        description NVARCHAR(MAX),
        start_date DATETIME,
        end_date DATETIME,
        status INT DEFAULT 1,
        created_by INT,
        created_at DATETIME DEFAULT GETDATE(),
        updated_at DATETIME DEFAULT GETDATE()
      )
    `);
    
    // Tạo bảng PollOptions
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='PollOptions' AND xtype='U')
      CREATE TABLE PollOptions (
        id INT IDENTITY(1,1) PRIMARY KEY,
        poll_id INT NOT NULL,
        option_text NVARCHAR(255) NOT NULL,
        vote_count INT DEFAULT 0,
        created_at DATETIME DEFAULT GETDATE(),
        FOREIGN KEY (poll_id) REFERENCES Polls(id) ON DELETE NO ACTION
      )
    `);
    
    // Tạo bảng PollVotes
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='PollVotes' AND xtype='U')
      CREATE TABLE PollVotes (
        id INT IDENTITY(1,1) PRIMARY KEY,
        poll_id INT NOT NULL,
        option_id INT NOT NULL,
        user_id INT,
        ip_address VARCHAR(45),
        created_at DATETIME DEFAULT GETDATE(),
        FOREIGN KEY (poll_id) REFERENCES Polls(id) ON DELETE NO ACTION,
        FOREIGN KEY (option_id) REFERENCES PollOptions(id) ON DELETE NO ACTION
      )
    `);
    
    console.log('✅ Poll tables created successfully');
  } catch (error) {
    console.error('❌ Error creating poll tables:', error);
    throw error;
  }
};

module.exports = {
  connectSqlServer,
  createDatabaseIfNotExists,
  createAllTables,
  createPollTables
};




















