import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { packageAPI, authAPI } from '../services/api';
import './Packages.css';

const Packages = () => {
  const { user, login } = useContext(AuthContext);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const navigate = useNavigate();

  const filters = ['All', 'India', 'Europe', 'America', 'Africa', 'Asia', 'Australia'];

  useEffect(() => {
    fetchPackages();
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

  const filteredPackages = selectedFilter === 'All'
    ? packages
    : packages.filter(pkg => {
      const pkgContinent = pkg.continent || '';
      const pkgLocation = pkg.location || '';
      return pkgContinent.toLowerCase() === selectedFilter.toLowerCase() ||
        pkgLocation.toLowerCase().includes(selectedFilter.toLowerCase());
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
          <div className="packages-grid">
            {filteredPackages.map(pkg => (
              <div key={pkg._id} className="destination-card" onClick={() => navigate(`/package/${pkg._id}`)}>
                <div className="card-image">
                  <img src={pkg.image} alt={pkg.title} />
                  <div className="price-badge">${pkg.price}</div>
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
        )}
      </div>
    </div>
  );
};

export default Packages;
