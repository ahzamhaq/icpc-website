# 🏆 ICPC Portal

A full-stack web application for the ACM ICPC USICT Student Chapter. A comprehensive platform for competitive programming activities including contests, task assignments, gamification, workshops/sessions, and a blog system.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Quick Start](#-quick-start)
- [Environment Variables](#-environment-variables)
- [Running the Project](#-running-the-project)
- [Available Scripts](#-available-scripts)
- [API Documentation](#-api-documentation)
- [Frontend Pages](#-frontend-pages)
- [Database Schema](#-database-schema)
- [Security Features](#-security-features)
- [Default Admin Credentials](#-default-admin-credentials)
- [Testing](#-testing)
- [Docker Deployment](#-docker-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

ICPC Portal is designed to streamline competitive programming activities for student chapters. It provides:

- **For Students**: Practice contests, task assignments, point tracking, leaderboards
- **For Admins**: User management, contest creation, session scheduling, content moderation
- **For Alumni**: Network connection and mentorship opportunities

---

✨ Features
Feature	Description
🔐 Google OAuth	Sign in with Google, admin approval workflow
🏅 Contest System	Real-time contests with code execution via Judge0
✅ Task Assignments	DSA tasks with submission links, verification, points
📊 Gamification	Points, leaderboards (all-time, monthly, semester), badges
📅 Session Management	Workshop scheduling, registration, meeting links
📢 Announcements	Pinned announcements with CRUD operations
📝 Blog System	Rich-text posts (Tiptap) with admin approval workflow
🤖 AI Assistant	Groq-powered coding assistant (LLaMA 3) for problem-solving help
📧 Email Notifications	Automatic Gmail alerts sent to users when new tasks are assigned
🎓 Alumni Network	Browse and connect with alumni profiles
👥 User Roles	Student, Admin, Alumni with role-based access
🌗 Dark/Light Mode	Full theme toggle with system preference support
📱 Responsive Design	Mobile-friendly dashboard with collapsible sidebar
💾 Code Persistence	Editor state saved during contests
---

## 🛠️ Tech Stack

### Backend

| Technology | Purpose |
|------------|---------|
| Node.js 18+ | Runtime environment |
| Express.js | Web framework |
| TypeScript | Type safety |
| PostgreSQL 15+ | Database |
| Prisma ORM | Database access & migrations |
| Google OAuth + JWT | Authentication (Passport.js) |
| Judge0 CE | Code execution engine |
| Groq AI (LLaMA 3) | AI chatbot |
| Jest + Supertest | Testing |
| Docker | Containerization |
| Swagger | API documentation |
| Pino | Logging |

### Frontend

| Technology | Purpose |
|------------|---------|
| Next.js 16 | React framework (App Router) |
| React 19 | UI library |
| TypeScript | Type safety |
| Zustand | State management |
| Tailwind CSS 4 | Styling |
| shadcn/ui + Radix | UI components |
| CodeMirror | Code editor |
| Tiptap | Rich-text blog editor |
| Framer Motion | Animations |
| next-themes | Dark/light mode |
| Axios | HTTP client |
| Zod | Validation |

---

## 📁 Project Structure

```
ICPC-website/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   └── migrations/        # Migration files
│   ├── src/
│   │   ├── config/
│   │   │   └── env.ts         # Environment configuration
│   │   ├── controllers/       # Request handlers
│   │   │   ├── authController.ts
│   │   │   ├── contestController.ts
│   │   │   ├── taskController.ts
│   │   │   ├── sessionController.ts
│   │   │   ├── announcementController.ts
│   │   │   ├── blogController.ts
│   │   │   ├── profileController.ts
│   │   │   ├── judgeController.ts
│   │   │   ├── gamificationController.ts
│   │   │   ├── alumniController.ts
│   │   │   └── aiController.ts
│   │   ├── middleware/
│   │   │   ├── auth.ts        # JWT authentication
│   │   │   ├── validate.ts    # Request validation
│   │   │   ├── sanitize.ts    # Input sanitization
│   │   │   └── requestId.ts   # Request ID tracking
│   │   ├── models/
│   │   │   └── prismaClient.ts
│   │   ├── routes/            # API route definitions
│   │   ├── services/          # Business logic
│   │   ├── utils/
│   │   │   ├── AppError.ts
│   │   │   ├── errorHandler.ts
│   │   │   ├── logger.ts
│   │   │   └── response.ts
│   │   ├── index.ts           # App setup
│   │   └── testApp.ts         # Test app setup
│   ├── tests/
│   │   ├── unit/
│   │   └── integration/
│   ├── .env.example
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── docker-compose.prod.yml
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── app/
│   │   ├── admin/             # Admin dashboard
│   │   ├── alumni/            # Alumni network
│   │   ├── announcements/     # Announcements page
│   │   ├── auth/              # OAuth callback & pending approval
│   │   ├── blog/              # Blog (list, write, edit, my posts)
│   │   ├── contests/
│   │   │   ├── [id]/          # Contest arena
│   │   │   └── page.tsx       # Contest list
│   │   ├── dashboard/         # Main dashboard
│   │   ├── login/             # Login page (Google Sign-In)
│   │   ├── profile/           # Profile settings
│   │   ├── register/          # Registration
│   │   ├── sessions/          # Sessions list & details
│   │   ├── tasks/             # Tasks list & details
│   │   ├── layout.tsx
│   │   ├── page.tsx           # Landing page
│   │   └── globals.css        # Theme variables
│   ├── components/
│   │   ├── ui/                # shadcn/ui components
│   │   ├── app-sidebar.tsx    # Dashboard sidebar
│   │   ├── chat-widget.tsx    # AI chatbot widget
│   │   ├── dashboard-layout.tsx # Responsive layout
│   │   ├── GoogleSignInButton.tsx
│   │   ├── mode-toggle.tsx    # Dark/light toggle
│   │   ├── rich-text-editor.tsx # Tiptap blog editor
│   │   └── theme-provider.tsx
│   ├── lib/
│   │   ├── hooks/
│   │   ├── adminService.ts
│   │   ├── alumniService.ts
│   │   ├── axios.ts
│   │   ├── blogService.ts
│   │   ├── chatService.ts
│   │   ├── contestService.ts
│   │   ├── profileService.ts
│   │   ├── sessionService.ts
│   │   ├── taskService.ts
│   │   └── utils.ts
│   ├── store/
│   │   ├── useAuthStore.ts
│   │   ├── useSessionStore.ts
│   │   └── useTaskStore.ts
│   ├── package.json
│   └── tsconfig.json
│
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have:

- **Node.js** 18 or higher
- **PostgreSQL** 15 or higher
- **npm** or **yarn**
- **Git**
- (Optional) **Docker** & **Docker Compose**

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd ICPC-website
```

### Step 2: Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Step 3: Setup Environment Variables

```bash
cd backend
cp .env.example .env
```

Edit `.env` with your configuration (see [Environment Variables](#-environment-variables))

### Step 4: Setup Database

```bash
cd backend

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed admin user
npm run seed
```

### Step 5: Start the Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Step 6: Access the Application

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:5000/api |
| API Docs (Swagger) | http://localhost:5000/api/docs/ui |

---

## ⚙️ Environment Variables

### Backend Required Variables

| Variable | Required | Default | Description |
|----------|:--------:|---------|-------------|
| `DATABASE_URL` | ✅ | - | PostgreSQL connection string |
| `JWT_SECRET` | ✅ | - | JWT signing secret (min 32 characters) |
| `PORT` | ❌ | `5000` | Server port |
| `NODE_ENV` | ❌ | `development` | Environment mode |

### Backend Optional Variables

| Variable | Required | Default | Description |
|----------|:--------:|---------|-------------|
| `JUDGE0_URL` | ❌ | - | Judge0 API URL |
| `JUDGE0_KEY` | ❌ | - | Judge0 RapidAPI key |
| `JUDGE0_KEY_HEADER` | ❌ | `X-RapidAPI-Key` | Judge0 API key header |
| `JUDGE0_TIMEOUT_MS` | ❌ | `15000` | Judge0 timeout in ms |
| `GROQ_API_KEY` | ❌ | - | Groq API key for AI chatbot |
| `GOOGLE_CLIENT_ID` | ❌ | - | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | ❌ | - | Google OAuth client secret |
| `LOG_LEVEL` | ❌ | `info` | Logging level (debug, info, warn, error) |
| `LOG_TO_FILE` | ❌ | `false` | Enable file logging |

### Example `.env` File

```env
# Database (Required)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/icpc_portal"

# Authentication (Required - minimum 32 characters)
JWT_SECRET="your-super-secret-key-minimum-32-characters-long"

# Server
PORT=5000
NODE_ENV=development

# Judge0 (Optional - for code execution)
JUDGE0_URL="https://judge0-ce.p.rapidapi.com"
JUDGE0_KEY="your-rapidapi-key"

# Groq AI (Optional - for AI chatbot)
GROQ_API_KEY="gsk_xxxx"

# Google OAuth (Required for login)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### Test Environment (`.env.test`)

```env
DATABASE_URL_TEST="postgresql://postgres:postgres@localhost:5432/icpc_portal_test"
JWT_SECRET="test-secret-key-minimum-32-characters"
NODE_ENV=test
```

---

## 🏃 Running the Project

### Development Mode

```bash
# Backend (http://localhost:5000)
cd backend
npm run dev

# Frontend (http://localhost:3000)
cd frontend
npm run dev
```

### Production Build

```bash
# Backend
cd backend
npm run build
npm start

# Frontend
cd frontend
npm run build
npm start
```

### Using Docker

```bash
# Start PostgreSQL only (development)
cd backend
docker-compose up -d

# Start full stack (production)
cd backend
docker-compose -f docker-compose.prod.yml up -d
```

---

## 📜 Available Scripts

### Backend Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `npm run dev` | Start development server with hot reload |
| `build` | `npm run build` | Compile TypeScript to JavaScript |
| `start` | `npm start` | Run production build |
| `seed` | `npm run seed` | Seed database with admin user |
| `test` | `npm test` | Run all tests |
| `test:unit` | `npm run test:unit` | Run unit tests only |
| `test:integration` | `npm run test:integration` | Run integration tests |
| `prisma:generate` | `npm run prisma:generate` | Generate Prisma client |
| `prisma:migrate` | `npm run prisma:migrate` | Run database migrations |

### Frontend Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `npm run dev` | Start Next.js development server |
| `build` | `npm run build` | Create production build |
| `start` | `npm start` | Start production server |
| `lint` | `npm run lint` | Run ESLint |

---

## 🔌 API Documentation

### Base URL

```
http://localhost:5000/api
```

### Authentication

Most endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Response Format

**Success Response:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description"
}
```

---

### 🏥 Health Endpoints

#### `GET /`

Welcome message

- **Auth:** None
- **Response:**
```json
{
  "message": "Welcome to ICPC Portal API"
}
```

---

#### `GET /health`

Health check

- **Auth:** None
- **Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-01-11T10:00:00.000Z"
}
```

---

#### `GET /ready`

Readiness check (tests database connection)

- **Auth:** None
- **Response:**
```json
{
  "status": "ready",
  "database": "connected"
}
```

---

### 🔐 Auth Endpoints

#### `POST /auth/register`

Register a new user

- **Auth:** None
- **Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "role": "STUDENT"
}
```

| Field | Type | Required | Description |
|-------|------|:--------:|-------------|
| email | string | ✅ | Valid email address |
| password | string | ✅ | Minimum 6 characters |
| role | string | ❌ | `STUDENT` (default) or `ALUMNI` |

- **Response:**
```json
{
  "success": true,
  "data": {
    "id": "clx1234567890",
    "email": "user@example.com"
  }
}
```

---

#### `POST /auth/login`

Login and get JWT token

- **Auth:** None
- **Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

- **Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "clx1234567890",
      "email": "user@example.com",
      "role": "STUDENT",
      "approved": true
    }
  }
}
```

---

#### `POST /auth/approve/:id`

Approve a pending user

- **Auth:** Admin
- **Parameters:** `id` - User ID
- **Response:**
```json
{
  "success": true,
  "data": {
    "id": "clx1234567890",
    "approved": true
  }
}
```

---

#### `GET /auth/users`

List all users

- **Auth:** Admin
- **Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "clx1234567890",
      "email": "user@example.com",
      "role": "STUDENT",
      "approved": true,
      "createdAt": "2026-01-11T10:00:00.000Z"
    }
  ]
}
```

---

#### `GET /auth/users/pending`

List pending (unapproved) users

- **Auth:** Admin
- **Response:** Same as `/auth/users`

---

#### `PUT /auth/users/:id/role`

Update user role

- **Auth:** Admin
- **Parameters:** `id` - User ID
- **Request Body:**
```json
{
  "role": "ADMIN"
}
```

| Role | Description |
|------|-------------|
| `STUDENT` | Regular student user |
| `ADMIN` | Administrator with full access |
| `ALUMNI` | Alumni member |

- **Response:**
```json
{
  "success": true,
  "data": {
    "id": "clx1234567890",
    "email": "user@example.com",
    "role": "ADMIN",
    "approved": true
  }
}
```

---

#### `DELETE /auth/users/:id`

Delete a user (cascades all related data)

- **Auth:** Admin
- **Parameters:** `id` - User ID
- **Restrictions:**
  - Cannot delete your own account
  - Cannot delete admin users
- **Response:**
```json
{
  "success": true,
  "data": {
    "message": "User user@example.com deleted successfully"
  }
}
```

---

### 👤 Profile Endpoints

#### `GET /profile`

Get current user's profile

- **Auth:** User
- **Response:**
```json
{
  "success": true,
  "data": {
    "id": "clx1234567890",
    "userId": "clx0987654321",
    "name": "John Doe",
    "branch": "CSE",
    "year": 2,
    "contact": "9876543210",
    "handles": {
      "codeforces": "john_cf",
      "leetcode": "johndoe",
      "codechef": "john_cc"
    }
  }
}
```

---

#### `POST /profile`

Create or update profile

- **Auth:** User
- **Request Body:**
```json
{
  "name": "John Doe",
  "branch": "CSE",
  "year": 2,
  "contact": "9876543210",
  "handles": {
    "codeforces": "john_cf",
    "leetcode": "johndoe",
    "codechef": "john_cc"
  }
}
```

| Field | Type | Required | Description |
|-------|------|:--------:|-------------|
| name | string | ✅ | Full name |
| branch | string | ✅ | Department/Branch |
| year | number | ✅ | Year of study (1-4) |
| contact | string | ✅ | Phone number |
| handles | object | ❌ | CP platform handles |

---

### ✅ Task Endpoints

#### `GET /tasks`

List all tasks

- **Auth:** Optional (filters by assignment if authenticated)
- **Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "clx1234567890",
      "title": "Solve 5 DP Problems",
      "description": "Complete any 5 dynamic programming problems from LeetCode",
      "points": 100,
      "dueDate": "2026-01-15T00:00:00.000Z",
      "assignedTo": null,
      "createdAt": "2026-01-10T00:00:00.000Z",
      "userSubmissions": []
    }
  ]
}
```

---

#### `POST /tasks`

Create a new task

- **Auth:** Admin
- **Request Body:**
```json
{
  "title": "Solve 5 DP Problems",
  "description": "Complete any 5 DP problems from LeetCode",
  "points": 100,
  "dueDate": "2026-01-15T00:00:00.000Z",
  "assignedTo": ["userId1", "userId2"]
}
```

| Field | Type | Required | Description |
|-------|------|:--------:|-------------|
| title | string | ✅ | Task title |
| description | string | ❌ | Task description |
| points | number | ✅ | Points awarded on completion |
| dueDate | string | ❌ | ISO date string deadline |
| assignedTo | array | ❌ | User IDs (null = open to all) |

---

#### `GET /tasks/:id`

Get a single task

- **Auth:** User
- **Parameters:** `id` - Task ID

---

#### `PUT /tasks/:id`

Update a task

- **Auth:** Admin
- **Parameters:** `id` - Task ID
- **Request Body:** Same as POST (partial update supported)

---

#### `DELETE /tasks/:id`

Delete a task (cascades submissions)

- **Auth:** Admin
- **Parameters:** `id` - Task ID

---

#### `POST /tasks/:taskId/submit`

Submit a task solution

- **Auth:** User
- **Parameters:** `taskId` - Task ID
- **Request Body:**
```json
{
  "link": "https://leetcode.com/submissions/detail/123456789/"
}
```

- **Response:**
```json
{
  "success": true,
  "data": {
    "id": "clx1234567890",
    "taskId": "clx0987654321",
    "userId": "clx1111111111",
    "link": "https://leetcode.com/submissions/detail/123456789/",
    "status": "PENDING",
    "points": 0,
    "createdAt": "2026-01-11T10:00:00.000Z"
  }
}
```

---

#### `GET /tasks/:id/submissions`

Get all submissions for a task

- **Auth:** Admin
- **Parameters:** `id` - Task ID
- **Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "clx1234567890",
      "userId": "clx1111111111",
      "link": "https://leetcode.com/submissions/...",
      "status": "PENDING",
      "points": 0,
      "createdAt": "2026-01-11T10:00:00.000Z",
      "user": {
        "email": "user@example.com"
      }
    }
  ]
}
```

---

#### `GET /tasks/my-submissions`

Get current user's task submissions

- **Auth:** User

---

#### `GET /tasks/my-points`

Get current user's total points

- **Auth:** User
- **Response:**
```json
{
  "success": true,
  "data": {
    "points": 500
  }
}
```

---

#### `POST /tasks/submissions/:subId/verify`

Verify a submission and award points

- **Auth:** Admin
- **Parameters:** `subId` - Submission ID
- **Request Body:**
```json
{
  "points": 100
}
```

---

#### `POST /tasks/submissions/:subId/reject`

Reject a submission

- **Auth:** Admin
- **Parameters:** `subId` - Submission ID

---

### 🏆 Contest Endpoints

#### `GET /contests`

List all contests

- **Auth:** None
- **Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "clx1234567890",
      "title": "Weekly Contest #1",
      "timer": 120,
      "startTime": "2026-01-15T10:00:00.000Z",
      "problems": [...],
      "createdAt": "2026-01-10T00:00:00.000Z"
    }
  ]
}
```

---

#### `POST /contests`

Create a new contest

- **Auth:** Admin
- **Request Body:**
```json
{
  "title": "Weekly Contest #1",
  "timer": 120,
  "startTime": "2026-01-15T10:00:00.000Z"
}
```

| Field | Type | Required | Description |
|-------|------|:--------:|-------------|
| title | string | ✅ | Contest title |
| timer | number | ✅ | Duration in minutes |
| startTime | string | ✅ | ISO date string for start time |

---

#### `GET /contests/:id`

Get contest details

- **Auth:** None
- **Parameters:** `id` - Contest ID

---

#### `DELETE /contests/:id`

Delete a contest (cascades submissions)

- **Auth:** Admin
- **Parameters:** `id` - Contest ID

---

#### `POST /contests/:id/problems`

Add a problem to a contest

- **Auth:** Admin
- **Parameters:** `id` - Contest ID
- **Request Body:**
```json
{
  "name": "Two Sum",
  "description": "Given an array of integers nums and an integer target...",
  "difficulty": "Easy",
  "tags": ["Array", "Hash Table"],
  "constraints": {
    "timeLimit": 1,
    "memoryLimit": 256
  },
  "sampleTestCases": [
    {
      "input": "4\n2 7 11 15\n9",
      "output": "0 1"
    }
  ],
  "hiddenTestCases": [
    {
      "input": "...",
      "output": "..."
    }
  ]
}
```

| Field | Type | Required | Description |
|-------|------|:--------:|-------------|
| name | string | ✅ | Problem name |
| description | string | ❌ | Problem statement |
| difficulty | string | ❌ | `Easy`, `Medium`, `Hard` |
| tags | array | ❌ | Problem tags |
| constraints | object | ❌ | Time/memory limits |
| sampleTestCases | array | ✅ | Visible test cases |
| hiddenTestCases | array | ❌ | Hidden test cases for judging |

---

#### `POST /contests/:id/submit`

Submit a solution

- **Auth:** User
- **Parameters:** `id` - Contest ID
- **Request Body:**
```json
{
  "problemIdx": 0,
  "code": "#include<bits/stdc++.h>\nusing namespace std;\nint main() { ... }",
  "language": "cpp"
}
```

| Field | Type | Required | Description |
|-------|------|:--------:|-------------|
| problemIdx | number | ✅ | Problem index (0-based) |
| code | string | ✅ | Source code |
| language | string | ✅ | `cpp`, `python`, `java`, `javascript` |

- **Response:**
```json
{
  "success": true,
  "data": {
    "submissionId": "clx1234567890",
    "tokens": ["token1", "token2", "token3"]
  }
}
```

---

#### `POST /contests/:id/run`

Run code against sample tests (without submission)

- **Auth:** User
- **Parameters:** `id` - Contest ID
- **Request Body:** Same as submit

---

#### `GET /contests/:id/submissions`

Get all submissions for a contest

- **Auth:** Admin
- **Parameters:** `id` - Contest ID

---

#### `GET /contests/:id/submissions/me`

Get current user's submissions for a contest

- **Auth:** User
- **Parameters:** `id` - Contest ID

---

#### `GET /contests/my-submissions`

Get all contest submissions by current user

- **Auth:** User

---

### ⚖️ Judge Endpoints

#### `POST /judge/submit`

Submit code to Judge0 for execution

- **Auth:** User
- **Request Body:**
```json
{
  "code": "print('Hello, World!')",
  "language": "python",
  "input": "test input"
}
```

- **Response:**
```json
{
  "success": true,
  "data": {
    "token": "abc123-def456-ghi789"
  }
}
```

---

#### `GET /judge/result/:token`

Get execution result

- **Auth:** User
- **Parameters:** `token` - Judge0 submission token
- **Response:**
```json
{
  "success": true,
  "data": {
    "status": {
      "id": 3,
      "description": "Accepted"
    },
    "stdout": "Hello, World!\n",
    "stderr": null,
    "time": "0.01",
    "memory": 1234
  }
}
```

**Status IDs:**
| ID | Description |
|----|-------------|
| 1 | In Queue |
| 2 | Processing |
| 3 | Accepted |
| 4 | Wrong Answer |
| 5 | Time Limit Exceeded |
| 6 | Compilation Error |
| 7-14 | Various Runtime Errors |

---

### 📅 Session Endpoints

#### `GET /sessions`

List all sessions

- **Auth:** None
- **Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "clx1234567890",
      "title": "Intro to Dynamic Programming",
      "details": "Learn DP basics with examples",
      "date": "2026-01-20T15:00:00.000Z",
      "meetLink": "https://meet.google.com/abc-defg-hij",
      "attendees": ["userId1", "userId2"],
      "createdAt": "2026-01-10T00:00:00.000Z"
    }
  ]
}
```

---

#### `POST /sessions`

Create a new session

- **Auth:** Admin
- **Request Body:**
```json
{
  "title": "Intro to Dynamic Programming",
  "details": "Learn DP basics with examples",
  "date": "2026-01-20T15:00:00.000Z",
  "meetLink": "https://meet.google.com/abc-defg-hij"
}
```

| Field | Type | Required | Description |
|-------|------|:--------:|-------------|
| title | string | ✅ | Session title |
| details | string | ❌ | Session description |
| date | string | ❌ | ISO date string |
| meetLink | string | ✅ | Video call URL (Google Meet, Zoom, etc.) |

---

#### `PUT /sessions/:id`

Update a session

- **Auth:** Admin
- **Parameters:** `id` - Session ID

---

#### `DELETE /sessions/:id`

Delete a session

- **Auth:** Admin
- **Parameters:** `id` - Session ID

---

#### `POST /sessions/:id/register`

Register for a session

- **Auth:** User
- **Parameters:** `id` - Session ID

---

### 📢 Announcement Endpoints

#### `GET /announcements`

List all announcements (pinned first)

- **Auth:** None
- **Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "clx1234567890",
      "title": "Contest Tomorrow!",
      "content": "Don't forget to register for tomorrow's weekly contest.",
      "pinned": true,
      "createdAt": "2026-01-10T00:00:00.000Z",
      "updatedAt": "2026-01-10T00:00:00.000Z"
    }
  ]
}
```

---

#### `POST /announcements`

Create an announcement

- **Auth:** Admin
- **Request Body:**
```json
{
  "title": "Contest Tomorrow!",
  "content": "Don't forget to register for tomorrow's weekly contest.",
  "pinned": true
}
```

| Field | Type | Required | Description |
|-------|------|:--------:|-------------|
| title | string | ✅ | Announcement title |
| content | string | ✅ | Announcement content |
| pinned | boolean | ❌ | Pin to top (default: false) |

---

#### `PUT /announcements/:id`

Update an announcement

- **Auth:** Admin
- **Parameters:** `id` - Announcement ID

---

#### `DELETE /announcements/:id`

Delete an announcement

- **Auth:** Admin
- **Parameters:** `id` - Announcement ID

---

### 📝 Blog Endpoints

#### `POST /blogs`

Create a blog post

- **Auth:** User
- **Request Body:**
```json
{
  "title": "My Competitive Programming Journey",
  "content": "I started competitive programming 2 years ago..."
}
```

---

#### `GET /blogs/pending`

List pending (unapproved) blogs

- **Auth:** Admin

---

#### `POST /blogs/:id/approve`

Approve a blog post

- **Auth:** Admin
- **Parameters:** `id` - Blog ID

---

#### `POST /blogs/:id/comments`

Add a comment to a blog

- **Auth:** User
- **Parameters:** `id` - Blog ID
- **Request Body:**
```json
{
  "content": "Great post! Very helpful."
}
```

---

### 🎮 Gamification Endpoints

#### `GET /gamification/leaderboard`

Get points leaderboard

- **Auth:** None
- **Query Parameters:**
  - `period`: `all` (default), `monthly`, `semester`
- **Response:**
```json
{
  "success": true,
  "data": [
    {
      "userId": "clx1234567890",
      "email": "user@example.com",
      "name": "John Doe",
      "points": 500,
      "position": 1
    }
  ]
}
```

---

#### `GET /gamification/badges`

List available badges

- **Auth:** None

---

#### `GET /gamification/my-badges`

Get current user's earned badges

- **Auth:** User

---

### 🎓 Alumni Endpoints

#### `POST /alumni/register`

Register as an alumni

- **Auth:** None

---

#### `GET /alumni`

List all alumni

- **Auth:** User

---

### 🤖 AI Endpoints

#### `POST /ai/chat`

Chat with AI coding assistant

- **Auth:** User
- **Request Body:**
```json
{
  "message": "Explain how binary search works"
}
```

- **Response:**
```json
{
  "success": true,
  "data": {
    "response": "Binary search is an efficient algorithm for finding..."
  }
}
```

---

## 🎨 Frontend Pages

| Route | Access | Description |
|-------|--------|-------------|
| `/` | Public | Landing page with login/register buttons |
| `/login` | Public | User login form |
| `/register` | Public | User registration form |
| `/dashboard` | User | Main dashboard with stats, tasks, contests |
| `/profile` | User | Profile settings (name, branch, CP handles) |
| `/contests` | Public | List of all contests with status |
| `/contests/[id]` | User | Contest arena with code editor |
| `/tasks` | User | Task list with submission modal |
| `/sessions` | User | Session list with registration |
| `/announcements` | User | View all announcements |
| `/admin` | Admin | Admin dashboard with management tabs |

### Admin Dashboard Tabs

| Tab | Features |
|-----|----------|
| **Users** | View all users, approve pending, change roles, delete users |
| **Contests** | Create contests, add problems, view/delete contests |
| **Sessions** | Create/edit/delete sessions, manage meeting links |
| **Tasks** | Create/edit/delete tasks, view submissions, verify/reject |
| **Announcements** | Create/edit/delete announcements, pin/unpin |
| **Blogs** | View pending blogs, approve/reject |

---

## 🗃️ Database Schema

### Entity Relationship Diagram

```
┌─────────┐       ┌─────────────┐       ┌────────────┐
│  User   │──1:1──│   Profile   │       │    Task    │
└────┬────┘       └─────────────┘       └─────┬──────┘
     │                                        │
     │ 1:N                               1:N  │
     ▼                                        ▼
