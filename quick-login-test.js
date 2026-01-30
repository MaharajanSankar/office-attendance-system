// quick-login-test.js - Quick test of demo credentials
const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';

async function test() {
  try {
    console.log('\n' + '═'.repeat(60));
    console.log('🧪 TESTING DEMO CREDENTIALS');
    console.log('═'.repeat(60));

    // Test Admin Login
    console.log('\n🔐 Testing Admin Login...');
    console.log('   Email: admin@example.com');
    console.log('   Password: 123');
    
    const adminRes = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'admin@example.com',
      password: '123'
    });

    if (adminRes.data.success) {
      console.log('   ✅ LOGIN SUCCESSFUL');
      console.log(`   Token: ${adminRes.data.token.substring(0, 30)}...`);
      console.log(`   Role: ${adminRes.data.user.role}`);
    }

    // Test Employee Login
    console.log('\n👨 Testing Employee Login...');
    console.log('   Email: john.doe@example.com');
    console.log('   Password: 123');
    
    const empRes = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'john.doe@example.com',
      password: '123'
    });

    if (empRes.data.success) {
      console.log('   ✅ LOGIN SUCCESSFUL');
      console.log(`   Token: ${empRes.data.token.substring(0, 30)}...`);
      console.log(`   Role: ${empRes.data.user.role}`);
      console.log(`   Department: ${empRes.data.user.department}`);
    }

    console.log('\n' + '═'.repeat(60));
    console.log('✨ All login tests passed! Try accessing the application:');
    console.log('   http://localhost:3001/login');
    console.log('═'.repeat(60) + '\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Login failed!');
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Error: ${error.response.data?.message}`);
    } else {
      console.error(`Error: ${error.message}`);
    }
    process.exit(1);
  }
}

test();
