const mongoose = require('mongoose');
const Package = require('./models/Package');
const User = require('./models/User');
const indiaPackages = require('./india_packages');
require('dotenv').config();

const connectDB = require('./config/db');

const seedData = async () => {
  try {
    await connectDB();

    // Delete existing data
    await Package.deleteMany({});

    // Only recreates admin if it doesn't exist
    const adminExists = await User.findOne({ email: 'admin@gmail.com' });
    if (!adminExists) {
      const adminUser = new User({
        name: 'Admin User',
        email: 'admin@gmail.com',
        password: 'admin@123',
        role: 'admin'
      });
      await adminUser.save();
      console.log('Default admin user created: admin@gmail.com / admin@123');
    }

    // Combine original samples (with continents) and the new extensive list
    const originalPackages = [
      {
        title: 'Fabulous Rome',
        location: 'Rome, Italy',
        continent: 'Europe',
        price: 320,
        description: 'Colosseum, Pantheon, and Vatican are waiting for you! We will see the most beautiful places in Rome, admire sunsets from the viewing platforms, and experience the rich history of the Eternal City.',
        image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=2070&auto=format&fit=crop',
        duration: '5 days',
        maxGroupSize: 15,
        difficulty: 'easy',
        featured: true
      },
      {
        title: 'Discover Kyiv',
        location: 'Kyiv, Ukraine',
        continent: 'Europe',
        price: 220,
        description: 'We will see the most beautiful cities of Ukraine, national parks, and spend wonderful 10 days among very friendly people. Experience the rich culture and history.',
        image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?q=80&w=2070&auto=format&fit=crop',
        duration: '10 days',
        maxGroupSize: 12,
        difficulty: 'easy',
        featured: true
      },
      {
        title: 'Venice and Florence',
        location: 'Venice, Italy',
        continent: 'Europe',
        price: 175,
        description: 'On this trip, we will see two incredibly beautiful cities in Italy - Venice and Florence. We will have a gondola ride, a walk along the Golden Bridge, and explore Renaissance art.',
        image: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?q=80&w=2070&auto=format&fit=crop',
        duration: '5 days',
        maxGroupSize: 10,
        difficulty: 'easy',
        featured: true
      }
    ];

    const allPackages = [...originalPackages, ...indiaPackages];

    await Package.insertMany(allPackages);
    console.log(`${allPackages.length} packages created successfully (including all Indian states)!`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
