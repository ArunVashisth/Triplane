import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { packageAPI } from '../services/api';
import './Home.css';

const Home = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPackages();

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await packageAPI.getAllPackages();
      setPackages(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch packages', err);
      setLoading(false);
    }
  };

  const featuredPackages = Array.isArray(packages) ? packages.filter(pkg => pkg.featured).slice(0, 6) : [];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-bg"></div>
        <div className="hero-content">
          <span className="badge">Explore the world with Triplane</span>
          <h1>Travel Beyond Your Limits</h1>
          <p>Discover hidden gems, vibrant cities, and serene landscapes with our curated travel experiences.</p>

          <div className="search-container">
            <div className="search-field">
              <label><i className="fas fa-map-marker-alt"></i> Where to?</label>
              <input type="text" placeholder="Dream destination..." />
            </div>
            <div className="search-field">
              <label><i className="far fa-calendar-alt"></i> Check in</label>
              <input type="date" />
            </div>
            <div className="search-field">
              <label><i className="fas fa-user-friends"></i> Guests</label>
              <input type="number" placeholder="How many?" />
            </div>
            <button className="search-btn">
              <i className="fas fa-search"></i>
            </button>
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="destinations-section">
        <div className="container">
          <div className="section-header">
            <span className="subtitle">Curated for you</span>
            <h2>Trending Destinations</h2>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
            </div>
          ) : (
            <div className="destinations-grid">
              {featuredPackages.map(pkg => (
                <div key={pkg._id} className="destination-card" onClick={() => navigate(`/package/${pkg._id}`)}>
                  <div className="card-image">
                    <img src={pkg.image} alt={pkg.title} />
                    <div className="price-badge">${pkg.price}</div>
                    <div className="heart-btn" onClick={(e) => { e.stopPropagation(); }}>
                      <i className="far fa-heart"></i>
                    </div>
                  </div>
                  <div className="card-info">
                    <span className="card-location">{pkg.location}</span>
                    <h3>{pkg.title}</h3>
                    <div className="card-footer">
                      <div className="duration">
                        <i className="far fa-clock"></i> {pkg.duration}
                      </div>
                      <div className="btn-link">View Details <i className="fas fa-arrow-right"></i></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '60px' }}>
            <button className="nav-btn nav-btn-primary" onClick={() => navigate('/packages')}>
              Explore All Destinations
            </button>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section style={{ background: 'var(--bg-light)', padding: '100px 0' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', textAlign: 'center' }}>
          <div className="trust-item">
            <i className="fas fa-globe-americas" style={{ fontSize: '2.5rem', color: 'var(--accent)', marginBottom: '20px' }}></i>
            <h4 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>500+ Destinations</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Explore the world with our vast selection of tours.</p>
          </div>
          <div className="trust-item">
            <i className="fas fa-shield-alt" style={{ fontSize: '2.5rem', color: 'var(--accent)', marginBottom: '20px' }}></i>
            <h4 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Safe & Secure</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Your safety is our priority with verified operators.</p>
          </div>
          <div className="trust-item">
            <i className="fas fa-headset" style={{ fontSize: '2.5rem', color: 'var(--accent)', marginBottom: '20px' }}></i>
            <h4 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>24/7 Support</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Our team is here to help you anytime, anywhere.</p>
          </div>
        </div>
      </section>

      {/* Simple Footer to match the clean look of the images */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <div className="nav-logo">
                <div className="logo-icon"><i className="fas fa-paper-plane"></i></div>
                <span className="logo-text">triplane</span>
              </div>
              <p style={{ marginTop: '15px' }}>Discover the world one destination at a time. Triplane is your trusted partner for unforgettable travel experiences.</p>
            </div>
            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/packages">Destinations</Link></li>
                <li><Link to="/packages">Packages</Link></li>
                <li><Link to="/about">About Us</Link></li>
              </ul>
            </div>
          </div>
          <div style={{ textAlign: 'center', marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #e2e8f0', color: '#94a3b8', fontSize: '0.9rem' }}>
            &copy; 2024 Triplane. All rights reserved.
          </div>
        </div>
      </footer>

      {showScrollTop && (
        <button className="scroll-top-btn" onClick={scrollToTop}>
          <i className="fas fa-arrow-up"></i>
        </button>
      )}
    </div>
  );
};

export default Home;
