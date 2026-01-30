// test-system.js - Quick test script for the attendance system
const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';

// Test data
let adminToken = '';
let employeeToken = '';
let employeeId = '';
let adminId = '';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

async function log(message, type = 'info') {
  const color = type === 'success' ? colors.green : type === 'error' ? colors.red : colors.blue;
  console.log(`${color}[${type.toUpperCase()}]${colors.reset} ${message}`);
}

async function test() {
  try {
    // Test 1: Admin Login
    console.log('\n' + '='.repeat(60));
    console.log('TEST 1: Admin Login');
    console.log('='.repeat(60));
    
    const adminLoginRes = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'admin@example.com',
      password: '123'
    });
    
    if (adminLoginRes.data.success) {
      adminToken = adminLoginRes.data.token;
      adminId = adminLoginRes.data.user.id;
      await log(`✓ Admin login successful - Token: ${adminToken.substring(0, 20)}...`, 'success');
      await log(`  Admin ID: ${adminId}`, 'info');
    }

    // Test 2: Create Employee
    console.log('\n' + '='.repeat(60));
    console.log('TEST 2: Create New Employee');
    console.log('='.repeat(60));
    
    const createEmpRes = await axios.post(`${BASE_URL}/admin/employees`, {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
      department: 'IT',
      employeeId: 'EMP001',
      role: 'employee'
    }, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });

    if (createEmpRes.data.success) {
      employeeId = createEmpRes.data.employee._id;
      await log(`✓ Employee created successfully`, 'success');
      await log(`  Employee ID: ${employeeId}`, 'info');
      await log(`  Employee Email: john.doe@example.com`, 'info');
    }

    // Test 3: Employee Login
    console.log('\n' + '='.repeat(60));
    console.log('TEST 3: Employee Login');
    console.log('='.repeat(60));
    
    const empLoginRes = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'john.doe@example.com',
      password: 'password123'
    });

    if (empLoginRes.data.success) {
      employeeToken = empLoginRes.data.token;
      await log(`✓ Employee login successful - Token: ${employeeToken.substring(0, 20)}...`, 'success');
    }

    // Test 4: Check-in
    console.log('\n' + '='.repeat(60));
    console.log('TEST 4: Employee Check-in');
    console.log('='.repeat(60));
    
    const checkinRes = await axios.post(`${BASE_URL}/employee/checkin`, {}, {
      headers: { 'Authorization': `Bearer ${employeeToken}` }
    });

    if (checkinRes.data.success) {
      await log(`✓ Check-in successful`, 'success');
    }

    // Test 5: Get Employee Logs
    console.log('\n' + '='.repeat(60));
    console.log('TEST 5: Fetch Employee Logs');
    console.log('='.repeat(60));
    
    const empLogsRes = await axios.get(`${BASE_URL}/admin/logs/employee/${employeeId}?limit=10`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });

    if (empLogsRes.data.success) {
      await log(`✓ Employee logs retrieved successfully`, 'success');
      await log(`  Total logs: ${empLogsRes.data.count}`, 'info');
      empLogsRes.data.logs.forEach((log, idx) => {
        console.log(`  ${idx + 1}. Action: ${log.action} | Timestamp: ${new Date(log.timestamp).toLocaleString()}`);
      });
    }

    // Test 6: Get Login Logs
    console.log('\n' + '='.repeat(60));
    console.log('TEST 6: Fetch Login Logs');
    console.log('='.repeat(60));
    
    const loginLogsRes = await axios.get(`${BASE_URL}/admin/logs/login/${employeeId}`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });

    if (loginLogsRes.data.success) {
      await log(`✓ Login logs retrieved successfully`, 'success');
      await log(`  Total login entries: ${loginLogsRes.data.count}`, 'info');
      loginLogsRes.data.logs.forEach((log, idx) => {
        console.log(`  ${idx + 1}. Action: ${log.action} | Status: ${log.status} | IP: ${log.ipAddress}`);
      });
    }

    // Test 7: Mark Attendance (Admin)
    console.log('\n' + '='.repeat(60));
    console.log('TEST 7: Admin Mark Attendance');
    console.log('='.repeat(60));
    
    const today = new Date().toISOString().split('T')[0];
    const attendanceRes = await axios.post(`${BASE_URL}/admin/attendance`, {
      employeeId: employeeId,
      date: today,
      status: 'present',
      remarks: 'Test attendance'
    }, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });

    if (attendanceRes.data.success) {
      await log(`✓ Attendance marked successfully`, 'success');
    }

    // Test 8: Get Attendance Logs
    console.log('\n' + '='.repeat(60));
    console.log('TEST 8: Fetch Attendance Logs');
    console.log('='.repeat(60));
    
    const attLogsRes = await axios.get(`${BASE_URL}/admin/logs/attendance/${today}`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });

    if (attLogsRes.data.success) {
      await log(`✓ Attendance logs retrieved successfully`, 'success');
      await log(`  Total attendance logs: ${attLogsRes.data.count}`, 'info');
      attLogsRes.data.logs.forEach((log, idx) => {
        console.log(`  ${idx + 1}. Employee: ${log.employeeId?.name} | Action: ${log.action} | Time: ${new Date(log.timestamp).toLocaleTimeString()}`);
      });
    }

    // Test 9: Employee Logout
    console.log('\n' + '='.repeat(60));
    console.log('TEST 9: Employee Logout');
    console.log('='.repeat(60));
    
    const logoutRes = await axios.post(`${BASE_URL}/auth/logout`, {}, {
      headers: { 'Authorization': `Bearer ${employeeToken}` }
    });

    if (logoutRes.data.success) {
      await log(`✓ Logout successful`, 'success');
    }

    // Test 10: Get All Recent Logs
    console.log('\n' + '='.repeat(60));
    console.log('TEST 10: Fetch All Recent Logs');
    console.log('='.repeat(60));
    
    const allLogsRes = await axios.get(`${BASE_URL}/admin/logs?limit=20`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });

    if (allLogsRes.data.success) {
      await log(`✓ All recent logs retrieved successfully`, 'success');
      await log(`  Total logs in system: ${allLogsRes.data.count}`, 'info');
      console.log('\n  Last 5 logs:');
      allLogsRes.data.logs.slice(0, 5).forEach((log, idx) => {
        console.log(`  ${idx + 1}. ${log.employeeId?.name || 'System'} - ${log.action} (${log.status})`);
      });
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ ALL TESTS COMPLETED SUCCESSFULLY!');
    console.log('='.repeat(60));

  } catch (error) {
    console.error('\n' + colors.red + '❌ TEST FAILED' + colors.reset);
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Message: ${error.response.data?.message}`);
    } else {
      console.error(`Error: ${error.message}`);
    }
    process.exit(1);
  }
}

test().then(() => process.exit(0));
