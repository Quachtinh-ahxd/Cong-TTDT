import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PostService from '../../services/PostService';
import ProductService from '../../services/ProductService';
import { normalizeImagePath } from '../../utils/imageUtils';
import './HeroSlider.css';

const HeroSlider = () => {
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        // Lấy bài viết nổi bật
        const postResponse = await PostService.getFeatured(3);
        // Lấy sản phẩm nổi bật
        const productResponse = await ProductService.getFeatured(2);
        
        const allSlides = [];
        
        if (postResponse.status) {
          postResponse.posts.forEach(post => {
            allSlides.push({
              id: post.id,
              type: 'post',
              title: post.title,
              description: post.description,
              image: normalizeImagePath(post.image, 'post'),
              link: `/post/${post.id}`,
              category: 'Tin tức'
            });
          });
        }
        
        if (productResponse.status) {
          productResponse.products.forEach(product => {
            allSlides.push({
              id: product.id,
              type: 'product',
              title: product.name,
              description: product.description,
              image: normalizeImagePath(product.image, 'product'),
              link: `/product/${product.id}`,
              category: 'Sản phẩm',
              price: product.price
            });
          });
        }
        
        setSlides(allSlides);
      } catch (error) {
        console.error('Error loading slides:', error);
      }
    };
    
    fetchSlides();
  }, []);

  useEffect(() => {
    if (slides.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
      
      return () => clearInterval(timer);
    }
  }, [slides.length]);

  if (slides.length === 0) return null;

  return (
    <div className="hero-slider">
      <div className="slider-container">
        {slides.map((slide, index) => (
          <div 
            key={slide.id}
            className={`slide ${index === currentSlide ? 'active' : ''}`}
          >
            <div className="slide-image">
              <img src={slide.image} alt={slide.title} />
              <div className="slide-overlay"></div>
            </div>
            <div className="slide-content">
              <span className="slide-category">{slide.category}</span>
              <h2 className="slide-title">
                <Link to={slide.link}>{slide.title}</Link>
              </h2>
              <p className="slide-description">{slide.description}</p>
              {slide.price && (
                <div className="slide-price">
                  {slide.price.toLocaleString('vi-VN')} đ
                </div>
              )}
              <Link to={slide.link} className="slide-btn">
                {slide.type === 'product' ? 'Xem sản phẩm' : 'Đọc thêm'}
              </Link>
            </div>
          </div>
        ))}
      </div>
      
      <div className="slider-dots">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => setCurrentSlide(index)}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;