// app.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/attendance_db';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Import routes
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const employeeRoutes = require('./routes/employee');

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/employee', employeeRoutes);

// Serve HTML pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/admin-login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin-login.html'));
});

app.get('/employee-login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'employee-login.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.get('/employee', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'employee.html'));
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  // For authentication errors, always return generic message
  if (err.name === 'UnauthorizedError' || 
      err.name === 'JsonWebTokenError' ||
      err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid username or password'
    });
  }

  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// Connect to MongoDB and start server
async function startServer() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    app.listen(PORT, () => {
      console.log(`
╔══════════════════════════════════════════════╗
║   Office Attendance System - Server Running  ║
╚══════════════════════════════════════════════╝

🚀 Server: http://localhost:${PORT}
📝 Login: http://localhost:${PORT}/login
💾 Database: ${MONGODB_URI}

Admin Credentials:
  📧 Email: admin@example.com
  🔑 Password: 123

API Endpoints:
  POST   /api/auth/login
  GET    /api/auth/verify
  POST   /api/auth/logout
  GET    /api/auth/me
  
  GET    /api/admin/employees
  POST   /api/admin/employees
  GET    /api/admin/employees/:id
  PUT    /api/admin/employees/:id
  DELETE /api/admin/employees/:id
  
  POST   /api/admin/attendance
  POST   /api/admin/attendance/bulk
  GET    /api/admin/attendance/date/:date
  GET    /api/admin/attendance/employee/:id
  GET    /api/admin/attendance/report
  GET    /api/admin/dashboard/stats

Press Ctrl+C to stop the server
      `);

    });
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

// Handle MongoDB connection errors
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('\n👋 Server shutting down...');
  process.exit(0);
});

startServer();