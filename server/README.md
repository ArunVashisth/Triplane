# 🔧 Server - Backend Documentation

## 📋 Overview

This is the Express.js backend server for Triplane Travel Agency.

**Port:** 5000
**Database:** MongoDB
**Auth:** JWT tokens
**Storage:** Cloudinary

---

## 🚀 Quick Start

### Run Development Server
```powershell
npm run dev
```

### Run Production Server
```powershell
npm start
```

---

## 📁 Directory Structure

```
server/
├── config/
│   ├── db.js              # MongoDB connection
│   └── cloudinary.js      # Cloudinary configuration
│
├── controllers/
│   └── packageController.js  # Package business logic
│
├── middleware/
│   ├── auth.js            # JWT authentication
│   └── multerMiddleware.js # File upload handling
│
├── models/
│   ├── User.js            # User schema
│   ├── Package.js         # Package schema
│   ├── Booking.js         # Booking schema
│   └── Feedback.js        # Feedback schema
│
├── routes/
│   ├── auth.js            # Auth endpoints
│   ├── packages.js        # Package endpoints
│   ├── bookings.js        # Booking endpoints
│   ├── upload.js          # Upload endpoints
│   └── feedback.js        # Feedback endpoints
│
├── .env                   # Environment config (NEVER commit!)
├── env.example            # Template for .env
├── package.json           # Dependencies
├── seed.js                # Database seeding script
└── server.js              # Main entry point
```

---

## ⚙️ Environment Variables

**File:** `.env` (already created, update with your credentials)

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/travel-agency
JWT_SECRET=your_jwt_secret_key_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

⚠️ **Important:** `.env` is ignored by Git. Update values with your actual credentials.

### Required Variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment | `development` or `production` |
| `PORT` | Server port | `5000` |
| `MONGO_URI` | MongoDB connection | See MongoDB setup |
| `JWT_SECRET` | Secret for JWT | Strong random string |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary name | From dashboard |
| `CLOUDINARY_API_KEY` | Cloudinary key | From dashboard |
| `CLOUDINARY_API_SECRET` | Cloudinary secret | From dashboard |

---

## 🗄️ Database Models

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (enum: 'user', 'admin'),
  profilePhoto: String,
  timestamps: true
}
```

### Package Model
```javascript
{
  title: String,
  location: String,
  price: Number,
  description: String,
  image: String,
  duration: String,
  maxGroupSize: Number,
  difficulty: String (enum: 'easy', 'medium', 'hard'),
  featured: Boolean
}
```

### Booking Model
```javascript
{
  userId: ObjectId (ref: 'User'),
  packageId: ObjectId (ref: 'Package'),
  numberOfPeople: Number,
  bookingDate: Date,
  duration: String,
  totalPrice: Number,
  specialRequests: String,
  status: String (enum: 'pending', 'confirmed', 'cancelled', 'completed'),
  timestamps: true
}
```

### Feedback Model
```javascript
{
  name: String,
  email: String,
  message: String,
  timestamp: Date
}
```

---

## 🔐 Authentication

### How It Works:
1. User registers/logs in
2. Server generates JWT token
3. Token sent to client
4. Client includes token in Authorization header
5. Middleware validates token on protected routes

### Protected Routes:
- All `/api/packages` POST, PUT, DELETE (admin only)
- All `/api/bookings` (authenticated users)
- `/api/auth/profile` (authenticated users)
- `/api/upload` (admin only)

### Middleware Usage:
```javascript
const { protect, admin } = require('./middleware/auth');

// Protect route (any authenticated user)
router.get('/profile', protect, getProfile);

// Admin only route
router.post('/packages', protect, admin, createPackage);
```

---

## 📤 File Upload

### Configuration:
- **Middleware:** Multer
- **Storage:** Cloudinary
- **Allowed:** Images only
- **Max Size:** Configured in multerMiddleware.js

### Upload Endpoint:
```
POST /api/upload
Headers: Authorization: Bearer <token>
Body: multipart/form-data with 'image' field
Response: { url: 'cloudinary_url' }
```

---

## 🛠️ Available Scripts

```powershell
# Development (with nodemon auto-reload)
npm run dev

# Production
npm start

# Seed database with sample data
node seed.js
```

---

## 🔍 API Testing

### Using PowerShell (Invoke-WebRequest):

**Test server running:**
```powershell
Invoke-WebRequest -Uri http://localhost:5000
```

**Register user:**
```powershell
$body = @{
    name = "Test User"
    email = "test@example.com"
    password = "password123"
} | ConvertTo-Json

Invoke-WebRequest -Uri http://localhost:5000/api/auth/register `
    -Method POST `
    -ContentType "application/json" `
    -Body $body
```

**Get packages:**
```powershell
Invoke-WebRequest -Uri http://localhost:5000/api/packages
```

---

## 🐛 Common Issues

### MongoDB Connection Error
**Error:** `MongoServerError: connect ECONNREFUSED`

**Solutions:**
1. Ensure MongoDB is running (local)
2. Check `MONGO_URI` in `.env`
3. For Atlas: Whitelist IP address

**Test connection:**
```powershell
# For local MongoDB
mongosh
# or
mongo
```

### JWT Token Error
**Error:** `Not authorized, token failed`

**Check:**
- Token is being sent in Authorization header
- Format: `Bearer <token>`
- `JWT_SECRET` matches between token creation and verification

### Cloudinary Upload Error
**Error:** 401 Unauthorized

**Check:**
- All three Cloudinary variables in `.env`
- No extra spaces in values
- Credentials are correct

---

## 📦 Dependencies

### Production:
- **express** - Web framework
- **mongoose** - MongoDB ODM
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variables
- **cloudinary** - Image storage
- **multer** - File upload handling
- **stripe** - Payment processing (if enabled)

### Development:
- **nodemon** - Auto-reload on file changes

---

## 🔒 Security Features

- Password hashing with bcrypt (10 rounds)
- JWT token authentication
- Protected routes with middleware
- CORS configuration
- Input validation in models
- Admin role-based access

---

## 🚀 Deployment

### For Render.com:

1. Set environment variables in Render dashboard
2. Set build command: `npm install`
3. Set start command: `npm start`
4. Root directory: `server`

### Environment Variables on Render:
```
NODE_ENV=production
PORT=10000
MONGO_URI=<your_mongodb_atlas_uri>
JWT_SECRET=<strong_random_string>
CLOUDINARY_CLOUD_NAME=<your_cloud_name>
CLOUDINARY_API_KEY=<your_api_key>
CLOUDINARY_API_SECRET=<your_api_secret>
```

---

## 📝 Notes

- JWT tokens stored in client's localStorage
- Passwords never stored in plain text
- All API responses follow consistent format
- Error handling middleware catches all errors
- CORS enabled for development (update for production)

---

**For more info, see root `SETUP.md`**
