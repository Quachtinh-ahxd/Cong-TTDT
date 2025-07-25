import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <>
      {/* Top Bar */}
      <div className="top-bar">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <div className="top-info">
                <span className="date">{new Date().toLocaleDateString('vi-VN', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
            </div>
            <div className="col-md-6">
              <div className="top-social">
                <a href="#"><i className="fab fa-facebook-f"></i></a>
                <a href="#"><i className="fab fa-twitter"></i></a>
                <a href="#"><i className="fab fa-instagram"></i></a>
                <a href="#"><i className="fab fa-youtube"></i></a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="main-header">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-3">
              <div className="logo">
                <Link to="/">
                  <h1>Shop News</h1>
                  <span>Your Shopping Magazine</span>
                </Link>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="header-ad">
                <img src="/images/banner/header-ad.jpg" alt="Advertisement" className="img-fluid" />
              </div>
            </div>
            <div className="col-lg-3">
              {/* Đã xóa search form cũ */}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;

