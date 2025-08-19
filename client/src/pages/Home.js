import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { packageAPI, feedbackAPI } from '../services/api';
import './Home.css';

const Home = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedContinent, setSelectedContinent] = useState('all');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [feedbackForm, setFeedbackForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    fetchPackages();
  }, []);

  // Add scroll event listener for scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
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
      setError('Failed to fetch packages');
      setLoading(false);
    }
  };

  const handleFeedbackChange = (e) => {
    setFeedbackForm({
      ...feedbackForm,
      [e.target.name]: e.target.value
    });
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setFeedbackLoading(true);
    
    try {
      await feedbackAPI.submitFeedback(feedbackForm);
      setFeedbackSuccess(true);
      setFeedbackForm({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      setTimeout(() => setFeedbackSuccess(false), 3000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setFeedbackLoading(false);
    }
  };

  const continents = [
    { id: 'all', name: 'All' },
    { id: 'europe', name: 'Europe' },
    { id: 'america', name: 'America' },
    { id: 'africa', name: 'Africa' },
    { id: 'asia', name: 'Asia' },
    { id: 'australia', name: 'Australia' }
  ];

  const filterPackagesByContinent = (continent) => {
    if (continent === 'all') {
      // Show all packages (both featured and regular) for "all" view
      return packages;
    }
    
    const continentKeywords = {
      'europe': ['rome', 'italy', 'venice', 'florence', 'paris', 'france', 'ukraine', 'kyiv'],
      'america': ['new york', 'usa', 'california', 'american'],
      'africa': ['morocco', 'marrakech', 'cairo', 'egypt', 'tanzania', 'serengeti', 'safari'],
      'asia': ['india', 'agra', 'japan', 'hiroshima', 'osaka', 'thailand', 'sukhothai'],
      'australia': ['australia', 'sydney', 'gold coast', 'canberra', 'great barrier reef']
    };

    const keywords = continentKeywords[continent] || [];
    return packages.filter(pkg => 
      keywords.some(keyword => 
        pkg.location.toLowerCase().includes(keyword) || 
        pkg.title.toLowerCase().includes(keyword)
      )
    );
  };

  const filteredPackages = filterPackagesByContinent(selectedContinent);

  // Group packages by country for carousel
  const groupPackagesByCountry = (continentPackages) => {
    const groups = {};
    continentPackages.forEach(pkg => {
      const country = pkg.location.split(',')[0].trim();
      if (!groups[country]) {
        groups[country] = [];
      }
      groups[country].push(pkg);
    });
    
    return Object.entries(groups).map(([country, packages]) => ({
      country,
      packages
    }));
  };

  const countryGroups = groupPackagesByCountry(filteredPackages);

  const nextSlide = () => {
    setCurrentSlide((prev) => {
      if (prev === countryGroups.length - 1) {
        return 0;
      }
      return prev + 1;
    });
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => {
      if (prev === 0) {
        return countryGroups.length - 1;
      }
      return prev - 1;
    });
  };

  // Auto-advance carousel with faster interval
  useEffect(() => {
    if (countryGroups.length > 1) {
      const interval = setInterval(() => {
        nextSlide();
      }, 3000); // Reduced from 4000ms to 3000ms for faster auto-change
      return () => clearInterval(interval);
    }
  }, [countryGroups.length]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="home-loading">
        <div className="loading-spinner"></div>
        <p>Loading amazing destinations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-error">
        <h2>Oops! Something went wrong</h2>
        <p>{error}</p>
        <button className="btn-retry" onClick={fetchPackages}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Your Gateway to Adventure</h1>
            <p className="hero-subtitle">- Triplane</p>
            <div className="hero-description">
              <p>
                Discover extraordinary destinations and create unforgettable memories. 
                From ancient wonders to modern marvels, embark on journeys that will 
                transform your perspective and enrich your soul.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Continent Filter */}
      <section className="continent-filter">
        {continents.map((continent) => (
          <button
            key={continent.id}
            className={`continent-btn ${selectedContinent === continent.id ? 'active' : ''}`}
            onClick={() => {
              setSelectedContinent(continent.id);
              setCurrentSlide(0);
            }}
          >
            {continent.name}
          </button>
        ))}
      </section>

      {/* Packages Section */}
      <section className="packages-section">
        <div className="packages-header">
          <h2>Discover Your Next Adventure</h2>
          <p className="packages-subtitle">- curated experiences</p>
          <div className="packages-description">
            <p>
              Explore our handpicked collection of extraordinary destinations. Each journey is carefully crafted to provide you with authentic experiences, stunning photography opportunities, and memories that last a lifetime.
            </p>
          </div>
        </div>

        {selectedContinent === 'all' ? (
          // Enhanced grid layout for "all" view with side-by-side packages
          <div className="packages-grid">
            {filteredPackages.map((pkg) => (
              <div key={pkg._id} className="package-card">
                <div className="package-image">
                  <img 
                    src={pkg.image || '/placeholder-image.jpg'} 
                    alt={pkg.title} 
                    onError={(e) => {
                      e.target.src = '/placeholder-image.jpg';
                    }}
                  />
                  {pkg.featured && <div className="featured-badge">Featured</div>}
                </div>
                <div className="package-content">
                  <h3 className="package-title">{pkg.title}</h3>
                  <div className="package-price">
                    from <span className="price-amount">${pkg.price}</span>
                  </div>
                  <p className="package-description">{pkg.description}</p>
                  <div className="package-details">
                    <div className="detail-item">
                      <i className="fas fa-clock"></i>
                      <span>Duration: {pkg.duration}</span>
                    </div>
                    <div className="detail-item">
                      <i className="fas fa-users"></i>
                      <span>Max {pkg.maxGroupSize} people</span>
                    </div>
                    <div className="detail-item">
                      <i className="fas fa-mountain"></i>
                      <span>Difficulty: {pkg.difficulty}</span>
                    </div>
                  </div>
                  <Link to={`/package/${pkg._id}`} className="view-details-btn">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Enhanced carousel for specific continents with auto-change
          <div className="country-carousel">
            {countryGroups.length > 0 ? (
              <>
                <div className="carousel-container">
                  <button className="carousel-btn prev" onClick={prevSlide}>
                    <i className="fas fa-chevron-left"></i>
                  </button>
                  
                  <div className="carousel-content">
                    <div className="country-group">
                      <h3 className="country-title">{countryGroups[currentSlide]?.country}</h3>
                      <div className="country-packages">
                        {countryGroups[currentSlide]?.packages.slice(0, 3).map((pkg) => (
                          <div key={pkg._id} className="country-package-card">
                            <div className="country-package-image">
                              <img 
                                src={pkg.image || '/placeholder-image.jpg'} 
                                alt={pkg.title} 
                                onError={(e) => {
                                  e.target.src = '/placeholder-image.jpg';
                                }}
                              />
                              {pkg.featured && <div className="featured-badge">Featured</div>}
                            </div>
                            <div className="country-package-content">
                              <h4 className="country-package-title">{pkg.title}</h4>
                              <div className="country-package-price">
                                from <span className="price-amount">${pkg.price}</span>
                              </div>
                              <p className="country-package-description">{pkg.description}</p>
                              <div className="country-package-details">
                                <div className="detail-item">
                                  <i className="fas fa-clock"></i>
                                  <span>{pkg.duration}</span>
                                </div>
                                <div className="detail-item">
                                  <i className="fas fa-users"></i>
                                  <span>Max {pkg.maxGroupSize} people</span>
                                </div>
                              </div>
                              <Link to={`/package/${pkg._id}`} className="view-details-btn">
                                View Details
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button className="carousel-btn next" onClick={nextSlide}>
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </div>
                
                <div className="carousel-indicators">
                  {countryGroups.map((_, index) => (
                    <button
                      key={index}
                      className={`indicator ${index === currentSlide ? 'active' : ''}`}
                      onClick={() => setCurrentSlide(index)}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="no-packages">
                <h3>No packages found for this region</h3>
                <p>Try selecting a different continent or check back later for new destinations.</p>
              </div>
            )}
          </div>
        )}

        {selectedContinent === 'all' && filteredPackages.length === 0 && (
          <div className="no-packages">
            <h3>No packages available</h3>
            <p>Check back later for amazing destinations.</p>
          </div>
        )}
      </section>

      {/* About Section */}
      <section className="about-section">
        <div className="about-content">
          <div className="about-text">
            <h2>Why Choose Triplane?</h2>
            <p className="about-subtitle">- your trusted travel partner</p>
            <div className="about-description">
              <p>
                We believe that travel should be more than just visiting places—it should be about creating meaningful connections, experiencing authentic cultures, and discovering the extraordinary in the ordinary.
              </p>
            </div>
            <ul className="services-list">
              <li><i className="fas fa-check-circle"></i> Expert local guides</li>
              <li><i className="fas fa-check-circle"></i> Handpicked accommodations</li>
              <li><i className="fas fa-check-circle"></i> Small group experiences</li>
              <li><i className="fas fa-check-circle"></i> 24/7 support</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section">
        <div className="contact-content">
          <div className="contact-text">
            <h2>Get in Touch</h2>
            <p className="contact-subtitle">- we'd love to hear from you</p>
            <div className="contact-description">
              <p>
                Have questions about our tours? Want to share your travel experiences? 
                We're here to help and would love to hear from you.
              </p>
            </div>
          </div>
          
          <form onSubmit={handleFeedbackSubmit} className="feedback-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={feedbackForm.name}
                  onChange={handleFeedbackChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={feedbackForm.email}
                  onChange={handleFeedbackChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={feedbackForm.subject}
                onChange={handleFeedbackChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={feedbackForm.message}
                onChange={handleFeedbackChange}
                rows="4"
                required
              />
            </div>
            
            <button 
              type="submit" 
              className="submit-btn"
              disabled={feedbackLoading}
            >
              {feedbackLoading ? 'Sending...' : 'Send Message'}
            </button>
            
            {feedbackSuccess && (
              <div className="success-message">
                Thank you for your message! We'll get back to you soon.
              </div>
            )}
          </form>
        </div>
      </section>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button className="scroll-to-top" onClick={scrollToTop}>
          <i className="fas fa-arrow-up"></i>
        </button>
      )}

      {/* Footer Section */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Triplane</h3>
            <p>Your gateway to adventure. Discover extraordinary destinations and create unforgettable memories with our carefully curated travel experiences.</p>
            <div className="social-links">
              <a href="#" aria-label="Facebook"><i className="fab fa-facebook"></i></a>
              <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
              <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
              <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin"></i></a>
              <a href="#" aria-label="YouTube"><i className="fab fa-youtube"></i></a>
            </div>
          </div>
          
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/" onClick={scrollToTop}>Home</a></li>
              <li><a href="/about">About Us</a></li>
              <li><a href="#packages">Destinations</a></li>
              <li><a href="#contact">Contact</a></li>
              <li><a href="/login">Login</a></li>
              <li><a href="/register">Register</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Destinations</h4>
            <ul>
              <li><a href="#europe">Europe</a></li>
              <li><a href="#asia">Asia</a></li>
              <li><a href="#africa">Africa</a></li>
              <li><a href="#america">America</a></li>
              <li><a href="#australia">Australia</a></li>
              <li><a href="#featured">Featured Tours</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Services</h4>
            <ul>
              <li><a href="#guided-tours">Guided Tours</a></li>
              <li><a href="#custom-packages">Custom Packages</a></li>
              <li><a href="#group-travel">Group Travel</a></li>
              <li><a href="#photography-tours">Photography Tours</a></li>
              <li><a href="#adventure-travel">Adventure Travel</a></li>
              <li><a href="#luxury-travel">Luxury Travel</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Support</h4>
            <ul>
              <li><a href="#faq">FAQ</a></li>
              <li><a href="#booking-help">Booking Help</a></li>
              <li><a href="#travel-insurance">Travel Insurance</a></li>
              <li><a href="#cancellation-policy">Cancellation Policy</a></li>
              <li><a href="#terms-conditions">Terms & Conditions</a></li>
              <li><a href="#privacy-policy">Privacy Policy</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Contact Info</h4>
            <div className="contact-info">
              <p><i className="fas fa-map-marker-alt"></i> 123 Travel Street, Adventure City, AC 12345</p>
              <p><i className="fas fa-phone"></i> +1 (555) 123-4567</p>
              <p><i className="fas fa-envelope"></i> info@triplane.com</p>
              <p><i className="fas fa-clock"></i> Mon-Fri: 9AM-6PM</p>
              <p><i className="fas fa-globe"></i> www.triplane.com</p>
              <p><i className="fas fa-headset"></i> 24/7 Emergency: +1 (555) 999-8888</p>
            </div>
          </div>
        </div>
        
        <div className="footer-middle">
          <div className="newsletter-section">
            <h4>Subscribe to Our Newsletter</h4>
            <p>Get the latest travel updates, exclusive offers, and destination inspiration delivered to your inbox.</p>
            <form className="newsletter-form">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                required 
              />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p>&copy; 2024 Triplane. All rights reserved. | Your Gateway to Adventure</p>
            <div className="footer-bottom-links">
              <a href="#terms">Terms of Service</a>
              <span>|</span>
              <a href="#privacy">Privacy Policy</a>
              <span>|</span>
              <a href="#cookies">Cookie Policy</a>
              <span>|</span>
              <a href="#sitemap">Sitemap</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
