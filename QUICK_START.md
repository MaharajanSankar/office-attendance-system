# Quick Start Guide - Office Attendance System

## 🚀 Starting the Application

### Step 1: Navigate to Project Directory
```bash
cd d:\Projects\office-attendance-system
```

### Step 2: Install Dependencies (if not already installed)
```bash
npm install
```

### Step 3: Create Demo Accounts
```bash
node scripts/seedDemo.js
```

### Step 4: Start the Server
```bash
npm start
```

You should see:
```
✅ Connected to MongoDB
╔══════════════════════════════════════════════╗
║   Office Attendance System - Server Running  ║
╚══════════════════════════════════════════════╝

🚀 Server: http://localhost:3001
```

## 🌐 Accessing the Application

Open your browser and go to:
```
http://localhost:3001/login
```

## 👨‍💼 Admin Login

1. Click **"Admin Login"** button
2. Enter credentials:
   - Email: `admin@example.com`
   - Password: `123`
3. Click **"Login"**

### Admin Dashboard Features
- **👥 Employees Section**
  - View all employees
  - Add new employees
  - Edit/Delete employees
  
- **📅 Attendance Section**
  - Mark attendance
  - Filter by date or employee
  - View attendance records

- **📊 Activity Logs**
  - View all employee activities
  - Track login/logout times
  - Monitor attendance marking

## 👨‍💻 Employee Login

1. Click **"Employee Login"** button
2. Enter credentials (choose one):
   - Email: `john.doe@example.com` | Password: `123`
   - Email: `jane.smith@example.com` | Password: `123`
   - Email: `bob.wilson@example.com` | Password: `123`
3. Click **"Login"**

### Employee Dashboard Features
- **⏰ Quick Actions**
  - ✓ Check-In (start of work)
  - 🍽️ Lunch Out (go for lunch)
  - 🍽️ Lunch In (return from lunch)
  - ✓ Check-Out (end of work)

- **📊 Status Display**
  - Shows real-time status of your actions
  - Professional, clean interface
  - Timestamp tracking

## 🔧 Troubleshooting

### Server won't start
```bash
# Check if MongoDB is running
# Windows: Check if MongoDB service is running
tasklist | findstr mongod

# If MongoDB is not running, start it
# (requires MongoDB installed)
```

### Port 3001 already in use
```bash
# Kill process using port 3001
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

### Demo accounts don't exist
```bash
# Reset demo accounts
node scripts/seedDemo.js
```

### "Cannot add employees" error
1. Make sure you're logged in as admin
2. Check browser console (F12) for errors
3. Verify admin token is stored in localStorage
4. Try refreshing and logging in again

## 📱 Features Overview

### For Admin Users
| Feature | Description |
|---------|-------------|
| Employee Management | Add, edit, view, deactivate employees |
| Attendance Marking | Mark attendance for employees individually or in bulk |
| Reports | View attendance reports with statistics |
| Activity Logs | Complete audit trail of all employee activities |
| Dashboard | Real-time statistics of attendance status |

### For Employee Users
| Feature | Description |
|---------|-------------|
| Check-In/Out | Quick buttons to mark work hours |
| Lunch Tracking | Record lunch break times |
| Status Display | Real-time confirmation of actions |
| Activity Logs | View personal attendance history |
| Statistics | View your attendance records |

## 🔐 Security Notes

- **Never share passwords** - Each user should have their own account
- **Logout when done** - Click logout to end your session
- **Secure connection** - Use HTTPS in production
- **Token expires** - Automatically logs you out after 24 hours

## 📊 Understanding the Status Display

### Check-In Example
```
✓ CHECK-IN SUCCESSFUL
You are now marked as present for today.

⏰ 1/29/2026, 10:30:00 AM
```

### Lunch Out Example
```
🍽️ LUNCH OUT RECORDED
Enjoy your lunch break!

⏰ 1/29/2026, 12:30:00 PM
```

### Check-Out Example
```
✓ CHECK-OUT SUCCESSFUL
Have a great day! See you tomorrow.

⏰ 1/29/2026, 6:00:00 PM
```

## 📝 Common Tasks

### Admin: Add a New Employee
1. Go to Admin Dashboard
2. Scroll to "Add New Employee" section
3. Fill in details:
   - Name: John Smith
   - Email: john.smith@example.com
   - Password: (temporary password, can be changed)
   - Role: Employee
4. Click "Add Employee"

### Admin: Mark Attendance
1. Go to "Attendance Records" section
2. Select date
3. Filter by employee if needed
4. Mark status (Present/Absent/Leave/Half-day)

### Employee: Check-In
1. Go to Employee Dashboard
2. Click "✓ Check In" button
3. See confirmation message
4. Status updates in real-time

### View Activity Logs
**As Admin:**
1. Go to Admin Dashboard
2. Scroll to "Activity Logs" section
3. Click "Get All Logs" or filter by employee

**As Employee:**
1. Go to Employee Dashboard
2. Click "View My Logs" button
3. See personal activity history

## 🛠️ Development Commands

```bash
# Start server (production)
npm start

# Start with auto-reload (development)
npm run dev

# Seed demo accounts
node scripts/seedDemo.js

# Stop server
Ctrl + C
```

## 📚 Learn More

- Read `README.md` for detailed documentation
- Check `IMPLEMENTATION_SUMMARY.md` for feature list
- Review API documentation in README.md

## ⚙️ System Requirements

- Node.js v18 or higher
- MongoDB v4 or higher
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection (for initial setup)

## 📞 Quick Reference

**Server:** http://localhost:3001  
**Login Page:** http://localhost:3001/login  
**Database:** MongoDB (local or remote)  
**API Base:** http://localhost:3001/api

## 🎉 You're All Set!

Your Office Attendance System is ready to use. Start by logging in as admin and exploring the dashboard!

---

Need help? Check the README.md or IMPLEMENTATION_SUMMARY.md files for more details.
