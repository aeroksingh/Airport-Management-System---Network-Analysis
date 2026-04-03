/**
 * Seed script to create a default admin user.
 * 
 * Usage:
 *   node scripts/seedAdmin.js
 * 
 * This will:
 *   1. Connect to MongoDB (using .env MONGO_URI)
 *   2. Check if admin@airport.com already exists
 *   3. If not, create the admin user with hashed password
 *   4. Print the created user document for verification
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load .env from the backend root
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const User = require('../models/User');

const seedAdmin = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/airportdb';
    console.log(`\n🔗 Connecting to: ${mongoURI}`);
    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB connected\n');

    // Check if admin already exists
    const existing = await User.findOne({ email: 'admin@airport.com' }).select('+password');
    if (existing) {
      console.log('⚠️  Admin user already exists:');
      console.log({
        _id: existing._id,
        name: existing.name,
        email: existing.email,
        role: existing.role,
        passwordHash: existing.password,
        createdAt: existing.createdAt,
      });
      console.log('\n💡 If login still fails, delete this user and re-run this script.');
      console.log('   To delete: db.users.deleteOne({ email: "admin@airport.com" })\n');
    } else {
      // Create admin user — the pre('save') hook in User model will hash the password
      const user = await User.create({
        name: 'Airport Admin',
        email: 'admin@airport.com',
        password: 'admin123',
        role: 'admin',
      });

      // Fetch again with password to verify hash was stored
      const saved = await User.findById(user._id).select('+password');
      console.log('✅ Admin user created successfully!\n');
      console.log('📄 User document in MongoDB:');
      console.log(JSON.stringify({
        _id: saved._id,
        name: saved.name,
        email: saved.email,
        role: saved.role,
        passwordHash: saved.password,
        createdAt: saved.createdAt,
      }, null, 2));
      console.log('\n🔑 Login credentials:');
      console.log('   Email:    admin@airport.com');
      console.log('   Password: admin123\n');
    }

    await mongoose.disconnect();
    console.log('🔌 MongoDB disconnected');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

seedAdmin();
