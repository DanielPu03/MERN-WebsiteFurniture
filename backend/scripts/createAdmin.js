const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

// Script to create first admin user
async function createAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_CONNECTIONSTRING);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: 1 });
    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin.email);
      process.exit(0);
    }

    // Create admin user
    const adminUser = await User.create({
      hoTen: 'Admin',
      email: 'admin@admin.com',
      matKhau: '123456',
      soDienThoai: '0900000000',
      role: 1,
      trangThai: true
    });

    console.log('Admin created successfully:');
    console.log('Email:', adminUser.email);
    console.log('Name:', adminUser.hoTen);
    console.log('Password: 123456');
    console.log('Role: Admin');

    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
}

// Run the script
createAdmin();
