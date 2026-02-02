# 🚀 Triplane Travel Agency - Complete Setup Guide

## 📊 Project Status

**✅ YES, IT CAN RUN!** - All dependencies installed, code is production-ready.

**What's Done:**
- ✅ All dependencies installed (client & server)
- ✅ Environment files created
- ✅ Code issues fixed
- ✅ Git protection configured

**What You Need:**
- ⚠️ MongoDB connection (local or Atlas)
- ⚠️ Cloudinary credentials (free account)

---

## ⚡ Quick Start (3 Steps)

### 1. Configure MongoDB

**Option A - MongoDB Atlas (Cloud, Recommended):**
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create free cluster → Get connection string
3. Edit `server/.env`:
   ```
   MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/travel-agency
   ```

**Option B - Local MongoDB:**
1. Install MongoDB Community Edition
2. Start service
3. Use default in `server/.env`:
   ```
   MONGO_URI=mongodb://localhost:27017/travel-agency
   ```

### 2. Configure Cloudinary

1. Go to https://cloudinary.com/users/register/free
2. Copy credentials from dashboard
3. Edit `server/.env`:
   ```
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

### 3. Run the Application

**Using Startup Script:**
```powershell
.\START_APP.ps1
```

**OR Manually (2 terminals):**

Terminal 1 (Server):
```powershell
cd server
npm run dev
```

Terminal 2 (Client):
```powershell
cd client
npm start
```

**Access:** http://localhost:3000

---

## 📁 Project Structure

```
Triplane/
├── client/              # React frontend (Port 3000)
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API calls
│   │   └── context/     # Auth context
│   ├── .env            # Frontend config
│   └── package.json
│
├── server/              # Express backend (Port 5000)
│   ├── config/         # Database & Cloudinary
│   ├── controllers/    # Business logic
│   ├── models/         # MongoDB schemas
│   ├── routes/         # API endpoints
│   ├── middleware/     # Auth & upload
│   ├── .env           # Backend config (SENSITIVE!)
│   └── package.json
│
├── .gitignore          # Git protection
└── SETUP.md           # This file
```

---

## 🔧 Configuration Files

### server/.env (REQUIRED - Update with your credentials!)

**File:** `server/.env`

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/travel-agency  # ← UPDATE THIS
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name   # ← UPDATE THIS
CLOUDINARY_API_KEY=your_cloudinary_api_key         # ← UPDATE THIS
CLOUDINARY_API_SECRET=your_cloudinary_api_secret   # ← UPDATE THIS
```

⚠️ **Note:** `.env` files are ignored by Git for security. Update the values above with your actual credentials.

### client/.env (Already configured)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 🌐 API Endpoints

**Base URL:** http://localhost:5000/api

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/check-admin` - Check if admin exists
- `PUT /auth/profile` - Update profile
- `GET /auth/profile` - Get profile

### Packages
- `GET /packages` - Get all packages
- `GET /packages/:id` - Get package by ID
- `POST /packages` - Create package (admin only)
- `PUT /packages/:id` - Update package (admin only)
- `DELETE /packages/:id` - Delete package (admin only)

### Bookings
- `POST /bookings` - Create booking
- `GET /bookings/user` - Get user bookings
- `GET /bookings` - Get all bookings (admin)
- `PUT /bookings/:id` - Update booking status (admin)

### Upload
- `POST /upload` - Upload image (admin only)

### Feedback
- `POST /feedback` - Submit feedback

---

## 🐛 Troubleshooting

### MongoDB Connection Failed
**Error:** `MongoServerError: connect ECONNREFUSED`

**Solutions:**
- Local: Ensure MongoDB service is running
- Atlas: Check connection string, whitelist IP (0.0.0.0/0)

### Port Already in Use
**Error:** `EADDRINUSE: address already in use :::5000`

**Solution:**
```powershell
# Find process
netstat -ano | findstr :5000
# Kill process (replace PID)
taskkill /PID <PID> /F
```

### Cloudinary Upload Fails
**Error:** 401 Unauthorized

**Solution:**
- Double-check credentials in `server/.env`
- Ensure no extra spaces in values

### Module Not Found
**Solution:**
```powershell
# Reinstall dependencies
cd server
npm install
cd ../client
npm install
```

---

## 🔐 Security Notes

**NEVER commit to Git:**
- ❌ `.env` files (protected by .gitignore)
- ❌ `node_modules/` (protected by .gitignore)
- ❌ API keys or passwords

**Change in production:**
- JWT_SECRET to a strong random string
- Use environment-specific .env files

---

## 🎯 Development Workflow

1. **Start Development:**
   ```powershell
   .\START_APP.ps1
   ```

2. **Make Changes:**
   - Edit files in `client/src/` or `server/`
   - Hot reload is enabled

3. **Test Changes:**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

4. **Commit Changes:**
   ```powershell
   git add .
   git commit -m "Description"
   git push
   ```

---

## 📦 Tech Stack

**Frontend:** React, React Router, Axios, Context API
**Backend:** Node.js, Express, MongoDB, Mongoose, JWT
**Storage:** Cloudinary (images)
**Auth:** JWT tokens

---

## 🚀 Deployment & Live Fixes

### 1. Front-end (Vercel)
When deploying to Vercel, you **MUST** set the Environment Variables in the Vercel Dashboard:
- `REACT_APP_API_URL`: Set this to your live backend URL (e.g., `https://your-api.onrender.com/api`)

### 2. Back-end (Render/Railway)
Set these variables in your hosting dashboard:
- `MONGO_URI`: Your MongoDB Atlas string
- `JWT_SECRET`: A long random string
- `CLOUDINARY_CLOUD_NAME / API_KEY / API_SECRET`
- `NODE_ENV`: production

### ❌ Troubleshooting "Black/White Screen" on Live Site
If you see a blank screen on the live site but it works locally:
1. **Open Browser Console (F12)**: Check for `TypeError: e.filter is not a function`.
2. **The Cause**: This usually means your frontend is trying to hit `localhost` instead of the live API, or the API is returning an error page instead of data.
3. **The Fix**: 
   - Ensure `REACT_APP_API_URL` is correctly set in Vercel.
   - We have added "Guard Rails" in the code (v1.1) to prevent the site from crashing even if the API fails.

---

## ✨ Features

- User authentication (register/login)
- Browse travel packages
- Book packages
- User profile management
- Admin dashboard
- Package management (CRUD)
- Booking management
- Image upload with Cloudinary
- Responsive design

---

## 📞 Support

- Check `client/README.md` for frontend details
- Check `server/README.md` for backend details
- See original `README.md` for full documentation

---

**Happy Coding! ✈️🌍**
