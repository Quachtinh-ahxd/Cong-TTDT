const Document = require('../models/sql/Document'); // ← ĐỔI THÀNH Document
const path = require('path');
const fs = require('fs');

const fileController = {
  getAllFiles: async (req, res) => {
    try {
      console.log('🔍 GET /api/files - Using Document model');
      const documents = await Document.findAll(); // ← DÙNG Document.findAll()
      
      // Xử lý file path và thông tin
      const processedFiles = documents.map(doc => {
        let fileUrl = null;
        let downloadUrl = null;
        
        if (doc.file_path) {
          // Kiểm tra file có tồn tại không
          const fileName = path.basename(doc.file_path);
          const filePath = path.join(__dirname, '../../public/images/files', fileName);
          const fileExists = fs.existsSync(filePath);
          
          if (fileExists) {
            fileUrl = `/images/files/${fileName}`;
            downloadUrl = `/api/files/download/${doc.id}`;
          }
        }
        
        return {
          id: doc.id,
          title: doc.title || '',
          description: doc.description || '',
          category: doc.category || 'tai-lieu',
          file_path: doc.file_path || '',
          original_name: doc.original_name || '',
          file_size: parseInt(doc.file_size) || 0,
          file_type: doc.file_type || '',
          file_url: fileUrl,
          download_url: downloadUrl,
          downloads: doc.downloads || 0,
          created_by: doc.created_by,
          created_by_name: doc.created_by_name || '',
          created_by_username: doc.created_by_username || '',
          status: doc.status,
          createdAt: doc.createdAt
        };
      });
      
      console.log(`✅ Processed ${processedFiles.length} documents`);
      
      res.json({
        success: true,
        data: processedFiles,
        total: processedFiles.length,
        message: 'Documents retrieved successfully'
      });
      
    } catch (error) {
      console.error('❌ Error getting documents:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Internal server error',
        data: []
      });
    }
  },

  getFileById: async (req, res) => {
    try {
      const { id } = req.params;
      const document = await Document.findById(id); // ← DÙNG Document.findById()
      
      if (!document) {
        return res.status(404).json({
          success: false,
          message: 'Document not found'
        });
      }
      
      res.json({
        success: true,
        data: document,
        message: 'Document retrieved successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  uploadFile: async (req, res) => {
    try {
      console.log('=== DOCUMENT UPLOAD DEBUG ===');
      console.log('Request body:', req.body);
      console.log('Request file:', req.file);
      
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded'
        });
      }

      const documentData = {
        title: req.body.title || req.file.originalname,
        description: req.body.description || '',
        file_path: `/images/files/${req.file.filename}`,
        original_name: req.file.originalname,
        file_size: req.file.size,
        file_type: req.file.mimetype,
        created_by: req.user?.id || 1
      };

      const savedDocument = await Document.create(documentData); // ← DÙNG Document.create()

      res.json({
        success: true,
        data: {
          id: savedDocument.id,
          title: savedDocument.title,
          original_name: savedDocument.original_name,
          file_size: savedDocument.file_size,
          file_url: `/images/files/${req.file.filename}`,
          download_url: `/api/files/download/${savedDocument.id}`
        },
        message: 'Document uploaded successfully'
      });
    } catch (error) {
      console.error('Upload document error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  deleteFile: async (req, res) => {
    try {
      const { id } = req.params;
      
      // Get document info before delete
      const document = await Document.findById(id);
      if (document && document.file_path) {
        // Delete physical file
        const fileName = path.basename(document.file_path);
        const filePath = path.join(__dirname, '../../public/images/files', fileName);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      
      const deleted = await Document.delete(id, req.user?.id || 1); // ← DÙNG Document.delete()
      
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Document not found'
        });
      }
      
      res.json({
        success: true,
        message: 'Document deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  downloadFile: async (req, res) => {
    try {
      const { id } = req.params;
      const document = await Document.findById(id);
      
      if (!document) {
        return res.status(404).json({
          success: false,
          message: 'Document not found'
        });
      }
      
      // Increment download count
      await Document.incrementDownloads(id);
      
      const fileName = path.basename(document.file_path);
      const filePath = path.join(__dirname, '../../public/images/files', fileName);
      
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({
          success: false,
          message: 'Physical file not found'
        });
      }
      
      res.download(filePath, document.original_name);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  getDocumentsByCategory: async (req, res) => {
    try {
      const { category } = req.params;
      const { page = 1, limit = 20 } = req.query;
      
      const documents = await Document.findByCategory(category, { 
        page: parseInt(page), 
        limit: parseInt(limit) 
      });
      
      res.json({
        success: true,
        data: documents,
        total: documents.length,
        page: parseInt(page),
        limit: parseInt(limit),
        message: 'Documents retrieved successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
};

module.exports = fileController;
