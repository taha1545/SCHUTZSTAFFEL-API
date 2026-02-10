# Schutzstaffel - Student Task Management & Gamification Platform

A comprehensive Node.js/Express API for managing students, teachers, tasks, goals, and badges with gamification features.

## 📋 Project Description

Schutzstaffel is an educational platform designed to help teachers manage student learning through task assignment, goal tracking, and gamification. Students can complete tasks, earn badges, and track their progress. Teachers can monitor student progress and assign customized learning objectives.

### Key Features:
- **Student & Teacher Authentication**: Secure signup and login with JWT
- **Google OAuth 2.0**: Third-party authentication integration
- **Task Management**: Create, assign, and track tasks
- **Goal Tracking**: Set and monitor learning goals
- **Gamification System**: Badge system to reward student achievements
- **Progress Monitoring**: Real-time student progress tracking
- **User Management**: Admin controls for user management
- **Responsive API**: RESTful API with proper error handling and validation
- **Real Time Changes**: socket io  for tracking real time changes
---

## 📦 Packages & Dependencies

### Core Dependencies:
- **express** (^4.21.2) - Web framework
- **sequelize** (^6.37.7) - ORM for database
- **jsonwebtoken** (^9.0.2) - JWT authentication
- **bcrypt** (^6.0.0) - Password hashing
- **passport** (^0.7.0) - Authentication middleware
- **passport-google-oauth20** (^2.0.0) - Google OAuth strategy
- **express-validator** (^7.2.1) - Input validation
- **multer** (^2.0.2) - File upload handling
- **nodemailer** (^7.0.5) - Email service
- **express-rate-limit** (^8.0.1) - Rate limiting
- **helmet** (^8.1.0) - Security headers
- **cors** (^2.8.5) - Cross-origin requests
- **dotenv** (^17.2.1) - Environment variables
- **dayjs** (^1.11.13) - Date manipulation
- **morgan** (^1.10.1) - HTTP request logger
- **express-session** (^1.18.2) - Session management

### Dev Dependencies:
- **nodemon** (^3.1.10) - Development auto-reload
- **prettier** (^3.6.2) - Code formatter
- **sequelize-cli** (^6.6.3) - Database migration tools

---

## 🚀 Features

### 1. **Authentication System**
   - Student signup and login
   - Teacher signup and login
   - Google OAuth 2.0 integration
   - JWT token-based authentication
   - Password encryption with bcrypt

### 2. **User Management**
   - User profile management
   - Role-based access control (Admin, Teacher, Student)
   - User search by name or email
   - User deletion by admin

### 3. **Task & Goal Management**
   - Create and manage learning goals
   - Create and assign tasks to goals
   - Task progress tracking
   - Multiple tasks per goal
   - Task assignment to students

### 4. **Gamification**
   - Badge creation and management
   - Award badges to students
   - Track student badges
   - Visual rewards system

### 5. **Progress Tracking**
   - Student dashboard with overview
   - Teacher progress monitoring
   - Student progress per teacher
   - Task completion tracking

### 6. **Additional Features**
   - Contact form submission
   - Email notifications (OTP, Welcome, Verification)
   - File upload support (badge images)
   - Data validation
   - Error handling
   - Rate limiting
   - Security headers

---


## 🗄️ Database Models

- **User**: Student user profile
- **Teacher**: Teacher profile with subject
- **Goal**: Learning objectives set by teachers
- **Task**: Individual tasks within goals
- **UserTask**: Task assignments to users
- **Badge**: Achievement badges
- **UserBadge**: Badge awards to users
- **Contact**: Contact form submissions
- **TeacherStudents**: Many-to-many relationship between teachers and students

---

## 📝 Environment Variables

Required `.env` variables:
```env
APP_NAME=schutzstaffel
APP_PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mytestdb
DB_USER=myuser
DB_PASSWORD=mypassword

# JWT
JWT_SECRET=your_secret_key
JWT_LIFETIME=30d

# Admin
ADMIN_EMAIL=admin@gmail.com
ADMIN_PASSWORD=admin123

# Email
MAIL_HOST=smtp.gmail.com
MAIL_PORT=465
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_app_password

# Google OAuth
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/google/callback
SESSION_SECRET=your_session_secret

# Frontend
FRONT_SIDE_URL=http://localhost:3000
FRONT_URL_CALLBACK=http://localhost:3000/
```

### Steps:

```bash
# Clone the repository
git clone <repository-url>

# Install dependencies
npm install

#
docker-compose up -d

# u need to add  .env file
cp .env.example .env

# Run database migrations
npm run migrate

# Start development server
npm run start:dev
```

**Version**: 1.0.0  
**Last Updated**: 10 February 2026
