require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const MONGO = process.env.MONGO_URI;
if (!MONGO) {
  console.error('Please set MONGO_URI in .env');
  process.exit(1);
}

const run = async () => {
  try {
    await mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    const email = process.env.ADMIN_EMAIL || 'admin@example.com';
    const password = process.env.ADMIN_PASSWORD || 'Password123';

    const existing = await User.findOne({ email });
    if (existing) {
      console.log('Admin already exists:', existing.email);
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const admin = await User.create({
      fullName: 'Admin User',
      email,
      password: hashed,
      role: 'admin',
    });

    console.log('Admin user created:', admin.email, '\nPassword:', password);
    process.exit(0);
  } catch (err) {
    console.error('Failed to create admin', err);
    process.exit(1);
  }
};

run();
