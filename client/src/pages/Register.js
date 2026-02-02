import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import './Register.css';

import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

const Register = () => {
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      const decoded = jwtDecode(credentialResponse.credential);
      const res = await authAPI.googleLogin({
        name: decoded.name,
        email: decoded.email,
        googleId: decoded.sub,
        profilePhoto: decoded.picture
      });
      login(res.data.token, res.data.user);
      navigate('/');
    } catch (err) {
      setError('Google Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await authAPI.register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });

      login(response.data.token, response.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h2>Create Account</h2>
          <p>Join us and start your journey</p>
        </div>

        {error && (
          <div className="error-message" style={{ color: 'var(--accent)', marginBottom: '20px', textAlign: 'center', fontWeight: 'bold' }}>
            {error}
          </div>
        )}

        <div className="social-login" style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError('Google Registration Failed')}
            theme="filled_blue"
            shape="pill"
            text="signup_with"
          />
        </div>

        <div className="divider" style={{ display: 'flex', alignItems: 'center', margin: '20px 0', color: 'var(--text-muted)' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
          <span style={{ margin: '0 10px', fontSize: '0.8rem' }}>OR</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              minLength="6"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm your password"
              minLength="6"
            />
          </div>

          <button
            type="submit"
            className="register-btn"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="register-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="login-link">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
