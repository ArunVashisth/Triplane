# 🌍 Travel Agency - Full Stack Web Application

A modern, full-stack travel agency web application built with the MERN stack (MongoDB, Express.js, React.js, Node.js). This application allows users to browse travel packages, make bookings, and provides admin functionality for managing packages and bookings.

## ✨ Features

### 🎯 User Features
- **User Authentication**: Secure registration and login system
- **Browse Packages**: View all available travel packages with filtering
- **Package Details**: Detailed view of each travel package
- **Booking System**: Book travel packages with custom preferences
- **User Profile**: Manage personal information and view booking history
- **Responsive Design**: Mobile-friendly interface

### 🔧 Admin Features
- **Package Management**: Add, edit, and delete travel packages
- **Booking Management**: View and manage all user bookings
- **Image Upload**: Upload package images via file or URL
- **Admin Dashboard**: Comprehensive admin interface

### 🛠 Technical Features
- **JWT Authentication**: Secure token-based authentication
- **Image Storage**: Cloudinary integration for image management
- **File Upload**: Multer middleware for handling file uploads
- **Responsive UI**: Modern, responsive design with CSS3
- **API Integration**: RESTful API with proper error handling

## 🚀 Tech Stack

### Frontend
- **React.js** - User interface library
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Context API** - State management
- **CSS3** - Styling and responsive design

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **Multer** - File upload middleware
- **Cloudinary** - Cloud image storage
- **bcryptjs** - Password hashing

## 📁 Project Structure

```
travel-agency/
├── client/                 # React frontend
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── context/       # Auth context
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   └── App.js         # Main app component
│   └── package.json
├── server/                 # Node.js backend
│   ├── config/            # Database and cloudinary config
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Auth and upload middleware
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   └── server.js          # Main server file
└── README.md
```

## 🛠 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Cloudinary account
- Git

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd travel-agency
   ```

2. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/travel-agency
   JWT_SECRET=your_jwt_secret_key_here
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

4. **Start the backend server**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Install frontend dependencies**
   ```bash
   cd client
   npm install
   ```

2. **Start the development server**
   ```bash
   npm start
   ```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 🌐 Deployment

### Backend Deployment (Render)

1. **Set up MongoDB Atlas**
   - Create a MongoDB Atlas account
   - Create a new cluster
   - Get your connection string
   - Whitelist IP addresses (0.0.0.0/0 for Render)

2. **Set up Cloudinary**
   - Create a Cloudinary account
   - Get your cloud name, API key, and API secret

3. **Deploy on Render**
   - Go to [render.com](https://render.com)
   - Create a new Web Service
   - Connect your GitHub repository
   - Set Root Directory to `server`
   - Configure environment variables:
     ```
     NODE_ENV=production
     PORT=10000
     MONGO_URI=your_mongodb_atlas_connection_string
     JWT_SECRET=your_secure_jwt_secret
     CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
     CLOUDINARY_API_KEY=your_cloudinary_api_key
     CLOUDINARY_API_SECRET=your_cloudinary_api_secret
     ```

### Frontend Deployment (Vercel)

1. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Set Root Directory to `client`
   - Set Build Command to `npm run build`
   - Set Output Directory to `build`

2. **Set environment variable**
   ```
   REACT_APP_API_URL=https://your-render-app-url.onrender.com/api
   ```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/check-admin` - Check if admin exists
- `PUT /api/auth/profile` - Update user profile

### Packages
- `GET /api/packages` - Get all packages
- `GET /api/packages/:id` - Get package by ID
- `POST /api/packages` - Create package (admin)
- `PUT /api/packages/:id` - Update package (admin)
- `DELETE /api/packages/:id` - Delete package (admin)

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/user` - Get user bookings
- `GET /api/bookings` - Get all bookings (admin)
- `PUT /api/bookings/:id` - Update booking status (admin)

### Upload
- `POST /api/upload` - Upload image (admin)

### Feedback
- `POST /api/feedback` - Submit feedback

## 🗄 Database Models

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (enum: ['user', 'admin']),
  profilePhoto: String
}
```

### Package
```javascript
{
  title: String,
  location: String,
  price: Number,
  description: String,
  image: String,
  duration: String,
  maxGroupSize: Number,
  difficulty: String (enum: ['easy', 'medium', 'hard']),
  featured: Boolean
}
```

### Booking
```javascript
{
  userId: ObjectId (ref: 'User'),
  packageId: ObjectId (ref: 'Package'),
  numberOfPeople: Number,
  bookingDate: Date,
  duration: String,
  totalPrice: Number,
  specialRequests: String,
  status: String (enum: ['pending', 'confirmed', 'cancelled', 'completed'])
}
```

## 🔐 Security Features

- **Password Hashing**: bcryptjs for secure password storage
- **JWT Authentication**: Token-based authentication
- **Input Validation**: Server-side validation for all inputs
- **CORS Configuration**: Proper CORS setup for production
- **Environment Variables**: Secure configuration management

## 🎨 UI/UX Features

- **Responsive Design**: Mobile-first approach
- **Modern Interface**: Clean and intuitive design
- **Loading States**: User feedback during operations
- **Error Handling**: Comprehensive error messages
- **Form Validation**: Client and server-side validation

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd travel-agency
   ```

2. **Set up the backend**
   ```bash
   cd server
   npm install
   cp env.example .env
   # Edit .env with your configuration
   npm run dev
   ```

3. **Set up the frontend**
   ```bash
   cd client
   npm install
   npm start
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React.js](https://reactjs.org/) - Frontend framework
- [Express.js](https://expressjs.com/) - Backend framework
- [MongoDB](https://www.mongodb.com/) - Database
- [Cloudinary](https://cloudinary.com/) - Image storage
- [Font Awesome](https://fontawesome.com/) - Icons

## 📞 Support

If you have any questions or need help with the project, please feel free to:
- Open an issue on GitHub
- Contact the author directly
- Check the documentation

---

**Happy Traveling! ✈️🌍**
