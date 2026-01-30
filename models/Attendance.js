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
    default: 'absent'  // default to absent until first action
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

// Keep unique index — this prevents duplicates (very important!)
attendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true });

// UPDATED MARK METHOD — now upserts (update or create)
attendanceSchema.statics.mark = async function(data) {
  const { employeeId, date, status, remarks, markedBy } = data;

  const update = {
    $set: {
      status,
      remarks: remarks || '',
      markedBy: markedBy || 'system',
      markedAt: new Date(),
      updatedAt: new Date()
    }
  };

  // Set the correct time field based on action
  if (status === 'check-in') {
    update.$set.checkInTime = new Date();
  } else if (status === 'lunch-out') {
    update.$set.lunchOutTime = new Date();
  } else if (status === 'lunch-in') {
    update.$set.lunchInTime = new Date();
  } else if (status === 'check-out') {
    update.$set.checkOutTime = new Date();
    update.$set.status = 'present';  // final status after checkout
  }

  // Upsert: update existing document or create new one
  return this.findOneAndUpdate(
    { employeeId, date },          // match by employee + date
    update,
    {
      upsert: true,                // create if not exists
      new: true,                   // return updated document
      setDefaultsOnInsert: true    // apply defaults on new doc
    }
  ).populate('employeeId', 'name email employeeId department');
};

// All your other static methods remain unchanged
attendanceSchema.statics.getByDate = async function(date) {
  return this.find({ date })
    .populate('employeeId', 'name email employeeId department')
    .sort({ createdAt: -1 });
};

attendanceSchema.statics.getByEmployee = async function(employeeId) {
  return this.find({ employeeId })
    .sort({ date: -1 });
};

attendanceSchema.statics.getByEmployeeAndDate = async function(employeeId, date) {
  return this.findOne({ employeeId, date })
    .populate('employeeId', 'name email employeeId department');
};

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

attendanceSchema.statics.bulkMark = async function(records, markedBy) {
  const bulkOps = records.map(record => ({
    updateOne: {
      filter: { employeeId: record.employeeId, date: record.date },
      update: {
        status: record.status,
        remarks: record.remarks || '',
        markedBy: markedBy || 'system',
        markedAt: new Date(),
        updatedAt: new Date()
      },
      upsert: true
    }
  }));
  
  return this.bulkWrite(bulkOps);
};

module.exports = mongoose.model('Attendance', attendanceSchema);