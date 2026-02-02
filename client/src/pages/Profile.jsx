import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { bookingAPI, authAPI, uploadAPI, packageAPI } from '../services/api';
import ImageCropperModal from '../components/ImageCropperModal';
import './Profile.css';

const Profile = () => {
  const { user, login, isAdmin, logout } = useContext(AuthContext);
  const [personalBookings, setPersonalBookings] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [allPackages, setAllPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Photo states
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);

  // Other modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPackageModalOpen, setIsPackageModalOpen] = useState(false);
  const [adminActiveTab, setAdminActiveTab] = useState('profile');

  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    location: '',
    travelerClass: '',
    seatPreference: '',
    mealPreference: '',
    passportExpiry: ''
  });

  const [packageForm, setPackageForm] = useState({
    _id: '',
    title: '',
    location: '',
    price: '',
    duration: '',
    maxGroupSize: '',
    difficulty: 'medium',
    description: '',
    image: '',
    featured: false
  });

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        email: user.email || '',
        location: user.location || 'Global Nomad',
        travelerClass: user.travelerClass || 'Economy',
        seatPreference: user.seatPreference || 'Window',
        mealPreference: user.mealPreference || 'Standard',
        passportExpiry: user.passportExpiry || 'Not Provided'
      });

      if (isAdmin()) {
        fetchAdminData();
      } else {
        fetchUserBookings();
      }
    }
  }, [user, isAdmin]);

  const fetchAdminData = async () => {
    try {
      const [bookingsRes, packagesRes] = await Promise.all([
        bookingAPI.getAllBookings(),
        packageAPI.getAllPackages()
      ]);
      setAllBookings(bookingsRes.data);
      setAllPackages(packagesRes.data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch admin data:', err);
      setLoading(false);
    }
  };

  const fetchUserBookings = async () => {
    try {
      const response = await bookingAPI.getUserBookings();
      setPersonalBookings(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
      setLoading(false);
    }
  };

  const handlePhotoSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result);
      setIsCropModalOpen(true);
    };
    reader.readAsDataURL(file);
    // Clear input so same file can be selected again
    e.target.value = '';
  };

  const handleCropComplete = async (croppedFile) => {
    setIsCropModalOpen(false);
    setUploading(true);

    const formData = new FormData();
    formData.append('image', croppedFile);

    try {
      const response = await uploadAPI.uploadImage(formData);
      const updateResponse = await authAPI.updateProfile({
        profilePhoto: response.data.url
      });
      login(localStorage.getItem('token'), updateResponse.data);
    } catch (err) {
      alert('Failed to upload photo');
    } finally {
      setUploading(false);
      setSelectedImage(null);
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await bookingAPI.updateBookingStatus(bookingId, newStatus);
      fetchAdminData();
    } catch (err) {
      alert('Failed to update booking status');
    }
  };

  const handleDeletePackage = async (pkgId) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      try {
        await packageAPI.deletePackage(pkgId);
        fetchAdminData();
      } catch (err) {
        alert('Failed to delete package');
      }
    }
  };

  const handleEditPackage = (pkg) => {
    setPackageForm({
      _id: pkg._id,
      title: pkg.title,
      location: pkg.location,
      price: pkg.price,
      duration: pkg.duration,
      maxGroupSize: pkg.maxGroupSize,
      difficulty: pkg.difficulty,
      description: pkg.description,
      image: pkg.image,
      featured: pkg.featured
    });
    setIsPackageModalOpen(true);
  };

  const handlePackageInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPackageForm({
      ...packageForm,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmitPackage = async (e) => {
    e.preventDefault();
    try {
      if (packageForm._id) {
        await packageAPI.updatePackage(packageForm._id, packageForm);
      } else {
        await packageAPI.createPackage(packageForm);
      }
      setIsPackageModalOpen(false);
      fetchAdminData();
    } catch (err) {
      alert('Failed to save package');
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await authAPI.updateProfile(profileForm);
      login(localStorage.getItem('token'), response.data);
      setIsModalOpen(false);
    } catch (err) {
      alert('Failed to update profile');
    }
  };

  if (loading) return <div className="profile-loading"><div className="loading-spinner"></div></div>;

  return (
    <div className="profile-page">
      <div className="profile-header-banner">
        <div className="profile-header-content">
          <div className="profile-avatar-wrapper">
            {uploading ? (
              <div className="avatar-loading"><div className="loading-spinner-sm"></div></div>
            ) : (
              <img src={user?.profilePhoto || 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200'} alt={user?.name} />
            )}
            <div className="avatar-edit-btn">
              <label htmlFor="photo-upload-profile"><i className="fas fa-camera"></i></label>
              <input
                id="photo-upload-profile"
                type="file"
                accept="image/*"
                onChange={handlePhotoSelect}
                style={{ display: 'none' }}
              />
            </div>
          </div>
          <div className="profile-user-info">
            <h1>{user?.name} {isAdmin() && <span className="admin-badge">Admin</span>}</h1>
            <p>
              <span>{isAdmin() ? 'Administrator' : 'Travel Enthusiast'}</span>
              <span><i className="far fa-envelope"></i> {user?.email}</span>
              <span><i className="fas fa-map-marker-alt"></i> {user?.location}</span>
            </p>
          </div>
          <div className="profile-header-actions">
            <button className="nav-btn nav-btn-outline" onClick={() => setIsModalOpen(true)}>
              <i className="fas fa-edit"></i> Edit Profile
            </button>
            <button className="nav-btn nav-btn-primary" onClick={logout}>
              <i className="fas fa-sign-out-alt"></i> Logout
            </button>
          </div>
        </div>
      </div>

      <div className="container" style={{ marginTop: '30px' }}>
        {isAdmin() && (
          <div className="admin-controls">
            <div className="admin-tabs">
              <button
                className={`admin-tab ${adminActiveTab === 'profile' ? 'active' : ''}`}
                onClick={() => setAdminActiveTab('profile')}
              >
                <i className="fas fa-user-circle"></i> My Dashboard
              </button>
              <button
                className={`admin-tab ${adminActiveTab === 'bookings' ? 'active' : ''}`}
                onClick={() => setAdminActiveTab('bookings')}
              >
                <i className="fas fa-calendar-check"></i> All Bookings
              </button>
              <button
                className={`admin-tab ${adminActiveTab === 'packages' ? 'active' : ''}`}
                onClick={() => setAdminActiveTab('packages')}
              >
                <i className="fas fa-box"></i> Manage Packages
              </button>
            </div>
          </div>
        )}

        {(!isAdmin() || adminActiveTab === 'profile') && (
          <>
            <div className="profile-stats-row">
              <div className="stat-box">
                <div className="stat-icon trips"><i className="fas fa-plane"></i></div>
                <div className="stat-text"><h3>{(isAdmin() ? (Array.isArray(allBookings) ? allBookings.length : 0) : (Array.isArray(personalBookings) ? personalBookings.length : 0))}</h3><span>{isAdmin() ? 'Total Bookings' : 'Trips Taken'}</span></div>
              </div>
              <div className="stat-box">
                <div className="stat-icon saved"><i className="far fa-heart"></i></div>
                <div className="stat-text"><h3>{isAdmin() ? (Array.isArray(allPackages) ? allPackages.length : 0) : (Array.isArray(user?.savedDestinations) ? user.savedDestinations.length : 0)}</h3><span>{isAdmin() ? 'Live Packages' : 'Saved Places'}</span></div>
              </div>
              <div className="stat-box">
                <div className="stat-icon upcoming"><i className="fas fa-award"></i></div>
                <div className="stat-text"><h3>{user?.membershipPoints || 1250}</h3><span>Member Points</span></div>
              </div>
            </div>

            <div className="profile-main-grid">
              <div className="profile-left-col">
                <div className="dashboard-card">
                  <h2><i className="fas fa-paper-plane"></i> {isAdmin() ? 'Recent System Activity' : 'My Trips'}</h2>
                  <div className="history-list">
                    {(isAdmin() ? (Array.isArray(allBookings) ? allBookings.slice(0, 5) : []) : (Array.isArray(personalBookings) ? personalBookings : [])).map((booking) => (
                      <div key={booking._id} className="history-item">
                        <div className="history-thumb"><img src={booking.packageId?.image} alt="Tour" /></div>
                        <div className="history-details">
                          <h4>{booking.packageId?.title}</h4>
                          <div className="history-meta">
                            {isAdmin() && <span><i className="far fa-user"></i> {booking.userId?.name}</span>}
                            <span><i className="far fa-calendar"></i> {new Date(booking.bookingDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className={`status-badge ${booking.status.toLowerCase()}`}>{booking.status}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="profile-right-col">
                <div className="dashboard-card">
                  <h2><i className="fas fa-cog"></i> Preferences</h2>
                  <div className="pref-grid">
                    <div className="pref-item"><label>Travel Class</label><span>{user?.travelerClass}</span></div>
                    <div className="pref-item"><label>Seat</label><span>{user?.seatPreference}</span></div>
                    <div className="pref-item"><label>Meal</label><span>{user?.mealPreference}</span></div>
                    <div className="pref-item"><label>Passport</label><span>{user?.passportExpiry}</span></div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {isAdmin() && adminActiveTab === 'bookings' && (
          <div className="admin-data-card">
            <div className="admin-header-row">
              <h2>All Client Bookings</h2>
            </div>
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Destination</th>
                    <th>Date</th>
                    <th>Guests</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(allBookings) && allBookings.map(b => (
                    <tr key={b._id}>
                      <td><strong>{b.userId?.name}</strong><br /><small>{b.userId?.email}</small></td>
                      <td>{b.packageId?.title}</td>
                      <td>{new Date(b.bookingDate).toLocaleDateString()}</td>
                      <td>{b.numberOfPeople}</td>
                      <td>₹{b.totalPrice}</td>
                      <td>
                        <select
                          className={`status-select ${b.status}`}
                          value={b.status}
                          onChange={(e) => handleStatusChange(b._id, e.target.value)}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="cancelled">Cancelled</option>
                          <option value="completed">Completed</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {isAdmin() && adminActiveTab === 'packages' && (
          <div className="admin-data-card">
            <div className="admin-header-row">
              <h2>Inventory Management</h2>
              <button className="nav-btn nav-btn-primary" onClick={() => {
                setPackageForm({ _id: '', title: '', location: '', price: '', duration: '', maxGroupSize: '', difficulty: 'medium', description: '', image: '', featured: false });
                setIsPackageModalOpen(true);
              }}>
                <i className="fas fa-plus"></i> Add New Package
              </button>
            </div>
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Package</th>
                    <th>Location</th>
                    <th>Price</th>
                    <th>Duration</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(allPackages) && allPackages.map(p => (
                    <tr key={p._id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <img src={p.image} alt="" style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />
                          <strong>{p.title}</strong>
                        </div>
                      </td>
                      <td>{p.location}</td>
                      <td>₹{p.price}</td>
                      <td>{p.duration}</td>
                      <td className="admin-actions">
                        <button className="admin-btn-icon btn-edit" onClick={() => handleEditPackage(p)}><i className="fas fa-edit"></i></button>
                        <button className="admin-btn-icon btn-delete" onClick={() => handleDeletePackage(p._id)}><i className="fas fa-trash"></i></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Profile Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="profile-modal">
            <div className="modal-header"><h3>Update Profile</h3><button onClick={() => setIsModalOpen(false)}><i className="fas fa-times"></i></button></div>
            <form onSubmit={handleProfileSubmit} className="modal-body">
              <div className="form-group-row">
                <div className="form-group"><label>Name</label><input name="name" value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} /></div>
                <div className="form-group"><label>Location</label><input name="location" value={profileForm.location} onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })} /></div>
              </div>
              <div className="form-group-row">
                <div className="form-group">
                  <label>Travel Class</label>
                  <select name="travelerClass" value={profileForm.travelerClass} onChange={(e) => setProfileForm({ ...profileForm, travelerClass: e.target.value })}>
                    <option value="Economy">Economy</option>
                    <option value="Premium Economy">Premium Economy</option>
                    <option value="Business">Business</option>
                    <option value="First Class">First Class</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Seat Preference</label>
                  <select name="seatPreference" value={profileForm.seatPreference} onChange={(e) => setProfileForm({ ...profileForm, seatPreference: e.target.value })}>
                    <option value="Window">Window</option>
                    <option value="Aisle">Aisle</option>
                    <option value="Middle">Middle</option>
                    <option value="Extra Legroom">Extra Legroom</option>
                  </select>
                </div>
              </div>
              <div className="form-group-row">
                <div className="form-group">
                  <label>Meal Preference</label>
                  <select name="mealPreference" value={profileForm.mealPreference} onChange={(e) => setProfileForm({ ...profileForm, mealPreference: e.target.value })}>
                    <option value="Standard">Standard</option>
                    <option value="Vegetarian">Vegetarian</option>
                    <option value="Vegan">Vegan</option>
                    <option value="Halal">Halal</option>
                    <option value="Gluten-Free">Gluten-Free</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Passport Expiry</label>
                  <input name="passportExpiry" placeholder="MM/YY or DD/MM/YYYY" value={profileForm.passportExpiry} onChange={(e) => setProfileForm({ ...profileForm, passportExpiry: e.target.value })} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="nav-btn nav-btn-outline" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="nav-btn nav-btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Crop Modal */}
      {isCropModalOpen && (
        <ImageCropperModal
          image={selectedImage}
          onCropComplete={handleCropComplete}
          onCancel={() => {
            setIsCropModalOpen(false);
            setSelectedImage(null);
          }}
        />
      )}

      {/* Package Modal */}
      {isPackageModalOpen && (
        <div className="modal-overlay">
          <div className="profile-modal" style={{ maxWidth: '800px' }}>
            <div className="modal-header"><h3>{packageForm._id ? 'Edit Package' : 'Create New Package'}</h3><button onClick={() => setIsPackageModalOpen(false)}><i className="fas fa-times"></i></button></div>
            <form onSubmit={handleSubmitPackage} className="modal-body">
              <div className="form-group-row">
                <div className="form-group"><label>Title</label><input name="title" value={packageForm.title} onChange={handlePackageInputChange} required /></div>
                <div className="form-group"><label>Location</label><input name="location" value={packageForm.location} onChange={handlePackageInputChange} required /></div>
              </div>
              <div className="form-group-row">
                <div className="form-group"><label>Price (₹)</label><input type="number" name="price" value={packageForm.price} onChange={handlePackageInputChange} required /></div>
                <div className="form-group"><label>Duration</label><input name="duration" value={packageForm.duration} onChange={handlePackageInputChange} placeholder="e.g. 7 Days, 6 Nights" required /></div>
              </div>
              <div className="form-group-row">
                <div className="form-group">
                  <label>Difficulty</label>
                  <select name="difficulty" value={packageForm.difficulty} onChange={handlePackageInputChange}>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
                <div className="form-group"><label>Group Size</label><input type="number" name="maxGroupSize" value={packageForm.maxGroupSize} onChange={handlePackageInputChange} required /></div>
              </div>
              <div className="form-group"><label>Image URL</label><input name="image" value={packageForm.image} onChange={handlePackageInputChange} required /></div>
              <div className="form-group"><label>Description</label><textarea name="description" value={packageForm.description} onChange={handlePackageInputChange} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', minHeight: '100px' }} required /></div>
              <div className="modal-footer">
                <button type="button" className="nav-btn nav-btn-outline" onClick={() => setIsPackageModalOpen(false)}>Cancel</button>
                <button type="submit" className="nav-btn nav-btn-primary">Save Package</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