┌─────────────┐                        ┌────────────┐
│ Submission  │◄───────────────────────│ Submission │
└─────────────┘                        └────────────┘
     │
     │ 1:N
     ▼
┌─────────────────────┐       ┌─────────────┐
│ ContestSubmission   │──N:1──│   Contest   │
└─────────────────────┘       └─────────────┘

┌─────────┐    ┌──────────────┐    ┌──────────────┐
│  Blog   │    │   Session    │    │ Announcement │
└─────────┘    └──────────────┘    └──────────────┘
```

### Models

#### User

| Field | Type | Description |
|-------|------|-------------|
| `id` | String (cuid) | Primary key |
| `email` | String | Unique email address |
| `password` | String | Hashed password (bcrypt) |
| `role` | Enum | `STUDENT`, `ADMIN`, `ALUMNI` |
| `approved` | Boolean | Account approval status |
| `createdAt` | DateTime | Registration timestamp |

**Relations:** Profile (1:1), Submissions (1:N), ContestSubmissions (1:N), Blogs (1:N)

---

#### Profile

| Field | Type | Description |
|-------|------|-------------|
| `id` | String (cuid) | Primary key |
| `userId` | String | Foreign key to User (unique) |
| `name` | String | Full name |
| `branch` | String | Department/Branch |
| `year` | Int | Year of study |
| `contact` | String | Phone number |
| `handles` | Json | CP platform handles |

**Cascade:** Deleted when user is deleted

---

#### Task

| Field | Type | Description |
|-------|------|-------------|
| `id` | String (cuid) | Primary key |
| `title` | String | Task title |
| `description` | String | Task description |
| `points` | Int | Points awarded (default: 0) |
| `assignedTo` | Json | User IDs array (null = all) |
| `dueDate` | DateTime? | Optional deadline |
| `createdAt` | DateTime | Creation timestamp |

**Relations:** Submissions (1:N)

---

#### Submission (Task)

| Field | Type | Description |
|-------|------|-------------|
| `id` | String (cuid) | Primary key |
| `taskId` | String | Foreign key to Task |
| `userId` | String | Foreign key to User |
| `link` | String | Submission URL |
| `status` | Enum | `PENDING`, `VERIFIED`, `REJECTED` |
| `points` | Int | Points awarded (default: 0) |
| `createdAt` | DateTime | Submission timestamp |

**Cascade:** Deleted when task or user is deleted

---

#### Contest

| Field | Type | Description |
|-------|------|-------------|
| `id` | String (cuid) | Primary key |
| `title` | String | Contest name |
| `timer` | Int | Duration in minutes |
| `startTime` | DateTime | Scheduled start time |
| `problems` | Json | Array of problem objects |
| `results` | Json | Final results/standings |
| `createdAt` | DateTime | Creation timestamp |

**Relations:** ContestSubmissions (1:N)

---

#### ContestSubmission

| Field | Type | Description |
|-------|------|-------------|
| `id` | String (cuid) | Primary key |
| `contestId` | String | Foreign key to Contest |
| `problemIdx` | Int | Problem index (0-based) |
| `userId` | String | Foreign key to User |
| `tokens` | String[] | Judge0 submission tokens |
| `token` | String? | Legacy single token |
| `status` | String | Verdict status |
| `result` | Json | Execution result details |
| `createdAt` | DateTime | Submission timestamp |
| `updatedAt` | DateTime | Last update timestamp |

**Cascade:** Deleted when contest or user is deleted

---

#### Session

| Field | Type | Description |
|-------|------|-------------|
| `id` | String (cuid) | Primary key |
| `title` | String | Session title |
| `details` | String? | Session description |
| `date` | DateTime? | Scheduled date/time |
| `meetLink` | String | Video call URL |
| `attendees` | Json | Registered user IDs |
| `summary` | String? | Post-session notes |
| `createdAt` | DateTime | Creation timestamp |

---

#### Blog

| Field | Type | Description |
|-------|------|-------------|
| `id` | String (cuid) | Primary key |
| `authorId` | String | Foreign key to User |
| `title` | String | Blog title |
| `content` | String | Blog content |
| `approved` | Boolean | Approval status (default: false) |
| `comments` | Json | Comments array |
| `createdAt` | DateTime | Creation timestamp |

**Cascade:** Deleted when user is deleted

---

#### Announcement

| Field | Type | Description |
|-------|------|-------------|
| `id` | String (cuid) | Primary key |
| `title` | String | Announcement title |
| `content` | String | Announcement content |
| `pinned` | Boolean | Pin to top (default: false) |
| `createdAt` | DateTime | Creation timestamp |
| `updatedAt` | DateTime | Last update timestamp |

---

## 🔐 Security Features

| Feature | Implementation |
|---------|----------------|
| **Authentication** | JWT tokens with 7-day expiry |
| **Password Security** | bcrypt hashing (10 rounds) |
| **Secret Validation** | Minimum 32-character JWT secret enforced |
| **Role-Based Access** | RBAC with Student, Admin, Alumni roles |
| **Rate Limiting** | 200 requests/15min (production) |
| **Security Headers** | Helmet.js middleware |
| **CORS** | Configurable cross-origin policy |
| **Input Validation** | express-validator + Joi schemas |
| **SQL Injection Prevention** | Prisma ORM parameterized queries |
| **XSS Protection** | Input sanitization middleware |

---

## 👤 Default Admin Credentials

After running `npm run seed`:

| Field | Value |
|-------|-------|
| **Email** | `admin@icpc.local` |
| **Password** | `admin1234` |

> ⚠️ **Important:** Change these credentials immediately in production!

---

## 🧪 Testing

### Run All Tests

```bash
cd backend
npm test
```

### Run Unit Tests Only

```bash
npm run test:unit
```

### Run Integration Tests

```bash
npm run test:integration
```

### Run Judge0 Integration Tests

```bash
npm run test:integration:judge0
```

### Test Coverage

```bash
npm test -- --coverage
```

---

## 🐳 Docker Deployment

### Development (Database Only)

Start PostgreSQL container:

```bash
cd backend
docker-compose up -d
```

This starts:
- PostgreSQL on `localhost:5432`
- Database: `icpc_portal`
- User: `postgres`
- Password: `postgres`

### Production (Full Stack)

```bash
cd backend
docker-compose -f docker-compose.prod.yml up -d
```

### Build Docker Image Manually

```bash
# Build image
docker build -t icpc-backend .

