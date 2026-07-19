# TaskFlow - Task Management System

TaskFlow is a full-stack task management app with user authentication, task CRUD, pagination, search, and dashboard-style task insights. The project is built with a TypeScript Node.js/Express backend and a React + Vite frontend.

## 1. Brief Overview

TaskFlow helps users organize daily work with a clean, modern interface. Users can register, log in, create tasks, update them, filter by status or priority, search content, and review task statistics. The app also supports soft delete so removed tasks are hidden from the main list without being permanently destroyed.

## 2. Features

### Authentication

- Register, login, logout, and protected routes
- JWT-based session handling with refresh-cookie support
- User-specific task access

### Task Management

- Create, view, edit, and delete tasks
- Status and priority labels
- Due dates, estimated hours, and tags
- Pagination, search, sorting, and filtering
- Soft delete for safer task removal
- Task statistics dashboard

### UI/UX

- Modern dark theme
- Responsive task cards and modal-based task details
- Optimistic UI updates and smooth form interactions

## 3. Vercel Deployment Link

Demo link placeholder:

- https://your-vercel-app.vercel.app

## 4. Run with Docker

From the project root:

```bash
docker compose up --build
```

This starts:

- MongoDB on port 27017
- Backend on port 5000
- Frontend on port 5173

To stop it:

```bash
docker compose down
```

## 5. Run Locally

### Backend

```bash
cd backend
npm install
cp .env.example .env
# update .env with your MongoDB URI and JWT secret
npm run dev
```

Backend runs at http://localhost:5000

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at http://localhost:5173

## 6. Demo Video

Demo video placeholder:

- https://your-video-link.com/demo

## Environment Variables

### Backend (.env)

| Variable                   | Description                  |
| -------------------------- | ---------------------------- |
| `NODE_ENV`                 | Runtime environment          |
| `PORT`                     | Backend port                 |
| `MONGODB_URI`              | MongoDB connection string    |
| `JWT_SECRET`               | JWT signing secret           |
| `JWT_ACCESS_EXPIRES_IN`    | Access token expiry          |
| `JWT_REFRESH_EXPIRES_DAYS` | Refresh token expiry in days |
| `CLIENT_URL`               | Frontend origin for CORS     |
| `LOG_LEVEL`                | Logging level                |

### Frontend

Use Vite environment variables if needed:

```env
VITE_API_URL=http://localhost:5000/api
```

## Project Structure

```text
Task-Management-System/
├── backend/
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── errors/
│       ├── middlewares/
│       ├── models/
│       ├── routes/
│       ├── services/
│       ├── types/
│       ├── utils/
│       ├── validators/
│       └── app.ts
├── frontend/
│   └── src/
│       ├── api/
│       ├── components/
│       ├── hooks/
│       ├── pages/
│       ├── store/
│       ├── types/
│       └── utils/
└── README.md
```

## Vercel Hosting Setup

The frontend can be deployed on Vercel directly, and the backend can be deployed as a Vercel serverless API.

### Frontend deployment on Vercel

1. Push the project to GitHub.
2. Open Vercel and import the repository.
3. Set the root directory to `frontend`.
4. Vercel will detect Vite automatically.
5. Add environment variable:
   - `VITE_API_URL=https://your-backend-vercel-url/api`
6. Deploy.

### Backend deployment on Vercel

1. Push the project to GitHub.
2. Open Vercel and import the repository.
3. Set the root directory to `backend`.
4. Add environment variables:
   - `NODE_ENV=production`
   - `MONGODB_URI=your-mongodb-connection-string`
   - `JWT_SECRET=your-secret`
   - `JWT_ACCESS_EXPIRES_IN=15m`
   - `JWT_REFRESH_EXPIRES_DAYS=5`
   - `CLIENT_URL=https://your-frontend-vercel-url`
5. Deploy.

### Notes

- The backend entrypoint is now compatible with Vercel serverless deployment.
- If your MongoDB is not publicly accessible, use a hosted Atlas instance.

## API Overview

Base URL: http://localhost:5000/api

### Authentication

- POST /auth/register
- POST /auth/login
- POST /auth/logout
- GET /auth/profile

### Tasks

- GET /tasks
- POST /tasks
- GET /tasks/:id
- PUT /tasks/:id
- DELETE /tasks/:id
- GET /tasks/stats

## Tech Stack

- Backend: Node.js, Express, TypeScript, MongoDB, Mongoose, JWT, Yup, Winston, Helmet, CORS
- Frontend: React, TypeScript, Vite, Redux Toolkit, React Query, React Hook Form, React Router

## License

MIT
