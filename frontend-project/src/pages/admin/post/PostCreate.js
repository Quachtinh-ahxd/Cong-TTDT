import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PostService from '../../../services/PostService';
import TopicService from '../../../services/TopicService';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import Swal from 'sweetalert2';

function PostCreate() {
  const navigate = useNavigate();
  
  // State cho form
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    topic_id: '',
    detail: '',
    type: 'post',
    metakey: '',
    metadesc: '',
    status: '2', // Mặc định là chưa xuất bản
    image: null
  });
  
  // State cho topics
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // State cho image preview
  const [imagePreview, setImagePreview] = useState(null);
  
  // State loading
  const [loadingTopics, setLoadingTopics] = useState(true);
  
  // Lấy danh sách chủ đề khi component được mount
  useEffect(() => {
    const loadTopics = async () => {
      try {
        console.log('Loading topics...');
        const response = await TopicService.getAll();
        console.log('Topics response:', response);
        console.log('Topics data:', response.data);
        
        if (response.data && response.data.status && response.data.topics) {
          console.log('Setting topics:', response.data.topics);
          setTopics(response.data.topics);
        } else {
          console.error('No topics found in response:', response.data);
          setTopics([]);
        }
      } catch (error) {
        console.error('Error loading topics:', error);
        setTopics([]);
      }
    };
    
    loadTopics();
  }, []);
  
  // Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Tự động tạo slug từ tiêu đề
    if (name === 'title') {
      const slug = value
        .toLowerCase()
        .replace(/[áàảãạăắằẳẵặâấầẩẫậ]/g, 'a')
        .replace(/[éèẻẽẹêếềểễệ]/g, 'e')
        .replace(/[íìỉĩị]/g, 'i')
        .replace(/[óòỏõọôốồổỗộơớờởỡợ]/g, 'o')
        .replace(/[úùủũụưứừửữự]/g, 'u')
        .replace(/[ýỳỷỹỵ]/g, 'y')
        .replace(/đ/g, 'd')
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/-+/g, '-');
      
      setFormData(prev => ({
        ...prev,
        slug
      }));
    }
  };
  
  // Xử lý thay đổi nội dung chi tiết (CKEditor)
  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    setFormData({
      ...formData,
      detail: data
    });
  };
  
  // Xử lý thay đổi file ảnh
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        image: file
      });
      
      // Tạo preview ảnh
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Kiểm tra dữ liệu
    if (!formData.title || !formData.topic_id || !formData.detail) {
      Swal.fire(
        'Lỗi!',
        'Vui lòng điền đầy đủ thông tin bài viết.',
        'error'
      );
      return;
    }
    
    try {
      setLoading(true);
      
      // Tạo FormData để gửi file
      const data = new FormData();
      data.append('title', formData.title);
      data.append('slug', formData.slug);
      data.append('topic_id', formData.topic_id);
      data.append('detail', formData.detail);
      data.append('type', formData.type);
      data.append('metakey', formData.metakey);
      data.append('metadesc', formData.metadesc);
      data.append('status', formData.status);
      
      if (formData.image) {
        data.append('image', formData.image);
      }
      
      // Gọi API tạo bài viết
      const response = await PostService.create(data);
      
      if (response.status) {
        Swal.fire(
          'Thành công!',
          'Bài viết đã được tạo thành công.',
          'success'
        ).then(() => {
          // Chuyển hướng về trang danh sách bài viết
          navigate('/admin/posts');
        });
      } else {
        Swal.fire(
          'Lỗi!',
          response.message || 'Không thể tạo bài viết.',
          'error'
        );
      }
    } catch (error) {
      console.error('Error creating post:', error);
      Swal.fire(
        'Lỗi!',
        'Đã xảy ra lỗi khi tạo bài viết.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="page-title">Thêm bài viết mới</h2>
        <button 
          className="btn btn-secondary" 
          onClick={() => navigate('/admin/posts')}
        >
          <i className="fas fa-arrow-left me-2"></i>Quay lại
        </button>
      </div>
      
      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-8">
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">Tiêu đề <span className="text-danger">*</span></label>
                  <input 
                    type="text" 
                    className="form-control" 
                    id="title" 
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="slug" className="form-label">Slug</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    id="slug" 
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                  />
                  <small className="text-muted">Slug sẽ được tạo tự động từ tiêu đề</small>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="detail" className="form-label">Nội dung chi tiết <span className="text-danger">*</span></label>
                  <CKEditor
                    editor={ClassicEditor}
                    data={formData.detail}
                    onChange={handleEditorChange}
                    config={{
                      toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', '|', 'outdent', 'indent', '|', 'blockQuote', 'insertTable', 'mediaEmbed', 'undo', 'redo']
                    }}
                  />
                </div>
                
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="metakey" className="form-label">Từ khóa (SEO)</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        id="metakey" 
                        name="metakey"
                        value={formData.metakey}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="metadesc" className="form-label">Mô tả (SEO)</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        id="metadesc" 
                        name="metadesc"
                        value={formData.metadesc}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="topic_id" className="form-label">Chủ đề <span className="text-danger">*</span></label>
                  <select 
                    className="form-select" 
                    id="topic_id" 
                    name="topic_id"
                    value={formData.topic_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Chọn chủ đề --</option>
                    {topics && topics.length > 0 ? (
                      topics.map(topic => (
                        <option key={topic.id} value={topic.id}>
                          {topic.name}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>Đang tải chủ đề...</option>
                    )}
                  </select>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="status" className="form-label">Trạng thái</label>
                  <select 
                    className="form-select" 
                    id="status" 
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="1">Xuất bản</option>
                    <option value="2">Chưa xuất bản</option>
                  </select>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="image" className="form-label">Hình ảnh</label>
                  <input 
                    type="file" 
                    className="form-control" 
                    id="image" 
                    name="image"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  
                  {imagePreview && (
                    <div className="mt-3 text-center">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="img-thumbnail" 
                        style={{ maxHeight: '200px' }}
                        onError={(e) => {
                          console.error('Image failed to load:', e.target.src);
                          e.target.onerror = null;
                          e.target.style.display = 'none';
                          e.target.parentNode.innerHTML = '<div class="no-image-text">Không thể hiển thị ảnh</div>';
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="text-end mt-4">
              <button 
                type="button" 
                className="btn btn-secondary me-2"
                onClick={() => navigate('/admin/posts')}
              >
                Hủy
              </button>              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Đang xử lý...
                  </>
                ) : (
                  <>Lưu bài viết</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PostCreate;









