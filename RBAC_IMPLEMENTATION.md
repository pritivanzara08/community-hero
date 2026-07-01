# 🛡️ Community Hero - Role-Based Access Control Implementation

## Overview
Your Community Hero application now has a complete **Role-Based Access Control (RBAC)** system that differentiates between **Admin** and **Citizen (regular users)**.

---

## 🔐 Authentication System

### User Roles

1. **Citizen (Regular User)**
   - Can report issues
   - Can view only their own reported issues
   - Can check status of their complaints
   - Cannot access admin panel

2. **Admin/Department_Admin/Moderator**
   - Can view all reported issues from all citizens
   - Can update issue status (Pending → In Progress → Resolved)
   - Can assign issues to departments
   - Full admin dashboard access
   - Cannot create citizen reports

### Demo Accounts

```
👤 CITIZEN LOGIN:
   Email: citizen@example.com
   Password: password123
   → Redirects to User Dashboard

🔐 ADMIN LOGIN:
   Email: admin@example.com
   Password: password123
   → Redirects to Admin Dashboard
```

---

## 📂 Backend Implementation

### Updated Files:

#### 1. **auth.py** - Authentication & Authorization
```python
# Key Functions:
- get_current_user()           # Get authenticated user info
- get_current_admin_user()     # Verify admin privileges
- get_current_citizen_user()   # Verify citizen privileges
```

#### 2. **main.py** - Role-Based API Endpoints

**Citizen Endpoints:**
```
GET  /api/user/dashboard          → Get user's dashboard
GET  /api/user/issues             → Get user's reported issues
POST /api/issues/                 → Report new issue
```

**Admin Endpoints:**
```
GET  /api/admin/dashboard         → Get all issues statistics
GET  /api/admin/users             → Get all users
PUT  /api/admin/issue/{id}/status → Update issue status
POST /api/admin/issue/{id}/assign → Assign to department
```

**Public Endpoints:**
```
POST /api/auth/login              → Login (returns role)
POST /api/auth/register           → Register new citizen
GET  /api/auth/me                 → Get current user info
```

---

## 🎨 Frontend Implementation

### JavaScript Files:

#### 1. **auth.js** - Authentication Management
- `handleLogin(event)` - Process login form
- `handleRegister(event)` - Process registration
- `logout()` - Clear session & redirect
- `updateNavigation()` - Update UI based on role
- `requireAuth()` - Enforce authentication
- `requireAdmin()` - Enforce admin role

#### 2. **dashboard.js** - Dashboard Logic
- `loadUserDashboard()` - Load citizen's personal dashboard
- `loadAdminDashboard()` - Load admin's dashboard
- `updateIssueStatus()` - Admin: Change issue status
- `assignDepartment()` - Admin: Assign to department
- Role-based redirect logic

#### 3. **report.js** - Issue Reporting
- Map initialization
- Location selection
- File upload handling
- Form submission with authentication

### HTML Files:

#### **index.html** (Landing/Login/Register)
- Login & Register forms
- Unified auth card
- Tab switching between forms
- Demo credentials display

#### **dashboard.html** (User/Admin Dashboard)
- Loads appropriate dashboard based on role
- Citizens: See their issues only
- Admins: See all issues with management controls

#### **admin.html** (Admin-Only)
- Protected by `requireAdmin()`
- Shows all reported issues
- Admin controls for status & assignment

#### **report.html** (Issue Reporting)
- Protected by `requireAuth()`
- Map-based location selection
- Issue form with file upload

---

## 🔄 Authentication Flow

### Login Flow:
```
1. User enters email & password on index.html
2. Frontend calls: POST /api/auth/login
3. Backend validates credentials
4. Backend checks if admin account → role = "Admin"
5. Backend creates JWT token with role embedded
6. Frontend stores token + role in localStorage
7. Frontend redirects based on role:
   - Admin → admin.html
   - Citizen → dashboard.html
```

### Protected Route Flow:
```
1. User navigates to protected page (e.g., dashboard.html)
2. Page script calls requireAuth()
3. Script checks localStorage for token
4. If token exists → Load content
5. If token missing → Redirect to index.html
```

### Admin-Only Route Flow:
```
1. User navigates to admin.html
2. Page script calls requireAdmin()
3. Script retrieves role from localStorage
4. If role = "Admin" → Show admin dashboard
5. If role ≠ "Admin" → Show alert & redirect home
```

---

## 💾 LocalStorage Structure

```javascript
localStorage.authToken   // JWT token
localStorage.userRole   // "Admin" or "Citizen"
localStorage.userEmail  // User's email
localStorage.username   // User's username
```

---

## 🛡️ Navigation Updates

The navigation menu automatically updates based on role:

```
CITIZEN SEES:
  Home → Report Issue → My Dashboard → (Admin hidden)

ADMIN SEES:
  Home → Report Issue → Dashboard (Admin) → Admin
  
ADMIN LABEL: Shows 🔐 Admin, email, Logout button
CITIZEN LABEL: Shows 👤 Citizen, email, Logout button
```

---

## 📋 Status Badges

```css
badge-pending      → Yellow (#f39c12)
badge-progress     → Blue (#3498db)
badge-resolved     → Green (#00f5d4)
```

---

## 🎯 Key Features

### ✅ For Citizens
- Seamless registration & login
- Map-based issue reporting
- Personal dashboard showing their reports
- Real-time status updates
- Issue history tracking

### ✅ For Admins
- View all citizen reports
- Update issue status
- Assign to departments
- See statistics & metrics
- Manage all incidents

### ✅ Security
- JWT token-based authentication
- Role verification on every request
- Password hashing with bcrypt
- Automatic logout on token expiry
- Protected routes with auth checks

---

## 🧪 Testing the System

### Test Citizen Flow:
```
1. Go to http://localhost:3000/
2. Login with citizen@example.com / password123
3. Should see "My Dashboard"
4. Click "Report Issue"
5. Select location & submit
6. Issue appears in your dashboard
```

### Test Admin Flow:
```
1. Go to http://localhost:3000/
2. Login with admin@example.com / password123
3. Should see "Admin Dashboard"
4. View all citizen issues
5. Try updating status & assigning departments
6. Admin link appears in navigation
```

### Test Access Control:
```
1. Login as citizen
2. Try accessing /admin.html directly
3. Should redirect to index.html with "Access Denied" alert
```

---

## 🚀 Next Steps (Optional Enhancements)

1. **Database Integration**
   - Connect to real database (currently mocked)
   - Store users & issues in DB
   - Persist all data

2. **Email Notifications**
   - Notify citizens of status updates
   - Notify departments of assignments
   - Email on issue resolution

3. **Advanced Features**
   - Citizen voting system (upvote important issues)
   - Issue comments & discussions
   - Photo gallery for issues
   - Real-time notifications

4. **Analytics Dashboard**
   - Issue trends over time
   - Department performance metrics
   - Response time analytics

---

## 📞 Support Notes

- **JWT Secret**: Change `JWT_SECRET_KEY` in `.env` for production
- **Token Expiry**: Default 60 minutes (configurable in `.env`)
- **CORS**: Configure CORS properly for production
- **API Base URL**: Currently `http://localhost:8000/api` (update for production)

---

## 🎉 Summary

Your Community Hero app now has a complete role-based access control system with:
- ✅ Separate dashboards for citizens and admins
- ✅ Protected routes with authentication checks
- ✅ Admin-only functionality
- ✅ Automatic role-based redirects
- ✅ Dynamic navigation updates
- ✅ Session management with localStorage

Happy coding! 🚀
