import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { packageAPI } from '../services/api';
import './AddPackage.css';

const AddPackage = () => {
  const { isAdmin, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPackage, setEditingPackage] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageType, setImageType] = useState('file'); // 'file' or 'url'
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    price: '',
    description: '',
    duration: '',
    maxGroupSize: '',
    difficulty: 'easy',
    featured: false
  });

  useEffect(() => {
    if (!isAdmin()) {
      navigate('/');
      return;
    }
    fetchPackages();
  }, [isAdmin, navigate]);

  const fetchPackages = async () => {
    try {
      const response = await packageAPI.getAllPackages();
      setPackages(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching packages:', error);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setFormData(prev => ({
      ...prev,
      imageUrl: url
    }));
    if (url) {
      setImagePreview(url);
    } else {
      setImagePreview(null);
    }
  };

  const handleImageTypeChange = (e) => {
    setImageType(e.target.value);
    setImagePreview(null);
    // Clear the other input
    if (e.target.value === 'file') {
      setFormData(prev => ({ ...prev, imageUrl: '' }));
    } else {
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let formDataToSend;
      
      if (imageType === 'file') {
        // Handle file upload
        formDataToSend = new FormData();
        
        // Append all form fields
        Object.keys(formData).forEach(key => {
          if (key !== 'imageUrl') { // Don't send imageUrl when using file
            formDataToSend.append(key, formData[key]);
          }
        });

        // Append image file if selected
        const imageFile = document.querySelector('input[type="file"]').files[0];
        if (imageFile) {
          formDataToSend.append('image', imageFile);
        } else if (!editingPackage) {
          alert('Please select an image file');
          return;
        }
      } else {
        // Handle URL upload
        if (!formData.imageUrl && !editingPackage) {
          alert('Please provide an image URL');
          return;
        }
        
        formDataToSend = new FormData();
        Object.keys(formData).forEach(key => {
          formDataToSend.append(key, formData[key]);
        });
      }

      // Set up headers with authentication token
      const headers = {
        'Content-Type': 'multipart/form-data',
      };

      // Add authorization header if token exists
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      if (editingPackage) {
        await packageAPI.updatePackage(editingPackage._id, formDataToSend);
      } else {
        await packageAPI.createPackage(formDataToSend);
      }
      
      setFormData({
        title: '',
        location: '',
        price: '',
        description: '',
        duration: '',
        maxGroupSize: '',
        difficulty: 'easy',
        featured: false
      });
      setImagePreview(null);
      setImageType('file');
      setEditingPackage(null);
      setShowForm(false);
      fetchPackages();
    } catch (error) {
      console.error('Error saving package:', error);
      alert('Error saving package: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleEdit = (pkg) => {
    setEditingPackage(pkg);
    setFormData({
      title: pkg.title,
      location: pkg.location,
      price: pkg.price.toString(),
      description: pkg.description,
      duration: pkg.duration,
      maxGroupSize: pkg.maxGroupSize.toString(),
      difficulty: pkg.difficulty,
      featured: pkg.featured
    });
    setImagePreview(pkg.image);
    setImageType('url'); // Default to URL when editing
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      try {
        const headers = {};
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        
        await packageAPI.deletePackage(id);
        fetchPackages();
      } catch (error) {
        console.error('Error deleting package:', error);
        alert('Error deleting package');
      }
    }
  };

  const handleCancel = () => {
    setEditingPackage(null);
    setShowForm(false);
    setImagePreview(null);
    setImageType('file');
    setFormData({
      title: '',
      location: '',
      price: '',
      description: '',
      duration: '',
      maxGroupSize: '',
      difficulty: 'easy',
      featured: false
    });
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Loading packages...</p>
      </div>
    );
  }

  return (
    <div className="admin-package-page">
      <div className="admin-header">
        <h1>Package Management</h1>
        <button 
          className="add-package-btn"
          onClick={() => setShowForm(true)}
        >
          <i className="fas fa-plus"></i>
          Add New Package
        </button>
      </div>

      {showForm && (
        <div className="package-form-container">
          <div className="package-form-card">
            <h2>{editingPackage ? 'Edit Package' : 'Add New Package'}</h2>
            <form onSubmit={handleSubmit} className="package-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Price ($)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Duration</label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    placeholder="e.g., 5 days"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Max Group Size</label>
                  <input
                    type="number"
                    name="maxGroupSize"
                    value={formData.maxGroupSize}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Difficulty</label>
                  <select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleInputChange}
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Image Type</label>
                <div className="image-type-selector">
                  <label>
                    <input
                      type="radio"
                      name="imageType"
                      value="file"
                      checked={imageType === 'file'}
                      onChange={handleImageTypeChange}
                    />
                    Upload File
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="imageType"
                      value="url"
                      checked={imageType === 'url'}
                      onChange={handleImageTypeChange}
                    />
                    Image URL
                  </label>
                </div>
              </div>

              {imageType === 'file' ? (
                <div className="form-group">
                  <label>Image File</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    required={!editingPackage}
                  />
                  <small>Supported formats: JPEG, JPG, PNG (Max 5MB)</small>
                </div>
              ) : (
                <div className="form-group">
                  <label>Image URL</label>
                  <input
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl || ''}
                    onChange={handleImageUrlChange}
                    placeholder="https://example.com/image.jpg"
                    required={!editingPackage}
                  />
                </div>
              )}

              {imagePreview && (
                <div className="image-preview">
                  <label>Preview:</label>
                  <img src={imagePreview} alt="Preview" style={{ maxWidth: '200px', marginTop: '10px', display: 'block' }} />
                </div>
              )}

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  required
                />
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                  />
                  Featured Package
                </label>
              </div>

              <div className="form-actions">
                <button type="submit" className="save-btn">
                  {editingPackage ? 'Update Package' : 'Add Package'}
                </button>
                <button type="button" className="cancel-btn" onClick={handleCancel}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="packages-grid">
        {packages.map((pkg) => (
          <div key={pkg._id} className="admin-package-card">
            <div className="package-image">
              <img src={pkg.image} alt={pkg.title} />
              {pkg.featured && <div className="featured-badge">Featured</div>}
            </div>
            <div className="package-content">
              <h3>{pkg.title}</h3>
              <p className="location"><i className="fas fa-map-marker-alt"></i> {pkg.location}</p>
              <div className="package-details">
                <span className="price">${pkg.price}</span>
                <span className="duration"><i className="fas fa-clock"></i> {pkg.duration}</span>
                <span className="group-size"><i className="fas fa-users"></i> Max {pkg.maxGroupSize}</span>
                <span className="difficulty"><i className="fas fa-mountain"></i> {pkg.difficulty}</span>
              </div>
              <p className="description">{pkg.description}</p>
              <div className="package-actions">
                <button 
                  className="edit-btn"
                  onClick={() => handleEdit(pkg)}
                >
                  <i className="fas fa-edit"></i> Edit
                </button>
                <button 
                  className="delete-btn"
                  onClick={() => handleDelete(pkg._id)}
                >
                  <i className="fas fa-trash"></i> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {packages.length === 0 && (
        <div className="no-packages">
          <i className="fas fa-plane"></i>
          <h3>No packages yet</h3>
          <p>Start by adding your first travel package!</p>
        </div>
      )}
    </div>
  );
};

export default AddPackage;
