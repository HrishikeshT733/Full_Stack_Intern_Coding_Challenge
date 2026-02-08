**Store Rating Platform - FullStack Intern Coding Challenge**


**📋 Project Overview**
This is a full-stack web application that allows users to submit ratings for stores registered on the platform. The application features a role-based access control system with three distinct user roles, each with specific functionalities.

User Roles:
System Administrator - Manages users and stores, views platform analytics

Normal User - Browses stores and submits ratings

Store Owner - Manages their store's ratings and viewer data

🚀 Tech Stack
Backend:
Framework: NestJS (Node.js)

Database: PostgreSQL (or MySQL as alternative)

ORM: TypeORM/Prisma (recommended with NestJS)

Authentication: JWT (JSON Web Tokens) with role-based guards

Frontend:
Framework: React.js with TypeScript

State Management: Context API or Redux Toolkit

UI Library: Material-UI or Ant Design

Routing: React Router v6

🏗️ System Architecture
Database Schema:
text
users
├── id (PK)
├── name
├── email (unique)
├── password (hashed)
├── address
├── role (enum: 'admin', 'user', 'store_owner')
├── created_at
└── updated_at

stores
├── id (PK)
├── name
├── email
├── address
├── owner_id (FK → users.id)
├── created_at
└── updated_at

ratings
├── id (PK)
├── store_id (FK → stores.id)
├── user_id (FK → users.id)
├── rating (1-5)
├── created_at
└── updated_at
🔐 Authentication & Authorization
Single login system for all user types

JWT-based authentication with refresh tokens

Role-based route guards (NestJS Guards)

Password encryption using bcrypt

📱 Features by User Role
1. System Administrator
✅ Add new stores, normal users, and admin users

✅ Dashboard with platform analytics:

Total number of users

Total number of stores

Total number of submitted ratings

✅ CRUD operations for users with details:

Name, Email, Password, Address, Role

✅ View store list with:

Name, Email, Address, Average Rating

✅ View user list with:

Name, Email, Address, Role (Store Owner ratings included)

✅ Advanced filtering on all listings:

Filter by Name, Email, Address, Role

✅ Sorting on all table columns (ascending/descending)

✅ Secure logout functionality

2. Normal User
✅ Sign up with form validation:

Name (20-60 chars)

Email (valid email format)

Address (max 400 chars)

Password (8-16 chars, uppercase + special char)

✅ Login to platform

✅ Update password after login

✅ Browse all registered stores

✅ Search stores by Name and Address

✅ Store listings display:

Store Name, Address, Overall Rating

User's submitted rating (if any)

Option to submit new rating (1-5)

Option to modify existing rating

✅ Secure logout functionality

3. Store Owner
✅ Login to platform

✅ Update password after login

✅ Dashboard functionalities:

View list of users who rated their store

See average rating of their store

✅ Secure logout functionality

⚙️ Form Validations
Backend (NestJS DTOs):
typescript
// User DTO Example
export class CreateUserDto {
  @IsString()
  @MinLength(20)
  @MaxLength(60)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(16)
  @Matches(/(?=.*[A-Z])(?=.*[!@#$%^&*])/)
  password: string;

  @IsString()
  @MaxLength(400)
  address: string;
}
Frontend (React Form Validation):
Real-time validation using Formik + Yup

Display appropriate error messages

Disable submit until valid

🗂️ Project Structure
text
backend/
├── src/
│   ├── auth/          # Authentication module
│   ├── users/         # User CRUD operations
│   ├── stores/        # Store management
│   ├── ratings/       # Rating operations
│   ├── common/        # Guards, filters, decorators
│   └── app.module.ts  # Root module
├── .env               # Environment variables
├── package.json
└── README.md

frontend/
├── src/
│   ├── components/    # Reusable components
│   ├── pages/         # Role-specific pages
│   ├── hooks/         # Custom React hooks
│   ├── context/       # Auth & global state
│   ├── services/      # API service calls
│   ├── utils/         # Helper functions
│   └── App.tsx        # Main App component
├── package.json
└── README.md
🚦 Setup Instructions
Backend (NestJS) Setup:
bash
# Clone repository
git clone <repository-url>
cd backend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your database credentials

# Run database migrations
npm run migration:run

# Start development server
npm run start:dev
Frontend (React) Setup:
bash
cd frontend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your API URL

# Start development server
npm start
Database Setup:
sql
-- Example PostgreSQL setup
CREATE DATABASE store_rating_db;
CREATE USER store_user WITH ENCRYPTED PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE store_rating_db TO store_user;
📊 API Endpoints (Key Examples)
Authentication:
POST /auth/register - User registration

POST /auth/login - User login

POST /auth/logout - User logout

POST /auth/change-password - Password update

Users:
GET /users - Get all users (Admin only)

POST /users - Create user (Admin only)

GET /users/:id - Get user details

PUT /users/:id - Update user

Stores:
GET /stores - Get all stores

POST /stores - Create store (Admin only)

GET /stores/:id - Get store details

GET /stores/search - Search stores

Ratings:
POST /ratings - Submit rating

PUT /ratings/:id - Update rating

GET /ratings/store/:storeId - Get ratings for store

🔧 Development Practices
Backend (NestJS Best Practices):
Modular architecture

Dependency injection

Repository pattern with TypeORM

Global exception filters

Request validation pipes

Environment configuration

Logging with Winston

Frontend (React Best Practices):
Component-based architecture

Custom hooks for reusable logic

Context API for state management

Responsive design

Error boundaries

Loading states

Optimistic updates

Database Best Practices:
Proper indexing for searchable fields

Foreign key constraints

Cascade delete rules

Timestamp columns (created_at, updated_at)

Soft deletes where applicable

🧪 Testing
Backend Tests:
Unit tests with Jest

Integration tests

E2E tests with Supertest

Frontend Tests:
Component tests with React Testing Library

Integration tests

Mock service workers for API mocking

📦 Deployment
Backend Deployment:
bash
# Build for production
npm run build

# Start production server
npm run start:prod
Frontend Deployment:
bash
# Build production bundle
npm run build

# Serve with Nginx or deploy to Vercel/Netlify
📝 Additional Notes
All tables support sorting (ascending/descending) on key fields

Pagination implemented for large datasets

Rate limiting on authentication endpoints

CORS configured for frontend-backend communication

Secure password storage with bcrypt hashing

Input sanitization to prevent XSS attacks

SQL injection prevention with parameterized queries

🐛 Troubleshooting
Common Issues:
Database connection failed

Check .env variables

Verify PostgreSQL service is running

CORS errors

Ensure backend CORS is configured for frontend origin

Check if requests include proper headers

Authentication issues

Verify JWT secret in .env

Check token expiration

📄 License
This project is developed as part of a coding challenge assessment.

Submission Details:



Developer: Hrishikesh Tholbare
Contact: hrishikeshtholbare@gmail.com
Submission Date: 07/02/26

