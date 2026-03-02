# ASTU Smart Complaint System (Backend)

NestJS backend for complaint submission, assignment, tracking, notifications, analytics, and role-based access.

## Tech Stack

- NestJS + TypeScript
- Prisma ORM
- PostgreSQL
- JWT authentication (Passport)
- Class-validator / class-transformer
- Docker + Docker Compose

## Features

- User registration and login
- JWT-protected profile and role-based authorization
- Complaint creation and lifecycle updates
- Department management
- Notification management
- Analytics endpoints
- Chatbot endpoint
- File upload support for complaints (`uploads/`)

## Project Structure

- `src/` - application source code
- `prisma/` - Prisma schema and migrations
- `uploads/` - uploaded files
- `docker-compose.yml` - backend + postgres services
- `Dockerfile` - production image build

## Environment Variables

Copy `.env.example` to `.env` and set values:

- `DATABASE_URL`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `OPENAI_API_KEY`

If running with Docker Compose, use:

`DATABASE_URL=postgresql://astuuser:astupass@db:5432/astudb?schema=public`

If connecting from host machine to Compose PostgreSQL port mapping (`5433:5432`), use:

`DATABASE_URL=postgresql://astuuser:astupass@localhost:5433/astudb?schema=public`

## Run Locally (without Docker)

1. Install dependencies:

```bash
npm install
```

2. Apply migrations:

```bash
npx prisma migrate deploy
```

3. Start app:

```bash
npm run start:dev
```

4. Seed sample data (optional):

```bash
npm run db:seed
```

5. App runs at:

`http://localhost:3000`

## Run with Docker Compose

1. Start services:

```bash
docker compose up -d --build
```

2. Run migrations inside backend container:

```bash
docker compose exec backend npx prisma migrate deploy
```

3. Seed sample data inside backend container (optional):

```bash
docker compose exec backend npm run db:seed
```

4. Check status/logs:

```bash
docker compose ps
docker compose logs -f backend
```

5. Stop services:

```bash
docker compose stop
```

## Scripts

- `npm run start:dev` - run with ts-node
- `npm run build` - compile TypeScript to `dist/`
- `npm run db:seed` - insert/update sample users, department, complaint, and notification

## Seeded Accounts

After `npm run db:seed`, these users are available:

- `admin@astu.edu.et` / `Admin@123`
- `staff@astu.edu.et` / `Staff@123`
- `student@astu.edu.et` / `Student@123`

## API Endpoints

### Auth

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/profile` (JWT)
- `GET /auth/admin-only` (JWT + ADMIN)

### Users

- `GET /users` (ADMIN)
- `PATCH /users/:id` (ADMIN)
- `DELETE /users/:id` (ADMIN)

### Departments

- `POST /departments` (ADMIN)
- `GET /departments` (ADMIN)
- `PATCH /departments/:id` (ADMIN)
- `DELETE /departments/:id` (ADMIN)

### Complaints

- `POST /complaints` (JWT)
- `GET /complaints`
- `GET /complaints/staff` (STAFF/ADMIN)
- `PATCH /complaints/:id` (STAFF/ADMIN)
- `PATCH /complaints/:id/assign-department` (ADMIN)

### Notifications

- `GET /notifications` (JWT)
- `PATCH /notifications/:id/read` (JWT)

### Analytics

- `GET /analytics` (ADMIN)
- `GET /analytics/complaints-per-staff` (guarded)
- `GET /analytics/resolution-rate` (guarded)
- `GET /analytics/complaints-by-category-or-department` (guarded)

### Chatbot

- `POST /chatbot` (STUDENT)

## Notes

- Backend container exposes API on `3000`.
- PostgreSQL container is mapped to host `5433`.
- Uploaded complaint files are persisted in local `uploads/`.
