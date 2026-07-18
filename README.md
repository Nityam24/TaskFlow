# TaskFlow - Task Management System

A full-stack task management application with JWT authentication, built with Node.js/Express (TypeScript) backend and React (TypeScript) frontend.

## Features

### Backend
- MVC architecture with service layer
- JWT authentication (register, login, logout with token blacklisting)
- Task CRUD with user-scoped authorization
- Mongoose with optimized indexes and lean queries
- Yup validation, Winston logging
- Helmet, CORS, compression middleware
- Class-based error handling
- Pagination, filtering, search, and task statistics

### Frontend
- React 18 + TypeScript + Vite
- Redux Toolkit for auth & filter state
- React Query for API caching & optimistic updates
- React Hook Form for forms
- React Router with private/public routes
- Landing page, task listing, detail modal, profile with stats

## Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

## Project Structure

```
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
│       ├── app.ts
│       └── server.ts
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

## Setup

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd Task-Management-System
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run dev
```

Backend runs at `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`

## Environment Variables

### Backend (.env)

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment | development |
| `PORT` | Server port | 5000 |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/task-management |
| `JWT_SECRET` | JWT signing secret | (required) |
| `JWT_EXPIRES_IN` | Token expiration | 7d |
| `CLIENT_URL` | Frontend URL for CORS | http://localhost:5173 |
| `LOG_LEVEL` | Winston log level | info |

### Frontend (.env - optional)

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | API base URL | /api (proxied to backend) |

## API Documentation

Base URL: `http://localhost:5000/api`

### Authentication

#### POST /auth/register
Create a new user account.

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": { "_id": "...", "name": "John Doe", "email": "john@example.com" },
    "token": "eyJhbG..."
  }
}
```

#### POST /auth/login
Authenticate and receive JWT token.

**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### POST /auth/logout
Invalidate current token. Requires authentication.

**Headers:** `Authorization: Bearer <token>`

#### GET /auth/profile
Get current user profile. Requires authentication.

---

### Tasks (All require authentication)

**Headers:** `Authorization: Bearer <token>`

#### POST /tasks
Create a new task.

**Body:**
```json
{
  "title": "Complete project",
  "description": "Finish the assignment",
  "status": "Todo",
  "priority": "High",
  "dueDate": "2026-07-25",
  "estimatedHours": 8,
  "tags": ["work", "urgent"]
}
```

#### GET /tasks
Get paginated tasks for the logged-in user.

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| page | number | Page number (default: 1) |
| limit | number | Items per page (default: 10, max: 100) |
| status | string | Filter by status |
| priority | string | Filter by priority |
| search | string | Full-text search |
| sortBy | string | createdAt, dueDate, priority, title, status |
| sortOrder | string | asc or desc |

#### GET /tasks/stats
Get task statistics for the logged-in user.

#### GET /tasks/:id
Get a single task by ID.

#### PUT /tasks/:id
Update a task (only own tasks).

#### DELETE /tasks/:id
Delete a task (only own tasks).

---

### Error Responses

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": "Invalid email format"
  }
}
```

**Status Codes:** 200, 201, 400, 401, 404, 409, 500

## Scripts

### Backend
- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript
- `npm start` - Run production build
- `npm run lint` - Type check

### Frontend
- `npm run dev` - Start Vite dev server
- `npm run build` - Production build
- `npm run preview` - Preview production build

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Backend | Node.js, Express, TypeScript, MongoDB, Mongoose, JWT, Yup, Winston, Helmet, CORS, Compression |
| Frontend | React, TypeScript, Vite, Redux Toolkit, React Query, React Hook Form, React Router |

## License

MIT
