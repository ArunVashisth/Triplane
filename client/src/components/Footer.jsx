import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer-main">
            <div className="container">
                <div className="footer-top">
                    <div className="footer-brand">
                        <div className="nav-logo">
                            <div className="logo-icon"><i className="fas fa-paper-plane"></i></div>
                            <span className="logo-text">triplane</span>
                        </div>
                        <p className="footer-desc">
                            Crafting extraordinary journeys and unforgettable memories. Your trusted companion for exploring the world's most beautiful destinations.
                        </p>
                    </div>

                    <div className="footer-links-grid">
                        <div className="footer-group">
                            <h4>Company</h4>
                            <ul>
                                <li><Link to="/about">About Us</Link></li>
                                <li><Link to="/packages">Our Team</Link></li>
                                <li><Link to="/about">Careers</Link></li>
                                <li><Link to="/about">Blog</Link></li>
                            </ul>
                        </div>
                        <div className="footer-group">
                            <h4>Support</h4>
                            <ul>
                                <li><Link to="/about">Help Center</Link></li>
                                <li><Link to="/about">Safety Information</Link></li>
                                <li><Link to="/about">Cancellation Policy</Link></li>
                                <li><Link to="/about">Contact Support</Link></li>
                            </ul>
                        </div>
                        <div className="footer-group">
                            <h4>Contact Me</h4>
                            <div className="contact-links">
                                <a href="arunvashisth80@gmail.com" className="contact-link">
                                    <i className="far fa-envelope"></i> arunvashisth80@gmail.com
                                </a>
                                <a href="https://github.com/ArunVashisth" target="_blank" rel="noopener noreferrer" className="contact-link">
                                    <i className="fab fa-github"></i> GitHub Profile
                                </a>
                                <a href="https://www.linkedin.com/in/arun-vashisth-27b6a9362/" target="_blank" rel="noopener noreferrer" className="contact-link">
                                    <i className="fab fa-linkedin"></i> LinkedIn
                                </a>
                                <a href="https://portfolio-five-sigma-yvjym7mfdi.vercel.app/" target="_blank" rel="noopener noreferrer" className="contact-link">
                                    <i className="fas fa-globe"></i> My Portfolio
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} Triplane Travel Agency. Designed for a better world.</p>
                    <div className="footer-social">
                        <i className="fab fa-facebook-f"></i>
                        <i className="fab fa-twitter"></i>
                        <i className="fab fa-instagram"></i>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
