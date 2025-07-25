import React from 'react';
import { Route } from 'react-router-dom';
import SiteLayout from '../layouts/SiteLayout';

// Import các trang Site
import Home from '../pages/site/Home';
// import ProductDetail from '../pages/site/ProductDetail';
// import ProductsByCategory from '../pages/site/ProductsByCategory';
// import ProductsByBrand from '../pages/site/ProductsByBrand';
// import PostDetail from '../pages/site/PostDetail';
// import PostsByTopic from '../pages/site/PostsByTopic';
// import Contact from '../pages/site/Contact';
// import About from '../pages/site/About';
// import Cart from '../pages/site/Cart';
// import Checkout from '../pages/site/Checkout';
// import Login from '../pages/site/Login';
// import Register from '../pages/site/Register';
// import NotFound from '../pages/site/NotFound';

function RouteSite() {
  return (
    <>
      {/* Trang chủ */}
      <Route path="/" element={<SiteLayout />}>
        <Route index element={<Home />} />
        
        {/* Sản phẩm */}
        {/* <Route path="product/:slug" element={<ProductDetail />} />
        <Route path="category/:slug" element={<ProductsByCategory />} />
        <Route path="brand/:slug" element={<ProductsByBrand />} /> */}
        
        {/* Bài viết */}
        {/* <Route path="post/:slug" element={<PostDetail />} />
        <Route path="topic/:slug" element={<PostsByTopic />} />
         */}
        {/* Trang thông tin */}
        {/* <Route path="contact" element={<Contact />} />
        <Route path="about" element={<About />} /> */}
        
        {/* Giỏ hàng & Thanh toán */}
        {/* <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} /> */}
        
        {/* Tài khoản */}
        {/* <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} /> */}
      </Route>
      
      {/* Trang 404 */}
      <Route path="*" element={<NotFound />} />
    </>
  );
}

export default RouteSite;