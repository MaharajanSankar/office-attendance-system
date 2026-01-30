# 🔐 Office Attendance System - Credentials & Access Information

## 🚀 System Access

**Server URL:** http://localhost:3001  
**Login Page:** http://localhost:3001/login  
**Database:** MongoDB (127.0.0.1:27017/attendance_db)  
**API Base:** http://localhost:3001/api  

---

## 👨‍💼 ADMIN ACCOUNT

### Primary Admin
```
Role:     Administrator
Email:    admin@example.com
Password: 123
Access:   Full system access
```

### Admin Capabilities
- ✅ View all employees
- ✅ Add new employees
- ✅ Edit employee details
- ✅ Deactivate employees
- ✅ Mark attendance (individual & bulk)
- ✅ Generate attendance reports
- ✅ View all activity logs
- ✅ Dashboard statistics

---

## 👨‍💻 EMPLOYEE ACCOUNTS

### Employee #1: John Doe
```
Name:       John Doe
Email:      john.doe@example.com
Password:   123
Department: IT
Employee ID: EMP001
Role:       Employee
Status:     Active ✅
```

### Employee #2: Jane Smith
```
Name:       Jane Smith
Email:      jane.smith@example.com
Password:   123
Department: HR
Employee ID: EMP002
Role:       Employee
Status:     Active ✅
```

### Employee #3: Bob Wilson
```
Name:       Bob Wilson
Email:      bob.wilson@example.com
Password:   123
Department: Finance
Employee ID: EMP003
Role:       Employee
Status:     Active ✅
```

---

## 📱 How to Login

### Admin Login
1. Go to http://localhost:3001/login
2. Click "Admin Login"
3. Enter: admin@example.com
4. Enter: 123
5. Click "Login"

### Employee Login
1. Go to http://localhost:3001/login
2. Click "Employee Login"
3. Choose one:
   - john.doe@example.com / 123
   - jane.smith@example.com / 123
   - bob.wilson@example.com / 123
4. Click "Login"

---

## 🎯 Quick Actions

### For Admin
**After logging in:**
1. View employees list
2. Add new employee
3. Mark attendance
4. View activity logs
5. Check dashboard stats

### For Employee
**After logging in:**
1. Click "Check In" at start of day
2. Click "Lunch Out" for lunch break
3. Click "Lunch In" after lunch
4. Click "Check Out" at end of day
5. View your activity logs

---

## 📊 Default Configuration

### Database
- **Host:** localhost
- **Port:** 27017
- **Database Name:** attendance_db
- **Collections:** Employees, Attendance, EmployeeLogs

### Server
- **Host:** localhost
- **Port:** 3001
- **Environment:** Development
- **Token Expiry:** 24 hours
- **API Version:** 1.0

### Security
- **Password Encryption:** bcryptjs (10 rounds)
- **JWT Secret:** Configured in middleware/auth.js
- **Token Format:** Bearer <token>

---

## 🔄 Resetting Demo Credentials

If credentials don't work or you want to reset:

```bash
cd d:\Projects\office-attendance-system
node scripts/seedDemo.js
```

This will:
- Delete existing demo accounts
- Create fresh demo accounts
- Display all credentials
- Confirm successful setup

---

## 🛠️ Changing Credentials

### To Change Admin Password
```javascript
// Using MongoDB shell
db.employees.updateOne(
  { email: "admin@example.com" },
  { $set: { password: "newpassword" } }
)
```

### To Change Employee Password
```javascript
db.employees.updateOne(
  { email: "john.doe@example.com" },
  { $set: { password: "newpassword" } }
)
```

⚠️ **Note:** Passwords must be hashed using bcryptjs before storing
Use the application's password hashing instead of direct updates

---

## 🔒 Security Notes

### Password Policy
- Minimum length: 3 characters (demo - change for production)
- All passwords are hashed with bcryptjs
- Never store plain text passwords
- Never send passwords over HTTP (use HTTPS in production)

### Token Security
- Tokens expire after 24 hours
- Tokens are stored in localStorage
- Tokens contain user ID and email
- Expired tokens require re-login

### Best Practices
- Change demo passwords before production use
- Use strong passwords in production
- Enable HTTPS for all connections
- Regular database backups
- Monitor activity logs
- Disable unused accounts

---

## 📞 Account Management

### Creating New Employees

**Via Admin Dashboard:**
1. Login as admin
2. Go to "Add New Employee" section
3. Fill in details:
   - Name
   - Email
   - Password
   - Department (optional)
   - Employee ID (optional)
4. Click "Add Employee"

**Via API:**
```bash
curl -X POST http://localhost:3001/api/admin/employees \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Employee",
    "email": "new@example.com",
    "password": "password123",
    "department": "IT"
  }'
```

### Deactivating Employees

**Via Admin Dashboard:**
1. Login as admin
2. Find employee in list
3. Click delete/deactivate button

**Via API:**
```bash
curl -X DELETE http://localhost:3001/api/admin/employees/<employee_id> \
  -H "Authorization: Bearer <admin_token>"
```

---

## 🧪 Testing with Demo Accounts

### Workflow for Testing

**Admin Workflow:**
1. Login as admin@example.com
2. Add new test employee
3. View employee list
4. Mark attendance for employees
5. Generate attendance report
6. View activity logs

**Employee Workflow:**
1. Login as john.doe@example.com
2. Click "Check In"
3. Click "Lunch Out"
4. Click "Lunch In"
5. Click "Check Out"
6. View personal logs

---

## 📋 Credential Storage

### In Browser
- **Stored in:** localStorage
- **Key:** token
- **Format:** JWT token string
- **Expires:** Manually (24 hours recommended)
- **Clear:** On logout

### In Database
- **Collection:** employees
- **Fields:** email, password (hashed), role, name, department
- **Indexes:** email (unique)
- **Backup:** Regular MongoDB backups recommended

---

## 🔑 API Authentication

### Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"123"}'
```

### Using Token
```bash
curl -X GET http://localhost:3001/api/admin/employees \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

### Logout
```bash
curl -X POST http://localhost:3001/api/auth/logout \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

---

## ⚠️ Troubleshooting

### Forgot Password
```bash
# Reset all demo credentials
node scripts/seedDemo.js
```

### Cannot Login
1. Verify credentials are correct
2. Check MongoDB connection
3. Verify account is active
4. Check browser console for errors

### Token Expired
- Login again
- Token automatically expires after 24 hours

### Account Locked
- Contact admin
- Admin can deactivate and reactivate account

---

## 📊 Account Status

| Email | Password | Role | Status | Department |
|-------|----------|------|--------|-----------|
| admin@example.com | 123 | Admin | ✅ Active | Management |
| john.doe@example.com | 123 | Employee | ✅ Active | IT |
| jane.smith@example.com | 123 | Employee | ✅ Active | HR |
| bob.wilson@example.com | 123 | Employee | ✅ Active | Finance |

---

## 🎯 Next Steps

1. **Start Server:** `npm start`
2. **Access:** http://localhost:3001/login
3. **Login:** Use credentials above
4. **Explore:** Navigate the dashboard
5. **Review:** Check README.md for features

---

## 📅 Last Updated
January 29, 2026

## 🔄 Credential Version
1.0

---

**Keep this file safe and secure!**
