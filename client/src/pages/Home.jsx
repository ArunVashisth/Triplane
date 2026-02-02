import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { packageAPI } from '../services/api';
import './Home.css';

const Home = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const navigate = useNavigate();

  const contactLinks = [
    { icon: 'fab fa-github', label: 'GitHub Profile', url: 'https://github.com/ArunVashisth' },
    { icon: 'far fa-envelope', label: 'Email Me', url: 'mailto:arunvashisth80@gmail.com' },
    { icon: 'fas fa-briefcase', label: 'My Portfolio', url: 'https://portfolio-five-sigma-yvjym7mfdi.vercel.app/' },
    { icon: 'fab fa-linkedin', label: 'LinkedIn', url: 'https://www.linkedin.com/in/arun-vashisth-27b6a9362/' }
  ];

  const [searchData, setSearchData] = useState({
    destination: '',
    checkIn: '',
    guests: ''
  });

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

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchData.destination) params.append('destination', searchData.destination);
    if (searchData.checkIn) params.append('checkIn', searchData.checkIn);
    if (searchData.guests) params.append('guests', searchData.guests);

    navigate(`/packages?${params.toString()}`);
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

          <form className="search-container" onSubmit={handleSearch}>
            <div className="search-field">
              <label><i className="fas fa-map-marker-alt"></i> Where to?</label>
              <input
                type="text"
                placeholder="Dream destination..."
                value={searchData.destination}
                onChange={(e) => setSearchData({ ...searchData, destination: e.target.value })}
              />
            </div>
            <div className="search-field">
              <label><i className="far fa-calendar-alt"></i> Check in</label>
              <input
                type="date"
                value={searchData.checkIn}
                onChange={(e) => setSearchData({ ...searchData, checkIn: e.target.value })}
              />
            </div>
            <div className="search-field">
              <label><i className="fas fa-user-friends"></i> Guests</label>
              <input
                type="number"
                placeholder="How many?"
                value={searchData.guests}
                onChange={(e) => setSearchData({ ...searchData, guests: e.target.value })}
              />
            </div>
            <button type="submit" className="search-btn">
              <i className="fas fa-search"></i>
            </button>
          </form>
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
                    <div className="price-badge">₹{pkg.price}</div>
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

      {/* Contact Me Section - Premium Grid */}
      <section className="contact-me-section">
        <div className="container">
          <div className="contact-card-premium">
            <div className="contact-info">
              <span className="subtitle">Let's Connect</span>
              <h2>Ready for your next adventure?</h2>
              <p>Feel free to reach out for business inquiries, collaboration, or just a quick travel chat!</p>
            </div>
            <div className="contact-links-grid">
              {contactLinks.map((link, index) => (
                <a key={index} href={link.url} target="_blank" rel="noopener noreferrer" className="contact-box">
                  <div className="icon-circle"><i className={link.icon}></i></div>
                  <span>{link.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section - Enhanced */}
      <section className="partners-section">
        <div className="container">
          <div className="section-header">
            <span className="subtitle">Our Global Partners</span>
            <h2>Trusted by the Best</h2>
          </div>
          <div className="partners-grid">
            <div className="partner-logo"><i className="fab fa-expedia"></i> Expedia</div>
            <div className="partner-logo"><i className="fab fa-airbnb"></i> Airbnb</div>
            <div className="partner-logo"><i className="fab fa-tripadvisor"></i> TripAdvisor</div>
            <div className="partner-logo"><i className="fab fa-booking"></i> Booking.com</div>
          </div>
        </div>
      </section>

      {showScrollTop && (
        <button className="scroll-top-btn" onClick={scrollToTop}>
          <i className="fas fa-arrow-up"></i>
        </button>
      )}
    </div>
  );
};

export default Home;
