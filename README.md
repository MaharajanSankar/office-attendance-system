# Office Attendance System 📊

A professional office attendance management system built with Node.js, Express, and MongoDB.

## 🚀 Features

### Authentication & Security
- ✅ **Separate Login Pages** - Different login interfaces for Admin and Employees
- ✅ **JWT Authentication** - Secure token-based authentication
- ✅ **Password Hashing** - bcryptjs encryption for password security
- ✅ **Role-Based Access Control** - Admin and Employee roles with different permissions
- ✅ **Session Management** - Automatic token expiration and refresh

### Admin Dashboard
- 👥 **Employee Management**
  - View all employees
  - Add new employees
  - Edit employee details
  - Deactivate employees
  - Search and filter employees

- 📅 **Attendance Management**
  - Mark attendance for employees
  - Bulk attendance marking
  - View attendance records by date or employee
  - Generate attendance reports

- 📊 **Dashboard Statistics**
  - Total employees count
  - Present/Absent/Leave/Half-day statistics
  - Real-time attendance status

- 📝 **Activity Logs**
  - View all employee login/logout activities
  - Track attendance marking events
  - Monitor employee check-in/check-out times
  - Filter logs by employee or action type

### Employee Dashboard
- ⏰ **Quick Actions**
  - Check-in/Check-out
  - Lunch out/Lunch in recording
  - Professional status messages

- 👀 **View Personal Records**
  - View personal attendance records
  - View attendance statistics
  - Access personal activity logs

- 📱 **User-Friendly Interface**
  - Clean, modern design
  - Quick-access buttons for common actions
  - Real-time status updates

### Employee Logs Database
Every action is logged and stored in MongoDB:
- **Login/Logout** - Track when employees login/logout
- **Check-in/Check-out** - Record work hours
- **Lunch Break** - Track lunch time
- **Attendance Marking** - Log admin attendance updates
- **IP Address & User Agent** - Security tracking

## 🔐 Demo Credentials

### Admin Account
```
Email: admin@example.com
Password: 123
```

### Employee Accounts
```
Email: john.doe@example.com | Password: 123
Email: jane.smith@example.com | Password: 123
Email: bob.wilson@example.com | Password: 123
```

## 📋 System Architecture

### Backend Stack
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM (Object Document Mapper)
- **JWT** - Authentication
- **bcryptjs** - Password encryption

### Frontend Stack
- **HTML5** - Markup
- **CSS3** - Styling with modern design
- **JavaScript (Vanilla)** - DOM manipulation and API calls

### Database Collections
1. **Employees** - User accounts and profiles
2. **Attendance** - Daily attendance records
3. **EmployeeLogs** - Activity tracking and audit trail

## 📂 Project Structure

```
office-attendance-system/
├── app.js                 # Main application entry
├── package.json           # Dependencies
├── middleware/
│   └── auth.js           # Authentication & authorization
├── models/
│   ├── Employee.js       # Employee schema & methods
│   ├── Attendance.js     # Attendance schema & methods
│   └── EmployeeLog.js    # Activity logging schema
├── routes/
│   ├── auth.js           # Login/Logout endpoints
│   ├── admin.js          # Admin dashboard endpoints
│   └── employee.js       # Employee dashboard endpoints
├── public/
│   ├── index.html        # Login choice page
│   ├── admin-login.html  # Admin login page
│   ├── employee-login.html # Employee login page
│   ├── admin.html        # Admin dashboard
│   ├── employee.html     # Employee dashboard
│   └── styles.css        # Global styles
└── scripts/
    └── seedDemo.js       # Demo data seeding
```

## 🛠️ API Endpoints

### Authentication
```
POST   /api/auth/login         # Login (admin or employee)
POST   /api/auth/logout        # Logout
GET    /api/auth/verify        # Verify token
GET    /api/auth/me            # Get current user info
```

