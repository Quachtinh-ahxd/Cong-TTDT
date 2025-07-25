const Post = require('../models/sql/Post');

// GET ALL POSTS
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.getAll();
    console.log('Posts from DB:', posts); // Xem log này trên terminal
    res.json({
      success: true,
      data: posts,
      total: posts.length,
      message: 'Posts retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET POST BY ID  
exports.getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }
    
    res.json({
      success: true,
      data: post,
      message: 'Post retrieved successfully'
    });
  } catch (error) {
    console.error('❌ Error getting post:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// CREATE POST
exports.createPost = async (req, res) => {
  try {
    console.log('=== CREATE POST ===');
    const { title, slug, content, excerpt, status } = req.body;
    
    if (!title || !slug) {
      return res.status(400).json({
        success: false,
        message: 'Title và slug là bắt buộc'
      });
    }
    
    const postData = {
      title: title.trim(),
      slug: slug.trim(),
      content: content?.trim() || '',
      excerpt: excerpt?.trim() || '',
      status: parseInt(status) || 1,
      image: req.file ? req.file.filename : null,
      created_by: 1
    };
    
    const newPost = await Post.create(postData);
    
    res.status(201).json({
      success: true,
      data: newPost,
      message: 'Post created successfully'
    });
  } catch (error) {
    console.error('❌ Create post error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// UPDATE POST
exports.updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, slug, content, excerpt, status } = req.body;
    
    const existingPost = await Post.findById(id);
    if (!existingPost) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }
    
    const postData = {
      title: title?.trim() || existingPost.title,
      slug: slug?.trim() || existingPost.slug,
      content: content?.trim() || existingPost.content,
      excerpt: excerpt?.trim() || existingPost.excerpt,
      status: status ? parseInt(status) : existingPost.status,
      image: req.file ? req.file.filename : existingPost.image,
      updated_by: 1
    };
    
    const updatedPost = await Post.update(id, postData);
    
    res.json({
      success: true,
      data: updatedPost,
      message: 'Post updated successfully'
    });
  } catch (error) {
    console.error('❌ Update post error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// DELETE POST
exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    
    const existingPost = await Post.findById(id);
    if (!existingPost) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }
    
    const isDeleted = await Post.delete(id);
    
    if (!isDeleted) {
      return res.status(400).json({
        success: false,
        message: 'Failed to delete post'
      });
    }
    
    res.json({
      success: true,
      message: `Post ${existingPost.title} deleted successfully`
    });
  } catch (error) {
    console.error('❌ Delete post error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
