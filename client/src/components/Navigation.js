import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import './Navigation.css';

const Navigation = () => {
  const { user, isAuthenticated, logout, isAdmin } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  const handleNavLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  const handleHomeClick = () => {
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        <Link to="/" className="nav-logo" onClick={handleHomeClick}>
          <div className="logo-icon">
            <i className="fas fa-plane"></i>
          </div>
          <span className="logo-text">Triplane</span>
        </Link>

        <button
          className="mobile-menu-btn"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <i className={isMobileMenuOpen ? 'fas fa-times' : 'fas fa-bars'}></i>
        </button>

        <div className={`nav-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          <Link to="/" className="nav-link" onClick={handleNavLinkClick}>
            Home
          </Link>
          <Link to="/packages" className="nav-link" onClick={handleNavLinkClick}>
            Destinations
          </Link>
          <Link to="/about" className="nav-link" onClick={handleNavLinkClick}>
            About
          </Link>

          <div className="nav-actions">
            <button className="theme-toggle-btn" onClick={toggleTheme} title="Toggle Theme">
              <i className={theme === 'light' ? 'fas fa-moon' : 'fas fa-sun'}></i>
            </button>

            {isAuthenticated() ? (
              <>
                <button
                  className="nav-btn nav-btn-outline"
                  onClick={() => { navigate('/profile'); handleNavLinkClick(); }}
                >
                  <i className={isAdmin() ? 'fas fa-crown' : 'far fa-user'}></i>
                  {isAdmin() ? 'Admin' : 'Account'}
                </button>
                <button
                  className="nav-btn nav-btn-primary"
                  onClick={handleLogout}
                >
                  <i className="fas fa-sign-out-alt"></i>
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  className="nav-btn nav-btn-outline"
                  onClick={() => { navigate('/login'); handleNavLinkClick(); }}
                >
                  Sign In
                </button>
                <button
                  className="nav-btn nav-btn-primary"
                  onClick={() => { navigate('/register'); handleNavLinkClick(); }}
                >
                  Join Triplane
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
