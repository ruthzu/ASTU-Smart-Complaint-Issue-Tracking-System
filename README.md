# ASTU Smart Complaint & Issue Tracking System

## 🎯 Background & Problem Statement

Students at ASTU face various campus-related issues, including:

- Dormitory maintenance problems
- Laboratory equipment malfunction
- Internet connectivity issues
- Classroom facility damage

Currently, complaint management lacks tracking, transparency, and a structured workflow. This project aims to build a digital complaint and ticket management system with proper tracking and accountability.

## 🎯 Project Objective

Develop a structured issue tracking platform that allows:

- **Students** to submit complaints
- **Departments** to manage and update tickets
- **Administrators** to monitor system performance
- Structured workflow and analytics for decision-making
- AI Chatbot to assist students

## 👥 System Roles

### Student

- Submit complaints
- Track status
- View complaint history
- Ask AI Chatbot

### Department Staff

- View assigned complaints
- Update ticket status
- Add remarks

### Admin

- Oversee all complaints
- Manage users and categories
- View analytics dashboard

## 💻 Full-Stack Version Requirements

### Core Functionalities

- 🔐 Role-based authentication system
- 📝 Complaint submission form
- 📎 File/image attachment support
- 🏷 Complaint categorization
- 📌 Ticket status tracking: Open, In Progress, Resolved
- 🔄 Structured status update workflow
- 🤖 AI Chatbot assistance
- 📊 Analytics dashboard:
  - Total complaints
  - Most common issue type
  - Resolution rate
- 📩 Notification system (email or in-app)

---

### Backend Tech Stack

- **NestJS** — Node.js framework for scalable server-side applications
- **Prisma** — Type-safe ORM for PostgreSQL
- **PostgreSQL** — Relational database
- **OpenAI API** — AI chatbot integration

> **Note:** This project currently implements only the backend. Frontend development will be added in the future.

### Getting Started (Backend)

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up your `.env` file with database and SMTP credentials
4. Run database migrations: `npx prisma migrate dev`
5. Start the server: `npm run start:dev`

### Environment Variables

- `DATABASE_URL` - PostgreSQL connection string
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_FROM` - Email configuration
- `OPENAI_API_KEY` - For AI chatbot

### Folder Structure

- `src/` — Main backend application source code
- `prisma/` — Prisma schema and migrations
- `uploads/` — File attachments

### Contribution

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

### License

[MIT](LICENSE)

---

## Backend API Highlights

### Auth Endpoints

- `POST /auth/register` — Register a new user
- `POST /auth/login` — Login and receive JWT
- `GET /auth/profile` — Get current user profile (JWT required)
- `GET /auth/admin-only` — Admin-only route (JWT + ADMIN role)

### Complaints

- `POST /complaints` — Submit a complaint (with file upload)
- `GET /complaints` — List complaints (paginated)
- `PATCH /complaints/:id` — Update complaint (staff/admin)

### Departments

- `POST /departments` — Create department (admin)
- `GET /departments` — List departments

### Notifications

- `GET /notifications` — List notifications (paginated)

### Analytics

- `GET /analytics` — Admin analytics dashboard (total, status, category, department, rates, per staff)

### AI Chatbot

- `POST /openai/chatbot` — Ask the AI assistant

---

> This backend is ready for integration with any frontend or mobile client.
