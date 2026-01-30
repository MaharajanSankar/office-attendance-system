// models/Attendance.js
const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: [true, 'Employee ID is required']
  },
  date: {
    type: String,
    required: [true, 'Date is required'],
    match: [/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format']
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'leave', 'half-day', 'check-in', 'check-out', 'lunch-out', 'lunch-in'],
    required: [true, 'Status is required']
  },
  checkInTime: {
    type: Date,
    default: null
  },
  lunchOutTime: {
    type: Date,
    default: null
  },
  lunchInTime: {
    type: Date,
    default: null
  },
  checkOutTime: {
    type: Date,
    default: null
  },
  remarks: {
    type: String,
    default: '',
    trim: true
  },
  markedBy: {
    type: String,
    default: 'system'
  },
  markedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index on employeeId and date for querying, but NOT unique (allows multiple entries per day)
attendanceSchema.index({ employeeId: 1, date: 1 });

// Static method to mark attendance - creates a new entry each time
attendanceSchema.statics.mark = async function(data) {
  const { employeeId, date, status, remarks, markedBy } = data;
  
  const entryData = {
    employeeId,
    date,
    status,
    remarks: remarks || '',
    markedBy: markedBy || 'system',
    markedAt: new Date()
  };

  // Handle different statuses to track times properly
  if (status === 'check-in') {
    entryData.checkInTime = new Date();
    entryData.status = 'check-in';
  } else if (status === 'lunch-out') {
    entryData.lunchOutTime = new Date();
    entryData.status = 'lunch-out';
  } else if (status === 'lunch-in') {
    entryData.lunchInTime = new Date();
    entryData.status = 'lunch-in';
  } else if (status === 'check-out') {
    entryData.checkOutTime = new Date();
    entryData.status = 'check-out';
  }

  // Create a new document instead of updating
  return this.create(entryData).then(doc => 
    doc.populate('employeeId', 'name email employeeId department')
  );
};

// Get attendance by date
attendanceSchema.statics.getByDate = async function(date) {
  return this.find({ date })
    .populate('employeeId', 'name email employeeId department')
    .sort({ createdAt: -1 });
};

// Get attendance by employee
attendanceSchema.statics.getByEmployee = async function(employeeId) {
  return this.find({ employeeId })
    .sort({ date: -1 });
};

// Get attendance by employee and date
attendanceSchema.statics.getByEmployeeAndDate = async function(employeeId, date) {
  return this.findOne({ employeeId, date })
    .populate('employeeId', 'name email employeeId department');
};

// Get attendance report
attendanceSchema.statics.getReport = async function(startDate, endDate) {
  const query = {};
  
  if (startDate && endDate) {
    query.date = { $gte: startDate, $lte: endDate };
  } else if (startDate) {
    query.date = { $gte: startDate };
  } else if (endDate) {
    query.date = { $lte: endDate };
  }
  
  return this.find(query)
    .populate('employeeId', 'name email employeeId department')
    .sort({ date: -1 });
};

// Get employee statistics
attendanceSchema.statics.getEmployeeStats = async function(employeeId, startDate, endDate) {
  const query = { employeeId };
  
  if (startDate && endDate) {
    query.date = { $gte: startDate, $lte: endDate };
  } else if (startDate) {
    query.date = { $gte: startDate };
  } else if (endDate) {
    query.date = { $lte: endDate };
  }
  
  const records = await this.find(query);
  
  return {
    total: records.length,
    present: records.filter(r => r.status === 'present').length,
    absent: records.filter(r => r.status === 'absent').length,
    leave: records.filter(r => r.status === 'leave').length,
    halfDay: records.filter(r => r.status === 'half-day').length
  };
};

// Bulk mark attendance
attendanceSchema.statics.bulkMark = async function(records, markedBy) {
  const bulkOps = records.map(record => ({
    updateOne: {
      filter: { employeeId: record.employeeId, date: record.date },
      update: {
        status: record.status,
        remarks: record.remarks || '',
        markedBy: markedBy || 'system',
        markedAt: new Date()
      },
      upsert: true
    }
  }));
  
  return this.bulkWrite(bulkOps);
};

module.exports = mongoose.model('Attendance', attendanceSchema);