// models/EmployeeLog.js
const mongoose = require('mongoose');

const employeeLogSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    default: null  // Optional - for logging attempts with non-existent users
  },
  action: {
    type: String,
    enum: ['login', 'logout', 'check-in', 'check-out', 'lunch-out', 'lunch-in', 'attendance-mark', 'profile-view'],
    required: [true, 'Action is required'],
    index: true
  },
  ipAddress: {
    type: String,
    default: null
  },
  userAgent: {
    type: String,
    default: null
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  status: {
    type: String,
    enum: ['success', 'failure'],
    default: 'success'
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true
});

// Compound index for efficient querying
employeeLogSchema.index({ employeeId: 1, timestamp: -1 });
employeeLogSchema.index({ action: 1, timestamp: -1 });

// Static method to log an action
employeeLogSchema.statics.logAction = async function(data) {
  const {
    employeeId,
    action,
    ipAddress,
    userAgent,
    details,
    status = 'success'
  } = data;

  try {
    const log = new this({
      employeeId,
      action,
      ipAddress,
      userAgent,
      details,
      status,
      timestamp: new Date()
    });

    return await log.save();
  } catch (error) {
    console.error('Error logging action:', error);
    throw error;
  }
};

// Static method to get logs for an employee
employeeLogSchema.statics.getEmployeeLogs = async function(employeeId, limit = 100) {
  return this.find({ employeeId })
    .populate('employeeId', 'name email employeeId department')
    .sort({ timestamp: -1 })
    .limit(limit);
};

// Static method to get logs by action type
employeeLogSchema.statics.getLogsByAction = async function(action, startDate, endDate, limit = 100) {
  const query = { action };

  if (startDate && endDate) {
    query.timestamp = { $gte: new Date(startDate), $lte: new Date(endDate) };
  } else if (startDate) {
    query.timestamp = { $gte: new Date(startDate) };
  } else if (endDate) {
    query.timestamp = { $lte: new Date(endDate) };
  }

  return this.find(query)
    .populate('employeeId', 'name email employeeId department')
    .sort({ timestamp: -1 })
    .limit(limit);
};

// Static method to get recent logs
employeeLogSchema.statics.getRecentLogs = async function(limit = 100) {
  return this.find({})
    .populate('employeeId', 'name email employeeId department')
    .sort({ timestamp: -1 })
    .limit(limit);
};

// Static method to get login logs
employeeLogSchema.statics.getLoginLogs = async function(employeeId, limit = 50) {
  return this.find({
    employeeId,
    action: { $in: ['login', 'logout'] }
  })
    .sort({ timestamp: -1 })
    .limit(limit);
};

// Static method to get attendance logs for a date
employeeLogSchema.statics.getAttendanceLogs = async function(date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  return this.find({
    action: { $in: ['check-in', 'check-out', 'lunch-out', 'lunch-in', 'attendance-mark'] },
    timestamp: { $gte: startOfDay, $lte: endOfDay }
  })
    .populate('employeeId', 'name email employeeId department')
    .sort({ timestamp: 1 });
};

module.exports = mongoose.model('EmployeeLog', employeeLogSchema);
