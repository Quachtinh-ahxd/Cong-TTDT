import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PostService from '../../../services/PostService';
import TopicService from '../../../services/TopicService';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { postImage } from '../../../config';
import PostImage from '../../../components/common/PostImage';
import Swal from 'sweetalert2';

function PostEdit() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  // State cho form
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    topic_id: '',
    detail: '',
    type: 'post',
    metakey: '',
    metadesc: '',
    status: '2',
    image: null
  });

  // State cho topics
  const [topics, setTopics] = useState([]);

  // State cho image
  const [currentImage, setCurrentImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // State loading
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  
  // THÊM STATE ERROR BỊ THIẾU
  const [error, setError] = useState(null);
  
  // Lấy thông tin bài viết và danh sách chủ đề khi component được mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingData(true);
        
        // Lấy danh sách chủ đề (categories)
        console.log('Fetching topics...');
        const topicResponse = await TopicService.getAll();
        console.log('Topic response:', topicResponse);
        
        // SỬA: Xử lý response categories
        if (topicResponse.status && topicResponse.data && topicResponse.data.topics) {
          console.log('Topics data from data.topics:', topicResponse.data.topics);
          setTopics(topicResponse.data.topics || []);
        } else if (topicResponse.status && topicResponse.categories) {
          console.log('Topics data from categories:', topicResponse.categories);
          setTopics(topicResponse.categories || []);
        } else {
          console.error('Failed to load topics:', topicResponse);
          setTopics([]);
        }
        
        // Lấy thông tin bài viết (giữ nguyên logic cũ)
        console.log('Fetching post with ID:', id);
        const postResponse = await PostService.getById(id);
        console.log('Post response:', postResponse);
        
        if (postResponse.status && postResponse.data) {
          const post = postResponse.data;
          setFormData({
            title: post.title || '',
            slug: post.slug || '',
            topic_id: post.topic_id || '',
            detail: post.detail || '',
            type: post.type || 'post',
            metakey: post.metakey || '',
            metadesc: post.metadesc || '',
            status: post.status ? post.status.toString() : '2',
          });
          
          if (post.image) {
            setCurrentImage(post.image);
          }
          setError(null);
        } else if (postResponse.success && postResponse.data) {
          const post = postResponse.data;
          setFormData({
            title: post.title || '',
            slug: post.slug || '',
            topic_id: post.topic_id || '',
            detail: post.detail || '',
            type: post.type || 'post',
            metakey: post.metakey || '',
            metadesc: post.metadesc || '',
            status: post.status ? post.status.toString() : '2',
          });
          
          if (post.image) {
            setCurrentImage(post.image);
          }
          setError(null);
        } else {
          console.error('Failed to load post:', postResponse);
          setError(postResponse.message || 'Không thể tải thông tin bài viết');
          Swal.fire(
            'Lỗi!',
            'Không thể tải thông tin bài viết.',
            'error'
          ).then(() => {
            navigate('/admin/posts');
          });
          return;
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Đã xảy ra lỗi khi tải dữ liệu');
        Swal.fire(
          'Lỗi!',
          'Đã xảy ra lỗi khi tải dữ liệu.',
          'error'
        ).then(() => {
          navigate('/admin/posts');
        });
      } finally {
        setLoadingData(false);
      }
    };
    
    fetchData();
  }, [id, navigate]);

  // XÓA FUNCTION fetchPost TRÙNG LẶP VÌ ĐÃ CÓ fetchData

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
    setLoading(true);

    try {
      // SỬA: Tạo FormData thay vì gửi JSON
      const submitData = {
        ...formData
      };
      
      // Nếu có file ảnh mới, giữ nguyên trong FormData
      // Nếu không có ảnh mới, không gửi field image
      if (!formData.image) {
        delete submitData.image;
      }
      
      console.log('Submitting post update with data:', submitData);
      
      const response = await PostService.update(id, submitData);
      
      console.log('Update response:', response);
      
      // Logic kiểm tra response như cũ
      if (response.status || response.success) {
        Swal.fire({
          title: 'Thành công!',
          text: response.message || 'Cập nhật bài viết thành công!',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          navigate('/admin/posts');
        });
      } else {
        Swal.fire('Lỗi!', response.message || 'Không thể cập nhật bài viết', 'error');
      }
    } catch (error) {
      console.error('Error updating post:', error);
      Swal.fire('Lỗi!', 'Đã xảy ra lỗi khi cập nhật bài viết', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="page-title">Chỉnh sửa bài viết</h2>
        <button 
          className="btn btn-secondary" 
          onClick={() => navigate('/admin/posts')}
        >
          <i className="fas fa-arrow-left me-2"></i>Quay lại
        </button>
      </div>
      
      {/* HIỂN THỊ ERROR NẾU CÓ */}
      {error && (
        <div className="alert alert-danger" role="alert">{error}</div>
      )}
      
      <div className="card">
        <div className="card-body">
          {loadingData ? (
            <div className="text-center my-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Đang tải...</span>
              </div>
              <p className="mt-2">Đang tải dữ liệu...</p>
            </div>
          ) : (
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
                </div>
                
                <div className="col-md-4">
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
                        <>
                          <option value="1">Tin tức (Mock)</option>
                          <option value="2">Thể thao (Mock)</option>
                          <option value="3">Công nghệ (Mock)</option>
                          <option value="4">Giải trí (Mock)</option>
                          <option value="5">Kinh doanh (Mock)</option>
                        </>
                      )}
                    </select>
                    {(!topics || topics.length === 0) && (
                      <small className="text-warning">
                        ⚠️ Đang sử dụng dữ liệu mẫu - Backend chưa có API topics
                      </small>
                    )}
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
                    
                    {(imagePreview || currentImage) && (
                      <div className="mt-3 text-center">
                        {imagePreview ? (
                          <img 
                            src={imagePreview}
                            alt="Preview" 
                            className="img-thumbnail" 
                            style={{ maxHeight: '200px' }}
                          />
                        ) : (
                          <PostImage 
                            image={currentImage}
                            alt="Current image"
                            className="img-thumbnail"
                            style={{ maxHeight: '200px' }}
                          />
                        )}
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
                </button>
                <button 
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
          )}
        </div>
      </div>
    </div>
  );
}

export default PostEdit;



























