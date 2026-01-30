// routes/auth.js
const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');
const EmployeeLog = require('../models/EmployeeLog');
const { generateToken, authenticateToken } = require('../middleware/auth');

/**
 * GET IP Address from request
 */
const getClientIp = (req) => {
  return req.headers['x-forwarded-for'] || 
         req.connection.remoteAddress || 
         req.socket.remoteAddress || 
         'Unknown';
};

/**
 * POST /api/auth/login
 * Login endpoint - works with MongoDB Employee model
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password, username } = req.body;

    // Accept either email or username (using email field)
    const loginField = email || username;

    // Validate input
    if (!loginField || !password) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid username or password' 
      });
    }

    // Find user by email (case-insensitive)
    const user = await Employee.findOne({ 
      email: loginField.toLowerCase() 
    });

    if (!user) {
      // Log failed login attempt
      try {
        await EmployeeLog.logAction({
          employeeId: null,
          action: 'login',
          ipAddress: getClientIp(req),
          userAgent: req.headers['user-agent'],
          details: { email: loginField },
          status: 'failure'
        });
      } catch (logError) {
        console.error('Error logging failed login:', logError);
      }

      return res.status(401).json({ 
        success: false, 
        message: 'Invalid username or password' 
      });
    }

    // Verify password
    const isValidPassword = await user.comparePassword(password);
    
    if (!isValidPassword) {
      // Log failed login attempt
      try {
        await EmployeeLog.logAction({
          employeeId: user._id,
          action: 'login',
          ipAddress: getClientIp(req),
          userAgent: req.headers['user-agent'],
          details: { email: user.email },
          status: 'failure'
        });
      } catch (logError) {
        console.error('Error logging failed login:', logError);
      }

      return res.status(401).json({ 
        success: false, 
        message: 'Invalid username or password' 
      });
    }

    // Check if user is active
    if (!user.isActive) {
      // Log inactive user login attempt
      try {
        await EmployeeLog.logAction({
          employeeId: user._id,
          action: 'login',
          ipAddress: getClientIp(req),
          userAgent: req.headers['user-agent'],
          details: { email: user.email, reason: 'inactive' },
          status: 'failure'
        });
      } catch (logError) {
        console.error('Error logging inactive login:', logError);
      }

      return res.status(401).json({ 
        success: false, 
        message: 'Invalid username or password' 
      });
    }

    // Generate JWT token
    const token = generateToken(user);

    // Log successful login
    try {
      await EmployeeLog.logAction({
        employeeId: user._id,
        action: 'login',
        ipAddress: getClientIp(req),
        userAgent: req.headers['user-agent'],
        details: { email: user.email, role: user.role },
        status: 'success'
      });
    } catch (logError) {
      console.error('Error logging successful login:', logError);
    }

    // Return success with token
    return res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        employeeId: user.employeeId
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid username or password' 
    });
  }
});

/**
 * GET /api/auth/verify
 * Verify token validity
 */
router.get('/verify', authenticateToken, async (req, res) => {
  try {
    // Get fresh user data from database
    const user = await Employee.findById(req.user.id).select('-password');
    
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        employeeId: user.employeeId
      }
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid username or password'
    });
  }
});

/**
 * POST /api/auth/logout
 * Logout endpoint
 */
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    // Log logout action
    await EmployeeLog.logAction({
      employeeId: req.user.id,
      action: 'logout',
      ipAddress: getClientIp(req),
      userAgent: req.headers['user-agent'],
      details: { email: req.user.email },
      status: 'success'
    });
  } catch (logError) {
    console.error('Error logging logout:', logError);
  }

  // With JWT, logout is handled client-side by removing the token
  res.json({
    success: true,
    message: 'Logout successful'
  });
});

/**
 * GET /api/auth/me
 * Get current user info
 */
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await Employee.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        employeeId: user.employeeId
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch user data'
    });
  }
});

module.exports = router;