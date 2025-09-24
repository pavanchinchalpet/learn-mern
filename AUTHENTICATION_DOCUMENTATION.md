# MERN Quest Authentication System - End-to-End Documentation

## Table of Contents
1. [Overview](#overview)
2. [System Architecture](#system-architecture)
3. [Authentication Methods](#authentication-methods)
4. [Backend Implementation](#backend-implementation)
5. [Frontend Implementation](#frontend-implementation)
6. [API Endpoints](#api-endpoints)
7. [Security Features](#security-features)
8. [Error Handling](#error-handling)
9. [Database Models](#database-models)
10. [Email Configuration](#email-configuration)
11. [Environment Variables](#environment-variables)
12. [Testing Guide](#testing-guide)
13. [Troubleshooting](#troubleshooting)

## Overview

The MERN Quest authentication system provides secure user authentication with two login methods:
- **Password-based authentication**: Traditional email/password login
- **OTP-based authentication**: One-Time Password sent via email

### Key Features
- JWT token-based authentication
- Password hashing with bcrypt
- OTP generation and verification
- Email delivery system
- Session management
- Input validation
- Rate limiting and security measures

## System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (React)       │    │   (Node.js)     │    │   (MongoDB)     │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ AuthContext     │◄──►│ AuthController  │◄──►│ Users Collection│
│ Login Component │    │ Auth Routes     │    │ OTP Collection  │
│ API Utils       │    │ Auth Middleware │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   Email Service │
                       │   (Nodemailer)  │
                       └─────────────────┘
```

## Authentication Methods

### 1. Password-Based Authentication

**Flow:**
1. User enters email and password
2. Frontend sends credentials to `/api/auth/login`
3. Backend validates credentials
4. Password is compared using bcrypt
5. JWT token is generated and returned
6. Token is stored in localStorage
7. User is redirected to dashboard

**Security Features:**
- Password hashing with bcrypt (salt rounds: 10)
- JWT token expiration (7 days)
- Input validation
- Error handling for invalid credentials

### 2. OTP-Based Authentication

**Flow:**
1. User enters email address
2. Frontend sends email to `/api/auth/send-otp`
3. Backend generates 6-digit OTP
4. OTP is saved to database with expiration
5. Email is sent via Nodemailer
6. User enters OTP
7. Frontend sends OTP to `/api/auth/verify-otp`
8. Backend verifies OTP
9. JWT token is generated and returned
10. User is logged in

**Security Features:**
- 6-digit random OTP
- 10-minute expiration
- Maximum 3 verification attempts
- Automatic cleanup of expired OTPs
- Rate limiting (60-second cooldown)

## Backend Implementation

### File Structure
```
api/
├── controllers/
│   └── authController.js    # Authentication logic
├── routes/
│   └── auth.js             # Route definitions
├── middleware/
│   └── auth.js             # JWT verification
├── models/
│   ├── User.js             # User schema
│   └── OTP.js              # OTP schema
└── config/
    └── email.js            # Email configuration
```

### AuthController (`api/controllers/authController.js`)

#### Key Functions:

**1. `register(req, res)`**
- Validates input using express-validator
- Checks for existing users (email/username)
- Creates new user with hashed password
- Generates JWT token
- Returns user data (excluding password)

**2. `login(req, res)`**
- Validates email format
- Finds user by email
- Compares password using bcrypt
- Updates lastLogin timestamp
- Generates JWT token
- Returns user data and token

**3. `sendOTP(req, res)`**
- Validates email format
- Checks if user exists
- Generates new OTP (removes old ones)
- Sends OTP via email
- Returns success message

**4. `verifyOTP(req, res)`**
- Validates email and OTP format
- Verifies OTP against database
- Checks expiration and attempts
- Marks OTP as used
- Updates lastLogin timestamp
- Generates JWT token
- Returns user data and token

**5. `getProfile(req, res)`**
- Protected route (requires JWT)
- Returns user profile data
- Excludes sensitive information

### Auth Routes (`api/routes/auth.js`)

#### Route Definitions:

```javascript
POST /api/auth/register     # User registration
POST /api/auth/login        # Password login
POST /api/auth/send-otp     # Send OTP
POST /api/auth/verify-otp   # Verify OTP
GET  /api/auth/profile      # Get user profile (protected)
```

#### Validation Rules:

**Registration:**
- Username: 3-30 characters, alphanumeric + underscore
- Email: Valid email format
- Password: Minimum 6 characters

**Login:**
- Email: Valid email format
- Password: Required

**OTP:**
- Email: Valid email format
- OTP: Exactly 6 digits, numeric only

### Auth Middleware (`api/middleware/auth.js`)

**Functions:**
- `auth`: Verifies JWT token, adds user to request
- `adminAuth`: Extends auth middleware for admin-only routes

**Process:**
1. Extracts token from Authorization header
2. Verifies token signature
3. Finds user in database
4. Adds user to request object
5. Calls next middleware

## Frontend Implementation

### File Structure
```
web/src/
├── context/
│   └── AuthContext.js      # Authentication state management
├── pages/
│   └── Login.js            # Login component
├── components/
│   ├── PrivateRoute.js     # Protected route wrapper
│   └── AdminRoute.js       # Admin-only route wrapper
└── utils/
    └── api.js              # API configuration
```

### AuthContext (`web/src/context/AuthContext.js`)

**State Management:**
- `user`: Current user data
- `loading`: Loading state
- `error`: Error messages

**Methods:**
- `login(email, password)`: Password-based login
- `register(username, email, password)`: User registration
- `sendOTP(email)`: Send OTP to email
- `verifyOTP(email, otp)`: Verify OTP and login
- `logout()`: Clear session
- `loadUser()`: Load user from token

**Token Management:**
- Stores JWT in localStorage
- Sets Authorization header for API calls
- Automatically loads user on app start

### Login Component (`web/src/pages/Login.js`)

**Features:**
- Toggle between password and OTP login
- Form validation
- Loading states
- Error handling
- OTP resend functionality
- Timer for OTP resend

**State Management:**
- `loginMethod`: 'password' or 'otp'
- `formData`: Form input values
- `otpSent`: OTP delivery status
- `otpTimer`: Countdown timer

**User Experience:**
- Responsive design
- Clear error messages
- Loading indicators
- Intuitive form flow

## API Endpoints

### 1. User Registration
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64a1b2c3d4e5f6789012345",
    "username": "johndoe",
    "email": "john@example.com",
    "points": 0,
    "level": 1,
    "badges": []
  }
}
```

### 2. Password Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64a1b2c3d4e5f6789012345",
    "username": "johndoe",
    "email": "john@example.com",
    "points": 150,
    "level": 2,
    "badges": ["Beginner"],
    "isAdmin": false
  }
}
```

### 3. Send OTP
```http
POST /api/auth/send-otp
Content-Type: application/json

{
  "email": "john@example.com"
}
```

**Response (200):**
```json
{
  "message": "OTP sent successfully to your email",
  "email": "john@example.com"
}
```

### 4. Verify OTP
```http
POST /api/auth/verify-otp
Content-Type: application/json

{
  "email": "john@example.com",
  "otp": "123456"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64a1b2c3d4e5f6789012345",
    "username": "johndoe",
    "email": "john@example.com",
    "points": 150,
    "level": 2,
    "badges": ["Beginner"],
    "isAdmin": false
  }
}
```

### 5. Get Profile
```http
GET /api/auth/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200):**
```json
{
  "id": "64a1b2c3d4e5f6789012345",
  "username": "johndoe",
  "email": "john@example.com",
  "points": 150,
  "level": 2,
  "badges": ["Beginner"],
  "streak": 5,
  "lastLogin": "2024-01-15T10:30:00.000Z",
  "isAdmin": false,
  "avatar": "default",
  "totalQuizzes": 10,
  "correctAnswers": 85,
  "totalAnswers": 100
}
```

## Security Features

### Password Security
- **Hashing**: bcrypt with 10 salt rounds
- **Validation**: Minimum 6 characters
- **Storage**: Never stored in plain text

### JWT Security
- **Secret**: Environment variable (JWT_SECRET)
- **Expiration**: 7 days
- **Algorithm**: HS256
- **Storage**: localStorage (consider httpOnly cookies for production)

### OTP Security
- **Generation**: Cryptographically secure random numbers
- **Length**: 6 digits
- **Expiration**: 10 minutes
- **Attempts**: Maximum 3 attempts per OTP
- **Cleanup**: Automatic deletion of expired OTPs

### Input Validation
- **Email**: RFC 5322 compliant validation
- **Username**: Alphanumeric + underscore, 3-30 characters
- **OTP**: Exactly 6 numeric digits
- **Sanitization**: Trim whitespace, lowercase emails

### Rate Limiting
- **OTP Resend**: 60-second cooldown
- **Failed Attempts**: Limited to prevent brute force
- **Email Delivery**: Prevents spam

## Error Handling

### Backend Error Responses

**Validation Errors (400):**
```json
{
  "errors": [
    {
      "msg": "Please enter a valid email",
      "param": "email",
      "location": "body"
    }
  ]
}
```

**Authentication Errors (400/401):**
```json
{
  "message": "Invalid credentials"
}
```

**Server Errors (500):**
```json
{
  "message": "Server error"
}
```

### Frontend Error Handling

**AuthContext Error States:**
- Validation errors from backend
- Network errors
- Authentication failures
- OTP verification failures

**User-Friendly Messages:**
- Clear error descriptions
- Actionable feedback
- Loading states
- Retry mechanisms

## Database Models

### User Model (`api/models/User.js`)

**Schema:**
```javascript
{
  username: String (unique, 3-30 chars),
  email: String (unique, lowercase),
  password: String (min 6 chars, hashed),
  points: Number (default: 0),
  badges: [String] (enum values),
  level: Number (default: 1),
  streak: Number (default: 0),
  lastLogin: Date,
  isAdmin: Boolean (default: false),
  avatar: String (default: 'default'),
  totalQuizzes: Number (default: 0),
  correctAnswers: Number (default: 0),
  totalAnswers: Number (default: 0),
  timestamps: true
}
```

**Methods:**
- `comparePassword(candidatePassword)`: bcrypt comparison
- `getAccuracy()`: Calculate accuracy percentage

**Pre-save Hook:**
- Automatically hashes password before saving

### OTP Model (`api/models/OTP.js`)

**Schema:**
```javascript
{
  email: String (required, lowercase),
  otp: String (required, 6 digits),
  expiresAt: Date (10 minutes from creation),
  attempts: Number (default: 0, max: 3),
  isUsed: Boolean (default: false),
  createdAt: Date (default: now)
}
```

**Static Methods:**
- `generateOTP()`: Creates 6-digit random number
- `createOTP(email)`: Creates OTP record for email
- `verifyOTP(email, otp)`: Verifies OTP and marks as used

**Indexes:**
- TTL index on `expiresAt` for automatic cleanup

## Email Configuration

### Email Service (`api/config/email.js`)

**Transporter Configuration:**
```javascript
{
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
}
```

**OTP Email Template:**
- Professional HTML design
- Branded header with gradient
- Clear OTP display
- Security warnings
- Expiration notice
- Responsive layout

**Features:**
- HTML email template
- Error handling
- Logging for debugging
- Environment-based configuration

## Environment Variables

### Required Environment Variables

```bash
# Database
MONGODB_URI=mongodb://localhost:27017/mern-quest

# JWT
JWT_SECRET=your-super-secret-jwt-key

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=465
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=MERN Quest <your-email@gmail.com>
```

### Optional Environment Variables

```bash
# Server Configuration
PORT=5000
NODE_ENV=development

# Email (with defaults)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=465
```

## Testing Guide

### Manual Testing

**1. Registration Flow:**
1. Navigate to `/register`
2. Enter valid credentials
3. Verify successful registration
4. Check email uniqueness validation
5. Test username validation

**2. Password Login:**
1. Navigate to `/login`
2. Select "Password" method
3. Enter valid credentials
4. Verify successful login
5. Test invalid credentials
6. Check token storage

**3. OTP Login:**
1. Navigate to `/login`
2. Select "OTP Login" method
3. Enter email address
4. Check email delivery
5. Enter OTP
6. Verify successful login
7. Test OTP expiration
8. Test resend functionality

**4. Protected Routes:**
1. Access `/profile` without token
2. Verify redirect to login
3. Access with valid token
4. Test token expiration

### API Testing with Postman

**Collection Setup:**
1. Create new collection "MERN Quest Auth"
2. Set base URL: `http://localhost:5000/api/auth`
3. Add environment variables for tokens

**Test Cases:**
1. Registration with valid data
2. Registration with duplicate email
3. Login with valid credentials
4. Login with invalid credentials
5. Send OTP to valid email
6. Send OTP to invalid email
7. Verify OTP with valid code
8. Verify OTP with invalid code
9. Get profile with valid token
10. Get profile without token

## Troubleshooting

### Common Issues

**1. Email Not Sending**
- Check EMAIL_USER and EMAIL_PASS environment variables
- Verify Gmail app password is correct
- Check network connectivity
- Review email service logs

**2. OTP Verification Failing**
- Check OTP expiration (10 minutes)
- Verify OTP format (6 digits)
- Check attempt limits (max 3)
- Review database for expired OTPs

**3. JWT Token Issues**
- Verify JWT_SECRET environment variable
- Check token expiration (7 days)
- Ensure proper Authorization header format
- Review token storage in localStorage

**4. Database Connection**
- Verify MONGODB_URI environment variable
- Check MongoDB service status
- Review connection logs
- Test database connectivity

**5. Frontend Authentication**
- Check AuthContext provider setup
- Verify API base URL configuration
- Review browser console for errors
- Check localStorage for token

### Debugging Steps

**1. Backend Debugging:**
```bash
# Enable detailed logging
DEBUG=* npm start

# Check environment variables
console.log(process.env.JWT_SECRET)
console.log(process.env.EMAIL_USER)
```

**2. Frontend Debugging:**
```javascript
// Check AuthContext state
console.log('User:', user)
console.log('Loading:', loading)
console.log('Error:', error)

// Check localStorage
console.log('Token:', localStorage.getItem('token'))
```

**3. Database Debugging:**
```javascript
// Check OTP collection
db.otps.find().sort({createdAt: -1}).limit(5)

// Check user collection
db.users.findOne({email: 'test@example.com'})
```

### Performance Optimization

**1. Database Indexes:**
- Email field in users collection
- Email field in OTPs collection
- TTL index on OTP expiration

**2. Caching:**
- Consider Redis for session storage
- Cache user profiles
- Implement rate limiting

**3. Security Enhancements:**
- Implement refresh tokens
- Add CSRF protection
- Use httpOnly cookies
- Add request rate limiting

## Conclusion

This authentication system provides a robust, secure, and user-friendly solution for the MERN Quest application. It supports both traditional password-based authentication and modern OTP-based authentication, with comprehensive security measures and error handling.

The system is designed to be scalable, maintainable, and follows industry best practices for web application security. Regular security audits and updates are recommended to maintain the highest level of protection.

For production deployment, consider implementing additional security measures such as:
- Rate limiting middleware
- Request logging and monitoring
- Security headers
- Regular security updates
- Penetration testing
