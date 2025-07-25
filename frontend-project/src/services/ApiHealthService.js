import httpAxios from '../httpAxios';
import { urlAPI } from '../config';

const ApiHealthService = {
  checkHealth: async () => {
    try {
      // Thử gọi một endpoint đơn giản để kiểm tra API
      await httpAxios.get('/health', { timeout: 3000 });
      return { status: true, endpoint: urlAPI };
    } catch (error) {
      console.warn('API health check failed:', error.message);
      return { status: false, endpoint: null };
    }
  }
};

export default ApiHealthService;