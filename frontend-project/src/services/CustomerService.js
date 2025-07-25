import httpAxios from '../httpAxios';
import { urlAPI } from '../config';

const CustomerService = {
  getAll: () => httpAxios.get(`${urlAPI}/customer`),
  getById: (id) => httpAxios.get(`${urlAPI}/customer/show/${id}`),
  create: (data) => httpAxios.post(`${urlAPI}/customer/store`, data),
  update: (id, data) => httpAxios.post(`${urlAPI}/customer/update/${id}`, data),
  delete: (id) => httpAxios.delete(`${urlAPI}/customer/destroy/${id}`),
  changeStatus: (id) => httpAxios.get(`${urlAPI}/customer/status/${id}`)
};

export default CustomerService;
