import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/site/Header';
import Footer from '../components/site/Footer';

function SiteLayout() {
  return (
    <div className="site-wrapper">
      <Header />
      <main className="site-main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default SiteLayout;