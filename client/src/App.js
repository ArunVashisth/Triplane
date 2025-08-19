import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PackageDetails from './pages/PackageDetails';
import About from './pages/About';
import Profile from './pages/Profile';
import AddPackage from './pages/AddPackage';
import AdminBookings from './pages/AdminBookings';
import Packages from './pages/Packages';
import './App.css';
import './responsive.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navigation />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/packages" element={<Packages />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/package/:id" element={<PackageDetails />} />
            <Route path="/about" element={<About />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/add-package" element={<AddPackage />} />
            <Route path="/admin-bookings" element={<AdminBookings />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
