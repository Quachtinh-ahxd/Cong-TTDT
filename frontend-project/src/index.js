import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import reportWebVitals from './reportWebVitals';

// Import layouts
import LayoutAdmin from './layouts/admin/LayoutAdmin';
import SiteLayout from './layouts/SiteLayout';

// Import admin pages
import Dashboard from './pages/admin/Dashboard';
import Login from './pages/admin/Login';
import ProductList from './pages/admin/product/ProductList';
import ProductCreate from './pages/admin/product/ProductCreate';
import ProductEdit from './pages/admin/product/ProductEdit';
import ProductShow from './pages/admin/product/ProductShow';
import ProductApproval from './pages/admin/product/ProductApproval';
import CategoryList from './pages/admin/category/CategoryList';
import CategoryCreate from './pages/admin/category/CategoryCreate';
import CategoryEdit from './pages/admin/category/CategoryEdit';
import CategoryShow from './pages/admin/category/CategoryShow';
import UserList from './pages/admin/user/UserList';
import UserCreate from './pages/admin/user/UserCreate';
import UserEdit from './pages/admin/user/UserEdit';
import UserShow from './pages/admin/user/UserShow';
import OrderList from './pages/admin/order/OrderList';
import PostList from './pages/admin/post/PostList';
import PostCreate from './pages/admin/post/PostCreate';
import PostEdit from './pages/admin/post/PostEdit';
import PostShow from './pages/admin/post/PostShow';
import BannerList from './pages/admin/banner/BannerList';
import BannerCreate from './pages/admin/banner/BannerCreate';
import BannerEdit from './pages/admin/banner/BannerEdit';
import BannerShow from './pages/admin/banner/BannerShow';
import AdminProfile from './pages/admin/profile/AdminProfile';
import UploadList from './pages/admin/upload/UploadList';
import BrandList from './pages/admin/brand/BrandList';
import BrandCreate from './pages/admin/brand/BrandCreate';
import BrandEdit from './pages/admin/brand/BrandEdit';
import BrandShow from './pages/admin/brand/BrandShow';
import BrandTrash from './pages/admin/brand/BrandTrash';
import Settings from './pages/admin/settings/Settings';
import Statistics from './pages/admin/statistics/Statistics';
import MovieList from './pages/admin/movie/MovieList';
import MovieCreate from './pages/admin/movie/MovieCreate';
import MovieEdit from './pages/admin/movie/MovieEdit';

// Import site pages
import Home from './pages/site/Home';
import Search from './pages/site/Search';
import SiteProductShow from './pages/site/product/ProductShow';
import SiteCategoryShow from './pages/site/category/CategoryShow';
import SitePostShow from './pages/site/post/PostShow';
import LichSu from './pages/site/LichSu';
import PhanThuong from './pages/site/PhanThuong';
import SanPham from './pages/site/SanPham';
import QuanSu from './pages/site/QuanSu';
import HoatDongTrungDoan from './pages/site/HoatDongTrungDoan';
import ThuVien from './pages/site/ThuVien';
import ThuVienSo from './pages/site/ThuVienSo';
import DocumentDetail from './pages/site/DocumentDetail';
import PhanMemQuanDoi from './pages/site/PhanMemQuanDoi';
import BieuMau from './pages/site/VanBan/BieuMau';
import HuongDan from './pages/site/VanBan/HuongDan';
import LienHe from './pages/site/LienHe';
import QuyPham from './pages/site/VanBan/QuyPham';
import LanhDao from './pages/site/LanhDao';
import TrungDoanVaCoQuan from './pages/site/TrungDoanVaCoQuan';
import Profile from './pages/site/Profile';

// Import ProtectedRoute
import ProtectedRoute from './components/ProtectedRoute';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Admin login route */}
        <Route path="/admin/login" element={<Login />} />
        
        {/* Admin routes - protected */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <LayoutAdmin />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          
          {/* Profile */}
          <Route path="profile" element={<AdminProfile />} />
          
          {/* Product routes */}
          <Route path="products">
            <Route index element={<ProductList />} />
            <Route path="create" element={<ProductCreate />} />
            <Route path="edit/:id" element={<ProductEdit />} />
            <Route path="show/:id" element={<ProductShow />} />
            <Route path="approval" element={<ProductApproval />} />
          </Route>
          {/* Brand routes */}
          <Route path="brands">
            <Route index element={<BrandList />} />
            <Route path="create" element={<BrandCreate />} />
            <Route path="edit/:id" element={<BrandEdit />} />
            <Route path="show/:id" element={<BrandShow />} />
            <Route path="trash" element={<BrandTrash />} />
          </Route>
          <Route path="categories" element={<CategoryList />} />
          <Route path="categories/create" element={<CategoryCreate />} />
          <Route path="categories/edit/:id" element={<CategoryEdit />} />
          <Route path="categories/show/:id" element={<CategoryShow />} />
          <Route path="posts" element={<PostList />} />
          <Route path="posts/create" element={<PostCreate />} />
          <Route path="posts/edit/:id" element={<PostEdit />} />
          <Route path="posts/show/:id" element={<PostShow />} />
          <Route path="users" element={<UserList />} />
          <Route path="users/create" element={<UserCreate />} />
          <Route path="users/edit/:id" element={<UserEdit />} />
          <Route path="users/show/:id" element={<UserShow />} />
          <Route path="orders" element={<OrderList />} />
          <Route path="banners" element={<BannerList />} />
          <Route path="banners/create" element={<BannerCreate />} />
          <Route path="banners/edit/:id" element={<BannerEdit />} />
          <Route path="banners/show/:id" element={<BannerShow />} />
          <Route path="uploads" element={<UploadList />} />
          <Route path="settings" element={<Settings />} />
          <Route path="statistics" element={<Statistics />} />
          <Route path="movies" element={<MovieList />} />
          <Route path="movies/create" element={<MovieCreate />} />
          <Route path="movies/edit/:id" element={<MovieEdit />} />
        </Route>
        
        {/* Site routes */}
        <Route path="/" element={<SiteLayout />}>
          <Route index element={<Home />} />
          <Route path="search" element={<Search />} />
          <Route path="products/:id" element={<SiteProductShow />} />
          <Route path="category/:id" element={<SiteCategoryShow />} />
          <Route path="post/:id" element={<SitePostShow />} />
          <Route path="documents/:id" element={<DocumentDetail />} />
          <Route path="lich-su" element={<LichSu />} />
          <Route path="phan-thuong" element={<PhanThuong />} />
          <Route path="san-pham" element={<SanPham />} />
          <Route path="quan-su" element={<QuanSu />} />
          <Route path="hoat-dong" element={<HoatDongTrungDoan />} />
          <Route path="thu-vien" element={<ThuVien />} />
          <Route path="thu-vien/thu-vien-so" element={<ThuVienSo />} />
          <Route path="phan-mem-quan-doi" element={<PhanMemQuanDoi />} />
          <Route path="van-ban/bieu-mau" element={<BieuMau />} />
          <Route path="van-ban/huong-dan" element={<HuongDan />} />
          <Route path="lien-he" element={<LienHe />} />
          <Route path="van-ban/quy-pham" element={<QuyPham />} />
          <Route path="gioi-thieu/lanh-dao" element={<LanhDao />} />
          <Route path="gioi-thieu/chi-tiet" element={<TrungDoanVaCoQuan />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);



reportWebVitals();
































