# SyntaxLab+

SyntaxLab+ is a full-stack MERN learning platform inspired by structured coding academies. It includes lesson-based learning, a Monaco-powered live editor with preview, exercise and quiz validation, XP progression, badges, leaderboards, and an admin control panel for content operations.

## Highlights

- Structured course paths (HTML/CSS/JavaScript)
- Live coding environment with Monaco editor and preview iframe
- Lesson completion, exercise validation, and course quiz support
- AI Tutor for course-relevant Q&A grounded in platform content
- XP, levels, badges, and leaderboard progression
- Admin dashboard for managing courses, lessons, exercises, quizzes, and users
- Admin quick action on the Courses page to add new courses directly
- JWT access + httpOnly refresh token authentication flow

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, React Router v6
- Backend: Node.js, Express.js
- Database: MongoDB, Mongoose
- Auth: JWT access token + refresh cookie
- Editor: @monaco-editor/react
- Graphics: ogl (Aurora animated background)

## Project Structure

```text
SyntaxLab/
   client/
      src/
         components/
         context/
         hooks/
         pages/
         utils/
   server/
      controllers/
      middleware/
      models/
      routes/
      utils/
      seed.js
   package.json
   README.md
```

## Prerequisites

- Node.js 18+
- MongoDB running locally (default: mongodb://localhost:27017/syntaxlab)

## Environment Setup

### Server

Copy `server/.env.example` to `server/.env`:

```dotenv
PORT=5000
MONGODB_URI=mongodb://localhost:27017/syntaxlab
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=your_refresh_secret_here
REFRESH_TOKEN_EXPIRES_IN=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o-mini
OPENAI_BASE_URL=https://api.openai.com/v1
```

### Client

Copy `client/.env.example` to `client/.env`:

```dotenv
VITE_API_URL=http://localhost:5000/api
```

## Installation

From project root:

```bash
npm install
npm install --prefix server
npm install --prefix client
```

## Admin Quick Start

1. Seed demo data:

```bash
npm run seed --prefix server
```

2. Login with admin account:
   - Email: <admin@syntaxlab.com>
   - Password: Admin@123
3. Open admin dashboard: `http://localhost:5173/admin/dashboard`
4. Add a new course quickly:
   - Open `http://localhost:5173/courses`
   - Click **Add Course** (visible for admin users)
5. Manage all course content from `http://localhost:5173/admin/courses`

## Seed Data

```bash
npm run seed
```

This creates:

- 1 admin user
- 1 demo learner
- 2 demo courses
- 6 lessons
- 6 exercises
- 2 quizzes

## Run the App

### Option A: Start both client and server from root

```bash
npm run dev
```

### Option B: Start separately

Terminal 1:

```bash
cd server
npm run dev
```

Terminal 2:

```bash
cd client
npm run dev
```

## URLs

- Frontend: <http://localhost:5173>
- Backend API: <http://localhost:5000/api>

## Demo Login Credentials

- Admin Email: <admin@syntaxlab.com>
- Admin Password: Admin@123
- User Email: <user@syntaxlab.com>
- User Password: User@123

## Admin Access

1. Login using admin credentials.
2. Navigate to: `http://localhost:5173/admin/dashboard`
3. Admin services available:
   - Manage courses
   - Create/edit lessons
   - Create/edit exercises
   - Create/edit quizzes
   - Manage users
4. Quick course creation:
   - Open `http://localhost:5173/courses` while logged in as admin.
   - Click **Add Course** to go directly to the new course form.

## Frontend Pages

### Public

- `/` landing page
- `/courses` course listing
- `/login` login
- `/register` register

### Authenticated User

- `/dashboard`
- `/courses/:slug`
- `/courses/:slug/:lessonSlug`
- `/assistant`
- `/profile`
- `/leaderboard`

### Admin

- `/admin/dashboard`
- `/admin/courses`
- `/admin/courses/new`
- `/admin/courses/:id/edit`
- `/admin/lessons/new`
- `/admin/lessons/:id/edit`
- `/admin/exercises/new`
- `/admin/exercises/:id/edit`
- `/admin/quizzes`
- `/admin/quizzes/new`
- `/admin/quizzes/:id/edit`
- `/admin/users`

## API Overview

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`

### Courses

- `GET /api/courses`
- `GET /api/courses/:slug`
- `POST /api/courses` (admin)
- `PUT /api/courses/:id` (admin)
- `DELETE /api/courses/:id` (admin)

### Lessons

- `GET /api/lessons/:id` (protected)
- `POST /api/lessons` (admin)
- `PUT /api/lessons/:id` (admin)
- `DELETE /api/lessons/:id` (admin)
- `POST /api/lessons/:id/complete` (protected)

### Exercises

- `GET /api/exercises/lesson/:lessonId` (protected)
- `POST /api/exercises/:id/submit` (protected)
- `POST /api/exercises` (admin)
- `PUT /api/exercises/:id` (admin)
- `DELETE /api/exercises/:id` (admin)

### Quizzes

- `GET /api/quizzes/course/:courseId` (protected)
- `POST /api/quizzes/:id/submit` (protected)
- `GET /api/quizzes` (admin)
- `GET /api/quizzes/:id` (admin)
- `POST /api/quizzes` (admin)
- `PUT /api/quizzes/:id` (admin)
- `DELETE /api/quizzes/:id` (admin)

### Users

- `GET /api/users/me` (protected)
- `GET /api/users/leaderboard` (public)
- `GET /api/users/admin/stats` (admin)
- `GET /api/users?page=1` (admin, paginated)
- `DELETE /api/users/:id` (admin)

### AI

- `POST /api/ai/ask` (protected)

## Security and Validation Notes

- Register endpoint always enforces `role=user`.
- Login endpoint is rate-limited.
- Refresh token is stored in an httpOnly cookie.
- Lesson content is sanitized before persistence.
- Exercise solution code is not exposed to learner-facing list endpoints.

## Common Troubleshooting

### 1) Seed fails with `MONGODB_URI is not configured`

- Ensure `server/.env` exists and includes `MONGODB_URI`.

### 2) Server fails with `EADDRINUSE: 5000`

- Another process is already using port 5000.
- Stop that process, then restart `npm run dev` in `server`.

### 3) Browser shows 401 on startup

- Expected on public pages when there is no active session.

### 4) Admin login credentials do not work

- Seed data may be missing.
- Run `npm run seed --prefix server` from the project root to recreate demo users:
   - Admin: `admin@syntaxlab.com` / `Admin@123`
   - User: `user@syntaxlab.com` / `User@123`
- Login to access protected routes.

## Scripts

### Root

- `npm run dev` -> run server + client concurrently
- `npm run seed` -> run server seed script

### Server Scripts

- `npm run dev` -> start nodemon server
- `npm run start` -> start production-like server
- `npm run seed` -> seed database

### Client Scripts

- `npm run dev` -> start Vite dev server
- `npm run build` -> production build
- `npm run preview` -> preview production build
