# astu-smart-complaint-system

This is a NestJS project scaffold. No business logic has been added yet.

## Getting Started

- Install dependencies: `npm install`
- Run the project: `npx ts-node src/main.ts`

## Environment Variables

- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for signing JWTs
- `JWT_EXPIRES_IN` - Token expiration (e.g. `1h`, `15m`)
- `OPENAI_API_KEY` - OpenAI API key for the official SDK

Copy `.env.example` to `.env` and fill in the values before running the project.

## Project Structure

- `src/` - Source code folder
- `src/main.ts` - Entry point
- `prisma/schema.prisma` - Prisma models (User, Department, Complaint)

## Requirements

- Node.js
- npm

## OpenAI Setup

- The official OpenAI SDK is installed and exposed via `OpenAIService` (global provider).
- Add `OPENAI_API_KEY` to your `.env` (see `.env.example`).
- Example usage inside a provider:

```ts
import { Injectable } from "@nestjs/common";
import { OpenAIService } from "../openai/openai.service";

@Injectable()
export class ExampleService {
  constructor(private readonly openAIService: OpenAIService) {}

  async sampleCompletion() {
    const client = this.openAIService.getClient();
    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: "Hello, OpenAI!",
    });
    return response;
  }
}
```

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
