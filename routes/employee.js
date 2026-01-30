// routes/employee.js
const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const EmployeeLog = require('../models/EmployeeLog');
const { authenticateToken } = require('../middleware/auth');

/**
 * GET IP Address from request
 */
const getClientIp = (req) => {
  return req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    'Unknown';
};

// Apply authentication to all employee routes
router.use(authenticateToken);

// Get my attendance records
router.get('/my-attendance', async (req, res) => {
  try {
    const records = await Attendance.getByEmployee(req.user.id);

    res.json({
      success: true,
      records
    });
  } catch (error) {
    console.error('Get my attendance error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch attendance records'
    });
  }
});

// Get my attendance stats
router.get('/my-stats', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const stats = await Attendance.getEmployeeStats(req.user.id, startDate, endDate);

    res.json({
      success: true,
      stats,
      startDate: startDate || null,
      endDate: endDate || null
    });
  } catch (error) {
    console.error('Get my stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics'
    });
  }
});

// Get my logs
router.get('/my-logs', async (req, res) => {
  try {
    const { limit = 50 } = req.query;
    const logs = await EmployeeLog.getEmployeeLogs(req.user.id, parseInt(limit));

    res.json({
      success: true,
      logs,
      count: logs.length
    });
  } catch (error) {
    console.error('Get my logs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch logs'
    });
  }
});

// Get today's attendance status (consolidated)
router.get('/today-status', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const allRecords = await Attendance.find({
      employeeId: req.user.id,
      date: today
    }).sort({ createdAt: 1 });

    // Consolidate all records into a single status
    const attendance = {
      date: today,
      checkInTime: null,
      lunchOutTime: null,
      lunchInTime: null,
      checkOutTime: null,
      status: 'absent'
    };

    allRecords.forEach(record => {
      if (record.checkInTime) {
        attendance.checkInTime = record.checkInTime;
        attendance.status = 'present';
      }
      if (record.lunchOutTime) attendance.lunchOutTime = record.lunchOutTime;
      if (record.lunchInTime) attendance.lunchInTime = record.lunchInTime;
      if (record.checkOutTime) attendance.checkOutTime = record.checkOutTime;
    });

    res.json({
      success: true,
      attendance
    });
  } catch (error) {
    console.error('Get today status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch today\'s status'
    });
  }
});

// Check In
router.post('/checkin', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const attendance = await Attendance.mark({
      employeeId: req.user.id,
      date: today,
      status: 'check-in',
      remarks: 'Checked in',
      markedBy: req.user.email
    });

    // Log check-in action
    try {
      await EmployeeLog.logAction({
        employeeId: req.user.id,
        action: 'check-in',
        ipAddress: getClientIp(req),
        userAgent: req.headers['user-agent'],
        details: { date: today },
        status: 'success'
      });
    } catch (logError) {
      console.error('Error logging check-in:', logError);
    }

    res.json({
      success: true,
      message: 'Checked in successfully',
      attendance
    });
  } catch (error) {
    console.error('Check in error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to check in'
    });
  }
});

// Lunch Out
router.post('/lunchout', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const attendance = await Attendance.mark({
      employeeId: req.user.id,
      date: today,
      status: 'lunch-out',
      remarks: 'Went for lunch',
      markedBy: req.user.email
    });

    // Log lunch-out action
    try {
      await EmployeeLog.logAction({
        employeeId: req.user.id,
        action: 'lunch-out',
        ipAddress: getClientIp(req),
        userAgent: req.headers['user-agent'],
        details: { date: today },
        status: 'success'
      });
    } catch (logError) {
      console.error('Error logging lunch-out:', logError);
    }

    res.json({
      success: true,
      message: 'Lunch out recorded successfully',
      attendance
    });
  } catch (error) {
    console.error('Lunch out error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to record lunch out'
    });
  }
});

// Lunch In
router.post('/lunchin', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const attendance = await Attendance.mark({
      employeeId: req.user.id,
      date: today,
      status: 'lunch-in',
      remarks: 'Back from lunch',
      markedBy: req.user.email
    });

    // Log lunch-in action
    try {
      await EmployeeLog.logAction({
        employeeId: req.user.id,
        action: 'lunch-in',
        ipAddress: getClientIp(req),
        userAgent: req.headers['user-agent'],
        details: { date: today },
        status: 'success'
      });
    } catch (logError) {
      console.error('Error logging lunch-in:', logError);
    }

    res.json({
      success: true,
      message: 'Lunch in recorded successfully',
      attendance
    });
  } catch (error) {
    console.error('Lunch in error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to record lunch in'
    });
  }
});

// Check Out
router.post('/checkout', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const attendance = await Attendance.mark({
      employeeId: req.user.id,
      date: today,
      status: 'check-out',
      remarks: 'Checked out',
      markedBy: req.user.email
    });

    // Log check-out action
    try {
      await EmployeeLog.logAction({
        employeeId: req.user.id,
        action: 'check-out',
        ipAddress: getClientIp(req),
        userAgent: req.headers['user-agent'],
        details: { date: today },
        status: 'success'
      });
    } catch (logError) {
      console.error('Error logging check-out:', logError);
    }

    res.json({
      success: true,
      message: 'Checked out successfully',
      attendance
    });
  } catch (error) {
    console.error('Check out error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to check out'
    });
  }
});

module.exports = router;