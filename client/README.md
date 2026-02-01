# 🎨 Client - Frontend Documentation

## 📋 Overview

This is the React frontend for Triplane Travel Agency.

**Port:** 3000
**Framework:** React 18
**Routing:** React Router v6
**HTTP Client:** Axios
**State:** Context API

---

## 🚀 Quick Start

### Run Development Server
```powershell
npm start
```

### Build for Production
```powershell
npm run build
```

### Run Tests
```powershell
npm test
```

**Access:** http://localhost:3000

---

## 📁 Directory Structure

```
client/
├── public/
│   ├── index.html         # Main HTML file
│   └── favicon.ico        # App icon
│
├── src/
│   ├── components/
│   │   ├── Navigation.jsx    # Header/navbar
│   │   └── Footer.jsx        # Footer component
│   │
│   ├── pages/
│   │   ├── Home.jsx          # Landing page
│   │   ├── Login.jsx         # Login page
│   │   ├── Register.jsx      # Registration page
│   │   ├── Packages.jsx      # Package listing
│   │   ├── PackageDetails.jsx # Package details
│   │   ├── Profile.jsx       # User profile
│   │   ├── About.jsx         # About page
│   │   ├── AddPackage.jsx    # Admin: Add package
│   │   └── AdminBookings.jsx # Admin: Manage bookings
│   │
│   ├── services/
│   │   └── api.js            # API calls (axios)
│   │
│   ├── context/
│   │   └── AuthContext.jsx   # Authentication state
│   │
│   ├── App.js                # Main app component
│   ├── App.css               # Global styles
│   ├── responsive.css        # Responsive styles
│   ├── index.js              # Entry point
│   └── index.css             # Base styles
│
├── .env                      # Environment config
├── env.example               # Template for .env
└── package.json              # Dependencies
```

---

## ⚙️ Environment Variables

**File:** `.env`

```env
REACT_APP_API_URL=http://localhost:5000/api
```

**For Production:**
```env
REACT_APP_API_URL=https://your-backend-url.com/api
```

---

## 🛣️ Routes

| Path | Component | Description | Auth Required |
|------|-----------|-------------|---------------|
| `/` | Home | Landing page | No |
| `/packages` | Packages | Browse packages | No |
| `/package/:id` | PackageDetails | Package details & booking | No |
| `/login` | Login | User login | No |
| `/register` | Register | User registration | No |
| `/profile` | Profile | User profile & bookings | Yes |
| `/about` | About | About page | No |
| `/add-package` | AddPackage | Create package | Admin only |
| `/admin-bookings` | AdminBookings | Manage bookings | Admin only |

---

## 🔐 Authentication

### How It Works:
1. User logs in → Receives JWT token
2. Token stored in `localStorage`
3. `AuthContext` provides auth state globally
4. Token sent in Authorization header for API calls

### Auth Context Usage:
```javascript
import { useAuth } from './context/AuthContext';

function MyComponent() {
  const { user, login, logout, isAuthenticated } = useAuth();
  
  // Check if user is logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  // Access user data
  console.log(user.name, user.email, user.role);
}
```

### Protected Routes (Manual):
```javascript
// In component
useEffect(() => {
  if (!isAuthenticated) {
    navigate('/login');
  }
}, [isAuthenticated, navigate]);
```

---

## 📡 API Services

All API calls are centralized in `src/services/api.js`:

### Auth API:
```javascript
import { authAPI } from './services/api';

// Login
const response = await authAPI.login({ email, password });
localStorage.setItem('token', response.data.token);

// Register
const response = await authAPI.register({ name, email, password });

// Get profile
const response = await authAPI.getProfile();

// Update profile
const response = await authAPI.updateProfile({ name, email });
```

### Package API:
```javascript
import { packageAPI } from './services/api';

// Get all packages
const response = await packageAPI.getAllPackages();

// Get single package
const response = await packageAPI.getPackageById(id);

// Create package (admin)
const response = await packageAPI.createPackage(packageData);

// Update package (admin)
const response = await packageAPI.updatePackage(id, packageData);

// Delete package (admin)
const response = await packageAPI.deletePackage(id);
```

### Booking API:
```javascript
import { bookingAPI } from './services/api';

// Create booking
const response = await bookingAPI.createBooking(bookingData);

// Get user's bookings
const response = await bookingAPI.getUserBookings();

// Get all bookings (admin)
const response = await bookingAPI.getAllBookings();

// Update booking status (admin)
const response = await bookingAPI.updateBookingStatus(id, status);
```

