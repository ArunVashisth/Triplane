const mongoose = require('mongoose');
const Package = require('./models/Package');
const User = require('./models/User');
require('dotenv').config();

const connectDB = require('./config/db');

const seedData = async () => {
  try {
    await connectDB();
    
    // Delete existing data
    await Package.deleteMany({});
    await User.deleteMany({ email: 'admin@gmail.com' });
    
    // Create default admin user
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@gmail.com',
      password: 'admin@123',
      role: 'admin'
    });
    await adminUser.save();
    console.log('Default admin user created: admin@gmail.com / admin@123');

    // Sample packages with appropriate images
    const packages = [
      {
        title: 'Fabulous Rome',
        location: 'Rome, Italy',
        price: 320,
        description: 'Colosseum, Pantheon, and Vatican are waiting for you! We will see the most beautiful places in Rome, admire sunsets from the viewing platforms, and experience the rich history of the Eternal City.',
        image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=2070&auto=format&fit=crop',
        duration: '5 days',
        maxGroupSize: 15,
        difficulty: 'easy',
        featured: true
      },
      {
        title: 'Discover Ukraine',
        location: 'Kyiv, Ukraine',
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
        price: 175,
        description: 'On this trip, we will see two incredibly beautiful cities in Italy - Venice and Florence. We will have a gondola ride, a walk along the Golden Bridge, and explore Renaissance art.',
        image: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?q=80&w=2070&auto=format&fit=crop',
        duration: '5 days',
        maxGroupSize: 10,
        difficulty: 'easy',
        featured: true
      },
      {
        title: 'Peerless Taj Mahal',
        location: 'Agra, India',
        price: 250,
        description: 'We will see the pearl of India, the Taj Mahal in all its glory. We will also visit many other beautiful places in India and take stunning photos.',
        image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=2070&auto=format&fit=crop',
        duration: '5 days',
        maxGroupSize: 15,
        difficulty: 'easy',
        featured: true
      },
      {
        title: 'Red Cities and Deserts',
        location: 'Marrakech, Morocco',
        price: 575,
        description: 'Africa has many deserts: Sahara, Kalahari, Namib, Nubian, Libyan, Western Sahara, Algeria, and the Atlas Mountains. We will see them all!',
        image: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=2070&auto=format&fit=crop',
        duration: '10 days',
        maxGroupSize: 12,
        difficulty: 'medium',
        featured: true
      },
      {
        title: 'Different Africa',
        location: 'Cairo, Egypt',
        price: 350,
        description: 'Africa is not only about nature, it also has very beautiful cities. We will see a completely different Africa and visit the most beautiful places.',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070&auto=format&fit=crop',
        duration: '7 days',
        maxGroupSize: 15,
        difficulty: 'easy',
        featured: true
      },
      {
        title: 'Tanzanian Safari',
        location: 'Serengeti, Tanzania',
        price: 475,
        description: 'Have you always wanted to live with animals? Now is your chance! Join us for a unique safari in Tanzania and go wild!',
        image: 'https://images.unsplash.com/photo-1549366021-9f761d450615?q=80&w=2070&auto=format&fit=crop',
        duration: '10 days',
        maxGroupSize: 8,
        difficulty: 'medium',
        featured: true
      },
      {
        title: 'Hiroshima and Osaka',
        location: 'Hiroshima, Japan',
        price: 425,
        description: 'We will visit the most beautiful cities in Japan, see the cherry blossoms, and experience the unique culture of the Land of the Rising Sun.',
        image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=2070&auto=format&fit=crop',
        duration: '8 days',
        maxGroupSize: 12,
        difficulty: 'easy',
        featured: false
      },
      {
        title: 'Sukhothai Historical Park',
        location: 'Sukhothai, Thailand',
        price: 325,
        description: 'Explore the ancient ruins of Sukhothai, the first capital of Thailand. Experience the rich history and beautiful temples.',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d134df?q=80&w=2070&auto=format&fit=crop',
        duration: '6 days',
        maxGroupSize: 15,
        difficulty: 'easy',
        featured: false
      },
      {
        title: 'Sydney Adventure',
        location: 'Sydney, Australia',
        price: 650,
        description: 'Discover the beautiful city of Sydney, visit the iconic Opera House, and explore the stunning beaches of Australia.',
        image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=2070&auto=format&fit=crop',
        duration: '12 days',
        maxGroupSize: 10,
        difficulty: 'medium',
        featured: false
      },
      {
        title: 'New York City',
        location: 'New York, USA',
        price: 450,
        description: 'Experience the city that never sleeps! Visit Times Square, Central Park, and all the iconic landmarks of the Big Apple.',
        image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=2070&auto=format&fit=crop',
        duration: '7 days',
        maxGroupSize: 15,
        difficulty: 'easy',
        featured: false
      },
      {
        title: 'Paris Romance',
        location: 'Paris, France',
        price: 380,
        description: 'The city of love awaits! Visit the Eiffel Tower, Louvre Museum, and enjoy the romantic atmosphere of Paris.',
        image: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?q=80&w=2070&auto=format&fit=crop',
        duration: '6 days',
        maxGroupSize: 12,
        difficulty: 'easy',
        featured: false
      }
    ];

    await Package.insertMany(packages);
    console.log('Sample packages created successfully!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
