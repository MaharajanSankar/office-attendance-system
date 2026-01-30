# Office Attendance System - Quick Reference Guide

## 🚀 Getting Started

### Start the Server
```bash
npm start
# Server runs on http://localhost:3001
```

### Access the Application
- **Home Page**: http://localhost:3001
- **Admin Login**: http://localhost:3001/admin-login
- **Employee Login**: http://localhost:3001/employee-login

---

## 👨‍💼 Admin Credentials

| Field | Value |
|-------|-------|
| Email | admin@example.com |
| Password | 123 |
| Role | admin |

---

## 👤 Employee Credentials (Demo)

| Field | Value |
|-------|-------|
| Email | john.doe@example.com |
| Password | password123 |
| Role | employee |

---

## 📊 Database Models

### Employee Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (hashed),
  role: String (enum: ['employee', 'admin']),
  department: String,
  employeeId: String (unique),
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Attendance Model
```javascript
{
  employeeId: ObjectId (ref: Employee),
  date: String (YYYY-MM-DD format),
  status: String (enum: ['present', 'absent', 'leave', 'half-day']),
  remarks: String,
  markedBy: String (email of who marked),
  markedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### EmployeeLog Model (NEW)
```javascript
{
  employeeId: ObjectId (ref: Employee),
  action: String (enum: ['login', 'logout', 'check-in', 'check-out', 
                         'lunch-out', 'lunch-in', 'attendance-mark', 'profile-view']),
  ipAddress: String,
  userAgent: String,
  details: Mixed (flexible JSON),
  status: String (enum: ['success', 'failure']),
  timestamp: Date,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔐 API Authentication

All protected endpoints require:
```
Header: Authorization: Bearer <JWT_TOKEN>
```

### How to Get Token:
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "123"
}

# Response includes:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { ... }
}
```

---

## 🔑 Authentication Endpoints

### Login
```
POST /api/auth/login
Body: { email, password }
Returns: { success, token, user }
```

### Verify Token
```
GET /api/auth/verify
Headers: Authorization: Bearer <token>
Returns: { success, user }
```

### Get Current User
```
GET /api/auth/me
Headers: Authorization: Bearer <token>
Returns: { success, user }
```

### Logout
```
POST /api/auth/logout
Headers: Authorization: Bearer <token>
Returns: { success }
```

---

## 👥 Admin API Endpoints

### Employee Management
```
GET    /api/admin/employees              # Get all active employees
POST   /api/admin/employees              # Create new employee
GET    /api/admin/employees/:id          # Get specific employee
PUT    /api/admin/employees/:id          # Update employee
DELETE /api/admin/employees/:id          # Soft delete employee
```

### Attendance Management
```
POST   /api/admin/attendance              # Mark attendance for employee
POST   /api/admin/attendance/bulk         # Bulk mark attendance
GET    /api/admin/attendance/date/:date   # Get attendance for date
GET    /api/admin/attendance/employee/:id # Get employee's attendance history
GET    /api/admin/attendance/report       # Generate report (with optional filters)
```

### Dashboard
```
GET    /api/admin/dashboard/stats         # Get today's attendance stats
```

### Activity Logs
```
GET    /api/admin/logs                       # Get all recent logs
GET    /api/admin/logs/employee/:employeeId # Get employee's activity logs
GET    /api/admin/logs/login/:employeeId    # Get employee's login history
GET    /api/admin/logs/attendance/:date     # Get attendance logs for date
GET    /api/admin/logs/action/:action       # Get logs by action type
```

---

## 👤 Employee API Endpoints

### Attendance
```
GET    /api/employee/my-attendance        # Get my attendance records
GET    /api/employee/my-stats             # Get my attendance stats
GET    /api/employee/my-logs              # Get my activity logs
```

### Clock In/Out
```
POST   /api/employee/checkin              # Check in
POST   /api/employee/checkout             # Check out
POST   /api/employee/lunchout             # Mark lunch start
POST   /api/employee/lunchin              # Mark lunch end
```

---

## 📋 Example API Requests

### Create Employee (Admin)
```bash
curl -X POST http://localhost:3001/api/admin/employees \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane.smith@example.com",
    "password": "secure123",
    "department": "HR",
    "employeeId": "EMP002",
    "role": "employee"
  }'
```

### Mark Attendance (Admin)
```bash
curl -X POST http://localhost:3001/api/admin/attendance \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "employeeId": "507f1f77bcf86cd799439011",
    "date": "2026-01-29",
    "status": "present",
    "remarks": "Regular working day"
  }'
