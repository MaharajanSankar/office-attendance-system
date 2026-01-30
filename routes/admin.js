// routes/admin.js
const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');
const Attendance = require('../models/Attendance');
const EmployeeLog = require('../models/EmployeeLog');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

/**
 * GET IP Address from request
 */
const getClientIp = (req) => {
  return req.headers['x-forwarded-for'] || 
         req.connection.remoteAddress || 
         req.socket.remoteAddress || 
         'Unknown';
};

// Apply authentication and admin check to all routes
router.use(authenticateToken);
router.use(requireAdmin);

// ============== EMPLOYEE ROUTES ==============

// Get all employees
router.get('/employees', async (req, res) => {
  try {
    const employees = await Employee.find({ isActive: true }).select('-password');
    
    res.json({
      success: true,
      employees
    });
  } catch (error) {
    console.error('Get employees error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch employees'
    });
  }
});

// Get single employee
router.get('/employees/:id', async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id).select('-password');
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    res.json({
      success: true,
      employee
    });
  } catch (error) {
    console.error('Get employee error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch employee'
    });
  }
});

// Add new employee
router.post('/employees', async (req, res) => {
  try {
    const { name, email, department, employeeId, role, password } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Name and email are required'
      });
    }

    // Check if email already exists
    const existing = await Employee.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }

    // Create new employee
    const newEmployee = new Employee({
      name,
      email: email.toLowerCase(),
      department: department || 'General',
      employeeId,
      role: role || 'employee',
      password: password || '123' // Default password
    });

    await newEmployee.save();

    res.status(201).json({
      success: true,
      message: 'Employee added successfully',
      employee: newEmployee.toJSON()
    });
  } catch (error) {
    console.error('Create employee error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Email or Employee ID already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create employee'
    });
  }
});

// Update employee
router.put('/employees/:id', async (req, res) => {
  try {
    const { name, email, department, employeeId, isActive } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email.toLowerCase();
    if (department) updateData.department = department;
    if (employeeId) updateData.employeeId = employeeId;
    if (typeof isActive === 'boolean') updateData.isActive = isActive;

    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    res.json({
      success: true,
      message: 'Employee updated successfully',
      employee
    });
  } catch (error) {
    console.error('Update employee error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Email or Employee ID already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to update employee'
    });
  }
});

// Delete employee (soft delete)
router.delete('/employees/:id', async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    ).select('-password');

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    res.json({
      success: true,
      message: 'Employee deleted successfully'
    });
  } catch (error) {
    console.error('Delete employee error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete employee'
    });
  }
});

// ============== ATTENDANCE ROUTES ==============

// Mark attendance
router.post('/attendance', async (req, res) => {
  try {
    const { employeeId, date, status, remarks } = req.body;

    if (!employeeId || !date || !status) {
      return res.status(400).json({
        success: false,
        message: 'Employee ID, date, and status are required'
      });
    }

    // Validate status
    const validStatuses = ['present', 'absent', 'leave', 'half-day'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be: present, absent, leave, or half-day'
      });
    }

    const attendance = await Attendance.mark({
      employeeId,
      date,
      status,
      remarks: remarks || '',
      markedBy: req.user.email
    });

    // Log attendance marking
    try {
      await EmployeeLog.logAction({
        employeeId,
        action: 'attendance-mark',
        ipAddress: getClientIp(req),
        userAgent: req.headers['user-agent'],
        details: { date, status, remarks, markedBy: req.user.email },
        status: 'success'
      });
    } catch (logError) {
      console.error('Error logging attendance:', logError);
    }

    res.json({
      success: true,
      message: 'Attendance marked successfully',
      attendance
    });
  } catch (error) {
    console.error('Mark attendance error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to mark attendance'
    });
  }
});

// Bulk mark attendance
router.post('/attendance/bulk', async (req, res) => {
  try {
    const { records } = req.body;

    if (!Array.isArray(records) || records.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Records array is required'
      });
    }

    const result = await Attendance.bulkMark(records, req.user.email);

    // Log bulk attendance marking
    try {
      await EmployeeLog.logAction({
        employeeId: null,
        action: 'attendance-mark',
        ipAddress: getClientIp(req),
        userAgent: req.headers['user-agent'],
        details: { recordCount: records.length, markedBy: req.user.email },
        status: 'success'
      });
    } catch (logError) {
      console.error('Error logging bulk attendance:', logError);
    }

    res.json({
      success: true,
      message: 'Bulk attendance marked successfully',
      result
    });
  } catch (error) {
    console.error('Bulk mark attendance error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark bulk attendance'
    });
  }
});