### Upload API:
```javascript
import { uploadAPI } from './services/api';

// Upload image
const formData = new FormData();
formData.append('image', file);
const response = await uploadAPI.uploadImage(formData);
const imageUrl = response.data.url;
```

---

## 🎨 Styling

### CSS Files:
- **index.css** - Base styles, resets
- **App.css** - Component-specific styles
- **responsive.css** - Media queries for mobile/tablet

### Responsive Breakpoints:
```css
/* Mobile: < 768px */
@media (max-width: 768px) { }

/* Tablet: 768px - 1024px */
@media (min-width: 768px) and (max-width: 1024px) { }

/* Desktop: > 1024px */
@media (min-width: 1024px) { }
```

---

## 🧩 Key Components

### Navigation
- Responsive navbar
- Shows different links for logged-in/guest users
- Admin menu for admin users

### Authentication Forms
- Login with email/password
- Register with name/email/password
- Client-side validation
- Error handling

### Package Components
- Package cards with image, title, price
- Filtering and search
- Detailed view with booking form

### Profile
- User information
- Booking history
- Edit profile option

### Admin Components
- Add/Edit packages
- Upload images
- Manage bookings
- View all users (if implemented)

---

## 🛠️ Available Scripts

```powershell
# Start development server (http://localhost:3000)
npm start

# Build for production
npm run build

# Run tests
npm test

# Eject from Create React App (irreversible!)
npm run eject
```

---

## 📦 Dependencies

### Core:
- **react** (^18.2.0) - UI library
- **react-dom** (^18.2.0) - React rendering
- **react-router-dom** (^6.18.0) - Routing
- **axios** (^1.6.0) - HTTP client

### Development:
- **react-scripts** (5.0.1) - Build scripts
- **@testing-library/*** - Testing utilities
- **web-vitals** - Performance monitoring

---

## 🔍 Development Tips

### Hot Reload:
- Changes auto-reload in browser
- No need to restart server

### Console Errors:
- Check browser console for errors
- Check Network tab for API call issues

### CORS Issues:
- Ensure backend is running
- Check CORS configuration in server

### State Management:
- Use Context for global state (auth)
- Use local state for component-specific data
- Lift state up when needed by multiple components

---

## 🐛 Common Issues

### "Failed to fetch" Error
**Cause:** Backend not running or wrong API URL

**Solution:**
1. Check backend is running on port 5000
2. Verify `REACT_APP_API_URL` in `.env`
3. Check browser console for exact error

### Login Not Working
**Cause:** Token not being saved or sent

**Solution:**
1. Check localStorage has 'token' after login
2. Verify token is sent in Authorization header
3. Check backend validates token correctly

### Images Not Loading
**Cause:** Cloudinary not configured or wrong image URL

**Solution:**
1. Check Cloudinary credentials in backend
2. Verify image URL format in database
3. Check browser console for 404 errors

### Routing Issues
**Cause:** React Router configuration

**Solution:**
1. Ensure `<BrowserRouter>` wraps `<Routes>`
2. Check route paths match navigation links
3. Use `<Navigate>` for redirects, not `window.location`

---

## 🚀 Deployment

### For Vercel:

1. **Install Vercel CLI:**
   ```powershell
   npm install -g vercel
   ```

2. **Deploy:**
   ```powershell
   npm run build
   vercel --prod
   ```

3. **Set Environment Variable:**
   ```
   REACT_APP_API_URL=https://your-backend-url.com/api
   ```

### Build Output:
- Production build created in `build/` folder
- Optimized and minified
- Ready for static hosting

---

## 🎯 Features

- ✅ User authentication (register/login/logout)
- ✅ Browse and search packages
- ✅ View package details
- ✅ Book packages
- ✅ User profile management
- ✅ Booking history
- ✅ Admin dashboard
- ✅ Package management (CRUD)
- ✅ Image upload
- ✅ Responsive design
- ✅ Form validation

---

## 📱 Responsive Design

The app is fully responsive:
- **Mobile:** Optimized for phones (< 768px)
- **Tablet:** Adjusted layouts (768px - 1024px)
- **Desktop:** Full features (> 1024px)

---

## 📝 Notes

- Token stored in localStorage (consider httpOnly cookies for production)
- All forms have client-side validation
- Images are hosted on Cloudinary
- `useEffect` cleanup prevents memory leaks
- Error boundaries can be added for production

---

**For more info, see root `SETUP.md`**
