import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductService from '../../services/ProductService';
import CategoryService from '../../services/CategoryService';
import SiteProductImage from '../../components/site/SiteProductImage';
import './Home.css';

function Home() {
    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [postsResponse, categoriesResponse] = await Promise.all([
                ProductService.getAll(),
                CategoryService.getAll()
            ]);
            
            console.log('=== HOME.JS LOAD DATA DEBUG ===');
            console.log('Posts response:', postsResponse);
            
            if (postsResponse.data && Array.isArray(postsResponse.data)) {
                console.log('Total products from API:', postsResponse.data.length);
                
                // DEBUG: Kiểm tra is_approved của tất cả products
                console.log('=== PRODUCTS APPROVAL STATUS ===');
                postsResponse.data.forEach((product, index) => {
                    console.log(`Product ${index + 1}: id=${product.id}, is_approved=${product.is_approved}, name="${product.name}"`);
                });
                
                const approvedPosts = postsResponse.data.filter(
                    product => product.is_approved === 1
                );
                
                console.log('Approved posts count:', approvedPosts.length);
                console.log('Approved posts:', approvedPosts);
                
                if (approvedPosts.length === 0) {
                    console.warn('⚠️ NO APPROVED PRODUCTS FOUND! All products may have is_approved = 0');
                    // Tạm thời hiển thị tất cả products để test
                    setPosts(postsResponse.data);
                    setFeaturedProducts(postsResponse.data.slice(-6).reverse());
                    console.log('🔧 TEMPORARILY SHOWING ALL PRODUCTS FOR TESTING');
                } else {
                    setPosts(approvedPosts);
                    setFeaturedProducts(approvedPosts.slice(-6).reverse());
                }
            } else {
                console.error('❌ postsResponse.data is not an array:', postsResponse.data);
            }
            
            if (categoriesResponse.categories) {
                setCategories(categoriesResponse.categories);
            }
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const featuredPost = posts[0];
    const recentPosts = posts.slice(1, 5);

    if (loading) {
        return (
            <div className="loading-spinner">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Đang tải...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="home-layout">
            <div className="container-fluid">
                <div className="row">
                    {/* Main Content */}
                    <div className="col-lg-8">
                        {/* Featured Article */}
                        {featuredPost && (
                            <div className="featured-article">
                                <div className="featured-image">
                                    <Link to={`/products/${featuredPost.id}`}>
                                        {featuredPost.image ? (
                                            <SiteProductImage
                                                image={featuredPost.image}
                                                alt={featuredPost.name}
                                                style={{ width: '100%', height: '300px', objectFit: 'cover' }}
                                            />
                                        ) : (
                                            <div className="no-image-placeholder" style={{ width: '100%', height: '300px', backgroundColor: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <span className="text-muted">Không có hình ảnh</span>
                                            </div>
                                        )}
                                    </Link>
                                </div>
                                <div className="featured-content">
                                    <div className="featured-category">
                                        {featuredPost.category_name || 'TIN TỨC'}
                                    </div>
                                    <h2 className="featured-title">
                                        <Link to={`/products/${featuredPost.id}`}>
                                            {featuredPost.name}
                                        </Link>
                                    </h2>
                                    <div className="featured-meta">
                                        <span className="date">
                                            {new Date(featuredPost.created_at).toLocaleDateString('vi-VN')}
                                        </span>
                                        <span className="author">Trung đoàn 290</span>
                                    </div>
                                    <p className="featured-excerpt">
                                        {featuredPost.description || featuredPost.name}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Recent Articles Grid */}
                        <div className="recent-articles">
                            <div className="row">
                                {recentPosts.map((post) => (
                                    <div key={post.id} className="col-md-6 mb-3">
                                        <div className="article-card">
                                            <div className="article-image">
                                                <Link to={`/products/${post.id}`}>
                                                    <SiteProductImage
                                                        image={post.image}
                                                        alt={post.name}
                                                        style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                                                    />
                                                </Link>
                                            </div>
                                            <div className="article-content">
                                                <h4 className="article-title">
                                                    <Link to={`/products/${post.id}`}>
                                                        {post.name}
                                                    </Link>
                                                </h4>
                                                <div className="article-meta">
                                                    <span className="date">
                                                        {new Date(post.created_at).toLocaleDateString('vi-VN')}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="col-lg-4">
                        <div className="sidebar">
                            {/* Featured Products - đặt đầu tiên */}
                            <div className="sidebar-section featured-products-section">
                                <h3 className="sidebar-title">TIÊU ĐIỂM</h3>
                                <div className="featured-products-scroll">
                                    <div className="featured-products-list">
                                        {featuredProducts.length > 0 ? (
                                            featuredProducts.map((product) => (
                                                <div key={product.id} className="featured-product-item">
                                                    <h5 className="featured-product-title">
                                                        <Link to={`/products/${product.id}`}>
                                                            {product.name}
                                                        </Link>
                                                    </h5>
                                                </div>
                                            ))
                                        ) : (
                                            <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                                                Không có sản phẩm tiêu điểm
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Latest News - đặt thứ hai */}
                            <div className="sidebar-section">
                                <h3 className="sidebar-title">TIN MỚI NHẤT</h3>
                                <div className="sidebar-articles">
                                    {posts.slice(5, 10).map((post) => (
                                        <div key={post.id} className="sidebar-article">
                                            <div className="sidebar-article-image">
                                                <Link to={`/products/${post.id}`}>
                                                    <SiteProductImage
                                                        image={post.image}
                                                        alt={post.name}
                                                        style={{ width: '80px', height: '60px', objectFit: 'cover' }}
                                                    />
                                                </Link>
                                            </div>
                                            <div className="sidebar-article-content">
                                                <h5 className="sidebar-article-title">
                                                    <Link to={`/products/${post.id}`}>
                                                        {post.name}
                                                    </Link>
                                                </h5>
                                                <div className="sidebar-article-date">
                                                    {new Date(post.created_at).toLocaleDateString('vi-VN')}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* 16 Bài hát quy định - đặt cuối cùng */}
                            <div className="sidebar-section songs-section">
                                <h3 className="sidebar-title">16 BÀI HÁT QUY ĐỊNH</h3>
                                <div className="songs-list">
                                    {[
                                        { name: 'BÀI 1 - TIẾN QUÂN CA', file: 'bai1_tienquanca.mp3' },
                                        { name: 'BÀI 2 - QUỐC TẾ CA', file: 'bai2_quocteca.mp3' },
                                        { name: 'BÀI 3 - CA NGỢI HỒ CHỦ TỊCH', file: 'bai3_cangoihocutich.mp3' },
                                        { name: 'BÀI 4 - CHÀO MỪNG ĐẢNG CỘNG SẢN', file: 'bai4_chaomungdang.mp3' },
                                        { name: 'BÀI 5 - VÌ NHÂN DÂN QUÊN MÌNH', file: 'bai5_vinhandanquenminh.mp3' },
                                        { name: 'BÀI 6 - HÀNH KHÚC ĐỘC LẬP', file: 'bai6_hanhkhucdoclap.mp3' },
                                        { name: 'BÀI 7 - HÀNH KHÚC QUYẾT THẮNG', file: 'bai7_hanhkhucquyetthang.mp3' },
                                        { name: 'BÀI 8 - QUÂN ĐỘI NHÂN DÂN VIỆT NAM', file: 'bai8_quandoinhandan.mp3' },
                                        { name: 'BÀI 9 - TIẾNG GỌI THANH NIÊN', file: 'bai9_tienggoithanhnien.mp3' },
                                        { name: 'BÀI 10 - XUÂN VỀ TRÊN BẢN MÔN', file: 'bai10_xuanvetrenbanmon.mp3' },
                                        { name: 'BÀI 11 - NIỀM TIN CHIẾN THẮNG', file: 'bai11_niemtinchienthang.mp3' },
                                        { name: 'BÀI 12 - HÀNH KHÚC CHIẾN SĨ', file: 'bai12_hanhkhucchiensi.mp3' },
                                        { name: 'BÀI 13 - NGƯỜI LÍNH', file: 'bai13_nguoilinh.mp3' },
                                        { name: 'BÀI 14 - ĐƯỜNG TỚI NGÀY VINH QUANG', file: 'bai14_duongtoingayvinh.mp3' },
                                        { name: 'BÀI 15 - TỔ QUỐC TRONG TRÁI TIM', file: 'bai15_toquoctrongtraitim.mp3' },
                                        { name: 'NHỊP TIM NGƯỜI LÍNH', file: 'nhiptim.mp3' }
                                    ].map((song, idx) => (
                                        <div key={song.file} className="song-item">
                                            <button
                                                className="song-button"
                                                onClick={() => playSong(song.file)}
                                            >
                                                <span className="song-icon">🎵</span>
                                                <span className="song-name">{song.name}</span>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <audio id="audio-player" controls style={{ width: '100%', marginTop: '15px', display: 'none' }}>
                                    <source id="audio-source" src="" type="audio/mpeg" />
                                    Trình duyệt của bạn không hỗ trợ audio.
                                </audio>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Hàm phát nhạc
function playSong(filename) {
    const audio = document.getElementById('audio-player');
    const source = document.getElementById('audio-source');
    if (audio && source) {
        audio.pause();
        let encodedFile = filename.replace(/ /g, '%20');
        source.src = `/audio/qd/${encodedFile}`;
        audio.load();
        audio.style.display = 'block';
        setTimeout(() => {
            audio.play().catch(() => {});
        }, 100);
    }
}

export default Home;











