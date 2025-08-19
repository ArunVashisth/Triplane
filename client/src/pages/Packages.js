import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { packageAPI } from '../services/api';
import './Packages.css';

const Packages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await packageAPI.getAllPackages();
        setPackages(res.data);
      } catch (err) {
        setError('Failed to load packages');
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  if (loading) {
    return (
      <div className="home-loading">
        <div className="loading-spinner"></div>
        <p>Loading packages...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-error">
        <h2>Oops! Something went wrong</h2>
        <p>{error}</p>
        <Link to="/" className="btn-retry">Go Home</Link>
      </div>
    );
  }

  return (
    <div className="packages-page">
      <div className="packages-section">
      <div className="packages-header">
        <h2>All Packages</h2>
        <p className="packages-subtitle">- explore everything in one place</p>
        <div className="packages-description">
          <p>
            Browse our complete collection of experiences. Click any package to view full details and book your next adventure.
          </p>
        </div>
      </div>

      {packages.length === 0 ? (
        <div className="no-packages">
          <h3>No packages available</h3>
          <p>Please check back later for new destinations.</p>
        </div>
      ) : (
        <div className="packages-grid">
          {packages.map((pkg) => (
            <div key={pkg._id} className="package-card">
              <div className="package-image">
                <img
                  src={pkg.image || '/placeholder-image.jpg'}
                  alt={pkg.title}
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder-image.jpg';
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
      )}
      </div>
    </div>
  );
};

export default Packages;
