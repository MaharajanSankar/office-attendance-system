// scripts/seedDemo.js - Create demo accounts
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const Employee = require('../models/Employee');

async function main() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/attendance_db');
    
    console.log('🌱 Seeding demo accounts...\n');

    // Delete existing demo accounts to reset passwords
    await Employee.deleteMany({ email: { $in: ['admin@example.com', 'john.doe@example.com', 'jane.smith@example.com', 'bob.wilson@example.com'] } });
    console.log('🗑️  Cleared existing demo accounts\n');

    // Admin Account
    const admin = new Employee({
      name: 'Admin User',
      email: 'admin@example.com',
      password: '123',
      role: 'admin',
      department: 'Management',
      employeeId: 'ADMIN001',
      isActive: true
    });
    await admin.save();
    console.log('✅ Admin account created:');
    console.log('   Email: admin@example.com');
    console.log('   Password: 123\n');

    // Demo Employee Account 1
    const emp1 = new Employee({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123',
      role: 'employee',
      department: 'IT',
      employeeId: 'EMP001',
      isActive: true
    });
    await emp1.save();
    console.log('✅ Employee account 1 created:');
    console.log('   Name: John Doe');
    console.log('   Email: john.doe@example.com');
    console.log('   Password: 123\n');

    // Demo Employee Account 2
    const emp2 = new Employee({
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      password: '123',
      role: 'employee',
      department: 'HR',
      employeeId: 'EMP002',
      isActive: true
    });
    await emp2.save();
    console.log('✅ Employee account 2 created:');
    console.log('   Name: Jane Smith');
    console.log('   Email: jane.smith@example.com');
    console.log('   Password: 123\n');

    // Demo Employee Account 3
    const emp3 = new Employee({
      name: 'Bob Wilson',
      email: 'bob.wilson@example.com',
      password: '123',
      role: 'employee',
      department: 'Finance',
      employeeId: 'EMP003',
      isActive: true
    });
    await emp3.save();
    console.log('✅ Employee account 3 created:');
    console.log('   Name: Bob Wilson');
    console.log('   Email: bob.wilson@example.com');
    console.log('   Password: 123\n');

    console.log('═'.repeat(50));
    console.log('📋 Demo Credentials Summary');
    console.log('═'.repeat(50));
    console.log('\n🔐 ADMIN LOGIN:');
    console.log('   Email: admin@example.com');
    console.log('   Password: 123');
    console.log('\n👨 EMPLOYEE LOGINS:');
    console.log('   Email: john.doe@example.com | Password: 123');
    console.log('   Email: jane.smith@example.com | Password: 123');
    console.log('   Email: bob.wilson@example.com | Password: 123');
    console.log('\n═'.repeat(50));

    await mongoose.disconnect();
    console.log('\n✨ Seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

main();
