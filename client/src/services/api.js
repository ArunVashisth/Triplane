import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth Services
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  checkAdmin: () => api.get('/auth/check-admin'),
  updateProfile: (userData) => api.put('/auth/profile', userData),
  getProfile: () => api.get('/auth/profile'),
};

// Package Services
export const packageAPI = {
  getAllPackages: () => api.get('/packages'),
  getPackageById: (id) => api.get(`/packages/${id}`),
  createPackage: (packageData) => api.post('/packages', packageData),
  updatePackage: (id, packageData) => api.put(`/packages/${id}`, packageData),
  deletePackage: (id) => api.delete(`/packages/${id}`),
};

// Booking Services
export const bookingAPI = {
  createBooking: (bookingData) => api.post('/bookings', bookingData),
  getUserBookings: () => api.get('/bookings/user'),
  getAllBookings: () => api.get('/bookings'),
  updateBookingStatus: (id, status) => api.put(`/bookings/${id}`, { status }),
  updateBooking: (id, bookingData) => api.put(`/bookings/${id}`, bookingData),
};

// Upload Services
export const uploadAPI = {
  uploadImage: (formData) => {
    const token = localStorage.getItem('token');
    return axios.post(`${API_BASE_URL}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });
  },
};

// Feedback Services
export const feedbackAPI = {
  submitFeedback: (feedbackData) => api.post('/feedback', feedbackData),
};

export default api;
