# astu-smart-complaint-system

This is a NestJS project scaffold. No business logic has been added yet.

## Getting Started

- Install dependencies: `npm install`
- Run the project: `npx ts-node src/main.ts`

## Environment Variables

- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for signing JWTs
- `JWT_EXPIRES_IN` - Token expiration (e.g. `1h`, `15m`)

## Project Structure

- `src/` - Source code folder
- `src/main.ts` - Entry point

## Requirements

- Node.js
- npm

## Dependencies

- @nestjs/core
- @nestjs/common
- typescript
- ts-node
- @types/node

## Auth Endpoints

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/profile` (JWT required)
- `GET /auth/admin-only` (JWT + ADMIN role)