# Run container
docker run -p 5000:5000 --env-file .env icpc-backend
```

### Docker Environment Variables

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=icpc_portal
```

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Getting Started

1. **Fork** the repository
2. **Clone** your fork:
   ```bash
   git clone https://github.com/your-username/ICPC-website.git
   ```
3. **Create** a feature branch:
   ```bash
   git checkout -b feature/amazing-feature
   ```
4. **Make** your changes
5. **Test** your changes:
   ```bash
   cd backend && npm test
   cd frontend && npm run build
   ```
6. **Commit** your changes:
   ```bash
   git commit -m 'Add amazing feature'
   ```
7. **Push** to your branch:
   ```bash
   git push origin feature/amazing-feature
   ```
8. **Open** a Pull Request

### Code Style

- Use TypeScript for all new code
- Follow existing code patterns
- Add tests for new features
- Update documentation as needed

### Reporting Issues

- Use GitHub Issues
- Include steps to reproduce
- Include error messages/logs
- Specify your environment (OS, Node version, etc.)

---

## 📄 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2026 ACM ICPC USICT Student Chapter

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 💬 Support

Need help? Here's how to get support:

- **GitHub Issues** - For bug reports and feature requests
- **Discussions** - For questions and community help

---

<div align="center">

Made with ❤️ by **ACM ICPC USICT Student Chapter**

[⬆ Back to Top](#-icpc-portal)

</div>
