# Job Tracker Backend

NestJS backend application for Job Tracker.

## Prerequisites

- Node.js
- pnpm
- Docker Desktop with Docker Compose

## Setup

Install dependencies:

```bash
pnpm install
```

Copy `.env.example` to `.env`:

```powershell
Copy-Item .env.example .env
```

The local development defaults are:

```env
PORT=3001
FRONTEND_URL=http://localhost:5173
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/job_tracker_dev?schema=public"
```

## Database

Start PostgreSQL:

```bash
pnpm db:start
```

Generate Prisma Client:

```bash
pnpm db:generate
```

Create and apply the initial migration using the migration name `init`:

```bash
pnpm db:migrate --name init
```

For later migrations, use a descriptive migration name:

```bash
pnpm db:migrate --name <migration-name>
```

Open Prisma Studio:

```bash
pnpm db:studio
```

Stop PostgreSQL:

```bash
pnpm db:stop
```

## Database schema

The initial Prisma schema includes:

- User
- Company
- JobApplication
- InterviewStage
- Contact
- Task
- AiGeneration

After schema changes, run:

```bash
pnpm db:migrate
pnpm db:generate
```

## Run locally

Start the backend in development mode:

```bash
pnpm start:dev
```

The API is available at `http://localhost:3001`.

## Health check

```text
GET http://localhost:3001/health
```

## Build

```bash
pnpm build
```