```

### Check In (Employee)
```bash
curl -X POST http://localhost:3001/api/employee/checkin \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json"
```

### View Logs (Admin)
```bash
curl -X GET "http://localhost:3001/api/admin/logs?limit=20" \
  -H "Authorization: Bearer <token>"
```

### View My Logs (Employee)
```bash
curl -X GET "http://localhost:3001/api/employee/my-logs?limit=50" \
  -H "Authorization: Bearer <token>"
```

---

## 🔍 Log Actions Tracked

| Action | When Logged |
|--------|------------|
| `login` | User logs in (success/failure) |
| `logout` | User logs out |
| `check-in` | Employee checks in |
| `check-out` | Employee checks out |
| `lunch-out` | Employee goes to lunch |
| `lunch-in` | Employee returns from lunch |
| `attendance-mark` | Admin marks attendance |
| `profile-view` | User views profile |

---

## 🎯 Query Parameters

### Pagination
```
?limit=50        # Limit results (default 100)
```

### Date Filters
```
?startDate=2026-01-01&endDate=2026-01-31
```

### Examples
```
GET /api/admin/logs/employee/507f1f77bcf86cd799439011?limit=10
GET /api/admin/logs/action/login?startDate=2026-01-01&limit=100
GET /api/admin/logs/attendance/2026-01-29
```

---

## 🔴 Error Responses

### Invalid Credentials
```json
{
  "success": false,
  "message": "Invalid username or password"
}
```

### Unauthorized (No Token)
```json
{
  "success": false,
  "message": "Invalid username or password"
}
```

### Forbidden (Not Admin)
```json
{
  "success": false,
  "message": "Access denied. Admin privileges required."
}
```

### Validation Error
```json
{
  "success": false,
  "message": "Employee ID, date, and status are required"
}
```

---

## 📱 Frontend URLs

| Page | URL | Purpose |
|------|-----|---------|
| Selection | `/` | Choose role (Admin/Employee) |
| Admin Login | `/admin-login` | Admin authentication |
| Employee Login | `/employee-login` | Employee authentication |
| Admin Dashboard | `/admin` | Admin control panel |
| Employee Dashboard | `/employee` | Employee portal |

---

## 🛠️ Environment Variables

Create `.env` file:
```
PORT=3001
MONGODB_URI=mongodb://127.0.0.1:27017/attendance_db
JWT_SECRET=my_super_secret_key_123
```

---

## 📊 Database Connection

- **Type**: MongoDB
- **Default URI**: mongodb://127.0.0.1:27017/attendance_db
- **Database Name**: attendance_db
- **Collections**: 
  - employees
  - attendances
  - employeelogs

---

## 🧪 Testing Checklist

- [ ] Home page shows role selection
- [ ] Admin login page loads at /admin-login
- [ ] Employee login page loads at /employee-login
- [ ] Admin can login with admin credentials
- [ ] Employee can login with employee credentials
- [ ] Admin cannot login with employee credentials
- [ ] Employee cannot login with admin credentials
- [ ] Logout functionality works
- [ ] Admin can view all logs
- [ ] Employees can view their own logs
- [ ] Check-in/out properly logged
- [ ] Attendance marking logged
- [ ] IP address captured in logs

---

## 🐛 Troubleshooting

### Server won't start
```bash
# Check if port 3001 is in use
netstat -ano | findstr :3001

# Kill process if needed
taskkill /PID <PID> /F
```

### MongoDB connection error
```bash
# Ensure MongoDB is running
mongod

# Or check connection string in .env
```

### Token errors
- Clear `localStorage` and login again
- Check token expiration (24 hours)
- Verify Authorization header format: `Bearer <token>`

### CORS errors
- Already configured in app.js
- Check if frontend domain is allowed

---

## 📞 Support

For issues or questions:
1. Check the MongoDB connection
2. Review server logs
3. Check browser console for frontend errors
4. Verify JWT token validity
5. Ensure proper Authorization headers

---

## ✅ Features Implemented

- ✅ Separate admin and employee login pages
- ✅ JWT-based authentication
- ✅ Role-based access control
- ✅ Complete activity logging
- ✅ IP address tracking
- ✅ Failed login detection
- ✅ Attendance management
- ✅ Employee audit trail
- ✅ Log querying endpoints
- ✅ Secure password hashing

---

**Last Updated**: January 29, 2026
**Version**: 1.0.0
