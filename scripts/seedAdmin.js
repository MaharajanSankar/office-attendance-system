// usage: node scripts/seedAdmin.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const Employee = require('../models/Employee');

async function main() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/attendance_db');
    const email = 'admin@example.com';
    const existing = await Employee.findOne({ email });
    if (existing) {
      console.log('Admin already exists:', existing.email);
      process.exit(0);
    }
    const admin = new Employee({ name: 'Admin', email, password: '123', role: 'admin' });
    await admin.save();
    console.log('Admin created:', admin.email);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
main();