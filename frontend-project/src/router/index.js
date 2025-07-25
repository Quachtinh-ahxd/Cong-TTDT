import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RouteAdmin from './RouteAdmin';
import RouteSite from './RouteSite';

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Route cho trang admin */}
        {RouteAdmin()}
        
        {/* Route cho trang người dùng */}
        {RouteSite()}
      </Routes>
    </BrowserRouter>
  );
}

export default Router;