import httpAxios from '../httpAxios';

const ProductService = {
  // Lấy tất cả sản phẩm
  async getAll() {
    try {
      const response = await httpAxios.get('/products');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Lấy sản phẩm theo ID
  getById: async (id) => {
    try {
      const response = await httpAxios.get(`/products/show/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Tạo sản phẩm mới
  create: (productData) => {
    return httpAxios.post('/products/store', productData);
  },

  // Cập nhật sản phẩm
  update: async (id, productData) => {
    try {
      let response;
      try {
        response = await httpAxios.put(`/products/${id}`, productData);
      } catch (error1) {
        try {
          response = await httpAxios.post(`/products/update/${id}`, productData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
        } catch (error2) {
          try {
            response = await httpAxios.patch(`/products/${id}`, productData);
          } catch (error3) {
            response = await httpAxios.post(`/products/${id}`, productData, {
              headers: { 'Content-Type': 'multipart/form-data' }
            });
          }
        }
      }
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Xóa sản phẩm
  delete: (id) => {
    return httpAxios.delete(`/products/destroy/${id}`);
  },

  // Thay đổi trạng thái sản phẩm
  changeStatus: (id) => {
    return httpAxios.get(`/products/status/${id}`);
  },

  // Lấy sản phẩm nổi bật
  getFeatured: (limit = 8) => {
    return httpAxios.get(`/products/featured?limit=${limit}`);
  },

  // Lấy sản phẩm mới nhất
  getLatest: (limit = 8) => {
    return httpAxios.get(`/products/latest?limit=${limit}`);
  },

  // Tìm kiếm sản phẩm
  search: (keyword) => {
    return httpAxios.get(`/products?search=${encodeURIComponent(keyword)}`);
  },

  // Lấy sản phẩm theo trạng thái duyệt
  getProductsByApprovalStatus: (status) => {
    return httpAxios.get(`/products/list?is_approved=${status}`);
  },
  

  // Duyệt sản phẩm
  approveProduct: async (id) => {
  try {
    const response = await httpAxios.put(`/products/${id}/approve`);
    return response.data;
  } catch (error) {
    throw error;
  }
},

  // Từ chối sản phẩm
  rejectProduct: (id, reason) => {
    return httpAxios.put(`/products/reject/${id}`, { reason });
  },

  // Track view
  trackView: async (id) => {
    try {
      const response = await httpAxios.post(`/products/track-view/${id}`);
      return response;
    } catch (error) {
      return null;
    }
  }
};

export default ProductService;
































