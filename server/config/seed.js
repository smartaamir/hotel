import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Room from '../models/Room.js';
import Booking from '../models/Booking.js';
import ServiceRequest from '../models/ServiceRequest.js';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/aurastay');
    console.log('[Seeder] Connected to MongoDB for seeding...');

    // Clear existing collections
    await User.deleteMany();
    await Room.deleteMany();
    await Booking.deleteMany();
    await ServiceRequest.deleteMany();
    console.log('[Seeder] Existing collections cleared.');

    // 1. Create Default Users (Passwords hashed via Mongoose hook)
    const adminUser = new User({
      name: 'AuraStay Admin',
      email: 'admin@aurastay.com',
      password: 'admin123',
      role: 'admin',
      phone: '+92 (51) 111-2831',
    });

    const guestUser = new User({
      name: 'Muhammad Bilal',
      email: 'guest@aurastay.com',
      password: 'guest123',
      role: 'customer',
      phone: '+92 (300) 014-9988',
    });

    await adminUser.save();
    await guestUser.save();
    console.log('[Seeder] Default administrative and guest accounts created.');

    // 2. Create Luxury Halal Rooms and Suites (in PKR / Rs.)
    const rooms = [
      // Single Rooms
      {
        roomNumber: '101',
        type: 'Single Room',
        pricePerNight: 15000,
        capacity: 1,
        description: 'A cozy, minimalist room equipped with a plush twin-sized mattress, sleek modern workspace, ambient smart lighting, Qibla compass direction indicator, and luxurious marble walk-in shower. Perfect for single corporate travelers and business nomads.',
        amenities: ['High-speed Wi-Fi', 'Smart TV', 'Prayer Mat & Qibla Compass', 'Espresso Machine', 'Luxury Robes & Slippers'],
        images: ['https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80'],
        status: 'Vacant'
      },
      {
        roomNumber: '102',
        type: 'Single Room',
        pricePerNight: 16000,
        capacity: 1,
        description: 'An intimate retreat offering an elegant work area, premium linen set, dynamic climate controls, prayer mat, and scenic city overlook, tailored for the discerning individual.',
        amenities: ['High-speed Wi-Fi', 'Smart TV', 'Organic Refreshments Pantry', 'In-room Safe', 'Prayer Mat & Qibla Compass'],
        images: ['https://images.unsplash.com/photo-1611891487122-207579d67d98?auto=format&fit=crop&w=800&q=80'],
        status: 'Vacant'
      },
      // Double Rooms
      {
        roomNumber: '201',
        type: 'Double Room',
        pricePerNight: 28000,
        capacity: 2,
        description: 'A modern sanctuary featuring a generous plush queen-sized bed, premium audio setup, bespoke wood furnishings, Qibla arrow, marble-top vanity, and floor-to-ceiling windows looking out over the city skyline.',
        amenities: ['High-speed Wi-Fi', '55" 4K Smart TV', 'Zamzam Water & Organic Dates Console', 'Mini Fridge', 'Rain Shower', 'Room Service Tablet'],
        images: ['https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80'],
        status: 'Vacant'
      },
      {
        roomNumber: '202',
        type: 'Double Room',
        pricePerNight: 29000,
        capacity: 2,
        description: 'A warm, sophisticated space adorned with art deco touches, two comfort double beds, automated blackout blinds, prayer rugs, and a customized organic refreshments pantry.',
        amenities: ['High-speed Wi-Fi', 'Smart TV', 'Prayer Mat & Qibla Compass', 'Plush Linens', 'Premium Halal Toiletries'],
        images: ['https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=800&q=80'],
        status: 'Vacant'
      },
      // Deluxe Suites
      {
        roomNumber: '301',
        type: 'Deluxe Suite',
        pricePerNight: 55000,
        capacity: 4,
        description: 'A sprawling executive suite boasting a separate opulent living room, master bedroom with California King bed, dynamic smart control center, luxury deep-soaking bathtub, private garden terrace, prayer rugs, and 24/7 dedicated butler call service.',
        amenities: ['High-speed Wi-Fi', '65" Smart TV & Soundbar', 'Complimentary Zamzam Water & Fresh Dates', 'Deep Soaking Tub', 'Private Veranda', 'Prayer Mats & Holy Quran Copy', '24/7 Butler Access'],
        images: ['https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80'],
        status: 'Vacant'
      },
      {
        roomNumber: '302',
        type: 'Deluxe Suite',
        pricePerNight: 55000,
        capacity: 4,
        description: 'A high-rise loft style suite featuring sleek designer aesthetics, a dining alcove, custom walk-in closet, premium massage shower columns, and sweeping sunset panoramas.',
        amenities: ['High-speed Wi-Fi', 'Smart TV', 'Dining Lounge', 'Prayer Mat & Qibla Compass', 'Premium Halal Spa Products', 'Nespresso Coffee Library'],
        images: ['https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80'],
        status: 'Vacant'
      },
      {
        roomNumber: '303',
        type: 'Deluxe Suite',
        pricePerNight: 58000,
        capacity: 4,
        description: 'An exquisite combination of classic warmth and contemporary amenities, offering a fresh juice station, customized dual master sinks, heated bathroom floors, and terrace deck.',
        amenities: ['High-speed Wi-Fi', 'Bose Sound System', 'Private Balcony', 'Chilled Beverage Dispenser', 'Prayer Mat & Qibla Compass', 'Heated Flooring'],
        images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80'],
        status: 'Vacant'
      },
      // Presidential Suites
      {
        roomNumber: '401',
        type: 'Presidential Suite',
        pricePerNight: 120000,
        capacity: 6,
        description: 'The ultimate statement of absolute prestige. A magnificent multi-room penthouse retreat featuring a private heated infinity plunge pool, full dining room, private library and prayer room, master steam shower, and stunning panoramic 360-degree ocean views.',
        amenities: ['Private Infinity Plunge Pool', 'Full Dining Room & Fresh Beverage Console', 'Steam Shower & Dry Sauna', 'Personal Concierge & Private Chef', 'Private Elevator Key', 'Prayer Mats & Holy Quran Copies', 'Complimentary Airport Premium Transfer'],
        images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'],
        status: 'Vacant'
      },
      {
        roomNumber: '402',
        type: 'Presidential Suite',
        pricePerNight: 135000,
        capacity: 6,
        description: 'Our crown jewel. A spectacular luxury estate penthouse equipped with custom imported designer furniture, grand fireplace salon, baby grand piano, and private sunbathing wrap-around terrace overlooking the pristine ocean coast.',
        amenities: ['Panoramic Wrap-Around Terrace', 'Baby Grand Piano & Fireplace Salon', 'Private Outdoor Jacuzzi', 'Premium Halal Mocktails Collection', 'Personal Gym Room', '24/7 Security & Chauffeur Services'],
        images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80'],
        status: 'Vacant'
      }
    ];

    await Room.insertMany(rooms);
    console.log('[Seeder] Luxurious halal rooms database seeded successfully.');

    // 3. Create a Seed Booking for Muhammad Bilal
    const seedBooking = new Booking({
      customer: guestUser._id,
      roomType: 'Deluxe Suite',
      assignedRoom: null, // Pending admin assignment
      checkInDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Check-in 2 days from now
      checkOutDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // Checkout 5 days from now
      totalPrice: 165000, // 3 nights at Rs. 55,000
      status: 'Pending Approval',
      paymentStatus: 'Paid',
      transactionId: 'ch_simulated_pk_3y8d9w10a',
      guestNotes: 'I would highly appreciate a suite on a higher floor with a clear morning Margalla Hills view. Also, please make sure a copy of the Holy Quran and prayer mats are set up. JazakAllah!',
    });

    await seedBooking.save();
    console.log('[Seeder] Initial customer booking request seeded successfully.');

    console.log('[Seeder] Database seeding complete. Exiting.');
    process.exit(0);
  } catch (error) {
    console.error(`[Seeder Error] Failed to seed database: ${error.message}`);
    process.exit(1);
  }
};

seedData();
