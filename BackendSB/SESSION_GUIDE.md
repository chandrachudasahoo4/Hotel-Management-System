# Simple HttpSession Authentication System

This is a beginner-friendly session-based authentication system for the Hotel Management System.

## How Sessions Work (Simple Explanation)

1. **Login**: When user logs in successfully, server creates a session and stores user info
2. **Session ID**: Server sends back a session ID to frontend 
3. **Storage**: Frontend stores session ID and user info in localStorage
4. **Security**: For protected routes, server checks if user has valid session

## Backend API Endpoints

### 1. Login API
```
POST /api/login
Body: {"email": "admin@a.com", "password": "123"}

Success Response:
{
  "status": "success",
  "message": "Login successful",
  "role": "ADMIN",
  "sessionId": "ABC123XYZ",
  "userId": 1,
  "userName": "Admin User"
}
```

### 2. Logout API
```
POST /api/logout

Response:
{
  "status": "success",
  "message": "Logout successful"
}
```

### 3. Check Session API
```
GET /api/session

Response (if logged in):
{
  "status": "success",
  "isLoggedIn": true,
  "userId": 1,
  "userName": "Admin User",
  "userEmail": "admin@a.com",
  "userRole": "ADMIN",
  "sessionId": "ABC123XYZ"
}
```

### 4. Protected APIs (Require Login)
- `GET /api/allUsers` - Only ADMIN can access
- `POST /api/addUsers` - Only ADMIN can access  
- `PUT /api/updateUsers/{id}` - Only ADMIN can access
- `DELETE /api/deleteUsers/{id}` - Only ADMIN can access

## Frontend Implementation Guide

### 1. After Successful Login - Store in localStorage
```javascript
// After successful login API call
const loginResponse = {
  "status": "success",
  "sessionId": "ABC123XYZ",
  "userId": 1,
  "userName": "Admin User",
  "role": "ADMIN"
};

// Store in localStorage
localStorage.setItem('sessionId', loginResponse.sessionId);
localStorage.setItem('userId', loginResponse.userId);
localStorage.setItem('userName', loginResponse.userName);
localStorage.setItem('userRole', loginResponse.role);
localStorage.setItem('isLoggedIn', 'true');
```

### 2. Check if User is Logged In
```javascript
function isUserLoggedIn() {
  return localStorage.getItem('isLoggedIn') === 'true';
}

function getUserRole() {
  return localStorage.getItem('userRole');
}

function getUserName() {
  return localStorage.getItem('userName');
}
```

### 3. Logout - Clear localStorage
```javascript
function logout() {
  // Call logout API first
  fetch('/api/logout', { method: 'POST' })
    .then(() => {
      // Clear localStorage
      localStorage.removeItem('sessionId');
      localStorage.removeItem('userId');
      localStorage.removeItem('userName');
      localStorage.removeItem('userRole');
      localStorage.removeItem('isLoggedIn');
      
      // Redirect to login page
      window.location.href = '/login';
    });
}
```

### 4. Making API Calls with Session
```javascript
// For protected API calls, make sure cookies are included
fetch('/api/allUsers', {
  method: 'GET',
  credentials: 'include'  // This includes cookies (session)
})
.then(response => response.json())
.then(data => {
  if (data.status === 'error' && data.message === 'Please login first') {
    // Redirect to login
    window.location.href = '/login';
  }
  // Handle success
});
```

### 5. Route Protection in Frontend
```javascript
// Check on page load
if (!isUserLoggedIn()) {
  window.location.href = '/login';
}

// Check role-based access
if (getUserRole() !== 'ADMIN') {
  alert('Access denied. Admin role required.');
  window.location.href = '/customer-dashboard';
}
```

## Security Features

1. **Session Timeout**: Sessions expire after 30 minutes of inactivity
2. **Role-Based Access**: Different roles have different permissions
3. **Session Validation**: Server checks session validity for protected routes
4. **Secure Cookies**: Sessions are stored securely on server side

## Testing the APIs

### Login Test:
```bash
curl -X POST http://localhost:8080/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@a.com","password":"123"}' \
  -c cookies.txt
```

### Access Protected Route:
```bash
curl -X GET http://localhost:8080/api/allUsers \
  -b cookies.txt
```

## Common Error Messages

1. `"Please login first"` - User not logged in
2. `"Access denied. Admin role required."` - User lacks required role
3. `"No active session found"` - Session expired or invalid

This system is simple, secure, and perfect for beginners to understand session-based authentication!