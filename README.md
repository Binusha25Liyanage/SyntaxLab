# CodeLab+

CodeLab+ is a MERN learning platform with structured programming lessons, Monaco-powered live coding, exercise validation, user XP progression, badges, and admin content management.

## Stack

- Frontend: React + Vite + Tailwind + React Router v6
- Backend: Node.js + Express + MongoDB + Mongoose
- Auth: JWT access token + httpOnly refresh cookie

## Quick Start

1. Install dependencies
   - npm install
   - npm install --prefix server
   - npm install --prefix client
2. Configure environments
   - Copy server/.env.example to server/.env and set values
   - Copy client/.env.example to client/.env
3. Seed demo data
   - npm run seed
4. Start development
   - npm run dev

## Demo Credentials

- Admin: <admin@codelab.com> / Admin@123
- User: <user@codelab.com> / User@123

## API Highlights

- Auth with refresh flow and login rate limiting
- Public course/leaderboard endpoints
- Protected lesson/exercise completion with XP and badge awards
- Admin CRUD for courses, lessons, exercises, users (users paginated 20 per page)

## Notes

- Register endpoint always forces role=user.
- Exercise solution code is never returned to clients.
- Lesson content is sanitized on create/update.
