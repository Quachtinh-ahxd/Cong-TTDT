import httpAxios from '../httpAxios';

const UserService = {
  getAll: () => {
    console.log('=== UserService.getAll() ===');
    return httpAxios.get('/user');
  },
  
  getById: (id) => {
    console.log('=== UserService.getById() ===', id);
    return httpAxios.get(`/users/${id}`); // Copy từ ProductService
  },
  
  create: (userData) => {
    console.log('=== UserService.create() ===');
    return httpAxios.post('/users', userData); // Copy từ ProductService
  },
  
  update: (id, userData) => {
    console.log('=== UserService.update() ===', id);
    return httpAxios.put(`/users/${id}`, userData); // Copy từ ProductService
  },
  
  delete: (id) => {
    console.log('=== UserService.delete() ===', id);
    return httpAxios.delete(`/users/${id}`); // Copy từ ProductService
  }
};

export default UserService;





