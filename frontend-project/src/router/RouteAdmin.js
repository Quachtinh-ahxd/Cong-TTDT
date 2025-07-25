import React from 'react';
import { Route } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import Login from '../pages/admin/Login';
import Dashboard from '../pages/admin/Dashboard';

// Import Product
import ProductList from '../pages/admin/product/ProductList';
import ProductCreate from '../pages/admin/product/ProductCreate';
import ProductUpdate from '../pages/admin/product/ProductUpdate';
import ProductShow from '../pages/admin/product/ProductShow';
import ProductApproval from '../pages/admin/product/ProductApproval';

// Import Brand
import BrandList from '../pages/admin/brand/BrandList';
import BrandCreate from '../pages/admin/brand/BrandCreate';
import BrandEdit from '../pages/admin/brand/BrandEdit';
import BrandShow from '../pages/admin/brand/BrandShow';
import BrandTrash from '../pages/admin/brand/BrandTrash';

// Import Category
import CategoryList from '../pages/admin/category/CategoryList';
import CategoryCreate from '../pages/admin/category/CategoryCreate';
import CategoryUpdate from '../pages/admin/category/CategoryUpdate';
import CategoryShow from '../pages/admin/category/CategoryShow';
import CategoryTrash from '../pages/admin/category/CategoryTrash';

// Import Post
import PostList from '../pages/admin/post/PostList';
import PostCreate from '../pages/admin/post/PostCreate';
import PostUpdate from '../pages/admin/post/PostUpdate';
import PostShow from '../pages/admin/post/PostShow';
import PostTrash from '../pages/admin/post/PostTrash';

// Import Topic
import TopicList from '../pages/admin/topic/TopicList';
import TopicCreate from '../pages/admin/topic/TopicCreate';
import TopicUpdate from '../pages/admin/topic/TopicUpdate';
import TopicShow from '../pages/admin/topic/TopicShow';
import TopicTrash from '../pages/admin/topic/TopicTrash';

// Import Banner
import BannerList from '../pages/admin/banner/BannerList';
import BannerCreate from '../pages/admin/banner/BannerCreate';
import BannerUpdate from '../pages/admin/banner/BannerUpdate';
import BannerShow from '../pages/admin/banner/BannerShow';
import BannerTrash from '../pages/admin/banner/BannerTrash';

// Import User
import UserList from '../pages/admin/user/UserList';
import UserCreate from '../pages/admin/user/UserCreate';
import UserUpdate from '../pages/admin/user/UserUpdate';
import UserShow from '../pages/admin/user/UserShow';
import UserTrash from '../pages/admin/user/UserTrash';

// Import Customer
import CustomerList from '../pages/admin/customer/CustomerList';
import CustomerShow from '../pages/admin/customer/CustomerShow';
import CustomerTrash from '../pages/admin/customer/CustomerTrash';

// Import Profile
import AdminProfile from '../pages/admin/profile/AdminProfile';

// Import Upload
import FileUpload from '../pages/admin/upload/FileUpload';

function RouteAdmin() {
  return (
    <Route path="/admin" element={<AdminLayout />}>
      <Route index element={<Dashboard />} />
      
      {/* Profile */}
      <Route path="profile" element={<AdminProfile />} />
      
      {/* File Upload */}
      <Route path="uploads" element={<FileUpload />} />
      
      {/* Sản phẩm */}
      <Route path="products">
        <Route index element={<ProductList />} />
        <Route path="create" element={<ProductCreate />} />
        <Route path="edit/:id" element={<ProductUpdate />} />
        <Route path="show/:id" element={<ProductShow />} />
        <Route path="approval" element={<ProductApproval />} />
      </Route>
      
      {/* Thương hiệu */}
      <Route path="brands">
        <Route index element={<BrandList />} />
        <Route path="create" element={<BrandCreate />} />
        <Route path="edit/:id" element={<BrandEdit />} />
        <Route path="show/:id" element={<BrandShow />} />
        <Route path="trash" element={<BrandTrash />} />
      </Route>
      
      {/* Danh mục */}
      <Route path="categories">
        <Route index element={<CategoryList />} />
        <Route path="create" element={<CategoryCreate />} />
        <Route path="edit/:id" element={<CategoryUpdate />} />
        <Route path="update/:id" element={<CategoryUpdate />} />
        <Route path="show/:id" element={<CategoryShow />} />
        <Route path="trash" element={<CategoryTrash />} />
      </Route>
      
      {/* Bài viết */}
      <Route path="posts">
        <Route index element={<PostList />} />
        <Route path="create" element={<PostCreate />} />
        <Route path="edit/:id" element={<PostUpdate />} />
        <Route path="update/:id" element={<PostUpdate />} />
        <Route path="show/:id" element={<PostShow />} />
        <Route path="trash" element={<PostTrash />} />
      </Route>
      
      {/* Chủ đề */}
      <Route path="topics">
        <Route index element={<TopicList />} />
        <Route path="create" element={<TopicCreate />} />
        <Route path="edit/:id" element={<TopicUpdate />} />
        <Route path="update/:id" element={<TopicUpdate />} />
        <Route path="show/:id" element={<TopicShow />} />
        <Route path="trash" element={<TopicTrash />} />
      </Route>
      
      {/* Banner */}
      <Route path="banners">
        <Route index element={<BannerList />} />
        <Route path="create" element={<BannerCreate />} />
        <Route path="edit/:id" element={<BannerUpdate />} />
        <Route path="update/:id" element={<BannerUpdate />} />
        <Route path="show/:id" element={<BannerShow />} />
        <Route path="trash" element={<BannerTrash />} />
      </Route>
      
      {/* Người dùng */}
      <Route path="users">
        <Route index element={<UserList />} />
        <Route path="create" element={<UserCreate />} />
        <Route path="edit/:id" element={<UserUpdate />} />
        <Route path="update/:id" element={<UserUpdate />} />
        <Route path="show/:id" element={<UserShow />} />
        <Route path="trash" element={<UserTrash />} />
      </Route>
      
      {/* Khách hàng */}
      <Route path="customers">
        <Route index element={<CustomerList />} />
        <Route path="show/:id" element={<CustomerShow />} />
        <Route path="trash" element={<CustomerTrash />} />
      </Route>
    </Route>
  );
}

// Route đăng nhập admin (nằm ngoài AdminLayout)
const LoginRoute = (
  <Route path="/admin/login" element={<Login />} />
);

export default function() {
  return (
    <>
      {LoginRoute}
      {RouteAdmin()}
    </>
  );
}