### Admin Routes (Requires Authentication & Admin Role)
```
# Employees
GET    /api/admin/employees           # List all employees
POST   /api/admin/employees           # Add new employee
GET    /api/admin/employees/:id       # Get employee details
PUT    /api/admin/employees/:id       # Update employee
DELETE /api/admin/employees/:id       # Deactivate employee

# Attendance
POST   /api/admin/attendance          # Mark attendance
POST   /api/admin/attendance/bulk     # Bulk mark attendance
GET    /api/admin/attendance/date/:date    # Get attendance by date
GET    /api/admin/attendance/employee/:id  # Get employee attendance
GET    /api/admin/attendance/report        # Get attendance report

# Logs
GET    /api/admin/logs                      # Get all recent logs
GET    /api/admin/logs/employee/:employeeId # Get employee logs
GET    /api/admin/logs/login/:employeeId    # Get login logs
GET    /api/admin/logs/attendance/:date     # Get attendance logs
GET    /api/admin/logs/action/:action       # Get logs by action

# Dashboard
GET    /api/admin/dashboard/stats     # Get dashboard statistics
```

### Employee Routes (Requires Authentication & Employee Role)
```
GET    /api/employee/my-attendance    # Get my attendance records
GET    /api/employee/my-stats         # Get my attendance statistics
GET    /api/employee/my-logs          # Get my activity logs

POST   /api/employee/checkin          # Check in
POST   /api/employee/lunchout         # Lunch out
POST   /api/employee/lunchin          # Lunch in
POST   /api/employee/checkout         # Check out
```

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB running locally or remote connection string

### Installation

1. **Install Dependencies**
```bash
npm install
```

2. **Create Demo Accounts**
```bash
node scripts/seedDemo.js
```

3. **Start the Server**
```bash
npm start
# or for development with auto-reload
npm run dev
```

4. **Access the Application**
```
http://localhost:3001
```

## 📊 Log Recording

The system automatically logs the following events:

### Admin Actions
- Employee login/logout
- Attendance marking (individual & bulk)
- Employee management (add, edit, delete)

### Employee Actions
- Login/Logout with timestamp
- Check-in time
- Lunch break (out/in)
- Check-out time

Each log entry contains:
- **employeeId** - The employee who performed the action
- **action** - Type of action (login, check-in, etc.)
- **timestamp** - When the action occurred
- **ipAddress** - IP address of the request
- **userAgent** - Browser/client information
- **details** - Additional context about the action
- **status** - Success or failure

## 🔒 Security Features

1. **Password Hashing** - All passwords hashed with bcryptjs (10 salt rounds)
2. **JWT Tokens** - 24-hour expiration for security
3. **Role-Based Access** - Different permissions for admin and employees
4. **Input Validation** - Email and data validation
5. **Error Messages** - Generic messages to prevent information leakage
6. **HTTPS Ready** - Can be deployed with HTTPS
7. **Activity Logging** - Complete audit trail of all actions

## 📈 Attendance Statuses

- **Present** - Employee was present
- **Absent** - Employee was absent
- **Leave** - Employee took leave
- **Half-day** - Employee worked half day
- **Check-in** - Employee marked entry
- **Check-out** - Employee marked exit
- **Lunch-out** - Employee went for lunch
- **Lunch-in** - Employee returned from lunch

## 🎨 User Interface

### Modern Design Features
- Clean, professional interface
- Responsive design (mobile-friendly)
- Color-coded status messages
  - Green for success
  - Red for errors
  - Blue for info
- Real-time status updates
- Smooth animations and transitions
- Easy-to-use forms and buttons

## 📝 Notes

- All timestamps are stored in UTC and displayed in local time
- Employee IDs are optional but recommended for identification
- Deactivated employees cannot login
- Admin users have full access to all features
- Employee data is automatically sanitized (passwords never sent to frontend)

## 🐛 Troubleshooting

### "Invalid username or password"
- Verify credentials are correct
- Check if account exists in database
- Ensure account is active (not deactivated)

### Cannot add employees
- Verify you are logged in as admin
- Check MongoDB connection
- Ensure all required fields are filled

### Token expired
- Login again
- Your token expires after 24 hours

## 🔄 Future Enhancements

- [ ] Email notifications
- [ ] Biometric integration
- [ ] Mobile app
- [ ] Advanced reporting (PDF exports)
- [ ] Geolocation tracking
- [ ] Two-factor authentication
- [ ] Holiday management
- [ ] Leave approval system
- [ ] Performance analytics

## 📞 Support

For issues or questions, refer to the code comments or contact the development team.

---

**Version:** 1.0.0  
**Last Updated:** January 29, 2026
