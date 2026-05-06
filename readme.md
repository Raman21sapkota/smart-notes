# Smart Notes Backend

A backend system for a note-taking application designed with a focus on real-world engineering practices such as caching, rate limiting, authentication, and failure handling.

## Overview

This project provides RESTful APIs for managing notes, including features like summarization, tagging, pinning, and soft deletion. It integrates AI-based summarization and uses Redis to improve performance and control API usage.

The system is designed not just as a CRUD application, but with attention to scalability, consistency, and reliability.

---

## Features

- User authentication using JWT
- Google OAuth login with account linking
- Create, update, delete, restore, and pin notes
- Soft delete with restore functionality
- AI-powered note summarization
- Redis caching to reduce database load
- Rate limiting for AI API usage
- Input validation using Zod
- Structured error handling

---

## Tech Stack

- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- Redis
- JWT Authentication
- Google OAuth (Passport.js)
- Zod (validation)
- Swagger (API documentation)

---

## Architecture

The project follows a layered architecture:

- Controllers handle request and response
- Services contain business logic
- Repositories interact with the database
- Middleware handles authentication, validation, and error handling

This separation improves maintainability and scalability.

---

## Caching Strategy

The application uses a cache-aside pattern:

- Data is first checked in Redis
- On cache miss, data is fetched from PostgreSQL
- The result is then stored in Redis with a TTL

Cache is invalidated on update or delete operations to maintain consistency.

---

## Rate Limiting

Rate limiting is implemented using Redis:

- Each user has a request counter with an expiry
- The counter increments on each AI request
- Requests are blocked if the limit is exceeded

If Redis is unavailable, rate limiting is bypassed to prioritize availability.

---

## Authentication

- JWT is used for securing API routes
- Google OAuth allows users to sign in using their Google account
- If a user signs in with Google using an existing email, the account is linked

---

## Failure Handling

The system is designed to handle failures gracefully:

- Redis failure: fallback to database
- External API failure: request fails without corrupting data
- Invalid inputs: handled via validation middleware

The goal is to maintain availability and prevent inconsistent states.

---


## Setup Instructions

# Smart Notes API

A production-ready REST API for a note-taking application with AI-powered summarization, Redis caching, and Google OAuth authentication.


## Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL
- Redis
- Google Cloud Console account
- Google Gemini API key

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/smart-notes.git
cd smart-notes
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```

4. Run database migrations
```bash
npx prisma migrate dev
```

5. Start the server
```bash
npm run dev
```

### Using Docker

```bash
# start all services
docker-compose up --build

# run migrations
docker-compose exec app npx prisma migrate deploy

# stop all services
docker-compose down
```

## Environment Variables

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/smart_notes
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
GEMINI_API_KEY=your_gemini_api_key
NODE_ENV=development
```

## API Endpoints

### Auth
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | Login with email/password | No |
| POST | `/auth/logout` | Logout user | Yes |
| GET | `/auth/google` | Login with Google | No |
| GET | `/auth/google/callback` | Google OAuth callback | No |

### Notes
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/notes` | Get all notes | Yes |
| GET | `/notes/:id` | Get single note | Yes |
| POST | `/notes` | Create note | Yes |
| PUT | `/notes/:id` | Update note | Yes |
| DELETE | `/notes/:id` | Soft delete note | Yes |
| PATCH | `/notes/:id/restore` | Restore deleted note | Yes |
| POST | `/notes/:id/summarize` | Summarize note with AI | Yes |
| PATCH | `/notes/:id/pin` | Pin note | Yes |
| PATCH | `/notes/:id/unpin` | Unpin note | Yes |



