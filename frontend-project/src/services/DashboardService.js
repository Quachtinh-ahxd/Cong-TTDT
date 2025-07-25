import httpAxios from '../httpAxios';
import { urlAPI } from '../config';
import ProductService from './ProductService';
import CategoryService from './CategoryService';
import UserService from './UserService';
import FileService from './FileService';
import PostService from './PostService';
import BannerService from './BannerService';
import BrandService from './BrandService';
import MovieService from './MovieService';

const DashboardService = {
  getStats: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await httpAxios.get(`${urlAPI}/dashboard/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.warn('Dashboard API not available, using fallback data collection...');
      
      // Fallback: Thu thập dữ liệu từ các service
      const stats = {
        products: 0,
        categories: 0,
        users: 0,
        files: 0,
        posts: 0,
        banners: 0,
        brands: 0,
        movies: 0
      };

      try {
        const movieResponse = await MovieService.getAll();
        if (movieResponse.data?.status) {
          stats.movies = movieResponse.data.movies?.length || 0;
        }
      } catch (err) {
        console.warn('Could not fetch movies count');
      }

      try {
        const [productsRes, categoriesRes, usersRes, filesRes, postsRes, bannersRes, brandsRes] = await Promise.allSettled([
          ProductService.getAll(),
          CategoryService.getAll(), 
          UserService.getAll(),
          FileService.getAll(),
          PostService.getAll(),
          BannerService.getAll(),
          BrandService.getAll()
        ]);

        // Log để debug
        console.log('Fallback results:', {
          products: productsRes,
          categories: categoriesRes,
          users: usersRes,
          files: filesRes,
          posts: postsRes,
          banners: bannersRes,
          brands: brandsRes
        });

        stats.products = productsRes.status === 'fulfilled' ? (productsRes.value?.data?.products?.length || productsRes.value?.products?.length || 0) : 0;
        stats.categories = categoriesRes.status === 'fulfilled' ? (categoriesRes.value?.data?.categories?.length || categoriesRes.value?.categories?.length || 0) : 0;
        stats.users = usersRes.status === 'fulfilled' ? (usersRes.value?.data?.users?.length || usersRes.value?.users?.length || 0) : 0;
        stats.files = filesRes.status === 'fulfilled' ? (filesRes.value?.data?.files?.length || filesRes.value?.files?.length || 0) : 0;
        stats.posts = postsRes.status === 'fulfilled' ? (postsRes.value?.data?.posts?.length || postsRes.value?.posts?.length || 0) : 0;
        stats.banners = bannersRes.status === 'fulfilled' ? (bannersRes.value?.data?.banners?.length || bannersRes.value?.banners?.length || 0) : 0;
        stats.brands = brandsRes.status === 'fulfilled' ? (brandsRes.value?.data?.brands?.length || brandsRes.value?.brands?.length || 0) : 0;
      } catch (fallbackError) {
        console.error('Error in fallback stats:', fallbackError);
        stats.products = 0;
        stats.categories = 0;
        stats.users = 0;
        stats.files = 0;
        stats.posts = 0;
        stats.banners = 0;
        stats.brands = 0;
      }

      return stats;
    }
  },

  // Thêm method để lấy thống kê chi tiết
  getDetailedStats: async () => {
    try {
      const [
        approvedProducts,
        pendingProducts,
        rejectedProducts
      ] = await Promise.allSettled([
        ProductService.getProductsByApprovalStatus(1), // Đã duyệt
        ProductService.getProductsByApprovalStatus(0), // Chờ duyệt
        ProductService.getProductsByApprovalStatus(2)  // Bị từ chối
      ]);

      console.log('Detailed stats results:', {
        approved: approvedProducts,
        pending: pendingProducts,
        rejected: rejectedProducts
      });

      return {
        products: {
          approved: approvedProducts.status === 'fulfilled' ? (approvedProducts.value?.data?.products?.length || 0) : 0,
          pending: pendingProducts.status === 'fulfilled' ? (pendingProducts.value?.data?.products?.length || 0) : 0,
          rejected: rejectedProducts.status === 'fulfilled' ? (rejectedProducts.value?.data?.products?.length || 0) : 0
        }
      };
    } catch (error) {
      console.error('Error getting detailed stats:', error);
      return {
        products: {
          approved: 0,
          pending: 0,
          rejected: 0
        }
      };
    }
  }
};

export default DashboardService;