// Get attendance by date
router.get('/attendance/date/:date', async (req, res) => {
  try {
    const records = await Attendance.getByDate(req.params.date);

    res.json({
      success: true,
      date: req.params.date,
      records
    });
  } catch (error) {
    console.error('Get attendance by date error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch attendance records'
    });
  }
});

// Get attendance by employee
router.get('/attendance/employee/:id', async (req, res) => {
  try {
    const records = await Attendance.getByEmployee(req.params.id);

    res.json({
      success: true,
      employeeId: req.params.id,
      records
    });
  } catch (error) {
    console.error('Get attendance by employee error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch attendance records'
    });
  }
});

// Get attendance report
router.get('/attendance/report', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const records = await Attendance.getReport(startDate, endDate);

    // Calculate statistics
    const stats = {
      total: records.length,
      present: records.filter(r => r.status === 'present').length,
      absent: records.filter(r => r.status === 'absent').length,
      leave: records.filter(r => r.status === 'leave').length,
      halfDay: records.filter(r => r.status === 'half-day').length
    };

    res.json({
      success: true,
      stats,
      records,
      startDate: startDate || null,
      endDate: endDate || null
    });
  } catch (error) {
    console.error('Get attendance report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate report'
    });
  }
});

// ============== DASHBOARD STATS ==============

router.get('/dashboard/stats', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const employees = await Employee.find({ isActive: true });
    const todayAttendance = await Attendance.getByDate(today);

    const stats = {
      totalEmployees: employees.length,
      presentToday: todayAttendance.filter(a => a.status === 'present').length,
      absentToday: todayAttendance.filter(a => a.status === 'absent').length,
      onLeaveToday: todayAttendance.filter(a => a.status === 'leave').length,
      halfDayToday: todayAttendance.filter(a => a.status === 'half-day').length,
      notMarkedToday: employees.length - todayAttendance.length
    };

    res.json({
      success: true,
      stats,
      date: today
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard stats'
    });
  }
});

// ============== EMPLOYEE LOGS ==============

// Get all employee logs
router.get('/logs', async (req, res) => {
  try {
    const { limit = 100, action, employeeId } = req.query;
    let logs;

    if (employeeId) {
      logs = await EmployeeLog.getEmployeeLogs(employeeId, parseInt(limit));
    } else if (action) {
      logs = await EmployeeLog.getLogsByAction(action, null, null, parseInt(limit));
    } else {
      logs = await EmployeeLog.getRecentLogs(parseInt(limit));
    }

    res.json({
      success: true,
      logs,
      count: logs.length
    });
  } catch (error) {
    console.error('Get logs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch logs'
    });
  }
});

// Get employee-specific logs
router.get('/logs/employee/:employeeId', async (req, res) => {
  try {
    const { limit = 50 } = req.query;
    const logs = await EmployeeLog.getEmployeeLogs(req.params.employeeId, parseInt(limit));

    res.json({
      success: true,
      logs,
      count: logs.length
    });
  } catch (error) {
    console.error('Get employee logs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch employee logs'
    });
  }
});

// Get login logs for an employee
router.get('/logs/login/:employeeId', async (req, res) => {
  try {
    const { limit = 50 } = req.query;
    const logs = await EmployeeLog.getLoginLogs(req.params.employeeId, parseInt(limit));

    res.json({
      success: true,
      logs,
      count: logs.length
    });
  } catch (error) {
    console.error('Get login logs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch login logs'
    });
  }
});

// Get attendance logs for a specific date
router.get('/logs/attendance/:date', async (req, res) => {
  try {
    const logs = await EmployeeLog.getAttendanceLogs(req.params.date);

    res.json({
      success: true,
      logs,
      count: logs.length,
      date: req.params.date
    });
  } catch (error) {
    console.error('Get attendance logs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch attendance logs'
    });
  }
});

// Get logs by action type
router.get('/logs/action/:action', async (req, res) => {
  try {
    const { startDate, endDate, limit = 100 } = req.query;
    const logs = await EmployeeLog.getLogsByAction(req.params.action, startDate, endDate, parseInt(limit));

    res.json({
      success: true,
      logs,
      count: logs.length,
      action: req.params.action
    });
  } catch (error) {
    console.error('Get action logs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch action logs'
    });
  }
});

module.exports = router;