import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { packageAPI, authAPI } from '../services/api';
import './Packages.css';

const Packages = () => {
  const { user, login } = useContext(AuthContext);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const filters = ['All', 'India', 'Europe', 'America', 'Africa', 'Asia', 'Australia'];

  useEffect(() => {
    fetchPackages();

    // Set filter from URL if present
    const dest = searchParams.get('destination');
    if (dest) {
      // If the destination matches one of our filters, select it
      const matchingFilter = filters.find(f => f.toLowerCase() === dest.toLowerCase());
      if (matchingFilter) {
        setSelectedFilter(matchingFilter);
      }
    }
  }, [searchParams]);

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

  const handleSaveDestination = async (e, pkgId) => {
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const isSaved = user.savedDestinations?.some(d => (d._id || d) === pkgId);
      let newSaved;

      if (isSaved) {
        newSaved = user.savedDestinations.filter(d => (d._id || d) !== pkgId).map(d => d._id || d);
      } else {
        newSaved = [...(user.savedDestinations || []).map(d => d._id || d), pkgId];
      }

      const response = await authAPI.updateProfile({ savedDestinations: newSaved });
      login(localStorage.getItem('token'), response.data);
    } catch (err) {
      console.error('Failed to save destination', err);
    }
  };

  const filteredPackages = !Array.isArray(packages)
    ? []
    : packages.filter(pkg => {
      const pkgContinent = (pkg.continent || '').toLowerCase();
      const pkgLocation = (pkg.location || '').toLowerCase();
      const pkgTitle = (pkg.title || '').toLowerCase();

      // 1. Filter by Category Button (continent/location)
      let matchesFilter = true;
      if (selectedFilter !== 'All') {
        matchesFilter = pkgContinent === selectedFilter.toLowerCase() ||
          pkgLocation.includes(selectedFilter.toLowerCase());
      }

      // 2. Filter by Search Params from URL
      const destParam = (searchParams.get('destination') || '').toLowerCase();
      const guestsParam = parseInt(searchParams.get('guests')) || 0;

      let matchesSearch = true;
      if (destParam) {
        matchesSearch = pkgLocation.includes(destParam) ||
          pkgContinent.includes(destParam) ||
          pkgTitle.includes(destParam);
      }

      if (guestsParam > 0 && pkg.maxGroupSize) {
        matchesSearch = matchesSearch && (pkg.maxGroupSize >= guestsParam);
      }

      return matchesFilter && matchesSearch;
    });

  return (
    <div className="packages-page">
      <div className="packages-container">
        <div className="packages-header">
          <h2>Our Tour Packages</h2>
          <p>Explore our wide range of carefully curated destinations across the globe.</p>
        </div>

        <div className="filter-bar">
          {filters.map(filter => (
            <button
              key={filter}
              className={`continent-btn ${selectedFilter === filter ? 'active' : ''}`}
              onClick={() => setSelectedFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading destinations...</p>
          </div>
        ) : (
          <>
            {filteredPackages.length > 0 ? (
              <div className="packages-grid">
                {filteredPackages.map(pkg => (
                  <div key={pkg._id} className="destination-card" onClick={() => navigate(`/package/${pkg._id}`)}>
                    <div className="card-image">
                      <img 
                        src={pkg.image} 
                        alt={pkg.title} 
                        onError={(e) => {
                          e.target.onerror = null; 
                          e.target.src = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=1200';
                        }}
                      />
                      <div className="price-badge">₹{pkg.price}</div>
                      <div
                        className={`heart-btn ${user?.savedDestinations?.some(d => (d._id || d) === pkg._id) ? 'active' : ''}`}
                        onClick={(e) => handleSaveDestination(e, pkg._id)}
                      >
                        <i className={user?.savedDestinations?.some(d => (d._id || d) === pkg._id) ? 'fas fa-heart' : 'far fa-heart'}></i>
                      </div>
                    </div>
                    <div className="card-info">
                      <span className="card-location">{pkg.location}</span>
                      <h3>{pkg.title}</h3>
                      <div className="card-footer">
                        <div className="duration">
                          <i className="far fa-clock"></i> {pkg.duration}
                        </div>
                        <div className="btn-link">Details <i className="fas fa-arrow-right"></i></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-results" style={{ textAlign: 'center', padding: '60px 20px' }}>
                <i className="fas fa-search" style={{ fontSize: '3rem', color: 'var(--accent)', marginBottom: '20px', opacity: 0.5 }}></i>
                <h3 style={{ fontSize: '1.8rem', marginBottom: '12px' }}>No destinations found</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>We couldn't find any packages matching your search criteria. Try a different destination or filter.</p>
                <button
                  className="nav-btn nav-btn-primary"
                  onClick={() => {
                    setSelectedFilter('All');
                    navigate('/packages');
                  }}
                >
                  View All Packages
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Packages;
