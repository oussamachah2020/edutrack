# 🎓 EduTrack — Learning Management Platform

**EduTrack** is a full-stack Learning Management System (LMS) built to help students learn effectively, instructors teach efficiently, and admins manage seamlessly.  
It’s designed as a learning project to master **NestJS**, **Next.js**, **PostgreSQL**, and **CI/CD pipelines** — while following clean architecture and best practices.

---

## 🚀 Tech Stack

### 🧠 Backend (NestJS)
- **NestJS** with **TypeORM**
- **PostgreSQL** (hosted on [Neon.tech](https://neon.tech))
- **JWT Authentication** (Access & Refresh tokens)
- **CSRF protection**, **Rate limiting**, and **CORS**
- **Jest** & **Supertest** for E2E testing
- **Swagger** for API documentation
- **Dockerized** setup for deployment
- **GitHub Actions** for CI/CD and Docker Hub integration

### 💻 Frontend (Next.js)
- **Next.js** (App Router)
- **TypeScript**
- **ShadCN/UI** + **TailwindCSS** for modern UI
- **JWT-based authentication** with secure token handling
- **Deployed on Vercel** or via CI/CD pipeline

---

## 🗃️ Database Schema Overview

| Table  | Description |
|--------|-------------|
| **users** | Stores authentication credentials and roles (`student`, `instructor`, `admin`) |
| **profiles** | User information (username, avatar, bio, links, etc.) |
| **courses** | Course details created by instructors |
| **modules** | Organized course content |
| **assignments** | Tasks related to modules |
| **submissions** | Student work submissions |
| **enrollments** | Links students to courses |
| **progress** | Tracks student completion rate |
| **notifications** | Stores user-specific updates and alerts |

> Visual schema available at [dbdiagram.io](https://dbdiagram.io)

---

## 🧱 Architecture
```
/edutrack-backend
├── src/
│ ├── auth/
│ ├── users/
│ ├── courses/
│ ├── modules/
│ ├── assignments/
│ ├── submissions/
│ ├── progress/
│ └── notifications/
└── test/

/edutrack-frontend
├── app/
│ ├── (auth)/
│ ├── (dashboard)/
│ ├── (courses)/
│ ├── (profile)/
│ └── (admin)/
└── components/

```

## ⚙️ Environment Setup

### 🧩 Backend `.env.example`

```bash
# App
NODE_ENV=development
PORT=4000
API_PREFIX=/api/v1

# Database
DB_HOST=db_host
DB_PORT=5432
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_NAME=your_db_name
DB_SSL=true

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=15m
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRATION=7d

# Security
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100

💻 Frontend .env.local.example

NEXT_PUBLIC_API_URL=http://example.com/api/v1
NEXT_PUBLIC_APP_NAME=EduTrack
NEXT_PUBLIC_JWT_STORAGE_KEY=edutrack_auth_token
```

## 💻 Local Development

### Backend
```
cd edutrack-backend
pnpm install
pnpm start:dev
```

### Frontend
```
cd edutrack-frontend
pnpm install
pnpm dev
```

### 🔐 Authentication Flow
- User Registration / Login
- JWT Access + Refresh Tokens
- Role-based Authorization (Student, Instructor, Admin)
- CSRF & Rate Limiting Protection

### 🔁 CI/CD Pipeline

- GitHub Actions Workflow:
- Lint & test code
- Build Docker image
- Push image to Docker Hub
- Deploy automatically to server


### 🧭 Roadmap
| Phase | Description                              | Status |
|:------:|-------------------------------------------|:-------:|
| 1 | Project setup & environment configuration | ✅ |
| 2 | Authentication & authorization | 🚧 |
| 3 | Course, module & assignment system | ⏳ |
| 4 | Progress tracking & notifications | 🔜 |
| 5 | CI/CD & Docker deployment | 🔜 |
| 6 | Testing, documentation & optimizations | 🔜 |


### 🧠 Learning Goals
This project is built as a DevOps + Fullstack learning journey:

- Master NestJS architecture & testing
- Understand PostgreSQL + TypeORM deeply
- Learn Next.js App Router best practices
- Apply security concepts (CSRF, rate limiting, etc.)
- Build & deploy using Docker and GitHub Actions

### 📘 License
MIT License © 2025 — Built for learning by Oussama Chahidi

### 💬 Contributing
This is a learning-based open project.
If you’d like to improve features, code quality, or documentation, feel free to open a PR or issue.