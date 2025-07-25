// Hệ thống phân loại file tự động
export const FileClassifier = {
  // Định nghĩa các danh mục và từ khóa
  categories: {
    'phan-mem-quan-doi': {
      keywords: ['quân đội', 'quân sự', 'bộ đội', 'lính', 'chiến tranh', 'vũ khí', 'tác chiến', 'huấn luyện quân sự', 'karaoke', 'quân ca'],
      filePatterns: ['quan_doi', 'quan_su', 'bo_doi', 'military', 'army', 'karaoke']
    },
    'huong-dan-chi-dao': {
      keywords: ['hướng dẫn', 'chỉ đạo', 'thông tư', 'nghị định', 'quyết định', 'công văn', 'chỉ thị', 'chuyên đề', 'văn bản', 'quy phạm', 'luật', 'pháp luật'],
      filePatterns: ['huong_dan', 'chi_dao', 'thong_tu', 'nghi_dinh', 'quyet_dinh', 'chuyen_de', 'van_ban', 'quy_pham']
    },
    'mau-van-ban': {
      keywords: ['mẫu', 'biểu mẫu', 'form', 'template', 'đơn từ', 'giấy tờ'],
      filePatterns: ['mau', 'bieu_mau', 'template', 'form', 'don_tu']
    }
  },

  // Hàm decode UTF-8 cho tên file
  decodeFileName(fileName) {
    try {
      // Thử decode UTF-8
      return decodeURIComponent(escape(fileName));
    } catch (e) {
      // Nếu không decode được, trả về tên gốc
      return fileName;
    }
  },

  // Phân loại file dựa trên tên và nội dung
  classifyFile(fileName, description = '') {
    // Decode tên file trước khi xử lý
    const decodedFileName = this.decodeFileName(fileName || '');
    const text = `${decodedFileName} ${description}`.toLowerCase();
    
    for (const [category, config] of Object.entries(this.categories)) {
      const hasKeyword = config.keywords.some(keyword => 
        text.includes(keyword.toLowerCase())
      );
      
      const hasPattern = config.filePatterns.some(pattern => 
        text.includes(pattern.toLowerCase())
      );
      
      if (hasKeyword || hasPattern) {
        return category;
      }
    }
    
    return 'other';
  },

  getFilesByCategory(files, category) {
    return files.filter(file => {
      const fileCategory = this.classifyFile(
        file.name || file.original_name || '', 
        file.description || ''
      );
      return fileCategory === category;
    });
  }
};

export default FileClassifier;





















