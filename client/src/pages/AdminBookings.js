import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { bookingAPI } from '../services/api';
import './AdminBookings.css';

const AdminBookings = () => {
  const { isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAdmin()) {
      navigate('/');
      return;
    }
    fetchAllBookings();
  }, [isAdmin, navigate]);

  const fetchAllBookings = async () => {
    try {
      const response = await bookingAPI.getAllBookings();
      setBookings(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch bookings');
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId, status) => {
    try {
      setError(''); // Clear any previous errors
      const response = await bookingAPI.updateBookingStatus(bookingId, status);
      
      // Refresh the bookings list
      await fetchAllBookings();
      alert(`Booking ${status} successfully!`);
    } catch (err) {
      console.error('Booking update error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update booking status';
      setError(errorMessage);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return '#28a745';
      case 'pending': return '#ffc107';
      case 'cancelled': return '#dc3545';
      case 'completed': return '#17a2b8';
      default: return '#6c757d';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed': return 'CONFIRMED';
      case 'pending': return 'PENDING';
      case 'cancelled': return 'CANCELLED';
      case 'completed': return 'COMPLETED';
      default: return status.toUpperCase();
    }
  };

  if (loading) {
    return (
      <div className="admin-bookings-loading">
        <div className="loading-spinner"></div>
        <p>Loading bookings...</p>
      </div>
    );
  }

  return (
    <div className="admin-bookings-page">
      <div className="admin-bookings-header">
        <h1>Booking Management</h1>
        <p>Manage all booking requests from users</p>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="bookings-stats">
        <div className="stat-card">
          <h3>Total Bookings</h3>
          <span className="stat-number">{bookings.length}</span>
        </div>
        <div className="stat-card">
          <h3>Pending</h3>
          <span className="stat-number pending">{bookings.filter(b => b.status === 'pending').length}</span>
        </div>
        <div className="stat-card">
          <h3>Confirmed</h3>
          <span className="stat-number confirmed">{bookings.filter(b => b.status === 'confirmed').length}</span>
        </div>
        <div className="stat-card">
          <h3>Cancelled</h3>
          <span className="stat-number cancelled">{bookings.filter(b => b.status === 'cancelled').length}</span>
        </div>
      </div>

      <div className="bookings-section">
        <h2>All Booking Requests</h2>
        {bookings.length === 0 ? (
          <div className="no-bookings">
            <i className="fas fa-calendar-times"></i>
            <h3>No bookings found</h3>
            <p>No booking requests have been made yet.</p>
          </div>
        ) : (
          <div className="bookings-grid">
            {bookings.map((booking) => {
              // Add null checks to prevent runtime errors
              if (!booking.packageId) {
                return (
                  <div key={booking._id} className="booking-card error-card">
                    <div className="booking-content">
                      <h3>Package Not Found</h3>
                      <p>This booking references a package that no longer exists.</p>
                      <div className="booking-details">
                        <div className="detail-item">
                          <i className="fas fa-calendar"></i>
                          <span>Booking Date: {new Date(booking.bookingDate).toLocaleDateString()}</span>
                        </div>
                        <div className="detail-item">
                          <i className="fas fa-users"></i>
                          <span>People: {booking.numberOfPeople}</span>
                        </div>
                        <div className="detail-item">
                          <i className="fas fa-dollar-sign"></i>
                          <span>Total: ${booking.totalPrice}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <div key={booking._id} className="booking-card">
                  <div className="booking-image">
                    <img 
                      src={booking.packageId.image || '/placeholder-image.jpg'} 
                      alt={booking.packageId.title || 'Package Image'} 
                      onError={(e) => {
                        e.target.src = '/placeholder-image.jpg';
                      }}
                    />
                    <div 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(booking.status) }}
                    >
                      {getStatusText(booking.status)}
                    </div>
                  </div>
                  <div className="booking-content">
                    <h3>{booking.packageId.title || 'Untitled Package'}</h3>
                    <p className="booking-location">
                      <i className="fas fa-map-marker-alt"></i>
                      {booking.packageId.location || 'Location not specified'}
                    </p>
                    
                    <div className="user-info">
                      <h4>User Information</h4>
                      <p><strong>Name:</strong> {booking.userId?.name || 'Unknown'}</p>
                      <p><strong>Email:</strong> {booking.userId?.email || 'Unknown'}</p>
                    </div>

                    <div className="booking-details">
                      <div className="detail-item">
                        <i className="fas fa-calendar"></i>
                        <span>Booking Date: {new Date(booking.bookingDate).toLocaleDateString()}</span>
                      </div>
                      <div className="detail-item">
                        <i className="fas fa-users"></i>
                        <span>People: {booking.numberOfPeople}</span>
                      </div>
                      <div className="detail-item">
                        <i className="fas fa-dollar-sign"></i>
                        <span>Total: ${booking.totalPrice}</span>
                      </div>
                      <div className="detail-item">
                        <i className="fas fa-clock"></i>
                        <span>Duration: {booking.packageId.duration || 'Not specified'}</span>
                      </div>
                      <div className="detail-item">
                        <i className="fas fa-users"></i>
                        <span>Max Group: {booking.packageId.maxGroupSize || 'Not specified'} people</span>
                      </div>
                    </div>

                    {booking.specialRequests && (
                      <div className="special-requests">
                        <strong>Special Requests:</strong>
                        <p>{booking.specialRequests}</p>
                      </div>
                    )}

                    <div className="booking-actions">
                      {booking.status === 'pending' && (
                        <div className="action-buttons">
                          <button 
                            className="btn-confirm"
                            onClick={() => updateBookingStatus(booking._id, 'confirmed')}
                          >
                            <i className="fas fa-check"></i>
                            Confirm Booking
                          </button>
                          <button 
                            className="btn-cancel"
                            onClick={() => updateBookingStatus(booking._id, 'cancelled')}
                          >
                            <i className="fas fa-times"></i>
                            Cancel Booking
                          </button>
                        </div>
                      )}
                      
                      {booking.status === 'confirmed' && (
                        <div className="action-buttons">
                          <button 
                            className="btn-complete"
                            onClick={() => updateBookingStatus(booking._id, 'completed')}
                          >
                            <i className="fas fa-flag-checkered"></i>
                            Mark as Completed
                          </button>
                        </div>
                      )}

                      <span className="booking-date">
                        Booked on: {new Date(booking.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBookings;
