import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { packageAPI, bookingAPI } from '../services/api';
import './PackageDetails.css';

const PackageDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useContext(AuthContext);
  
  const [packageData, setPackageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingForm, setBookingForm] = useState({
    numberOfPeople: 1,
    bookingDate: '',
    duration: '',
    specialRequests: ''
  });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState('');

  useEffect(() => {
    fetchPackageDetails();
  }, [id]);

  const fetchPackageDetails = async () => {
    try {
      const response = await packageAPI.getPackageById(id);
      setPackageData(response.data);
      // Set default duration
      setBookingForm(prev => ({
        ...prev,
        duration: response.data.duration
      }));
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch package details');
      setLoading(false);
    }
  };

  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setBookingForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    setBookingLoading(true);
    setBookingError('');

    try {
      const totalPrice = packageData.price * bookingForm.numberOfPeople;
      const bookingData = {
        packageId: id,
        numberOfPeople: parseInt(bookingForm.numberOfPeople),
        bookingDate: bookingForm.bookingDate,
        duration: bookingForm.duration,
        totalPrice,
        specialRequests: bookingForm.specialRequests
      };

      const response = await bookingAPI.createBooking(bookingData);

      alert('Booking created successfully!');
      navigate('/');
    } catch (err) {
      setBookingError(err.response?.data?.message || 'Failed to create booking');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="package-details-loading">
        <div className="loading-spinner"></div>
        <p>Loading package details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="package-details-error">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/')} className="btn-primary">
          Back to Home
        </button>
      </div>
    );
  }

  if (!packageData) {
    return (
      <div className="package-details-error">
        <h2>Package Not Found</h2>
        <p>The package you're looking for doesn't exist.</p>
        <button onClick={() => navigate('/')} className="btn-primary">
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="package-details-page">
      <div className="package-details-container">
        <div className="package-details-content">
          <div className="package-image-section">
            <img src={packageData.image} alt={packageData.title} className="package-image" />
            {packageData.featured && <div className="featured-badge">Featured</div>}
          </div>
          
          <div className="package-info-section">
            <h1 className="package-title">{packageData.title}</h1>
            
            <div className="package-price">
              from <span className="price-amount">${packageData.price}</span> per person
            </div>

            <p className="package-description">{packageData.description}</p>

            <div className="package-details-grid">
              <div className="detail-item">
                <i className="fas fa-clock"></i>
                <h4>Duration</h4>
                <p>{packageData.duration}</p>
              </div>
              <div className="detail-item">
                <i className="fas fa-users"></i>
                <h4>Group Size</h4>
                <p>Max {packageData.maxGroupSize} people</p>
              </div>
              <div className="detail-item">
                <i className="fas fa-mountain"></i>
                <h4>Difficulty</h4>
                <p>{packageData.difficulty}</p>
              </div>
              <div className="detail-item">
                <i className="fas fa-map-marker-alt"></i>
                <h4>Location</h4>
                <p>{packageData.location}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="booking-section">
          <h3 className="booking-title">Book This Tour</h3>
          {bookingError && <div className="booking-error">{bookingError}</div>}
          <form onSubmit={handleBookingSubmit} className="booking-form">
                <div className="form-group">
                  <label htmlFor="numberOfPeople">Number of People</label>
                  <input
                    type="number"
                    id="numberOfPeople"
                    name="numberOfPeople"
                    min="1"
                    max={packageData.maxGroupSize}
                    value={bookingForm.numberOfPeople}
                    onChange={handleBookingChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="duration">Duration</label>
                  <select
                    id="duration"
                    name="duration"
                    value={bookingForm.duration}
                    onChange={handleBookingChange}
                    required
                  >
                    <option value="">Select duration</option>
                    <option value="3 days">3 days</option>
                    <option value="5 days">5 days</option>
                    <option value="7 days">7 days</option>
                    <option value="10 days">10 days</option>
                    <option value="14 days">14 days</option>
                    <option value={packageData.duration}>{packageData.duration} (Recommended)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="bookingDate">Preferred Date</label>
                  <input
                    type="date"
                    id="bookingDate"
                    name="bookingDate"
                    value={bookingForm.bookingDate}
                    onChange={handleBookingChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="specialRequests">Special Requests (Optional)</label>
                  <textarea
                    id="specialRequests"
                    name="specialRequests"
                    value={bookingForm.specialRequests}
                    onChange={handleBookingChange}
                    rows="3"
                    placeholder="Any special requirements or requests..."
                  />
                </div>

                <button 
                  type="submit" 
                  className="booking-btn"
                  disabled={bookingLoading}
                >
                  {bookingLoading ? 'Processing...' : 'Book Now'}
                </button>

                {!isAuthenticated() && (
                  <p style={{ textAlign: 'center', color: '#7f8c8d', marginTop: '15px', fontSize: '0.9rem' }}>
                    Please <button 
                      type="button" 
                      onClick={() => navigate('/login')}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#ff6b6b',
                        textDecoration: 'underline',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '0.9rem'
                      }}
                    >
                      login
                    </button> to book this tour.
                  </p>
                )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default PackageDetails;
