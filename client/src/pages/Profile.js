import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { bookingAPI, authAPI, uploadAPI } from '../services/api';
import './Profile.css';

const Profile = () => {
  const { user, login, isAdmin } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    // Only fetch bookings for non-admin users
    if (!isAdmin()) {
      fetchUserBookings();
    } else {
      setLoading(false);
    }
  }, [isAdmin]);

  const fetchUserBookings = async () => {
    try {
      const response = await bookingAPI.getUserBookings();
      setBookings(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch bookings');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setUploading(true);
    try {
      const response = await uploadAPI.uploadImage(formData);

      // Update user profile with new photo URL
      const updateResponse = await authAPI.updateProfile({
        profilePhoto: response.data.url
      });

      // Update context with new user data
      login(localStorage.getItem('token'), updateResponse.data);
      alert('Profile photo updated successfully!');
    } catch (err) {
      setError('Failed to upload photo');
    } finally {
      setUploading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    try {
      const updateData = {
        name: formData.name,
        email: formData.email
      };

      if (formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      const response = await authAPI.updateProfile(updateData);

      login(localStorage.getItem('token'), response.data);
      setEditMode(false);
      setFormData({
        name: response.data.name,
        email: response.data.email,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      alert('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    }
  };

  const cancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    try {
      await bookingAPI.updateBookingStatus(bookingId, 'cancelled');

      fetchUserBookings();
      alert('Booking cancelled successfully!');
    } catch (err) {
      setError('Failed to cancel booking');
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
      <div className="profile-loading">
        <div className="loading-spinner"></div>
        <p>Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="container">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-photo-section">
            <div className="profile-photo">
              <img 
                src={user?.profilePhoto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2070&auto=format&fit=crop'} 
                alt={user?.name} 
              />
              <div className="photo-upload">
                <label htmlFor="photo-upload" className="upload-btn">
                  <i className="fas fa-camera"></i>
                </label>
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  style={{ display: 'none' }}
                />
                {uploading && <div className="upload-spinner"></div>}
              </div>
            </div>
            <div className="profile-info">
              <h1>{user?.name}</h1>
              <p className="user-email">{user?.email}</p>
              <p className="user-role">Role: {user?.role}</p>
            </div>
          </div>
          <button 
            className="edit-profile-btn"
            onClick={() => setEditMode(!editMode)}
          >
            {editMode ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {/* Profile Form */}
        {editMode && (
          <div className="profile-form-section">
            <h2>Edit Profile</h2>
            <form onSubmit={handleProfileUpdate} className="profile-form">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="password-section">
                <h3>Change Password (Optional)</h3>
                <div className="form-group">
                  <label htmlFor="currentPassword">Current Password</label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="newPassword">New Password</label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm New Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {error && <div className="error-message">{error}</div>}

              <div className="form-actions">
                <button type="submit" className="btn-save">
                  Save Changes
                </button>
                <button 
                  type="button" 
                  className="btn-cancel"
                  onClick={() => setEditMode(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Bookings Section - Only show for non-admin users */}
        {!isAdmin() && (
          <div className="bookings-section">
            <h2>My Bookings</h2>
            {bookings.length === 0 ? (
              <div className="no-bookings">
                <i className="fas fa-calendar-times"></i>
                <h3>No bookings yet</h3>
                <p>Start exploring our amazing destinations and make your first booking!</p>
                <a href="/" className="btn-explore">Explore Tours</a>
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
                            <span>Duration: {booking.duration || booking.packageId.duration || 'Not specified'}</span>
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
                            <button 
                              className="btn-cancel-booking"
                              onClick={() => cancelBooking(booking._id)}
                            >
                              Cancel Booking
                            </button>
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
        )}
      </div>
    </div>
  );
};

export default Profile;
